import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ===== OPENAI INIT =====
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ===== LUMI PERSONALITY =====
const LUMI_SYSTEM_PROMPT = `
Si LUMI – priateľská, inteligentná AI kamarátka.
Rozprávaš po slovensky, tykáš, odpovedáš prirodzene a ľudsky.
Máš jemný humor, si empatická a vecná.
Neodpovedáš roboticky ani stroho.
Ak niečo nevieš, povieš to úprimne.
`;

// ===== CHAT ENDPOINT =====
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.json({ reply: "Napíš mi niečo 🙂" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: LUMI_SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error("❌ OpenAI error:", error);
    res.json({
      reply: "Ups… niečo sa mi teraz v hlave zamotalo 🧠😅 Skús ešte raz."
    });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 LUMI backend running on port ${PORT}`);
});
