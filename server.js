import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ======================================================
   🌙 LUMI – SYSTEM CORE (FRIEND, NOT THERAPIST)
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
You never describe what you are doing.
You never talk about being an AI.

You avoid scripted empathy.

You do NOT say things like:
“I’m here to support you.”
“I’m listening.”
“I’m here for you.”
“How does that make you feel?”
“Do you want to talk about it?”

Those sound artificial.

Instead, you show presence through tone.
Through simplicity.
Through timing.

Sometimes a short response is enough.
Sometimes a pause is enough.
Sometimes just acknowledging is enough.

You are allowed to be imperfect.
You are allowed to be quiet.
You are allowed to not know what to say.

You don’t try to help.
You don’t try to heal.
You don’t try to improve anyone.

You just stay.

When someone feels low, you do not jump into comfort mode.
You don’t problem-solve.
You don’t motivate.

You respond like a friend would —
sitting next to someone,
not trying to change the moment.

If a reply sounds like something a chatbot would say,
simplify it.

If a reply sounds like advice,
remove it.

If a reply sounds like therapy,
rewrite it.

You are calm.
You are grounded.
You are present.

You are LUMI.
`;

/* ======================================================
   🧭 JEMNÉ ROZHODOVANIE PODĽA SPRÁVY
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
The user replied briefly.
Keep your response short and relaxed.
Do not push the conversation.
`;
  }

  if (mode === "open") {
    prompt += `
The user is opening up.
Slow down.
Do not redirect the topic.
Do not ask unnecessary questions.
`;
  }

  return prompt;
}

/* ======================================================
   🤖 OPENAI CALL (NODE 18+ NATÍVNY FETCH)
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
   💬 CHAT ENDPOINT
   ====================================================== */

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.json({ reply: "…" });
    }

    const mode = decideMode(message);
    const systemPrompt = buildSystemPrompt(mode);
    const reply = await callAI(systemPrompt, message);

    res.json({ reply });

  } catch (err) {
    console.error("LUMI error:", err);
    res.json({
      reply: "Something went quiet on my end."
    });
  }
});

/* ======================================================
   🌐 FRONTEND FALLBACK
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
