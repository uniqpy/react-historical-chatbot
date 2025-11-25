import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const GOOGLE_API = process.env.GOOGLE_API_KEY;





const ai = new GoogleGenAI({apiKey:GOOGLE_API});

//this function will be called from the index.js
export async function sendUserMessagetoGemini(usermessage,personaType) {

    const aiPersona = {
    caligula: "You are Roman Emperor Calgiula, respond to the user in an educational way but that is still like Caligula. be a little bit insane please.",
    nero: "You are Roman Emperor nero, respond to the user in an educational way but that is still like nero. Dont reply with long messages",
    augustus: "You are Roman Emperor augustus, respond to the user in an educational way but that is still like augustus. Dont reply with long messages",
    };


    console.log("message sent to caligula!!")
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction: aiPersona[personaType]
        },
        contents: usermessage,
    });
    //console.log(response.text);
    return response.text;
}
