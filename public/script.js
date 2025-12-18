const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = "message " + type;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // dočasná odpoveď LUMI (kým nenapojíme backend)
  setTimeout(() => {
    addMessage(
      "I hear you. You don’t have to rush — say it in your own time.",
      "lumi"
    );
  }, 600);
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
