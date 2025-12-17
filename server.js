import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

/**
 * 🧠 Simple in-memory state
 */
const memory = {
  mode: "default",
  lastUserMessage: "",
  lastLumiReply: ""
};

/**
 * Helpers
 */
function replyDefault(message) {
  if (!memory.lastUserMessage) {
    return `Ahoj 😊 Som LUMI. Ako sa dnes cítiš?`;
  }

  return `Rozumiem. Pred chvíľou si hovoril: "${memory.lastUserMessage}". Povedz mi viac.`;
}

function replyCoach(message) {
  return `💪 Počujem ťa. Povedal si: "${message}".  
Čo je **jedna malá vec**, ktorú vieš spraviť ešte dnes?`;
}

/**
 * Root
 */
app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

/**
 * Chat endpoint
 */
app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message" });
  }

  let reply = "";
  let from = "LUMI_default";

  // 🔁 MODE SWITCHING
  if (message.startsWith("/coach")) {
    memory.mode = "coach";
    reply = "💛 OK. Prepínam sa do COACH módu. Poďme makať.";
    from = "system";
  } else {
    // 🧠 MODE LOGIC
    if (memory.mode === "coach") {
      reply = replyCoach(message);
      from = "LUMI_coach";
    } else {
      reply = replyDefault(message);
      from = "LUMI_default";
    }
  }

  // 🧠 SAVE MEMORY
  memory.lastUserMessage = message;
  memory.lastLumiReply = reply;

  res.json({
    from,
    mode: memory.mode,
    reply
  });
});

/**
 * Start server
 */
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🧠 LUMI server running on port ${PORT}`);
});
