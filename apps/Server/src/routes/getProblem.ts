import { Router } from "express";
import prisma from "../utils/db";

export const problemRouter = Router();

problemRouter.get("/getProblems", async (req, res) => {
    try{
        const problems = await prisma.problem.findMany({
            where: {
                hidden: false,
            },
        });
        res.json(problems);
    } catch (error) {
        console.error("Error fetching problems:", error);
    }
});

problemRouter.get("/getProblem/:id", async (req, res) => {
    try {
        const problem = await prisma.problem.findFirst({
            where: {
                id: (req.params.id),
            },
            include: {
                defaultCode: true
            }
        }); 
        res.json(problem);
    } catch (error) {
        console.error("Error fetching problem:", error);
    }
});
