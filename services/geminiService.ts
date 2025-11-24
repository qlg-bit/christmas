import { GoogleGenAI } from "@google/genai";
import { RsvpStatus } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY is not set in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateRsvpMessage = async (
  status: RsvpStatus,
  guestName: string,
  partyHost: string = "The Smith Family"
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "";

  const prompt = status === RsvpStatus.ATTENDING
    ? `Write a short, warm, and excited 1-2 sentence message from ${guestName} to ${partyHost} accepting their Christmas party invitation. Mention looking forward to the celebration.`
    : `Write a short, polite, and regretful 1-2 sentence message from ${guestName} to ${partyHost} declining their Christmas party invitation. Wish them a wonderful time.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error generating message:", error);
    return "";
  }
};
