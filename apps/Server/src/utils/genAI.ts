import OpenAI from "openai";

const PROMPT_PREFIX = `Help me in this code, don't give me exact code but give me some hints or suggestions.`;

export async function generateResponse(text: string, apiKey: string, code: string) {
    const response = await gpt(apiKey, text, code);
		return response;
}

export async function gpt(apiKey: string, text: string, code: string) {
    const openai = new OpenAI({ apiKey: apiKey });
    const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {"role": "user", "content": `${PROMPT_PREFIX} ${code} ${text}` },
        ]
    });
    return completion.choices[0].message.content;
}