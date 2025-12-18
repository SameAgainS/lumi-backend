const input = document.getElementById("user-input");
const btn = document.getElementById("send-btn");
const chat = document.getElementById("chat-box");
const langSwitch = document.getElementById("lang-switch");

let currentLang = "en";

const placeholders = {
  en: "Write what came to mind…",
  sk: "Napíš, čo ti napadlo…",
  cz: "Napiš, co tě napadlo…"
};

langSwitch.addEventListener("change", () => {
  currentLang = langSwitch.value;
  input.placeholder = placeholders[currentLang];
});

async function send() {
  const text = input.value.trim();
  if (!text) return;

  // USER MESSAGE
  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = text;
  chat.appendChild(userMsg);

  input.value = "";

  // THINKING
  const thinking = document.createElement("div");
  thinking.className = "message lumi";
  thinking.textContent = "…";
  chat.appendChild(thinking);

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: text,
        lang: currentLang
      })
    });

    const data = await res.json();
    thinking.textContent = data.reply;

  } catch {
    thinking.textContent = "I’m still here. Something just paused.";
  }

  chat.scrollTop = chat.scrollHeight;
}

btn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});
