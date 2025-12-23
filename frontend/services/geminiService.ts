import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { Difficulty, QuestType } from "../types";

// Helper interface for the API response structure
interface GeneratedQuest {
    step: number;
    title: string;
    desc: string;
    difficulty: string;
    type: string;
    sp_cost: number;
}

export const generateQuestsFromGoal = async (goal: string): Promise<GeneratedQuest[]> => {
    if (!process.env.API_KEY) {
        console.warn("No API_KEY found. Returning mock data.");
        return getMockQuests();
    }

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: `User Goal: ${goal}`,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            step: { type: Type.INTEGER },
                            title: { type: Type.STRING },
                            desc: { type: Type.STRING },
                            difficulty: { type: Type.STRING },
                            type: { type: Type.STRING },
                            sp_cost: { type: Type.INTEGER }
                        },
                        required: ["step", "title", "desc", "difficulty", "type", "sp_cost"]
                    }
                }
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("Empty response from Gemini");
        }

        const data = JSON.parse(text) as GeneratedQuest[];
        return data;

    } catch (error) {
        console.error("Gemini API Error:", error);
        alert("无法连接到大界王。启用离线模拟模式。");
        return getMockQuests();
    }
};

const getMockQuests = (): GeneratedQuest[] => {
    return [
        {
            step: 1,
            title: "侦察地形",
            desc: "花5分钟研究基础知识。即使是悟空在战斗前也会先感知气的流动。",
            difficulty: "简单",
            type: "主线",
            sp_cost: 5
        },
        {
            step: 2,
            title: "初次切磋",
            desc: "完成任务的核心部分，相当于写一个 'Hello World'。热身运动。",
            difficulty: "普通",
            type: "主线",
            sp_cost: 15
        },
        {
            step: 3,
            title: "击败杂兵",
            desc: "攻克任务中的第一个难点。",
            difficulty: "困难",
            type: "主线",
            sp_cost: 25
        }
    ];
};