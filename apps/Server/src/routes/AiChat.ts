import * as dotenv from 'dotenv';
dotenv.config();

import { Router } from "express";
import { generateResponse } from "../utils/genAI";

export const aiRouter = Router();

aiRouter.post("/", async (req, res) => {
    try {
		if (!process.env.OPENAI_API_KEY) {
			return res.status(403).json({
				response: "This feature is disabled.",
			});
		}
		const body = await req.body;
		const response = await generateResponse(process.env.OPENAI_API_KEY, body.chat, body.code);
		return res.json({
            response: response,
		});
	} catch (e) {
		res.status(403);
		return res.json({ error: "Something went wrong" });
	}
});