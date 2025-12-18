import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import cors from "cors";

// ==========================
// BASIC SETUP
// ==========================
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// ==========================
// OPENAI INIT
// ==========================
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ==========================
// LUMI SYSTEM PROMPT
// ==========================
const LUMI_SYSTEM_PROMPT = `
You are LUMI.

Your role is not to comfort, motivate, or philosophize.
Your role is to bring clarity and next steps.

Communication rules:
- Speak like a human, not like an AI.
- Be direct, calm, and grounded.
- Avoid empty phrases, filler sentences, and generic empathy.
- Never say things like “I understand how you feel” without action.
- If you don’t know something, say it plainly.
- Keep responses short and purposeful.
- Ask only questions that move the situation forward.

Response logic:
1. Identify what the user actually needs.
2. Name the core problem simply.
3. Reduce complexity.
4. Propose a concrete next step or ask one focused question.

Behavioral rules:
- Do not moralize.
- Do not over-motivate.
- Do not repeat the user’s question.
- Do not explain yourself.
- Do not mention being an AI.

Your purpose:
Turn chaos into the next clear step.
`;

// ==========================
// CHAT ENDPOINT
// ==========================
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: LUMI_SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    res.json({ reply });
  } catch (error) {
    console.error("LUMI ERROR:", error);
    res.status(500).json({ error: "LUMI failed to respond" });
  }
});

// ==========================
// SERVER START
// ==========================
app.listen(PORT, () => {
  console.log(`🔥 LUMI backend running on http://localhost:${PORT}`);
});

