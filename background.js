chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html")
  });
});

const RATE_LIMIT_TOTAL = 125;
const RATE_LIMIT_BUFFER = 20;
const RATE_LIMIT_STOP_AT = RATE_LIMIT_TOTAL - RATE_LIMIT_BUFFER;

const ensureRateLimitPauseState = async () => {
  const now = Math.floor(Date.now() / 1000);
  const { rateLimitPaused, pauseUntil } = await chrome.storage.local.get([
    "rateLimitPaused",
    "pauseUntil"
  ]);

  if (rateLimitPaused && pauseUntil && now >= pauseUntil) {
    await chrome.storage.local.set({ rateLimitPaused: false, pauseUntil: null });
    return false;
  }

  return Boolean(rateLimitPaused);
};

const shouldPauseForRateLimit = (data) => {
  if (!data) {
    return false;
  }
  if (data.statusCode === 429) {
    return true;
  }
  if (data.remaining !== null && data.remaining <= RATE_LIMIT_BUFFER) {
    return true;
  }
  return false;
};

const parseRateLimitHeaders = (headers = []) => {
  const lookup = {};
  headers.forEach((header) => {
    if (!header?.name) {
      return;
    }
    lookup[header.name.toLowerCase()] = header.value;
  });

  const limit = lookup["x-ratelimit-limit"];
  const remaining = lookup["x-ratelimit-remaining"];
  const reset = lookup["x-ratelimit-reset"];

  const toNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  };

  return {
    limit: toNumber(limit),
    remaining: toNumber(remaining),
    reset: toNumber(reset)
  };
};

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const headerData = parseRateLimitHeaders(details.responseHeaders);
    if (
      headerData.limit === null &&
      headerData.remaining === null &&
      headerData.reset === null
    ) {
      return;
    }

    const data = {
      ...headerData,
      seenAt: Math.floor(Date.now() / 1000),
      statusCode: details.statusCode,
      url: details.url
    };

    chrome.storage.local.set({ rateLimit: data });

    if (shouldPauseForRateLimit(data)) {
      chrome.storage.local.set({
        rateLimitPaused: true,
        pauseUntil: data.reset ?? null
      });
    }

    chrome.runtime.sendMessage({ type: "rateLimitUpdate", data }).catch(() => {});
  },
  { urls: ["*://csfloat.com/api/v1/floatdb/search*"] },
  ["responseHeaders"]
);

const waitForCountInTab = async (tabId) => {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const waitForItemsFound = ({
        selector,
        intervalMs = 500,
        timeoutMs = 120000,
        stableChecks = 2
      } = {}) => {
        return new Promise((resolve, reject) => {
          const started = Date.now();
          let lastValue = null;
          let stableCount = 0;

          const timer = setInterval(() => {
            if (Date.now() - started > timeoutMs) {
              clearInterval(timer);
              reject(new Error("Timeout: count did not become readable"));
              return;
            }

            const el = document.querySelector(selector);
            if (!el) {
              return;
            }

            const text = (el.textContent || "").trim();
            const match = text.match(/([\d,.\s]+)\s+Items\s+Found/i);
            if (!match) {
              return;
            }

            const value = parseInt(match[1].replace(/[^\d]/g, ""), 10);
            if (!Number.isFinite(value)) {
              return;
            }

            if (value === lastValue) {
              stableCount += 1;
            } else {
              lastValue = value;
              stableCount = 1;
            }

            if (stableCount >= stableChecks) {
              clearInterval(timer);
              resolve(`${value.toLocaleString()} Items Found`);
            }
          }, intervalMs);
        });
      };

      return waitForItemsFound({
        selector: "div.count-container > div.count"
      }).catch(() => null);
    }
  });

  return result ?? null;
};

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.action !== "runCounts" || !Array.isArray(message.urls)) {
    return;
  }

  (async () => {
    const isPaused = await ensureRateLimitPauseState();
    if (isPaused) {
      console.log("Rate limit paused – waiting for reset");
      sendResponse({ results: [] });
      return;
    }

    const results = [];
    for (const url of message.urls) {
      const pausedDuringRun = await ensureRateLimitPauseState();
      if (pausedDuringRun) {
        console.log("Rate limit paused – waiting for reset");
        break;
      }

      const tab = await chrome.tabs.create({ url, active: false });
      await new Promise((resolve) => {
        const listener = (tabId, info) => {
          if (tabId === tab.id && info.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
      });

      const count = await waitForCountInTab(tab.id);
      results.push({ url, count });
      await chrome.tabs.remove(tab.id);
    }

    sendResponse({ results });
  })();

  return true;
});
