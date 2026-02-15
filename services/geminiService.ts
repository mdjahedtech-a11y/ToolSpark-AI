import { GoogleGenAI } from "@google/genai";

// Configured with provided API Key
const API_KEY = "AIzaSyClKu7ZggFCevzXDaKdCqT6cTGeJgwuGbI";

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: API_KEY });
};

export const generateCaption = async (topic: string, tone: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 catchy, engaging social media captions for a post about: "${topic}". Tone: ${tone}. Include emojis.`,
    });
    return response.text || "No caption generated.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Failed to generate content. Please try again later.";
  }
};

export const generateShortStory = async (prompt: string, genre: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a very short story (max 200 words) with the following premise: "${prompt}". Genre: ${genre}.`,
    });
    return response.text || "No story generated.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Failed to generate story.";
  }
};

export const generateStudyQuestions = async (topic: string, level: string): Promise<string> => {
  const ai = getAiClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create 5 study questions (multiple choice or open ended) about "${topic}" for a ${level} level student. Provide answers at the end.`,
    });
    return response.text || "No questions generated.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Failed to generate questions.";
  }
};