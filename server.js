import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 8080;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(bodyParser.json());

// ===== OPENAI CLIENT =====
console.log("🔥 SERVER.JS LOADED");
console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("✅ LUMI backend is running");
});

// ===== CHAT ENDPOINT =====
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: "You are LUMI, a friendly AI companion.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      response.output?.[0]?.content?.[0]?.text ||
      "LUMI is thinking… 🤔";

    res.json({ reply });
  } catch (err) {
    console.error("🔥 AI ERROR FULL:", err);
    res.status(500).json({
      error: "AI error",
      details: err.message,
    });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
