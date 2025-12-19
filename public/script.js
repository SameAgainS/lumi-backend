const chat = document.getElementById("chat");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");

// persistent identity
let userName = localStorage.getItem("lumi_name");

// detect name
function detectName(text) {
  const match = text.match(/i[' ]?m ([a-z]+)/i);
  if (match) {
    userName = match[1];
    localStorage.setItem("lumi_name", userName);
  }
}

function add(text, sender) {
  const div = document.createElement("div");
  div.className = `msg ${sender}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

async function send() {
  const text = input.value.trim();
  if (!text) return;

  add(text, "user");
  input.value = "";

  detectName(text);

  const res = await fetch("/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: text,
      name: userName
    })
  });

  const data = await res.json();
  add(data.reply, "lumi");
}

sendBtn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});
