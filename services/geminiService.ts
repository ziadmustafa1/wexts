
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateFrameworkResponse = async (
  userPrompt: string,
  history: { role: string; content: string }[]
): Promise<string> => {
  if (!API_KEY) {
    return "Error: API_KEY not found in environment variables.";
  }

  const systemInstruction = `
    You are the AI Architect for "wexts", a full-stack framework combining Next.js (v16 Canary with React 19) and NestJS (v10) in a unified monorepo.
    
    STRICT SPECIFICATION FOR wexts:
    1. **Structure**: 
       - apps/web (Next.js 16, React 19, Tailwind v4)
       - apps/api (NestJS 10, Fastify adapter recommended)
       - packages/types (Shared DTOs, Zod schemas)
       - packages/api-client (Auto-generated SDK)
       - packages/ui (React Server Components)
    
    2. **Auto-Linking**: 
       - Developer NEVER writes "fetch('http://localhost:5050/users')".
       - Developer writes "api.users.findAll()".
       - The CLI parses NestJS Controllers (AST) and generates the SDK.
    
    3. **Development**:
       - Command: \`fusion dev\`
       - Next runs on 3000. Nest runs on random port (e.g. 5050).
       - Includes "Fusion Insight" GUI for monitoring RPC calls and Database.
    
    4. **Key Features**:
       - React 19 support (useActionState, useFormStatus, useOptimistic).
       - Next.js 16 features (Partial Prerendering - PPR).
       - Prisma v6 integration.
    
    Your tone should be technical, confident, and focused on Developer Experience (DX).
    If asked for code, provide wexts-style examples (using \`api.\` object in frontend, or \`@Controller\` in backend).
  `;

  try {
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const response = await chat.sendMessage({
      message: userPrompt
    });

    return response.text || "I couldn't generate a response.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "System Error: Unable to contact wexts Cloud Architect.";
  }
};
