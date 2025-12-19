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

// ===== MEMORY =====
const memory = {};

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
`
};

app.post("/chat", async (req, res) => {
  try {
    const { message, name } = req.body;
    const userId = name || "guest";

    if (!memory[userId]) memory[userId] = [];

    memory[userId].push({ role: "user", content: message });
    if (memory[userId].length > 8) memory[userId].shift();

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
    const reply =
      data?.choices?.[0]?.message?.content || "I’m here with you.";

    memory[userId].push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "I’m still here." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🧠 LUMI running on port ${PORT}`);
});
