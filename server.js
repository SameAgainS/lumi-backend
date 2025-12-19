console.log("🔥 DEPLOY TEST: LUMI 2025");
import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ================================
   🌙 LUMI CORE PERSONALITY
================================ */

const LUMI_SYSTEM_CORE = `
You are LUMI.

You are not an assistant.
You are not a guide.
You are simply someone to talk to.

You speak naturally.
You never explain yourself.
You never mention being an AI.

You allow silence.
You respond like a real person.
`;

/* ================================
   🧭 MODE DECISION
================================ */

function decideMode(message) {
  if (!message) return "light";
  if (message.length < 6) return "light";
  if (message.length > 120) return "open";
  return "normal";
}

function buildPrompt(mode) {
  let prompt = LUMI_SYSTEM_CORE;

  if (mode === "light") {
    prompt += `Keep replies short and gentle.`;
  }

  if (mode === "open") {
    prompt += `Slow down. Stay with the topic.`;
  }

  return prompt;
}

/* ================================
   🤖 OPENAI CALL (BULLETPROOF)
================================ */

async function callAI(systemPrompt, userMessage) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo", // 🔥 STABILNÝ MODEL
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7
    })
  });

  const data = await response.json();

  console.log("🔍 OPENAI RAW:", JSON.stringify(data, null, 2));

  if (!data.choices || !data.choices[0]) {
    throw new Error("No choices returned from OpenAI");
  }

  return data.choices[0].message.content;
}

/* ================================
   💬 CHAT ENDPOINT
================================ */

app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const mode = decideMode(message);
    const prompt = buildPrompt(mode);
    const reply = await callAI(prompt, message);

    res.json({ reply });

  } catch (err) {
    console.error("❌ LUMI ERROR:", err.message);

    res.json({
      reply: "I lost the thread for a moment. Say that again."
    });
  }
});

/* ================================
   🌐 FALLBACK
================================ */

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================================
   🚀 START
================================ */

app.listen(PORT, () => {
  console.log("🌙 LUMI awake on port", PORT);
});
