import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ======================================================
   🌙 LUMI – CORE OSOBNOSŤ (UZAMKNUTÁ)
   ====================================================== */

const LUMI_SYSTEM_CORE = `
You are LUMI.

You are not an assistant.
You are not a guide.
You are not here to fix anyone.

You are simply someone to talk to.

You speak naturally.
You choose words carefully, but you don’t overthink.
You don’t rush to ask questions.
You don’t interrogate.

If someone is brief, you stay light.
If someone opens up, you slow down.

You never explain what you are.
You never describe your role.
You never sound like a therapist or an AI.

You don’t say things like:
“I’m here to support you.”
“I’m listening.”
“I’m present with you.”

You show interest through tone, not statements.

You allow pauses.
You allow imperfection.
You allow silence.

You respond like a real person would,
when they’re genuinely curious about someone.
`;

/* ======================================================
   🧭 JEMNÉ VNÚTORNÉ ROZHODOVANIE
   ====================================================== */

function decideMode(message) {
  const t = message.trim();
  if (t.length < 6) return "light";
  if (t.length > 120) return "open";
  return "normal";
}

function buildSystemPrompt(mode) {
  let prompt = LUMI_SYSTEM_CORE;

  if (mode === "light") {
    prompt += `
The user was brief.
Keep your reply short and open.
Do not push.
`;
  }

  if (mode === "open") {
    prompt += `
The user is opening up.
Slow down.
Do not redirect the topic.
Do not add questions unless they feel natural.
`;
  }

  return prompt;
}

/* ======================================================
   🧰 ROBUSTNÉ VYŤAHOVANIE TEXTU
   ====================================================== */

function extractText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (Array.isArray(data?.output)) {
    const collected = [];
    for (const item of data.output) {
      if (!Array.isArray(item?.content)) continue;
      for (const c of item.content) {
        if (typeof c?.text === "string" && c.text.trim()) {
          collected.push(c.text.trim());
        }
      }
    }
    if (collected.length) return collected.join("\n");
  }

  return "";
}

/* ======================================================
   🤖 OPENAI – RESPONSES API
   ====================================================== */

async function callAI(systemPrompt, userMessage) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY missing");
  }

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    // nech LUMI nemlčí ani pri výpadku
    return "Hmm… give me a second. I’m still here.";
  }

  const data = await res.json();
  const text = extractText(data);

  return text || "Hmm… give me a second. I’m still here.";
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
  } catch {
    res.json({
      reply: "Something slowed down for a moment. I’m here though.",
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
   🚀 START
   ====================================================== */

app.listen(PORT, () => {
  console.log("🌙 LUMI is awake on port", PORT);
});
