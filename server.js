import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   🧠 LUMI CORE
========================= */

const LUMI = {
  name: "LUMI",
  personality: "warm, human, honest, supportive",
};

/* =========================
   🧠 MEMORY (v1)
========================= */

let memory = {
  mode: "default", // default | coach | friend
  lastMessage: null,
};

/* =========================
   🎭 MODE RESPONSES
========================= */

const modes = {
  default: (msg) => {
    return `Rozumiem. Povedal si: "${msg}"  
Chceš sa len porozprávať, alebo mám pomôcť konkrétne?`;
  },

  coach: (msg) => {
    if (/nem[aá]m|unaven|nechce|nič sa mi/i.test(msg)) {
      return `Počujem ťa.  
👉 Čo je **jedna malá vec**, ktorú by si dnes zvládol?`;
    }

    return `Počujem ťa.  
👉 Na čom chceš teraz zapracovať – hlava, disciplína alebo cieľ?`;
  },

  friend: (msg) => {
    return `Som tu 🙂  
Povedz mi viac, čo sa ti dnes deje.`;
  },
};

/* =========================
   🔁 COMMANDS
========================= */

function handleCommand(message) {
  if (message === "/coach") {
    memory.mode = "coach";
    return {
      from: "system",
      reply: "💪 OK. Prepínam sa do COACH módu. Poďme makať.",
    };
  }

  if (message === "/friend") {
    memory.mode = "friend";
    return {
      from: "system",
      reply: "🙂 Som tu ako kamarát. Kľudne sa vypíš.",
    };
  }

  if (message === "/default") {
    memory.mode = "default";
    return {
      from: "system",
      reply: "🔄 Späť do normálneho módu.",
    };
  }

  return null;
}

/* =========================
   🌐 ROUTES
========================= */

app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  const command = handleCommand(message);
  if (command) {
    return res.json(command);
  }

  const handler = modes[memory.mode] || modes.default;
  const reply = handler(message);

  memory.lastMessage = message;

  res.json({
    from: `LUMI_${memory.mode}`,
    reply,
  });
});

/* =========================
   🚀 START
========================= */

const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`LUMI server running on port ${PORT}`);
});
