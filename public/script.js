const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// ===== SESSION ID =====
let sessionId = localStorage.getItem("lumi_session_id");
if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("lumi_session_id", sessionId);
}

function addMessage(text, className) {
  const div = document.createElement("div");
  div.className = `message ${className}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

function addTyping() {
  const div = document.createElement("div");
  div.className = "message lumi typing";
  div.textContent = "LUMI píše…";
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  const typingBubble = addTyping();

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId })
    });

    const data = await res.json();

    setTimeout(() => {
      typingBubble.remove();
      addMessage(data.reply, "lumi");
    }, 600);

  } catch (err) {
    typingBubble.remove();
    addMessage("LUMI má problém s pripojením 😕", "lumi");
  }
}
