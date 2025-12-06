import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const GOOGLE_API = process.env.GOOGLE_API_KEY;

const ai = new GoogleGenAI({apiKey:GOOGLE_API});

//this function will be called from the index.js
//This function generates a Gemini response in the tone of the chosen histroical figure to the users input.
export async function sendUserMessagetoGemini(messages,personaType) {

    const aiPersona = {
    caligula: "You are Roman Emperor Calgiula, respond to the user in an educational way but that is still like Caligula. Keep replies no longer than 4 sentences. you will recieve a json showing a history of user messages and your responses, where applicable (where the user mentions) refer back to the chat history",
    nero: "You are Roman Emperor nero, respond to the user in an educational way but that is still like nero. Keep replies no longer than 4 sentences",
    augustus: "You are Roman Emperor augustus, respond to the user in an educational way but that is still like augustus. Keep replies no longer than 4 sentences",
    };


    console.log("message sent to caligula!!")
    console.log(messages)
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: aiPersona[personaType]
        },
        contents: messages,
    });
    console.log("pre modified response = ",response.text);
    return response.text;
}


//This function will be called from index.js
//This functions purpose is to ensure that the inital response that has been made by Gemini is considered accurate to what is needed.
//If the LLM considers it not to be accurate, it will generate a new version, removing the inaccuracies
//Otherwise the LLM will respond with a keyphrase which allows us to know that it is accurate to the figure and can be sent to the front end.
export async function checkGeminiresponse(GeminiResponse) {
    const AIprompt = "you are a checking agent, your role is to ensure that the following input sounds like the Roman Emperor Calgiula. The input should not include anything that he wouldnt of known in his time, ie ww2 or the existance of phones or an event such as his own death. If the input is considered safe and accurate to him, reply with just a exact copy of the input otherwise generate an alternative version with all the mistakes corrected."

    console.log("message sent to be checked")
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config:{systemInstruction:AIprompt},
        contents: GeminiResponse,
    });

    console.log("modified message = ",response.text);
    return response.text;
}


