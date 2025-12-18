import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 👉 SERVE FRONTEND
app.use(express.static("public"));

// 👉 CHAT ENDPOINT
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ reply: "No message received." });
  }

  // 🔮 LUMI odpoveď (zatim placeholder – AI už máš)
  const reply = `LUMI: Počujem ťa → "${userMessage}"`;

  res.json({ reply });
});

// 👉 FALLBACK (nechytá sa, ak existuje index.html)
app.get("*", (req, res) => {
  res.sendFile(process.cwd() + "/public/index.html");
});

app.listen(PORT, () => {
  console.log(`🚀 LUMI backend running on port ${PORT}`);
});
