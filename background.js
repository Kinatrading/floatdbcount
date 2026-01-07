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
        const isValidCount = (text) =>
          text &&
          /Items\s*Found/i.test(text) &&
          !/NaN/i.test(text) &&
          /[0-9]/.test(text);

        const getCountText = () =>
          document.querySelector(".count")?.textContent?.trim() ?? null;

        let observer;
        let intervalId;

        const timeout = setTimeout(() => {
          if (observer) {
            observer.disconnect();
          }
          if (intervalId) {
            clearInterval(intervalId);
          }
          resolve(null);
        }, 120000);

        const checkAndResolve = () => {
          const text = getCountText();
          if (isValidCount(text)) {
            clearTimeout(timeout);
            if (observer) {
              observer.disconnect();
            }
            if (intervalId) {
              clearInterval(intervalId);
            }
            resolve(text);
          }
        };

        checkAndResolve();

        intervalId = setInterval(checkAndResolve, 1000);

        observer = new MutationObserver(checkAndResolve);
        // CSFloat often updates the "Items Found" text by changing an existing text node,
        // which does NOT trigger childList mutations. Watch characterData/attributes too.
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true
        });

        window.addEventListener("load", checkAndResolve, { once: true });
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
