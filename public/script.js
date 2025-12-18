const input = document.getElementById("user-input");
const btn = document.getElementById("send-btn");
const chat = document.getElementById("chat-box");

setTimeout(() => input.focus(), 200);

btn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

function send() {
  if (!input.value.trim()) return;

  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = input.value;
  chat.appendChild(userMsg);

  input.value = "";
  input.focus();
}
