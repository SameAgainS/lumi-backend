const input = document.getElementById("user-input");
const btn = document.getElementById("send-btn");
const chat = document.getElementById("chat-box");

/* FORCE FOCUS PRI NAČÍTANÍ */
setTimeout(() => {
  input.focus();
  console.log("focused:", document.activeElement === input);
}, 300);

btn.onclick = send;

input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

function send() {
  if (!input.value.trim()) return;

  const div = document.createElement("div");
  div.textContent = input.value;
  chat.appendChild(div);

  input.value = "";
  input.focus();
}
