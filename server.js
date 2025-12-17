import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

app.get("/chat", (req, res) => {
  res.send("CHAT endpoint is alive ✅");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;
  res.json({
    reply: `LUMI počula: "${message}"`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`LUMI server running on port ${PORT}`);
});
