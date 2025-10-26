// main.js
import { model } from "./model.js";
import { leads, schema, jsonToJs, saveJson } from "./data.js";

async function main() {
    // Get leads data
    const data = leads();

    // Empty array used for model responses
    const responses = [];

    for (const lead of data) {
        // Get raw json-string from model
        const raw = await model(schema, lead);

        // Convert to JS object
        const data = jsonToJs(raw);
        console.log("Preview:", data);
        responses.push(data);
    }

    // Save responses in file result/company_data.json
    await saveJson("company_data", responses);

    return responses;
}

main().then(res => {
    console.log("Final JSON array:");
    console.log(res);
}).catch(console.error);
