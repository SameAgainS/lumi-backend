const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

let isSending = false;

/* ===============================
   ADD MESSAGE
   =============================== */
function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* ===============================
   TYPING INDICATOR (…)
   =============================== */
function showTyping() {
  if (document.getElementById("lumi-typing")) return;

  const typing = document.createElement("div");
  typing.className = "message lumi typing";
  typing.id = "lumi-typing";
  typing.innerText = "…";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("lumi-typing");
  if (typing) typing.remove();
}

/* ===============================
   SEND MESSAGE
   =============================== */
async function sendMessage() {
  const text = input.value.trim();
  if (!text || isSending) return;

  isSending = true;
  addMessage(text, "user");
  input.value = "";

  try {
    // 👇 LUMI "thinking…"
    showTyping();

    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();

    // 👇 garantovaný čas, aby boli bodky VIDITEĽNÉ
    setTimeout(() => {
      removeTyping();
      addMessage(data.reply || "…", "lumi");
      isSending = false;
    }, 900);

  } catch (err) {
    removeTyping();
    addMessage("Something went quiet on my end.", "lumi");
    isSending = false;
  }
}

/* ===============================
   EVENTS
   =============================== */
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

/* ===============================
   FIRST MESSAGE (MODE B)
   =============================== */
window.addEventListener("load", async () => {
  try {
    const res = await fetch("/hello");
    const data = await res.json();
    if (data.reply) {
      addMessage(data.reply, "lumi");
    }
  } catch (e) {
    console.error("LUMI hello failed");
  }
});
