import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   ROOT ENDPOINT
========================= */
app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

/* =========================
   SIMPLE INTELLIGENCE
========================= */
function analyzeMessage(message) {
  const text = message.toLowerCase();

  if (text.includes("ahoj") || text.includes("hello") || text.includes("čau")) {
    return "greeting";
  }

  if (text.includes("?")) {
    return "question";
  }

  if (
    text.includes("smutný") ||
    text.includes("zle") ||
    text.includes("nahovno") ||
    text.includes("unavený")
  ) {
    return "emotion";
  }

  return "default";
}

function generateReply(type, message) {
  switch (type) {
    case "greeting":
      return "Ahoj 👋 som LUMI. Ako sa dnes cítiš?";

    case "question":
      return "Dobrá otázka 🤔 Skús mi ju trochu rozviesť.";

    case "emotion":
      return "To ma mrzí 😔 Chceš sa o tom porozprávať?";

    default:
      return `Rozumiem. Povedal si: "${message}"`;
  }
}

/* =========================
   CHAT ENDPOINT
========================= */
app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Missing message"
    });
  }

  const type = analyzeMessage(message);
  const reply = generateReply(type, message);

  res.json({
    from: "LUMI",
    type,
    reply
  });
});

/* =========================
   SERVER START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🤖 LUMI server running on port ${PORT}`);
});
