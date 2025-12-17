import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("."));

function generateReply(message) {
  const text = message.toLowerCase();

  if (text.includes("sad") || text.includes("smut")) {
    return "I’m really sorry you’re feeling this way. You don’t have to carry it alone. What’s been weighing on you the most?";
  }

  if (text.includes("lonely") || text.includes("alone")) {
    return "Loneliness can feel heavy. I’m here with you right now. When does it feel the strongest?";
  }

  if (text.includes("anxious") || text.includes("stress")) {
    return "That sounds overwhelming. Let’s slow this down together. What’s the main thing your mind keeps returning to?";
  }

  if (text.includes("angry") || text.includes("mad")) {
    return "Anger often shows up when something important was crossed. What do you feel was not respected?";
  }

  if (text.includes("happy") || text.includes("good")) {
    return "I’m glad to hear that. What made today feel lighter for you?";
  }

  if (text.endsWith("?")) {
    return "That’s a good question. What answer feels closest to the truth for you right now?";
  }

  if (text.length < 4) {
    return "I’m here. You don’t need many words. What are you feeling underneath?";
  }

  return "Thank you for sharing that with me. Do you want to tell me a bit more about it?";
}

app.post("/api/chat", (req, res) => {
  const userMessage = req.body.message || "";
  const reply = generateReply(userMessage);

  setTimeout(() => {
    res.json({ reply });
  }, 800); // jemné oneskorenie = ľudskejší pocit
});

app.listen(PORT, () => {
  console.log(`🌙 LUMI server running at http://localhost:${PORT}`);
app.get("/", (req, res) => {
  res.send("LUMI backend is alive 🚀");
});

});
