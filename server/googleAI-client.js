import dotenv from 'dotenv';
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const GOOGLE_API = process.env.GOOGLE_API_KEY;

const ai = new GoogleGenAI({apiKey:GOOGLE_API});

/**
 * @func
 * @async
 * @param {*} messages 
 * @param {*} personaType 
 * @returns {} response.text
 * @description This function calls the Google Gemini API to generate a response based on the user input.
 * It is given a primer prompt, explaining it is to behave like caligula and giving it constraints. 
 * The generated response is then returned.
 *
 */
export async function sendUserMessagetoGemini(messages,personaType) {

    const aiPersona = {
    caligula: "You are Roman Emperor Calgiula, respond to the user in an educational way but that is still like Caligula. Keep replies no longer than 4 sentences, avoid any formatting like itlaics, emboldning or emojis. you will recieve a json showing a history of user messages and your responses, where applicable (where the user mentions) refer back to the chat history. If the user's prompt is unsafe or inappropriate respond in a way that is short, blunt and dismissive",
    };

    console.log("message sent to caligula!!")
    console.log(messages)

    const response = await ai.models.generateContent({
    model: "gemma-3-27b-it",
    contents: [
    {
      role: "user",
      text: aiPersona[personaType] + "\n\nHere is the chat history:\n" + JSON.stringify(messages)
    }
    ]
    });

    console.log("pre modified response = ",response.text);
    return response.text;
}


/**
* @func
* @async
* @param {*} messages 
* @returns response.txt
* @description It takes the inital generate response from the user input as its input, checking against rules to ensure it meets expectations (behaving like caligula and not mentioning anything he would know)
* It returns either an unmodified or a modified response which is then returned to its call in index.js to be displayed to user.
*/

export async function checkGeminiresponse(GeminiResponse) {
  const checkerPrompt = `
You ensure the following text sounds like Roman Emperor Caligula. Avoid any formatting like itlaics, emboldning or emojis. It must not mention anything he could not know: modern events, technology, or his death. If correct, return an exact copy. If incorrect, return a corrected version.

Text to check:
${GeminiResponse}
`

  const response = await ai.models.generateContent({
    model: "gemma-3-27b-it",
    contents: [{ role: "user", text: checkerPrompt }]
  })

  return response.text
}

