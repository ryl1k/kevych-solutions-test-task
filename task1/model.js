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
                content: `
                    You are a structured data extractor.
                    Your task is to analyze company information text and return a VALID JSON ONLY.
                    
                    If some fields are missing, set them to null.
                    The output must follow exactly this schema:
                    ${JSON.stringify(schema)}
                    
                    For each field:
                    
                    - companyName: exact name of the company.
                    - founded: year of founding (number).
                    - companyType: choose from ["startup", "enterprise", "agency", "non-profit", "other"].
                    - focus: list of key technologies, products, or services.
                    - industry: short general industry name.
                    - location: city and country.
                    - contacts: extract known people, their roles, and emails if available.
                    - email: main company email.
                    - insights: write 1–3 short analytical remarks about growth, funding, or relevance. ALWAYS WRITE SOME INSIGHTS.
                    - summary: short objective paragraph (3–4 sentences) describing the company in third person.
                    
                    Be consistent across all examples.
                    Return valid JSON only, nothing else.
                `
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


