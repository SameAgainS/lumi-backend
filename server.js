import express from "express";
import cors from "cors";

const app = express();

/* ======================
   BASIC MIDDLEWARE
====================== */
app.use(cors());
app.use(express.json());

/* ======================
   STATE (LUMI MODE)
====================== */
let lumiMode = "default"; 
// default | coach | friend

/* ======================
   ROOT ENDPOINT
====================== */
app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

/* ======================
   CHAT ENDPOINT
====================== */
app.post("/chat", (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({
      from: "system",
      reply: "⚠️ Pošli mi správu, prosím."
    });
  }

  /* =========
     COMMANDS
  ========= */

  if (message.toLowerCase() === "/coach") {
    lumiMode = "coach";
    return res.json({
      from: "system",
      reply: "💪 OK. Prepínam sa do COACH módu. Poďme makať."
    });
  }

  if (message.toLowerCase() === "/friend") {
    lumiMode = "friend";
    return res.json({
      from: "system",
      reply: "😊 Jasné. Som tu ako tvoj parťák."
    });
  }

  if (message.toLowerCase() === "/default") {
    lumiMode = "default";
    return res.json({
      from: "system",
      reply: "🔄 Späť do normálneho módu."
    });
  }

  /* =========
     RESPONSES
  ========= */

  let reply = "";

  if (lumiMode === "coach") {
    reply = `💡 Počujem ťa. Povedal si: "${message}".  
Čo je momentálne tvoja najväčšia prekážka?`;
  }

  else if (lumiMode === "friend") {
    reply = `🙂 Hej, rozumiem. "${message}"  
Som tu, kľudne mi povedz viac.`;
  }

  else {
    reply = `🤍 Rozumiem. Povedal si: "${message}"`;
  }

  res.json({
    from: `LUMI_${lumiMode}`,
    reply
  });
});

/* ======================
   SERVER START
====================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`LUMI server running on port ${PORT}`);
});
