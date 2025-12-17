import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

/* -------------------------
   LUMI – message classifier
--------------------------*/
function classifyMessage(text) {
  const msg = text.toLowerCase();

  if (
    msg.includes("ahoj") ||
    msg.includes("čau") ||
    msg.includes("cau") ||
    msg.includes("hello") ||
    msg.includes("hi")
  ) {
    return "greeting";
  }

  if (
    msg.includes("nič") ||
    msg.includes("zle") ||
    msg.includes("na hovno") ||
    msg.includes("smutno") ||
    msg.includes("nahovno")
  ) {
    return "negative";
  }

  if (msg.endsWith("?")) {
    return "question";
  }

  return "default";
}

/* -------------------------
   LUMI – response engine
--------------------------*/
function generateReply(type, message) {
  switch (type) {
    case "greeting":
      return "Ahoj 👋 som LUMI. Ako sa dnes cítiš?";

    case "negative":
      return "Mrzí ma, že to tak cítiš 😔 Chceš mi povedať, čo sa deje?";

    case "question":
      return "Zaujímavá otázka 🤔 Skús mi ju trochu rozvinúť.";

    default:
      return `Rozumiem. Povedal si: "${message}"`;
  }
}

/* -------------------------
   Routes
--------------------------*/
app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      error: "Message is required",
    });
  }

  const type = classifyMessage(message);
  const reply = generateReply(type, message);

  res.json({
    from: "LUMI",
    type,
    reply,
  });
});

/* -------------------------
   Server start
--------------------------*/
const PORT = process.env.PORT || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`LUMI server running on port ${PORT}`);
});
