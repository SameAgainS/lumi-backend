const translations = {
  en: {
    slogan1: "Words need to be spoken",
    slogan2: "ONLY THEN THEY GAIN MEANING",
    placeholder: "Write a thought…",
    hello: "Hello. Speak freely. I am listening."
  },
  sk: {
    slogan1: "Slová musia byť vyslovené",
    slogan2: "AŽ POTOM MAJÚ VÝZNAM",
    placeholder: "Napíš myšlienku…",
    hello: "Ahoj. Hovor slobodne. Počúvam."
  },
  cz: {
    slogan1: "Slova musí být vyslovena",
    slogan2: "TEPRVE PAK MAJÍ VÝZNAM",
    placeholder: "Napiš myšlenku…",
    hello: "Ahoj. Mluv svobodně. Naslouchám."
  }
};

const input = document.getElementById("user-input");
const btn = document.getElementById("send-btn");
const chat = document.getElementById("chat-box");
const langSwitch = document.getElementById("lang-switch");

function setLanguage(lang) {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    el.textContent = translations[lang][key];
  });

  input.placeholder = translations[lang].placeholder;
}

langSwitch.addEventListener("change", e => {
  setLanguage(e.target.value);
});

setLanguage("en");

setTimeout(() => input.focus(), 200);

btn.onclick = send;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});

function send() {
  if (!input.value.trim()) return;

  const msg = document.createElement("div");
  msg.className = "message user";
  msg.textContent = input.value;
  chat.appendChild(msg);

  input.value = "";
  input.focus();
}
