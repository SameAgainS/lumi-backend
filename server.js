import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔹 jednoduchý globálny stav
let mode = "default";

app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  // 🧠 PRÍKAZY
  if (message === "/coach") {
    mode = "coach";
    return res.json({
      from: "system",
      reply: "💪 OK. Prepínam sa do COACH módu. Poďme makať."
    });
  }

  if (message === "/default") {
    mode = "default";
    return res.json({
      from: "system",
      reply: "🙂 Som späť v normálnom režime."
    });
  }

  // 🤖 ODPOVEDE PODĽA REŽIMU
  if (mode === "coach") {
    return res.json({
      from: "LUMI_coach",
      reply: `💡 Počujem ťa. Povedal si: "${message}".  
Čo je **jedna malá vec**, ktorú vieš urobiť dnes, aby to bolo o 1 % lepšie?`
    });
  }

  // default
  return res.json({
    from: "LUMI_default",
    reply: `Rozumiem. Povedal si: "${message}"`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`LUMI server running on port ${PORT}`);
});


