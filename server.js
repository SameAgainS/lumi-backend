import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

/* ======================================================
   🌙 LUMI – CORE OSOBNOSŤ (ZLATÝ STRED)
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

You never explain what you are doing.
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
  const text = message.trim();
  if (text.length < 6) return "light";
  if (text.length > 120) return "open";
  return "normal";
}

function buildSystemPrompt(mode) {
  let prompt = LUMI_SYSTEM_CORE;

  if (mode === "light") {
    prompt += `
The user responded briefly.
Keep your reply short and open.
Do not push.
`;
  }

  if (mode === "open") {
    prompt += `
The user is opening up.
Slow down.
Do not redirect the topic.
Do not add new questions unless they feel natural.
`;
  }

  return prompt;
}

/* ======================================================
   🧰 Helper: vytiahni text z Responses API rôznych tvarov
   ====================================================== */

function extractResponseText(data) {
  // 1) najčastejšie: output_text
  if (typeof data?.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  // 2) output array -> content array -> položky s textom
  const out = data?.output;
  if (Array.isArray(out)) {
    const parts = [];

    for (const item of out) {
      const content = item?.content;
      if (!Array.isArray(content)) continue;

      for (const c of content) {
        // býva { type: "output_text", text: "..." }
        if (typeof c?.text === "string" && c.text.trim()) {
          parts.push(c.text.trim());
        }
        // niekedy je text zabalený inak
        if (typeof c?.content === "string" && c.content.trim()) {
          parts.push(c.content.trim());
        }
      }
    }

    if (parts.length) return parts.join("\n");
  }

  // 3) fallbacky (niekedy)
  if (typeof data?.text === "string" && data.text.trim()) {
    return data.text.trim();
  }

  return "";
}

/* ======================================================
   🤖 OPENAI VOLANIE (RESPONSES API)
   ====================================================== */

async function callAI(systemPrompt, userMessage) {
  const response = await fetch("https://api.openai.com/v1/responses", {
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

  const data = await response.json();

  // ✅ Debug: uvidíš pravdu v Railway Logs (bez hádania)
  console.log("📡 OpenAI status:", response.status);
  console.log("📦 OpenAI response:", JSON.stringify(data, null, 2));

  // Ak OpenAI vráti error, nech to vidíš
  if (!response.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      "OpenAI request failed (unknown).";
    throw new Error(msg);
  }

  const text = extractResponseText(data);
  return text || "…";
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
    console.error("❌ LUMI error:", err?.message || err);
    res.status(500).json({
      reply: "Something paused for a moment. I'm still here.",
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
