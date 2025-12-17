import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🧠 jednoduchá pamäť
let memory = {
  lastUserMessage: null
};

app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  let reply = "";

  if (!message) {
    reply = "Prosím, napíš mi niečo 🙂";
  } else if (memory.lastUserMessage) {
    reply = `Spomínal si predtým: "${memory.lastUserMessage}". Chceš na to nadviazať?`;
  } else {
    reply = `Ahoj 😊 Som LUMI. Povedz mi viac.`;
  }

  // uložíme pamäť
  memory.lastUserMessage = message;

  res.json({ reply });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`LUMI server running on port ${PORT}`);
});
