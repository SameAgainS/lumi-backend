import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 8080;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(bodyParser.json());

// ===== LOGS =====
console.log("🔥 SERVER.JS LOADED");
console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);

// ===== OPENAI CLIENT (NEW API) =====
const client = new OpenAI({
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

    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: `You are LUMI, a friendly AI companion.\nUser: ${message}`,
    });

    res.json({
      reply: response.output_text,
    });
  } catch (err) {
    console.error("❌ AI ERROR:", err);
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
