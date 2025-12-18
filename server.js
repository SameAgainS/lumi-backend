import express from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

// __dirname fix pre ES modules
const __dirname = path.resolve();

app.use(express.json());

// 🔑 SERVE FRONTEND
app.use(express.static(path.join(__dirname, "public")));

// 🔑 CHAT ENDPOINT (dummy – len na test)
app.post("/chat", (req, res) => {
  res.json({ reply: "LUMI počuje tvoje slová." });
});

// 🔑 FALLBACK – VŽDY VRÁTI index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("LUMI server running on port", PORT);
});
