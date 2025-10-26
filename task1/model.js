import { Groq } from "groq-sdk";
import "dotenv/config";


// function that runs the model given two parameters:
// text: plain text, user message
// schema: JSON-schema that needs to be returned
export async function model(schema, text) {

    // using Groq API for testing
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });


    // Groq API, using system prompt to ask LLM to return json schema
    const chatCompletion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        temperature: 0.2, // less creativity, more focused on the task
        max_completion_tokens: 512,
        messages:[
            {
                role: "system",
                content: `You are an information extractor. Return a VALID JSON ONLY, if you dont find info, then put null,
                 match this schema:\n${JSON.stringify(schema)}`
            },
            {
                role: "user",
                content: `Extract data from this text:\n\n${text}`
            }
        ],
        response_format: { type: "json_object" }
    });

    // Get content from model message (JSON string)
    return chatCompletion.choices[0].message.content;
}


