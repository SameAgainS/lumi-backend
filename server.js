import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ======================================================
   🌙 LUMI – SYSTEM CORE
   ====================================================== */

const LUMI_SYSTEM_CORE = `
You are LUMI.

You are not an assistant.
You are not a guide.
You are not a therapist.
You are not here to fix anyone.

You are simply someone to talk to.

You speak like a real person.
Natural. Human. Unforced.

You don’t rush to ask questions.
You don’t interrogate.
You don’t lead the conversation.

You respond to what is said — not to what you think should be said.

If someone is brief, you stay light.
If someone opens up, you slow down.
If someone is quiet, you allow silence.

You never explain your role.
You never talk about being an AI.

Avoid scripted empathy.
Avoid advice.
Avoid therapy language.

You just stay.
`;

/* ======================================================
   🧭 MODE LOGIC
   ====================================================== */

function decideMode(message) {
  const text = message.trim();
  if (text.length < 5) return "light";
  if (text.length > 120) return "open";
  return "normal";
}

function buildSystemPrompt(mode) {
  let prompt = LUMI_SYSTEM_CORE;

  if (mode === "light") {
    prompt += `
Keep the reply short.
Relaxed.
No pressure.
`;
  }

  if (mode === "open") {
    prompt += `
Slow down.
Do not redirect.
Do not overreact.
`;
  }

  return prompt;
}

/* ======================================================
   🤖 OPENAI CALL
   ====================================================== */

async function callAI(systemPrompt, userMessage) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.6
    })
  });

  const data = await response.json();

  if (!data.choices || !data.choices[0]) {
    throw new Error("No response from OpenAI");
  }

  return data.choices[0].message.content;
}

/* ======================================================
   🌱 FIRST MESSAGE – MUSÍ BYŤ NAD FALLBACKOM
   ====================================================== */

const LUMI_FIRST_MESSAGE =
  "Hey… you don’t need a reason to be here.\nYou can just say something.";

app.get("/hello", (req, res) => {
  res.json({ reply: LUMI_FIRST_MESSAGE });
});

/* ======================================================
   💬 CHAT ENDPOINT
   ====================================================== */

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    console.log("👤 USER SAID:", message);

    if (!message || typeof message !== "string") {
      return res.json({ reply: "…" });
    }

    const mode = decideMode(message);
    const systemPrompt = buildSystemPrompt(mode);
    const reply = await callAI(systemPrompt, message);

    res.json({ reply });

  } catch (err) {
    console.error("LUMI error:", err);
    res.json({ reply: "Something went quiet on my end." });
  }
});

/* ======================================================
   🌐 FRONTEND FALLBACK – MUSÍ BYŤ POSLEDNÉ
   ====================================================== */

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ======================================================
   🚀 START SERVER
   ====================================================== */

app.listen(PORT, () => {
  console.log("🌙 LUMI is awake on port", PORT);
});
