import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

/**
 * 🧠 PAMÄŤ LUMI
 * (zatím len v RAM – neskôr DB)
 */
const memory = {
  mode: "default", // default | coach
  lastUserMessage: null,
  lastLumiReply: null,
};

/**
 * 🤍 DEFAULT MÓD – prirodzený rozhovor
 */
function replyDefault(message) {
  if (!memory.lastUserMessage) {
    return "Ahoj 😊 Som LUMI. Ako sa dnes cítiš?";
  }

  return `Rozumiem. Pred chvíľou si hovoril: "${memory.lastUserMessage}".  
Čo sa odvtedy zmenilo?`;
}

/**
 * 💪 COACH MÓD – motivačný, priamy
 */
function replyCoach(message) {
  if (!memory.lastUserMessage) {
    return "💪 Som tvoj COACH. Čo ťa teraz najviac brzdí?";
  }

  return `Počujem ťa. Hovoril si: "${memory.lastUserMessage}".  
Poďme to rozbiť na malé kroky. Čo je prvá vec, ktorú vieš spraviť hneď teraz?`;
}

/**
 * 🚀 HLAVNÝ CHAT ENDPOINT
 */
app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      from: "system",
      reply: "❌ Chýba správa.",
    });
  }

  let reply = "";
  let from = "LUMI_default";

  // 🔀 PRÍKAZY
  if (message.startsWith("/coach")) {
    memory.mode = "coach";
    reply = "💛 OK. Prepínam sa do COACH módu. Poďme makať.";
    from = "system";
  } else if (message.startsWith("/default")) {
    memory.mode = "default";
    reply = "🤍 OK. Späť do normálneho rozhovoru.";
    from = "system";
  } else {
    // 🧠 Odpoveď podľa módu
    if (memory.mode === "coach") {
      reply = replyCoach(message);
      from = "LUMI_coach";
    } else {
      reply = replyDefault(message);
      from = "LUMI_default";
    }
  }

  // 🧠 ULOŽIŤ PAMÄŤ AŽ PO VÝPOČTE ODPOVEDE
  memory.lastUserMessage = message;
  memory.lastLumiReply = reply;

  res.json({
    from,
    mode: memory.mode,
    reply,
  });
});

/**
 * 🟢 HEALTH CHECK
 */
app.get("/", (req, res) => {
  res.send("✅ LUMI backend is running");
});

/**
 * 🔊 START SERVER
 */
app.listen(PORT, () => {
  console.log(`🚀 LUMI server running on port ${PORT}`);
});
