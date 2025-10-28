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
        temperature: 0.4, // less creativity, more focused on the task
        max_completion_tokens: 512,
        messages:[
            {
                role: "system",
                content: `You are a structured data extractor. \n` +
                 `Return a VALID JSON ONLY, if you dont find info, then put null, match this schema:\n${JSON.stringify(schema)} \n\n` +
                 `For each field:\n
                - companyName: exact name of the company.\n
                - founded: year of founding (number).\n
                - companyType: choose from ["startup", "enterprise", "agency", "non-profit", "other"].\n
                - focus: list of key technologies, products, or services.\n
                - industry: short general industry name.\n
                - location: city and country.\n
                - contacts: extract known people, their roles, and emails if available.\n
                - email: main company email.\n
                - insights: write 1–3 short analytical remarks about growth, funding, or relevance. ALWAYS WRITE SOME INSIGHTS.\n
                - summary: short objective paragraph (3–4 sentences) describing the company in third person.\n\n` +
                `Be consistent across all examples. Return **valid JSON only**.`
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


