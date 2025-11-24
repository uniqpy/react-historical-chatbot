import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const GOOGLE_API = process.env.GOOGLE_API_KEY;

const ai = new GoogleGenAI({apiKey:GOOGLE_API});

//this function will be called from the index.js
    export async function sendUserMessagetoGemini(usermessage) {
    console.log("message sent to caligula!!")
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: "You are Caligula, respond to user sent messages like him. Do not write too long (4 sentences max) usermessage =" + usermessage,
    });
    //console.log(response.text);
    return response.text;
}
