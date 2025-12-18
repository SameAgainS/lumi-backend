import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(bodyParser.json());

// debug
console.log("🔥 SERVER JS LOADED");
console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);

// OpenAI client (NOVÝ 2025 spôsob)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// health check
app.get("/", (req, res) => {
  res.send("✅ LUMI backend is running");
});

// CHAT ENDPOINT
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

    res.json({
      reply: response.output_text,
    });
  } catch (err) {
    console.error("❌ AI ERROR:", err);
    res.status(500).json({
      error: "AI error",
      details: err?.message ?? err,
    });
  }
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
