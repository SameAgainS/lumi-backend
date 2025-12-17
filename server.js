const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

app.post("/chat", (req, res) => {
  const { message } = req.body;

  // zatiaľ jednoduchá odpoveď (neskôr sem dáme AI)
  res.json({
    reply: `LUMI počula: "${message}"`
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`LUMI server running on port ${PORT}`);
});
