// File that contains data used in model, there are:
// example user prompts from test task
// JSON-schema that is used in model
// JSON to JS parse function

import fs from "fs/promises";
import path from "path";


// Data for leads given in test task
export function leads(){
    const lead1 = "Acme Innovations is a leading tech firm based in Austin, TX, specializing in cloud-native\n" +
        "application development and IoT solutions for the logistics sector. Founded in 2018 by CEO\n" +
        "Sarah Chen, our mission is to empower businesses with cutting-edge digital tools. For\n" +
        "partnerships, contact our Head of Business Development, John Doe, at\n" +
        "john.doe@acmeinnovations.com.";

    const lead2 = "Founded in 2005, 'Global Ventures Inc.' has grown to become a key player in the financial\n" +
        "technology (FinTech) industry, headquartered in New York. We provide bespoke software\n" +
        "solutions, primarily focusing on secure payment gateways and algorithmic trading\n" +
        "platforms. Our founder and current CTO is Mark Johnson. For inquiries, please reach out to\n" +
        "our general info email at info@globalventures.com.";

    const lead3 = "FutureTech Solutions, a dynamic startup in Berlin, Germany, recently secured Series B\n" +
        "funding to expand their AI-powered data analytics platform for the healthcare industry.\n" +
        "While their primary contact details weren't immediately available in the press release,\n" +
        "industry sources suggest Dr. Elena Petrova is their Chief Strategy Officer.";

    return [lead1,lead2,lead3];
}

// Function that parses JSON and converts into JS Object
export function jsonToJs(json) {
    try {
        return JSON.parse(json);
    } catch (err) {
        console.error("Invalid JSON:", json);
        throw err;
    }
}

// Function that saves JSON in specific file
export async function saveJson(fileName, data) {
    try {
        const dirPath = path.resolve("result");
        await fs.mkdir(dirPath, { recursive: true });
        const filePath = path.join(dirPath, `${fileName}.json`);
        const json = JSON.stringify(data, null, 2);
        await fs.writeFile(filePath, json, "utf8");
        console.log(`JSON saved in ${filePath}`);
    } catch (err) {
        console.error("Error while saving JSON:", err);
    }
}


// JSON-schema for LLM output
export const schema = {
    type: "object",
    properties: {
        companyName: { type: "string" },
        founded: { type: "number" },
        companyType: {
            "type": "string",
            "enum": ["startup", "enterprise", "agency", "non-profit", "other"]
        },
        focus: {
            type: "array",
            items: { type: "string" }
        },
        industry: { type: "string" },
        location: { type: "string" },
        contacts: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    fullName: { type: "string" },
                    position: { type: "string" },
                    email: { type: "string" }
                },
                required: ["fullName"],
                additionalProperties: false
            }
        },
        email: { type: "string" }, // Company email
        insights: {
            type: "array",
            items: { type: "string" }
        },
        summary: { type: "string" }
    },
    required: ["companyName", "summary"],
    additionalProperties: false
};
