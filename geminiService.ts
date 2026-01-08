
import { GoogleGenAI } from "@google/genai";
import { BgColor } from "../types";

export class GeminiService {
  static async removeBackground(base64Image: string, mimeType: string, bgColor: BgColor = 'white'): Promise<string> {
    // Always use exactly this initialization format as per @google/genai guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
            {
              text: `Remove the background of this image. Extract the main subject precisely and place it on a clean, solid ${bgColor} background. Ensure the subject's edges are sharp and high quality. Return only the edited image with the solid ${bgColor} background.`,
            },
          ],
        },
      });

      if (!response.candidates?.[0]?.content?.parts) {
        throw new Error("No content returned from the model.");
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }

      throw new Error("Model did not return an image part.");
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      throw new Error(error.message || "Failed to process image with Gemini AI.");
    }
  }
}
