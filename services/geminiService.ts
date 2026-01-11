
import { GoogleGenAI } from "@google/genai";

export interface VideoResult {
  uri: string;
  videoObject: any;
}

/**
 * Analyzes an image using Gemini 3 Pro.
 */
export const analyzeImage = async (
  base64Data: string,
  mimeType: string,
  prompt?: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          {
            text: prompt || "Analyze this image in detail focusing on composition, lighting, and facial anatomy for high-fidelity video source use.",
          },
        ],
      },
    });
    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Image analysis failed:", error);
    throw error;
  }
};

/**
 * Enhances a concept into a cinematic prompt with special focus on Lip-Sync and performance.
 */
export const enhanceVideoPrompt = async (concept: string, isLipSync: boolean = false): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const systemInstruction = isLipSync 
      ? `You are an expert Performance Director for AI Video. 
         Your task is to transform lyrics or a singing concept into a technical prompt for Veo 3.1.
         Focus on:
         - Precise lip-syncing and phoneme matching (O-shapes, A-shapes, dental fricatives).
         - Realistic facial muscle movements and jaw dynamics.
         - Micro-expressions in the eyes that match the emotional intensity of the song.
         - Professional cinematic lighting that highlights the mouth and skin textures.
         - Mention 'high-fidelity facial animation' and 'perfectly synchronized mouth movements'.`
      : `Transform this concept into a highly detailed cinematic video prompt. Focus on camera movement, professional lighting, and visual textures.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Concept: "${concept}"`,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });
    return response.text || concept;
  } catch (error) {
    console.error("Prompt enhancement failed:", error);
    throw error;
  }
};

/**
 * Generates a video using Veo 3.1.
 */
export const generateVideo = async (
  prompt: string,
  base64Image?: string,
  mimeType?: string
): Promise<VideoResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const config = {
      numberOfVideos: 1,
      resolution: '720p' as const,
      aspectRatio: '16:9' as const
    };

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      ...(base64Image && mimeType ? { image: { imageBytes: base64Image, mimeType } } : {}),
      config
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) throw new Error(JSON.stringify(operation.error));
    const videoObject = operation.response?.generatedVideos?.[0]?.video;
    if (!videoObject) throw new Error("Kein Video generiert.");

    return { uri: videoObject.uri, videoObject };
  } catch (error: any) {
    console.error("Video generation failed:", error);
    throw error;
  }
};

/**
 * Extends a video with high continuity.
 */
export const extendVideo = async (
  prompt: string,
  previousVideo: any
): Promise<VideoResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-generate-preview',
      prompt: prompt,
      video: previousVideo,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if (operation.error) throw new Error(JSON.stringify(operation.error));
    const videoObject = operation.response?.generatedVideos?.[0]?.video;
    if (!videoObject) throw new Error("Verlängerung fehlgeschlagen.");

    return { uri: videoObject.uri, videoObject };
  } catch (error: any) {
    console.error("Video extension failed:", error);
    throw error;
  }
};

export const fetchVideoBlob = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (e) {
    console.error(e);
    return "";
  }
}
