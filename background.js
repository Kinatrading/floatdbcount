chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html")
  });
});

const waitForCountInTab = async (tabId) => {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const parseCount = (text) => {
        const match = text.match(/([0-9.,]+)\s*Items\s*Found/i);
        if (!match) {
          return null;
        }
        return Number(match[1].replace(/,/g, ""));
      };

      return new Promise((resolve) => {
        const existing = document.querySelector(".count");
        if (existing) {
          const parsed = parseCount(existing.textContent || "");
          if (parsed !== null) {
            resolve(parsed);
            return;
          }
        }

        let observer;

        const timeout = setTimeout(() => {
          if (observer) {
            observer.disconnect();
          }
          resolve(null);
        }, 20000);

        observer = new MutationObserver(() => {
          const element = document.querySelector(".count");
          if (!element) {
            return;
          }
          const parsed = parseCount(element.textContent || "");
          if (parsed !== null) {
            clearTimeout(timeout);
            observer.disconnect();
            resolve(parsed);
          }
        });

        observer.observe(document.body, { childList: true, subtree: true });
      });
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
