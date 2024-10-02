import { CheckIcon, CircleX, ClockIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

export interface Submission {
  id: string;
  time: string;
  problemId: string;
  languageId: string;
  code: string;
  fullCode: string;
  status: string;
  testcases: {
    status: string;
    index: number;
  }[];
}

function getColor(status: string) {
  switch (status) {
    case "AC":
      return "text-green-500";
    case "FAIL":
      return "text-red-500";
    case "TLE":
      return "text-red-500";
    case "COMPILATION_ERROR":
      return "text-red-500";
    case "PENDING":
      return "text-yellow-500";
    case "REJECTED":
      return "text-red-500";
    default:
      return "text-gray-500";
  }
}
  
function getIcon(status: string) {
    switch (status) {
        case "AC":
        return <CheckIcon className="h-4 w-4" />;
        case "FAIL":
        return <CircleX className="h-4 w-4" />;
        case "REJECTED":
        return <CircleX className="h-4 w-4" />;
        case "TLE":
        return <ClockIcon className="h-4 w-4" />;
        case "COMPILATION_ERROR":
        return <CircleX className="h-4 w-4" />;
        case "PENDING":
        return <ClockIcon className="h-4 w-4" />;
        default:
        return <ClockIcon className="h-4 w-4" />;
    }
}


export function SubmissionsTable({ submissions }: { submissions: Submission[] }) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submission ID</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Tests Passed</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}> 
                <TableCell>{submission.id.substr(0, 8)}</TableCell>
                <TableCell className={getColor(submission.status)}>
                  {getIcon(submission.status)}
                </TableCell>
                <TableCell>
                  {
                  submission.testcases.filter(
                      (testcase) => testcase.status === "AC",
                  ).length
                  }
                  /{submission.testcases.length}
                </TableCell>
                <TableCell>{submission.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );

}