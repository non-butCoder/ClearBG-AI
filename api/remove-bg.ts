import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Allow only POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { base64Image, mimeType, bgColor = "white" } = req.body;

    if (!base64Image || !mimeType) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY, // 🔐 SAFE (Vercel only)
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Remove the background of this image. Extract the main subject precisely and place it on a clean, solid ${bgColor} background. Ensure sharp, clean edges. Return only the edited image.`,
          },
        ],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;

    if (!parts) {
      return res.status(500).json({ error: "No response from Gemini" });
    }

    for (const part of parts) {
      if (part.inlineData?.data) {
        return res.status(200).json({
          image: `data:image/png;base64,${part.inlineData.data}`,
        });
      }
    }

    return res.status(500).json({ error: "No image returned by model" });
  } catch (error: any) {
    console.error("Gemini backend error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process image",
    });
  }
}
