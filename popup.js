const limitEl = document.getElementById("rate-limit");
const remainingEl = document.getElementById("rate-remaining");
const resetEl = document.getElementById("rate-reset");

let rateLimitData = null;

const formatValue = (value) => (value === null || value === undefined ? "n/a" : value);

const render = () => {
  if (!rateLimitData) {
    limitEl.textContent = "n/a";
    remainingEl.textContent = "n/a";
    resetEl.textContent = "n/a";
    return;
  }

  limitEl.textContent = formatValue(rateLimitData.limit);
  remainingEl.textContent = formatValue(rateLimitData.remaining);

  if (rateLimitData.reset) {
    const now = Math.floor(Date.now() / 1000);
    const secondsLeft = Math.max(rateLimitData.reset - now, 0);
    resetEl.textContent = `${secondsLeft}s`;
  } else {
    resetEl.textContent = "n/a";
  }
};

const loadRateLimit = async () => {
  const { rateLimit } = await chrome.storage.local.get("rateLimit");
  rateLimitData = rateLimit || null;
  render();
};

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "rateLimitUpdate") {
    rateLimitData = message.data;
    render();
  }
});

loadRateLimit();
setInterval(render, 1000);
