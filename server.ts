/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for parsing JSON
app.use(express.json());

// Initialize Gemini SDK securely
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return aiClient;
}

// 1. API Route: AI Rules Sage
app.post("/api/rules-sage", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).json({ error: "Missing prompt parameter" });
    return;
  }

  try {
    const ai = getAiClient();
    
    const systemInstruction = `You are the Codex Rules Sage, an elite Warhammer 40,000 10th Edition rules referee and guide.
Your role is to answer questions for brand-new or learning players in a clear, supportive, and highly structured manner.
Rules Guideline:
- Always base your answers strictly on Warhammer 40k 10th Edition rules.
- Do NOT refer to older editions (like 9th or 8th) unless specifically contrasting, and keep it brief. Highlight 10th Edition innovations (e.g., Battle-shock replacing Morale, Toughness scale expansion, simplified psychic mechanics integrated into weapons/abilities, Objective Control OC stat, and Combat Patrol preset game modes).
- Keep answers scannable and digestible! Use bold text for stats (e.g., **S** for Strength, **T** for Toughness, **SV** for Armor Save, **Ld** for Leadership, **OC** for Objective Control) and bullet points for lists.
- Be concise. Players might be reading your answer directly at the gaming table during a live match. Aim to give a direct, fully correct answer in under 180 words if possible.
- If a rule depends on situational abilities or stratagems, explain the base rule first, then mention exceptions.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || "My mental connection with the Warp was interrupted. Please ask your rules query again.";
    res.json({ reply });
  } catch (err: any) {
    console.error("Gemini API Error in Rules Sage endpoint:", err);
    res.status(500).json({ 
      error: "Failed to consult the Codex Rules Sage.", 
      details: err.message || err 
    });
  }
});

// 2. Health check route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 3. Vite middleware / Static Asset serving setup
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Running in DEVELOPMENT mode. Initializing Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Running in PRODUCTION mode. Serving static built assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express full-stack server successfully running on port ${PORT}`);
  });
}

setupVite().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
