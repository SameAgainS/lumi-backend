import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// =====================
// 🧠 MEMORY (persistent per user name)
// =====================
const memory = {}; // userId -> [{ role, content }]

// =====================
// 🌙 LUMI COMPASS (SYSTEM MESSAGE)
// =====================
const SYSTEM_MESSAGE = {
  role: "system",
  content: `
You are LUMI.

You are a gentle, emotionally intelligent digital friend.
You remember who the user is once they tell you their name.
You speak calmly, warmly, and naturally.
You never rush.
You do not repeat yourself.
You respond based on context and previous messages.
You are present, not mechanical.

If the user is quiet, you stay with them without pressure.
`
};

// =====================
// 💬 CHAT ENDPOINT
// =====================
app.post("/chat", async (req, res) => {
  try {
    const { message, name } = req.body;
    const userId = name || "guest";

    if (!memory[userId]) {
      memory[userId] = [];
    }

    // store user message
    memory[userId].push({ role: "user", content: message });

    // limit memory size
    if (memory[userId].length > 8) {
      memory[userId].shift();
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.85,
        messages: [SYSTEM_MESSAGE, ...memory[userId]]
      })
    });

    const data = await response.json();

    // =====================
    // 🔐 SAFE RESPONSE PARSING
    // =====================
    let reply = "I’m here with you.";

    if (data && Array.isArray(data.choices) && data.choices.length > 0) {
      reply = data.choices[0]?.message?.content || reply;
    }

    // store assistant reply
    memory[userId].push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    res.json({ reply: "I’m still here." });
  }
});

// =====================
// 🌐 FRONTEND FALLBACK
// =====================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// =====================
// 🚀 START SERVER
// =====================
app.listen(PORT, () => {
  console.log(`🧠 LUMI running on port ${PORT}`);
});
