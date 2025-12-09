import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const GOOGLE_API = process.env.GOOGLE_API_KEY;

const ai = new GoogleGenAI({apiKey:GOOGLE_API});

/**
 * 
 * @param {*} messages 
 * @param {*} personaType 
 * @returns response.txt
 * 
 * This function calls the Google Gemini API to generate a response based on the user input.
 * It is given a primer prompt, explaining it is to behave like caligula and give it constraints. 
 * The generate response is then returned.
 */
export async function sendUserMessagetoGemini(messages,personaType) {

    const aiPersona = {
    caligula: "You are Roman Emperor Calgiula, respond to the user in an educational way but that is still like Caligula. Keep replies no longer than 4 sentences, avoid any formatting like itlaics, emboldning or emojis. you will recieve a json showing a history of user messages and your responses, where applicable (where the user mentions) refer back to the chat history. If the user's prompt is unsafe or inappropriate respond in a way that is short, blunt and dismissive",
    nero: "You are Roman Emperor nero, respond to the user in an educational way but that is still like nero. Keep replies no longer than 4 sentences",
    augustus: "You are Roman Emperor augustus, respond to the user in an educational way but that is still like augustus. Keep replies no longer than 4 sentences",
    };


    console.log("message sent to caligula!!")
    console.log(messages)
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        config: {
            systemInstruction: aiPersona[personaType]
        },
        contents: messages,
    });
    console.log("pre modified response = ",response.text);
    return response.text;
}


/**
* This function does an API call to Gemini.
* @param {*} messages 
* @returns response.txt
* It takes the inital generate response from the user input as its input, checking against rules to ensure it meets expectations (behaving like caligula and not mentioning anything he would know)
* It returns either an unmodified or a modified response which is then returned to its call in index.js to be displayed to user.
 */
export async function checkGeminiresponse(GeminiResponse) {
    const AIprompt = "you are a checking agent, your role is to ensure that the following input sounds like the Roman Emperor Calgiula. The input should not include anything that he wouldnt of known in his time, ie ww2 or the existance of phones or an event such as his own death. If the input is considered safe and accurate to him, reply with just a exact copy of the input otherwise generate an alternative version with all the mistakes corrected."

    console.log("message sent to be checked")
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        config:{systemInstruction:AIprompt},
        contents: GeminiResponse,
    });

    console.log("modified message = ",response.text);
    return response.text;
}

