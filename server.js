import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 8080;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public")); // 👈 frontend

// ===== OPENAI =====
console.log("🔥 SERVER.JS LOADED");
console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ===== MEMORY (simple session memory) =====
const memory = [];

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

    memory.push({ role: "user", content: message });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are LUMI.
You are warm, witty, supportive and slightly playful.
You speak Slovak naturally.
You talk like a real friend.
Never say you are an AI unless asked directly.
          `,
        },
        ...memory,
      ],
    });

    const reply = completion.choices[0].message.content;

    memory.push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error("❌ AI ERROR:", err);
    res.status(500).json({ error: "AI error", details: err.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
