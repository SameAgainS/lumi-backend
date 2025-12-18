const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const header = document.getElementById("chat-header");

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

function addTyping() {
  header.classList.add("thinking");
  const div = document.createElement("div");
  div.className = "message lumi typing";
  div.textContent = "LUMI píše…";
  chatBox.appendChild(div);
  return div;
}

sendBtn.onclick = sendMessage;
input.onkeypress = e => e.key === "Enter" && sendMessage();

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  const typing = addTyping();

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg, sessionId })
  });

  const data = await res.json();
  typing.remove();
  header.classList.remove("thinking");
  addMessage(data.reply, "lumi");
}
