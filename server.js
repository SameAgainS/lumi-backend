import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   LUMI STATE (MOZOG)
========================= */
let state = {
  mode: "default",      // default | coach
  style: "soft",        // soft | normal | brutal
  emotion: "neutral",   // neutral | sad | angry | tired | focused
  memory: {
    lastProblem: null,
    lastGoal: null
  }
};

/* =========================
   HELPER
========================= */
function reply(from, text) {
  return {
    from,
    mode: state.mode,
    style: state.style,
    emotion: state.emotion,
    reply: text
  };
}

/* =========================
   COMMAND HANDLERS
========================= */
function handleCommand(message, res) {

  // RESET
  if (message === "/reset") {
    state = {
      mode: "default",
      style: "soft",
      emotion: "neutral",
      memory: {
        lastProblem: null,
        lastGoal: null
      }
    };

    return res.json(
      reply("LUMI_default", "🔄 Reset hotový. Začíname odznova. Ako sa cítiš?")
    );
  }

  // COACH MODE
  if (message === "/coach") {
    state.mode = "coach";
    return res.json(
      reply("system", "💪 OK. Prepínam do COACH módu. Poďme makať.")
    );
  }

  // STYLE
  if (message.startsWith("/style")) {
    const style = message.split(" ")[1];
    const allowed = ["soft", "normal", "brutal"];

    if (allowed.includes(style)) {
      state.style = style;
      return res.json(
        reply("system", `🎨 Štýl nastavený na: ${style}`)
      );
    }

    return res.json(
      reply("system", "❌ Použi: /style soft | normal | brutal")
    );
  }

  // MOOD
  if (message.startsWith("/mood")) {
    const mood = message.split(" ")[1];
    const allowed = ["neutral", "sad", "angry", "tired", "focused"];

    if (allowed.includes(mood)) {
      state.emotion = mood;
      return res.json(
        reply("system", `🧠 Emócia nastavená na: ${mood}`)
      );
    }

    return res.json(
      reply("system", "❌ Použi: /mood neutral | sad | angry | tired | focused")
    );
  }

  return false;
}

/* =========================
   CHAT ENDPOINT
========================= */
app.post("/chat", (req, res) => {
  const message = (req.body.message || "").trim();

  // COMMANDS
  const handled = handleCommand(message, res);
  if (handled !== false) return;

  /* =========================
     MEMORY DETECTION
  ========================= */
  if (/nemám|neviem|trápi|ťažké/i.test(message)) {
    state.memory.lastProblem = message;
  }

  if (/chcem|cieľ|budem|plánujem/i.test(message)) {
    state.memory.lastGoal = message;
  }

  /* =========================
     RESPONSE LOGIC
  ========================= */

  // COACH MODE
  if (state.mode === "coach") {

    if (state.emotion === "tired") {
      return res.json(
        reply(
          "LUMI_coach",
          "Si unavený. Nehraj sa na hrdinu. Aký je najmenší krok, ktorý dnes zvládneš?"
        )
      );
    }

    if (state.emotion === "angry") {
      return res.json(
        reply(
          "LUMI_coach",
          "Hnev je energia. Kam ju dnes nasmeruješ?"
        )
      );
    }

    if (state.style === "brutal") {
      return res.json(
        reply(
          "LUMI_coach",
          "Tvrdá pravda: nikto ťa nepríde zachrániť. Aký je JEDEN krok, ktorý spravíš dnes?"
        )
      );
    }

    if (state.style === "soft") {
      return res.json(
        reply(
          "LUMI_coach",
          "Som tu s tebou. Povedz mi, čo je teraz pre teba najťažšie."
        )
      );
    }

    return res.json(
      reply(
        "LUMI_coach",
        "Poďme to rozbiť na malé kroky. Čo je prvá vec, ktorú môžeme spraviť?"
      )
    );
  }

  // DEFAULT MODE
  return res.json(
    reply(
      "LUMI_default",
      `❤️ Rozumiem. Povedal si: "${message}".  
Chceš sa o tom porozprávať viac?`
    )
  );
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 LUMI server running on port ${PORT}`);
});
