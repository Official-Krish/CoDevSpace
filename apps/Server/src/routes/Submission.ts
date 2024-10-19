import * as dotenv from 'dotenv';
dotenv.config();


import { Router } from "express";
import prisma from "../utils/db";
import axios from "axios";
import { getProblem } from "../lib/problem";
import { authMiddleware } from '../middleware';

export const SubmissionRouter = Router();

SubmissionRouter.use(authMiddleware);

const LANGUAGE_MAPPING: Record<string, {
  judge0: number;
  internal: number;
  name: string;
  monaco: string;
}> = {
  js: { judge0: 63, internal: 1, name: "Javascript", monaco: "javascript" },
  cpp: { judge0: 54, internal: 2, name: "C++", monaco: "cpp" },
  rs: { judge0: 73, internal: 3, name: "Rust", monaco: "rust" },
  java: { judge0: 62, internal: 4, name: "Java", monaco: "java" },
};

const JUDGE0_URL = process.env.JUDGE0_URL;


SubmissionRouter.get("/", async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    var submission = await prisma.submission.findUnique({
      where: { id: id as string },
      include: { testcases: true }
    });

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.json(submission);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Submit Code for Problem
SubmissionRouter.post("/submit", async (req, res) => {
    const submissionInput = req.body;
    const { problemId, languageId, code, userId } = submissionInput;
    console.log(problemId, "problemId")

    // Basic validation
    if (!problemId || !code || !userId || !LANGUAGE_MAPPING[languageId]) {
        return res.status(400).json({ message: "Invalid submission input" });
    }


    try {
        const dbProblem = await prisma.problem.findUnique({
            where: { id: problemId }
        });

        if (!dbProblem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        const problem = await getProblem(dbProblem.slug, languageId);

        problem.fullBoilerplateCode = problem.fullBoilerplateCode.replace("##USER_CODE_HERE##", code);
        console.log("fullBoilerplateCode", problem);
        console.log("problem output", problem.outputs);

        const response = await axios.post(
            `${JUDGE0_URL}/submissions/batch?base64_encoded=false&`,
            {
              submissions: problem.inputs.map((input, index) => ({
                language_id: LANGUAGE_MAPPING[languageId]?.judge0,
                source_code: problem.fullBoilerplateCode.replace(
                  "##INPUT_FILE_INDEX##",
                  index.toString()
                ),
                expected_output: problem.outputs[index],
              })),
            }
          );

        console.log("response", response.data);

        const submission = await prisma.submission.create({
            data: {
              userId: userId,
              problemId: problemId,
              code: code,
              testcases: {
                connect: response.data,
              },
            },
            include: {
              testcases: true,
            },
          });
          console.log("Done");

        return res.json({ message: "Submission created", id: submission.id });
    } catch (error) {
        console.error("Error during submission:", error);
        return res.status(500).json({ message: "Error during submission", error });
    }
});

// Get Bulk Submissions for a Problem and User
SubmissionRouter.get("/bulk", async (req, res) => {
  const { problemId } = req.query;
  const { userId } = req.body;

  if (!problemId || !userId) {
    return res.status(400).json({ message: "Invalid request" });
  }

  try {
    const submissions = await prisma.submission.findMany({
      where: { problemId: problemId as string, userId },
      take: 10,
      include: { testcases: true },
      orderBy: { createdAt: "desc" }
    });

    return res.json(submissions);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving submissions", error });
  }
});


