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

// ===== PAMÄŤ (IN-MEMORY) =====
// sessionId -> { name: string|null, history: [] }
const memory = new Map();

// ===== LUMI PERSONALITY =====
const BASE_SYSTEM_PROMPT = `
Si LUMI – priateľská, inteligentná AI kamarátka.
Rozprávaš po slovensky, tykáš, odpovedáš prirodzene a ľudsky.
Máš jemný humor, si empatická a vecná.
Ak poznáš meno používateľa, používaj ho prirodzene v odpovediach.
`;

// ===== SESSION HANDLER =====
function getSession(sessionId) {
  if (!memory.has(sessionId)) {
    memory.set(sessionId, {
      name: null,
      history: []
    });
  }
  return memory.get(sessionId);
}

// ===== LEPŠIA DETEKCIA MENA =====
function extractName(text) {
  const clean = text
    .toLowerCase()
    .replace(/[.,!?]/g, "")
    .trim();

  const patterns = [
    /volam sa ([a-záčďéíľľňóŕšťúýž]+)/i,
    /volám sa ([a-záčďéíľľňóŕšťúýž]+)/i,
    /som ([a-záčďéíľľňóŕšťúýž]+)/i,
    /moje meno je ([a-záčďéíľľňóŕšťúýž]+)/i
  ];

  for (const pattern of patterns) {
    const match = clean.match(pattern);
    if (match) {
      return match[1].charAt(0).toUpperCase() + match[1].slice(1);
    }
  }

  return null;
}

// ===== CHAT ENDPOINT =====
app.post("/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message || !sessionId) {
      return res.json({ reply: "Niečo mi tu chýba 🙂" });
    }

    const session = getSession(sessionId);

    // pokus o uloženie mena
    const detectedName = extractName(message);
    if (detectedName) {
      session.name = detectedName;
    }

    // system prompt s pamäťou
    let systemPrompt = BASE_SYSTEM_PROMPT;
    if (session.name) {
      systemPrompt += `\nPoužívateľ sa volá ${session.name}.`;
    }

    // kontext (posledných max 6 správ)
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

    // uložiť históriu
    session.history.push({ role: "user", content: message });
    session.history.push({ role: "assistant", content: reply });

    res.json({ reply });

  } catch (error) {
    console.error("❌ LUMI error:", error);
    res.json({
      reply: "Ups… na chvíľu som stratila niť myšlienok 🧠😅"
    });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 LUMI backend running on port ${PORT}`);
});
