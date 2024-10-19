import { Router } from "express";
import axios from 'axios';
import { authMiddleware } from "../middleware";

export const qustnRouter = Router();

qustnRouter.use(authMiddleware);

qustnRouter.get("/", async (req, res) => {
    const slug = req.query.slug;
    const url = 'https://leetcode.com/graphql';
    const headers = {
        'Content-Type': 'application/json',
        'Referer': `https://leetcode.com/problems/${slug}/`
    };

    const query = `
        {
        question(titleSlug: "${slug}") {
            questionId
            title
            content
            difficulty
            exampleTestcases
        }
        }
    `;

    try {
        const response = await axios.post(url, { query }, { headers });
        const problemData = response.data.data.question;
        return res.json(problemData);
    } catch (error) {
        console.error('Error fetching problem data:', error);
    }
});