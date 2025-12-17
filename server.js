import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

/* ROOT TEST */
app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

/* CHAT ENDPOINT */
app.post("/chat", (req, res) => {
  const text = (req.body.message || "").toLowerCase();

  let reply = "Hm… povedz mi o tom viac.";

  if (text.includes("ahoj") || text.includes("hello")) {
    reply = "Ahoj 🙂 Som LUMI. Ako sa dnes máš?";
  } 
  else if (text.includes("ako sa máš")) {
    reply = "Mám sa pokojne. Som tu pre teba. A ty?";
  } 
  else if (text.includes("pomoc")) {
    reply = "Rada pomôžem 🌱 Čo práve riešiš?";
  } 
  else if (text.includes("ďakujem")) {
    reply = "Rado sa stalo 🤍";
  }

  res.json({ reply });
});

/* START SERVER */
app.listen(PORT, () => {
  console.log(`LUMI server running on port ${PORT}`);
});
