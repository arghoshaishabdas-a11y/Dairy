import { GoogleGenAI } from "@google/genai";
import { Feedback, GrammarCorrection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function analyzeStory(content: string): Promise<{
  feedback: Feedback;
  grammarCorrections: GrammarCorrection[];
}> {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: `Analyze this diary entry. Return ONLY valid JSON (no markdown):
{
  "feedback": { "score": 1-10, "creativity": "", "emotionalDepth": "", "clarity": "", "vocabulary": "", "suggestions": [] },
  "grammarCorrections": [{ "error": "", "suggestion": "", "explanation": "", "type": "spelling|grammar" }]
}

Entry: """${content}"""`,
  });

  const text = response.text || '{}';
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}
