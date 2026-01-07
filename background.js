chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL("index.html")
  });
});

const waitForCountInTab = async (tabId) => {
  const [{ result }] = await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      return new Promise((resolve) => {
        const existing = document.querySelector(".count");
        if (existing) {
          const text = existing.textContent?.trim();
          if (text) {
            resolve(text);
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
          const text = element.textContent?.trim();
          if (text) {
            clearTimeout(timeout);
            observer.disconnect();
            resolve(text);
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
