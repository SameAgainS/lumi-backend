const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

// ===== persistent identity =====
let userName = localStorage.getItem("lumi_name");

// detect name like: "I'm Alex"
function detectName(text) {
  const match = text.match(/i[' ]?m ([a-z]+)/i);
  if (match) {
    userName = match[1];
    localStorage.setItem("lumi_name", userName);
  }
}

// add message to chat
function add(text, sender) {
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

// ===== SEND MESSAGE =====
async function send() {
  const text = input.value.trim();
  if (!text) return;

  // show user message
  add(text, "user");
  input.value = "";

  detectName(text);

  try {
    console.log("📤 sending to /chat:", text);

    const res = await fetch("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        name: userName
      })
    });

    console.log("📥 response status:", res.status);

    if (!res.ok) {
      add("Something went wrong on my side.", "lumi");
      return;
    }

    const data = await res.json();
    console.log("📦 response data:", data);

    if (data && data.reply) {
      add(data.reply, "lumi");
    } else {
      add("I’m here with you.", "lumi");
    }

  } catch (err) {
    console.error("❌ FETCH ERROR:", err);
    add("I’m still here.", "lumi");
  }
}

// ===== EVENTS =====
sendBtn.addEventListener("click", send);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") send();
});
