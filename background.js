chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html")
  });
});

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
    const results = [];
    for (const url of message.urls) {
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
