import fs from "fs/promises";
import "dotenv/config";
import { Groq } from "groq-sdk";

async function main() {

    // using Groq API for testing
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    // Read system prompt
    const system_prompt = await fs.readFile("system_prompt.txt", "utf8");

    // Groq API, using system prompt to tone LLM to feel like human
    const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.5, // medium between creativity and task
        max_completion_tokens: 512,
        messages: [
            {
                role: "system",
                content: system_prompt
            },
            {
                role: "user",
                content: `Tell me a bit about Healthcare.`
            }
        ],
    });

    // Get content from model message (JSON string)
    const response = chatCompletion.choices[0].message.content;
    console.log(response);

    await fs.writeFile("results.txt", response, "utf8");
}

main().catch(console.error);