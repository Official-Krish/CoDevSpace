import { Router } from "express";
import prisma from "../utils/db";
import axios from "axios";
import { getProblem } from "../lib/problem";
import { SubmissionInput } from "@repo/common/zod";

export const SubmissionRouter = Router();

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

SubmissionRouter.get("/", async (req, res) => {
    const id = req.query.id;

    if (!id) {
        return res.status(400).json({ message: "Invalid request" });
    }

    var submission = await prisma.submission.findUnique({
        where: {
            id: id as string
        },
        include: {
            testcases: true
        }
    })

    if (!submission) {
        return res.status(404).json({ message: "Submission not found" });
    }

    return res.json(submission);
});

SubmissionRouter.post("/submit", async (req, res) => {
    const submissionInput = SubmissionInput.safeParse(req.body);

    if (!submissionInput.success) {
        return res.status(400).json({ message: "Invalid request" });
    }

    const dbproblem = await prisma.problem.findUnique({
        where: {
            id: submissionInput.data.problemId
        }
    });

    if (!dbproblem) {
        return res.status(404).json({ message: "Problem not found" });
    }

    const problem = await getProblem(
        dbproblem.slug,
        submissionInput.data.languageId
    );
    problem.fullBoilerplateCode = problem.fullBoilerplateCode.replace(
        "##USER_CODE_HERE##",
        submissionInput.data.code
    )

    const response = await axios.post(`${process.env.JUDGE0_URL}/submissions?base64_encoded=false`, {
        submissions: problem.inputs.map((index) => ({
            language_id : LANGUAGE_MAPPING[submissionInput.data.languageId]?.judge0,
            source_code: problem.fullBoilerplateCode.replace(
                "##INPUT_FILE_INDEX##",
                index.toString()
            ),
            expected_output: problem.outputs[index as unknown as number],
        }))
    })

    const submission = await prisma.submission.create({
        data: {
            userId: submissionInput.data.userId,
            problemId: submissionInput.data.problemId,
            code : submissionInput.data.code,
            testcases: {
                create: response.data,
            }
        },
        include: {
            testcases: true
        }
    })

    return res.json({
        msg : "Submission created",
        id : submission.id
    })
});

SubmissionRouter.get("/bulk", (req, res) => {
    const id = req.query.problemId;

    if (!id) {
        return res.status(400).json({ message: "Invalid request" });
    }

    const submissions = prisma.submission.findMany({
        where: {
            problemId: id as string,
            userId: req.body.userId
        },
        take: 10,
        include: {
            testcases: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return res.json(submissions);
})