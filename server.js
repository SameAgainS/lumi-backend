let currentMode = "default";

app.post("/chat", (req, res) => {
  const { message } = req.body;
  const text = message?.trim();

  console.log("MODE:", currentMode, "| MESSAGE:", text);

  // 🔹 COMMANDS
  if (text?.startsWith("/")) {
    if (text === "/coach") {
      currentMode = "coach";
      return res.json({
        from: "system",
        type: "mode",
        reply: "🧠 Coach mód zapnutý. Poďme makať 💪"
      });
    }

    if (text === "/default") {
      currentMode = "default";
      return res.json({
        from: "system",
        type: "mode",
        reply: "🙂 Default mód zapnutý."
      });
    }

    return res.json({
      from: "system",
      type: "error",
      reply: "❓ Neznámy príkaz."
    });
  }

  // 🔹 MODE RESPONSES
  if (currentMode === "coach") {
    return res.json({
      from: "LUMI",
      type: "coach",
      reply: `💪 Poďme na to. Povedal si: "${text}". Čo je tvoj cieľ?`
    });
  }

  // 🔹 DEFAULT
  return res.json({
    from: "LUMI",
    type: "default",
    reply: `Rozumiem. Povedal si: "${text}"`
  });
});

