import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

/* =========================
   🧠 USER PROFIL + PAMÄŤ
========================= */
const state = {
  user: {
    name: null,
    goal: null,
    style: "soft", // soft | direct | brutal
  },
  mode: "default", // default | coach
  emotion: "neutral", // neutral | sad | frustrated | motivated
  lastUserMessage: null,
};

/* =========================
   🎭 EMOTION DETECTION
========================= */
function detectEmotion(text) {
  const t = text.toLowerCase();

  if (t.includes("nemám") || t.includes("nebaví") || t.includes("nič")) {
    return "frustrated";
  }
  if (t.includes("smutný") || t.includes("zle")) {
    return "sad";
  }
  if (t.includes("idem") || t.includes("chcem") || t.includes("poďme")) {
    return "motivated";
  }
  return "neutral";
}

/* =========================
   🤍 DEFAULT MODE
========================= */
function defaultReply(msg) {
  return `Rozumiem. Povedal si: "${msg}".  
Chceš sa o tom porozprávať viac?`;
}

/* =========================
   💪 COACH MODE (LEVELY)
========================= */
function coachReply(msg) {
  switch (state.user.style) {
    case "brutal":
      return `Tvrdá pravda: nikto ťa nepríde zachrániť.  
Aký je JEDEN krok, ktorý spravíš dnes?`;

    case "direct":
      return `OK. Poďme vecne.  
Čo konkrétne ti teraz bráni spraviť ďalší krok?`;

    default:
      return `Počujem ťa.  
Čo by ti teraz najviac pomohlo posunúť sa aspoň o 1 %?`;
  }
}

/* =========================
   🚀 CHAT ENDPOINT
========================= */
app.post("/chat", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ reply: "❌ Chýba správa." });
  }

  // uložiť emóciu
  state.emotion = detectEmotion(message);
  state.lastUserMessage = message;

  let reply = "";
  let from = "LUMI";

  /* ===== COMMANDS ===== */
  if (message.startsWith("/coach")) {
    state.mode = "coach";
    reply = "💪 COACH mód aktivovaný. Poďme makať.";
    from = "system";
  }

  else if (message.startsWith("/style")) {
    const style = message.split(" ")[1];
    if (["soft", "direct", "brutal"].includes(style)) {
      state.user.style = style;
      reply = `🧠 Štýl nastavený na: ${style}`;
      from = "system";
    } else {
      reply = "Použi: /style soft | direct | brutal";
      from = "system";
    }
  }

  else if (message.startsWith("/name")) {
    state.user.name = message.replace("/name", "").trim();
    reply = `🤍 Teší ma, ${state.user.name}.`;
    from = "system";
  }

  else if (message.startsWith("/goal")) {
    state.user.goal = message.replace("/goal", "").trim();
    reply = `🎯 Cieľ uložený: ${state.user.goal}`;
    from = "system";
  }

  /* ===== NORMAL CHAT ===== */
  else {
    if (state.mode === "coach") {
      reply = coachReply(message);
      from = "LUMI_coach";
    } else {
      reply = defaultReply(message);
      from = "LUMI_default";
    }
  }

  res.json({
    from,
    mode: state.mode,
    style: state.user.style,
    emotion: state.emotion,
    reply,
  });
});

/* =========================
   🟢 HEALTH
========================= */
app.get("/", (req, res) => {
  res.send("✅ LUMI v2 online");
});

app.listen(PORT, () => {
  console.log(`🚀 LUMI v2 running on ${PORT}`);
});
