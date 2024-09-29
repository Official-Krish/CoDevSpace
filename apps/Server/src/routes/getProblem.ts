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
