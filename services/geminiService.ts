import { GoogleGenAI, Chat } from "@google/genai";
import { UserProfile } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export type AIPersona = 'standard' | 'drill_sergeant' | 'scientist' | 'zen_master';

const PERSONA_PROMPTS: Record<AIPersona, string> = {
  standard: "You are IronPulse AI, an elite fitness and nutrition coach. Be motivating, knowledgeable, and concise.",
  drill_sergeant: "You are a tough, no-nonsense Drill Sergeant. Use CAPS occasionally for emphasis. Demand discipline. Do not coddle the user. Push them to their limits! Keep it short and punchy.",
  scientist: "You are a Sports Scientist. Focus on biomechanics, metabolic pathways, and peer-reviewed studies. Explain the 'WHY' behind every recommendation using technical but accessible terms.",
  zen_master: "You are a Yoga & Wellness Guru. Focus on mindfulness, breathwork, and holistic health. Be calm, soothing, and metaphorical. Encourage balance and inner peace."
};

// Helper to create a chat session with context and persona
export const createAdvisorChat = (userProfile: UserProfile, persona: AIPersona = 'standard'): Chat => {
  const baseInstruction = `
    User Profile:
    Name: ${userProfile.name}
    Age: ${userProfile.age}
    Weight: ${userProfile.weight}kg
    Height: ${userProfile.height}cm
    Goal: ${userProfile.goal.replace('_', ' ')}
    Level: ${userProfile.level}

    Your Persona Style: ${PERSONA_PROMPTS[persona]}
    
    General Rules:
    - Keep answers concise (under 200 words unless asked for a detailed plan).
    - Use formatting (bullet points, bold text) to make it readable.
  `;

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: baseInstruction,
    },
  });
};

export const generatePersonalizedPlan = async (userProfile: UserProfile): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a 1-week sample workout and diet plan for me.
            My stats: ${userProfile.weight}kg, ${userProfile.height}cm.
            Goal: ${userProfile.goal}.
            Level: ${userProfile.level}.
            Format it as a markdown table or clear list.`
        });
        return response.text || "Could not generate plan.";
    } catch (e) {
        console.error("Plan generation error", e);
        return "Sorry, I am having trouble generating a plan right now. Please try again later.";
    }
}

export const analyzeImageWithGemini = async (base64Image: string, prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Flash supports vision and is fast
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/png', data: base64Image } },
                    { text: prompt }
                ]
            }
        });
        return response.text || "Could not analyze image.";
    } catch (e) {
        console.error("Vision error", e);
        return "Sorry, I couldn't analyze that image. Please try again.";
    }
}

export const getOutdoorRoute = async (location: string, activity: string, distance: string, preferences: string) => {
  const prompt = `Suggest a specific ${activity} route in or near ${location}. 
  Target Distance: ${distance}. 
  Preferences: ${preferences}.
  Provide a bulleted list of waypoints, expected terrain, and difficulty.
  Conclude with a motivating quote for an outdoor athlete.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });
    return {
      text: response.text || "No route details generated.",
      // Extract grounding chunks for Maps links
      chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    console.error("Route error", error);
    return { text: "Unable to connect to mapping services.", chunks: [] };
  }
};
