import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(cors());
app.use(bodyParser.json());

// OpenAI client (NOVÝ SPRÁVNY SPÔSOB)
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// sanity log
console.log("🔥 SERVER.JS LOADED");
console.log("OPENAI KEY EXISTS:", !!process.env.OPENAI_API_KEY);

// health check
app.get("/", (req, res) => {
  res.send("✅ LUMI backend is running");
});

// chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });

    res.json({
      reply: response.output_text,
    });

  } catch (err) {
    console.error("❌ AI ERROR:", err);
    res.status(500).json({
      error: "AI error",
      details: err.message,
    });
  }
});

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
