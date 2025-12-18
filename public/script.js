/* =========================
   LANGUAGE DATA
========================= */
const LANG = {
  en: {
    brand1: "Words need to be spoken",
    brand2: "Only then they gain meaning",
    welcome: "Hello. What will words create today?",
    placeholder: "Write a thought…",
    send: "Send"
  },
  sk: {
    brand1: "Slová chcú byť vyslovené",
    brand2: "Až potom majú význam",
    welcome: "Ahoj. Čo dnes vznikne slovami?",
    placeholder: "Napíš myšlienku…",
    send: "Send"
  },
  cz: {
    brand1: "Slova chtějí být vyslovena",
    brand2: "Teprve pak mají význam",
    welcome: "Ahoj. Co dnes vznikne slovy?",
    placeholder: "Napiš myšlenku…",
    send: "Send"
  }
};

/* =========================
   DEFAULT LANGUAGE = EN
========================= */
let currentLang = localStorage.getItem("lumi_lang") || "en";

/* =========================
   APPLY LANGUAGE
========================= */
function applyLanguage() {
  const t = LANG[currentLang];

  document.querySelector(".brand-line-1").textContent = t.brand1;
  document.querySelector(".brand-line-2").textContent = t.brand2;
  document.querySelector(".message.lumi").textContent = t.welcome;
  document.getElementById("user-input").placeholder = t.placeholder;
  document.getElementById("send-btn").textContent = t.send;

  document.querySelectorAll("#lang-switch button").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === currentLang);
  });
}

applyLanguage();

/* =========================
   LANGUAGE SWITCH HANDLER
========================= */
document.querySelectorAll("#lang-switch button").forEach(btn => {
  btn.onclick = () => {
    currentLang = btn.dataset.lang;
    localStorage.setItem("lumi_lang", currentLang);
    applyLanguage();
  };
});

/* =========================
   CHAT LOGIC
========================= */
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let sessionId = localStorage.getItem("lumi_session");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("lumi_session", sessionId);
}

function addMessage(text, cls) {
  const div = document.createElement("div");
  div.className = "message " + cls;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.onclick = sendMessage;
input.onkeypress = e => e.key === "Enter" && sendMessage();

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg, sessionId })
  });

  const data = await res.json();
  addMessage(data.reply, "lumi");
}
