import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ===== MEMORY =====
const memory = new Map();

// ===== SYSTEM PROMPT =====
const BASE_SYSTEM_PROMPT = `
Si LUMI – priateľská, inteligentná AI kamarátka.
Rozprávaš po slovensky, tykáš, odpovedáš prirodzene a ľudsky.
Máš jemný humor, si empatická.
Ak poznáš meno používateľa, používaj ho prirodzene.
`;

function getSession(sessionId) {
  if (!memory.has(sessionId)) {
    memory.set(sessionId, { name: null, history: [] });
  }
  return memory.get(sessionId);
}

function extractName(text) {
  const clean = text.toLowerCase().replace(/[.,!?]/g, "").trim();
  const patterns = [
    /volam sa ([a-záčďéíľľňóŕšťúýž]+)/i,
    /volám sa ([a-záčďéíľľňóŕšťúýž]+)/i,
    /som ([a-záčďéíľľňóŕšťúýž]+)/i,
    /moje meno je ([a-záčďéíľľňóŕšťúýž]+)/i
  ];

  for (const p of patterns) {
    const m = clean.match(p);
    if (m) return m[1].charAt(0).toUpperCase() + m[1].slice(1);
  }
  return null;
}

app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!message || !sessionId) {
      return res.json({ reply: "Niečo mi tu chýba 🙂" });
    }

    const session = getSession(sessionId);
    const name = extractName(message);
    if (name) session.name = name;

    let systemPrompt = BASE_SYSTEM_PROMPT;
    if (session.name) systemPrompt += `\nPoužívateľ sa volá ${session.name}.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...session.history.slice(-6),
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.7,
      messages
    });

    const reply = completion.choices[0].message.content;

    session.history.push({ role: "user", content: message });
    session.history.push({ role: "assistant", content: reply });

    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.json({ reply: "Ups… na chvíľu som sa zamyslela až príliš 😅" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 LUMI backend running on port ${PORT}`);
});
