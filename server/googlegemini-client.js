import 'dotenv/config'
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({apiKey:'AIzaSyBJqlx4kIwNtgvWpy6Ps65MuX1q_j18ZRw'}); //evil api key...

//what needs to be done
// send gemini output to index.js
// make output ready for json, so it can be send to front end and displayed :D


//this function will be called from the index.js
export async function sendUserMessagetoGemini(usermessage) {
    console.log("message sent to caligula!!")
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: "You are Caligula, respond to user sent messages like him... usermessage =" + usermessage,
    });
    console.log(response.text);
    return response.text;
}
