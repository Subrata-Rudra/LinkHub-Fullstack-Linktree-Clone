const img = document.querySelector(".img");
img.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

const copyBtn = document.getElementById("copyBtn");

copyBtn.addEventListener("click", () => {
  const text = document.getElementById("copy");
  text.select();
  text.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(text.value);
  copyBtn.innerHTML = "Copied!";
  copyBtn.classList.add("makeGreen");
  setTimeout(() => {
    copyBtn.innerHTML = "COPY";
    copyBtn.classList.remove("makeGreen");
  }, 1000);
});

document.getElementById("closeBtn").addEventListener("click", () => {
  document.querySelector(".shareDiv").classList.add("invisible");
  document.querySelector(".container").classList.remove("invisible");
});

document.getElementById("shareBtn").addEventListener("click", () => {
  document.querySelector(".container").classList.add("invisible");
  document.querySelector(".shareDiv").classList.remove("invisible");
});

document
  .getElementById("subscribeDivCloseBtn")
  .addEventListener("click", () => {
    document.querySelector(".subscribeDiv").classList.add("invisible");
    document.querySelector(".container").classList.remove("invisible");
    window.location.reload();
  });

document.getElementById("subscribeBtn").addEventListener("click", () => {
  document.querySelector(".container").classList.add("invisible");
  document.querySelector(".subscribeDiv").classList.remove("invisible");
});
