chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html")
  });
});

const activeRuns = new Map();

const RATE_LIMIT_DEFAULT = 125;
const GLOBAL_RATE_LIMIT_DEFAULT = 50000;

const getNextHourStart = (baseMs = Date.now()) => {
  const nextHour = new Date(baseMs);
  nextHour.setMinutes(0, 0, 0);
  if (nextHour.getTime() <= baseMs) {
    nextHour.setHours(nextHour.getHours() + 1);
  }
  return nextHour;
};

const parseResetTimeMs = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  if (numeric > 1e12) {
    return numeric;
  }
  return numeric * 1000;
};

const formatResetTime = (date) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const buildRateLimitPayload = (headers = [], defaultLimit) => {
  const remainingHeader = headers.find(
    (header) => header.name.toLowerCase() === "x-ratelimit-remaining"
  );
  if (!remainingHeader) {
    return null;
  }
  const limitHeader = headers.find(
    (header) => header.name.toLowerCase() === "x-ratelimit-limit"
  );
  const resetHeader = headers.find(
    (header) => header.name.toLowerCase() === "x-ratelimit-reset"
  );
  const remaining = Number(remainingHeader.value);
  const limit = Number(limitHeader?.value ?? defaultLimit);
  const resetTimeMs = parseResetTimeMs(resetHeader?.value);
  const resetDate = resetTimeMs ? new Date(resetTimeMs) : getNextHourStart();
  return {
    remaining: Number.isFinite(remaining) ? remaining : null,
    limit: Number.isFinite(limit) ? limit : defaultLimit,
    resetTime: formatResetTime(resetDate),
    resetTimeMs: resetDate.getTime()
  };
};

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const payload = buildRateLimitPayload(
      details.responseHeaders || [],
      RATE_LIMIT_DEFAULT
    );
    if (!payload) {
      return;
    }
    chrome.runtime.sendMessage({
      action: "rateLimitUpdate",
      payload
    });
  },
  { urls: ["https://csfloat.com/api/v1/floatdb/search*"] },
  ["responseHeaders"]
);

chrome.webRequest.onHeadersReceived.addListener(
  (details) => {
    const payload = buildRateLimitPayload(
      details.responseHeaders || [],
      GLOBAL_RATE_LIMIT_DEFAULT
    );
    if (!payload) {
      return;
    }
    chrome.runtime.sendMessage({
      action: "globalRateLimitUpdate",
      payload
    });
  },
  { urls: ["https://csfloat.com/api/v1/floatdb/count*"] },
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

            const emptyState = document.body?.textContent?.includes("Found No Items");
            if (emptyState) {
              clearInterval(timer);
              resolve("0 Items Found");
              return;
            }

            const el = document.querySelector(selector);
            if (!el) {
              return;
            }

            const text = (el.textContent || "").trim();
            const match = text.match(/([\d,.\s]+)\s+Items\s+Found/i);
            if (!match) {
              if (/found\s+no\s+items/i.test(text)) {
                clearInterval(timer);
                resolve("0 Items Found");
              }
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
    const runId = message.runId || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    if (!activeRuns.has(runId)) {
      activeRuns.set(runId, { cancelled: false, currentTabId: null });
    } else {
      activeRuns.get(runId).cancelled = false;
      activeRuns.get(runId).currentTabId = null;
    }
    const runState = activeRuns.get(runId);
    const results = [];
    let wasCancelled = false;
    for (const url of message.urls) {
      if (runState.cancelled) {
        wasCancelled = true;
        break;
      }
      const tab = await chrome.tabs.create({ url, active: false });
      runState.currentTabId = tab.id;
      if (runState.cancelled) {
        wasCancelled = true;
        try {
          await chrome.tabs.remove(tab.id);
        } catch (error) {
          // ignore
        }
        break;
      }
      await new Promise((resolve) => {
        const listener = (tabId, info) => {
          if (tabId === tab.id && info.status === "complete") {
            cleanup();
            resolve();
          }
        };
        const removalListener = (tabId) => {
          if (tabId === tab.id) {
            cleanup();
            resolve();
          }
        };
        const cleanup = () => {
          chrome.tabs.onUpdated.removeListener(listener);
          chrome.tabs.onRemoved.removeListener(removalListener);
        };
        chrome.tabs.onUpdated.addListener(listener);
        chrome.tabs.onRemoved.addListener(removalListener);
      });

      let count = null;
      try {
        if (runState.cancelled) {
          wasCancelled = true;
        } else {
          count = await waitForCountInTab(tab.id);
        }
      } catch (error) {
        count = null;
      }
      results.push({ url, count });
      try {
        await chrome.tabs.remove(tab.id);
      } catch (error) {
        // ignore
      }
      runState.currentTabId = null;
      if (runState.cancelled) {
        wasCancelled = true;
        break;
      }
    }

    activeRuns.delete(runId);
    sendResponse(wasCancelled ? { cancelled: true, results: null } : { results });
  })();

  return true;
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.action !== "stopCounts" || !message.runId) {
    return;
  }

  if (!activeRuns.has(message.runId)) {
    sendResponse({ ok: false });
    return;
  }

  const runState = activeRuns.get(message.runId);
  runState.cancelled = true;
  if (runState.currentTabId != null) {
    chrome.tabs.remove(runState.currentTabId).catch(() => {});
  }
  sendResponse({ ok: true });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.action !== "fetchSteamImage") {
    return;
  }

  const url = message.url;
  if (
    typeof url !== "string" ||
    !url.startsWith("https://community.akamai.steamstatic.com/economy/image/")
  ) {
    sendResponse({ ok: false, error: "invalid-url" });
    return;
  }

  (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Steam image fetch failed: ${response.status}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      sendResponse({
        ok: true,
        arrayBuffer,
        contentType: response.headers.get("content-type")
      });
    } catch (error) {
      sendResponse({ ok: false, error: error?.message || "fetch-error" });
    }
  })();

  return true;
});
