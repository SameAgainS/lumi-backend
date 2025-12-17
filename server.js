import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// =========================
// GLOBAL STATE (LUMI)
// =========================
let state = {
  mode: "default",   // default | coach
  style: "normal",   // normal | brutal
  emotion: "neutral"
};

// =========================
// HELPERS
// =========================
function systemReply(reply, extra = {}) {
  return {
    from: "system",
    ...state,
    ...extra,
    reply
  };
}

function lumiReply(from, reply) {
  return {
    from,
    ...state,
    reply
  };
}

// =========================
// COMMAND HANDLERS
// =========================
function handleCommand(message) {
  const cmd = message.trim().toLowerCase();

  // /reset
  if (cmd === "/reset") {
    state = {
      mode: "default",
      style: "normal",
      emotion: "neutral"
    };
    return systemReply("🔄 LUMI resetnutá. Začíname odznova.");
  }

  // /coach
  if (cmd === "/coach") {
    state.mode = "coach";
    return systemReply("💪 OK. Prepínam sa do COACH módu. Poďme makať.");
  }

  // /style brutal
  if (cmd.startsWith("/style")) {
    const parts = cmd.split(" ");
    if (parts[1]) {
      state.style = parts[1];
      return systemReply(`🎭 Štýl nastavený na: ${state.style}`);
    }
    return systemReply("⚠️ Zadaj štýl. Napr: /style brutal");
  }

  return null;
}

// =========================
// MESSAGE HANDLER
// =========================
function handleMessage(message) {
  // COACH MODE
  if (state.mode === "coach") {
    if (state.style === "brutal") {
      return lumiReply(
        "LUMI_coach",
        `Tvrdá pravda: nikto ťa nepríde zachrániť.\nAký je JEDEN krok, ktorý spravíš dnes?`
      );
    }

    return lumiReply(
      "LUMI_coach",
      "Počujem ťa. Čo je teraz najväčší problém, ktorý chceš riešiť?"
    );
  }

  // DEFAULT MODE
  return lumiReply(
    "LUMI_default",
    `❤️ Rozumiem. Povedal si: "${message}"`
  );
}

// =========================
// ROUTES
// =========================
app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json(systemReply("⚠️ Chýba správa."));
  }

  // COMMAND?
  if (message.startsWith("/")) {
    const commandResponse = handleCommand(message);
    if (commandResponse) {
      return res.json(commandResponse);
    }
  }

  // NORMAL MESSAGE
  const reply = handleMessage(message);
  res.json(reply);
});

// =========================
// START SERVER
// =========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 LUMI server running on port ${PORT}`);
});
