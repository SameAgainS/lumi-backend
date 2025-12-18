const input = document.getElementById("user-input");
const btn = document.getElementById("send-btn");
const chat = document.getElementById("chat-box");

setTimeout(() => {
  input.focus();
}, 300);

btn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

function send() {
  if (!input.value.trim()) return;

  const div = document.createElement("div");
  div.className = "message user";
  div.textContent = input.value;
  chat.appendChild(div);

  input.value = "";
  input.focus();
}
