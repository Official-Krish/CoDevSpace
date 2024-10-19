import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import axios from "axios";
import toast from "react-hot-toast";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import Editor from "@monaco-editor/react";
import { Button } from "./ui/button";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { CheckIcon, CircleX, ClockIcon } from "lucide-react";
import { BACKEND_URL } from "../../config";
import { Submission, SubmissionsTable } from "./SubmissionTable";

export interface IProblem {
  id: string;
  title: string;
  description: string;
  slug: string;
  defaultCode: {
    languageId: number;
    code: string;
  }[];
}

enum SubmitStatus {
  SUBMIT = "SUBMIT",
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  FAILED = "FAILED",
}
const LANGUAGE_MAPPING: {
  [key: string]: {
    judge0: number;
    internal: number;
    name: string;
    monaco: string;
  };
} = {
  js: { judge0: 63, internal: 1, name: "Javascript", monaco: "javascript" },
  cpp: { judge0: 54, internal: 2, name: "C++", monaco: "cpp" },
  rs: { judge0: 73, internal: 3, name: "Rust", monaco: "rust" },
  java: { judge0: 62, internal: 4, name: "Java", monaco: "java" },
};

const SubmitBar = ({problem, isContest} : {problem: IProblem, isContest: boolean}) => {
  const [activeTab, setActiveTab] = useState("problem");

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Tabs
              defaultValue="problem"
              className="rounded-md p-1"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="problem">Submit</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        <div className={`${activeTab === "problem" ? "" : "hidden"}`}>
          <SubmitProblem problem={problem} isContest={isContest} />
        </div>
        {activeTab === "submissions" && <Submissions problem={problem} />}
      </div>
    </div>
  );
};

function Submissions({ problem }: { problem: IProblem }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get( `${BACKEND_URL}/api/v1/submission/bulk?problemId=${problem.id}`, {
        withCredentials : true,
      });
      setSubmissions(response.data.submissions || []);
    };
    fetchData();
  }, []);

  return (
    <div>
      <SubmissionsTable submissions={submissions} />
    </div>
  );
}

function SubmitProblem({
  problem,
  isContest,
}: {
  problem: IProblem;
  isContest: boolean;
}) {
  if(problem.defaultCode === undefined) {
    return <div>Loading...</div>;
  }
  const [language, setLanguage] = useState(
    Object.keys(LANGUAGE_MAPPING)[0] as string
  );
  const [code, setCode] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string>(SubmitStatus.SUBMIT);
  const [testcases, setTestcases] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const defaultCode: { [key: string]: string } = {};
      problem.defaultCode.forEach((code ) => {
        const language = Object.keys(LANGUAGE_MAPPING).find(
          (language) => LANGUAGE_MAPPING[language]?.internal === code.languageId
        );
        if (!language) return;
        defaultCode[language] = code.code;
      });
    setCode(defaultCode);
  }, [problem]);


  async function pollWithBackoff(id: string, retries: number, isContest: boolean) {
    if (retries === 0) {
      setStatus(SubmitStatus.SUBMIT);
      toast.error("Not able to get status ");
      return;
    }

    const response = await axios.get(`${BACKEND_URL}/api/v1/submission?id=${id}`, {
      withCredentials : true,
    });

    console.log("pollWithBackoff", response.data.submission);


    if (response.data.submission.status === "PENDING") {
      setTestcases(response.data.submission.testcases);
      await new Promise((resolve) => setTimeout(resolve, 2.5 * 1000));
      pollWithBackoff(id, retries - 1, isContest);
    } else {
      if (response.data.submission.status === "AC") {
        setStatus(SubmitStatus.ACCEPTED);
        setTestcases(response.data.submission.testcases);
        {isContest && axios.post(`${BACKEND_URL}/api/v1/contest/poll`, {
          userId: localStorage.getItem("userId"),
          withCredentials : true,
        }
        )}
        toast.success("Accepted!");
        return;
      } else {
        setStatus(SubmitStatus.FAILED);
        toast.error("Failed :(");
        setTestcases(response.data.submission.testcases);
        return;
      }
    }
  }

  async function submit(isContest: boolean) {
    setStatus(SubmitStatus.PENDING);
    setTestcases((t) => t.map((tc) => ({ ...tc, status: "PENDING" })));
    console.log("language", language);
    console.log("code", code[language]);
    console.log("problemId", problem.id);
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/submission/submit`, {
        code: code[language],
        languageId: language,
        problemId: problem.id,
        userId: localStorage.getItem("userId"),
        withCredentials : true,
      });
      pollWithBackoff(response.data.id, 10, isContest);
    } catch (e) {
      //@ts-ignore
      toast.error(e.response.statusText);
      setStatus(SubmitStatus.SUBMIT);
    }
  }

  return (
    <div>
      <Label htmlFor="language">Language</Label>
      <Select
        value={language}
        defaultValue="cpp"
        onValueChange={(value) => setLanguage(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(LANGUAGE_MAPPING).map((language) => (
            <SelectItem key={language} value={language}>
              {LANGUAGE_MAPPING[language]?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="pt-4 rounded-md">
        <Editor
          height={"60vh"}
          value={code[language]}
          theme="vs-dark"
          onMount={() => {}}
          options={{
            fontSize: 14,
            scrollBeyondLastLine: false,
          }}
          language={LANGUAGE_MAPPING[language]?.monaco}
          onChange={(value) => {
            //@ts-ignore
            setCode({ ...code, [language]: value });
          }}
          defaultLanguage="javascript"
        />
      </div>
      <div className="flex justify-end">
        
        <Button
          disabled={status === SubmitStatus.PENDING}
          type="submit"
          className="mt-4 align-right"
          onClick={Cookies.get("token") ? () => submit(isContest) : () => navigate("/signin")}
        >
          {Cookies.get("token")
            ? status === SubmitStatus.PENDING
              ? "Submitting"
              : "Submit"
            : "Login to submit"}
        </Button>
      </div>
      <RenderTestcase testcases={testcases} />
    </div>
  );
}

function renderResult(status: number | null) {
  switch (status) {
    case 1:
      return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    case 2:
      return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    case 3:
      return <CheckIcon className="h-6 w-6 text-green-500" />;
    case 4:
      return <CircleX className="h-6 w-6 text-red-500" />;
    case 5:
      return <ClockIcon className="h-6 w-6 text-red-500" />;
    case 6:
      return <CircleX className="h-6 w-6 text-red-500" />;
    case 13:
      return <div className="text-gray-500">Internal Error!</div>;
    case 14:
      return <div className="text-gray-500">Exec Format Error!</div>;
    default:
      return <div className="text-gray-500">Runtime Error!</div>;
  }
}

function RenderTestcase({ testcases }: { testcases: any[] }) {
  return (
    <div className="grid grid-cols-6 gap-4">
      {testcases.map((testcase, index) => (
        <div key={index} className="border rounded-md">
          <div className="px-2 pt-2 flex justify-center">
            <div className="">Test #{index + 1}</div>
          </div>
          <div className="p-2 flex justify-center">
            {renderResult(testcase.status_id)}
          </div>
        </div>
      ))}
    </div>
    );
}
export default SubmitBar;