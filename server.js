const express = require("express");
const app = express();

// 🔑 Render port (POVINNÉ)
const PORT = process.env.PORT || 3000;

// root endpoint
app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

// health check (voliteľné)
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`LUMI server running on port ${PORT}`);
});

