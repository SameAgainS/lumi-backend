const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let isSending = false;

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text || isSending) return;

  isSending = true;

  addMessage(text, "user");
  input.value = "";

  try {
    console.log("📤 sending:", text);

    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    console.log("📥 status:", res.status);

    const data = await res.json();
    console.log("📦 data:", data);

    if (data.reply) {
      addMessage(data.reply, "lumi");
    } else {
      addMessage("…I didn’t quite catch that.", "lumi");
    }
  } catch (err) {
    console.error(err);
    addMessage("Something went quiet on my end.", "lumi");
  }

  isSending = false;
}

sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});
