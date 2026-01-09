import { BgColor } from "../types";

interface RemoveBgResponse {
  image: string;
  error?: string;
}

export class GeminiService {
  static async removeBackground(
    base64Image: string,
    mimeType: string,
    bgColor: BgColor = "white"
  ): Promise<string> {
    try {
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          base64Image,
          mimeType,
          bgColor,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Backend request failed");
      }

      const data: RemoveBgResponse = await response.json();

      if (!data.image) {
        throw new Error(data.error || "No image returned from backend");
      }

      return data.image;
    } catch (error: any) {
      console.error("Background removal failed:", error);
      throw new Error(
        error.message || "Failed to remove background using Gemini AI"
      );
    }
  }
}
