import html2canvas from "./html2canvas.esm.js";

const categoryCheckboxes = Array.from(
  document.querySelectorAll('input[name="category"]')
);
const minRange = document.getElementById("min-range");
const maxRange = document.getElementById("max-range");
const minInput = document.getElementById("min-input");
const maxInput = document.getElementById("max-input");
const minDisplay = document.getElementById("min-display");
const maxDisplay = document.getElementById("max-display");
const stickerSearchInput = document.getElementById("sticker-search");
const stickerSuggestions = document.getElementById("sticker-suggestions");
const collectionSearchInput = document.getElementById("collection-search");
const collectionSuggestions = document.getElementById("collection-suggestions");
const keychainSearchInput = document.getElementById("keychain-search");
const keychainSuggestions = document.getElementById("keychain-suggestions");
const keychainCollectionSearchInput = document.getElementById("keychain-collection-search");
const keychainCollectionSuggestions = document.getElementById(
  "keychain-collection-suggestions"
);
const rarityCheckboxes = Array.from(
  document.querySelectorAll('input[name="rarity"]')
);
const selectedStickersList = document.getElementById("selected-stickers");
const clearStickersButton = document.getElementById("clear-stickers");
const selectedKeychainsList = document.getElementById("selected-keychains");
const clearKeychainsButton = document.getElementById("clear-keychains");
const runBtn = document.getElementById("run-btn");
const stopBtn = document.getElementById("stop-btn");
const generatedLink = document.getElementById("generated-link");
const resultsList = document.getElementById("results-list");
const summaryList = document.getElementById("summary-list");
const progressBar = document.getElementById("progress-bar");
const progressMeta = document.getElementById("progress-meta");
const rateLimitDisplay = document.getElementById("rate-limit");
const globalRateLimitDisplay = document.getElementById("rate-limit-global");
const downloadCsvButton = document.getElementById("download-csv");
const downloadImagesButton = document.getElementById("download-images");
const downloadCollageButton = document.getElementById("download-collage");
const languageSelect = document.getElementById("language-select");
const themeToggle = document.getElementById("theme-toggle");

const translations = {
  uk: {
    title: "CSFloat DB Sticker Linker created by Kina",
    subtitle: "Згенеруйте посилання для пошуку скінів по наліпках та float.",
    language: "Мова",
    themeLabel: "Тема",
    themeToggleDark: "Темна тема",
    themeToggleLight: "Світла тема",
    categoryTitle: "Категорія предметів",
    categoryAll: "Усі",
    categoryAria: "Категорія",
    floatTitle: "Діапазон float",
    minFloatAria: "Мінімальний float",
    maxFloatAria: "Максимальний float",
    minLabel: "Мінімум",
    maxLabel: "Максимум",
    stickersTitle: "Наліпки",
    keychainsTitle: "Брелки",
    gradeLabel: "Грейд:",
    gradeAria: "Грейд наліпок",
    gradeAll: "Усі",
    stickerSearch: "Пошук наліпки",
    stickerSearchPlaceholder: "Sticker | Fearsome",
    collectionSearch: "Пошук колекції",
    collectionSearchPlaceholder: "Sticker Capsule",
    keychainSearch: "Пошук брелка",
    keychainSearchPlaceholder: "Charm | Lil' Ava",
    keychainCollectionSearch: "Пошук колекції",
    keychainCollectionSearchPlaceholder: "Missing Link Charm Collection",
    selectedStickers: "Обрані наліпки:",
    selectedKeychains: "Обрані брелки:",
    clearAll: "Видалити всі",
    run: "Run",
    stop: "Stop",
    progressLabel: "Прогрес обробки:",
    generatedLink: "Згенероване посилання:",
    resultsLabel: "Посилання та кількість:",
    summaryLabel: "Збережений підсумок:",
    downloadCsv: "Завантажити CSV",
    downloadImages: "Завантажити всі картинки",
    downloadCollage: "Завантажити однією картинкою",
    exportImage: "Експорт картинки",
    exportTitle: "CS2 STICKER HIGHLIGHT",
    exportTotalLabel: "ЗАГАЛЬНО ПОКЛЕЄНО",
    resultsTitle: "Результати",
    waiting: "Очікування...",
    notFound: "Не знайдено",
    totalStickersLabel: "Загальна кількість поклеєних стікерів:",
    averageStickersLabel: "Середня кількість:",
    totalKeychainsLabel: "Загальна кількість закріплених брелків:",
    summaryEmpty: "Підсумок буде доступний після запуску.",
    selectedEmpty: "Нічого не обрано.",
    remove: "Видалити",
    alertSelect: "Оберіть хоча б одну наліпку або брелок.",
    summaryCountsLabel: "1х: {c1}, 2х: {c2}, 3х: {c3}, 4х: {c4}, 5х: {c5}",
    summaryKeychainCountsLabel: "1х: {c1}",
    summaryTotalLabel: "Сумарна кількість поклеєних: {total}",
    summaryDateLabel: "Дата: {date}",
    progressMeta: "{current} / {total}",
    rateLimitLabel: "Лишилось запитів:",
    globalRateLimitLabel: "Глобальний ліміт:",
    downloadCsvName: "sticker-summary.csv",
    downloadCollageName: "sticker-summary-collage",
    csvStickerHeader: "Предмет",
    csvAverageHeader: "Середня кількість на скін",
    csvGradeMultiplierHeader: "Множник грейду",
    csvCollectionCountHeader: "Кількість у колекції",
    csvEstimateHeader: "Оцінка відкриттів",
    capsuleEstimateLabel: "Приблизна кількість відкритих капсул: {value}",
    keychainEstimateLabel: "Приблизна кількість відкритих брелоків: {value}"
  },
  en: {
    title: "CSFloat DB Sticker Linker created by Kina",
    subtitle: "Generate links to search skins by stickers and float range.",
    language: "Language",
    themeLabel: "Theme",
    themeToggleDark: "Dark theme",
    themeToggleLight: "Light theme",
    categoryTitle: "Item category",
    categoryAll: "All",
    categoryAria: "Category",
    floatTitle: "Float range",
    minFloatAria: "Minimum float",
    maxFloatAria: "Maximum float",
    minLabel: "Minimum",
    maxLabel: "Maximum",
    stickersTitle: "Stickers",
    keychainsTitle: "Keychains",
    gradeLabel: "Grade:",
    gradeAria: "Sticker grade",
    gradeAll: "All",
    stickerSearch: "Sticker search",
    stickerSearchPlaceholder: "Sticker | Fearsome",
    collectionSearch: "Collection search",
    collectionSearchPlaceholder: "Sticker Capsule",
    keychainSearch: "Keychain search",
    keychainSearchPlaceholder: "Charm | Lil' Ava",
    keychainCollectionSearch: "Collection search",
    keychainCollectionSearchPlaceholder: "Missing Link Charm Collection",
    selectedStickers: "Selected stickers:",
    selectedKeychains: "Selected keychains:",
    clearAll: "Clear all",
    run: "Run",
    stop: "Stop",
    progressLabel: "Processing progress:",
    generatedLink: "Generated link:",
    resultsLabel: "Links and count:",
    summaryLabel: "Saved summary:",
    downloadCsv: "Download CSV",
    downloadImages: "Download all images",
    downloadCollage: "Download as single image",
    exportImage: "Export image",
    exportTitle: "CS2 STICKER HIGHLIGHT",
    exportTotalLabel: "TOTAL POOLS",
    resultsTitle: "Results",
    waiting: "Waiting...",
    notFound: "Not found",
    totalStickersLabel: "Total applied stickers:",
    averageStickersLabel: "Average:",
    totalKeychainsLabel: "Total attached keychains:",
    summaryEmpty: "Summary will be available after running.",
    selectedEmpty: "No items selected.",
    remove: "Remove",
    alertSelect: "Select at least one sticker or keychain.",
    summaryCountsLabel: "1x: {c1}, 2x: {c2}, 3x: {c3}, 4x: {c4}, 5x: {c5}",
    summaryKeychainCountsLabel: "1x: {c1}",
    summaryTotalLabel: "Total applied: {total}",
    summaryDateLabel: "Date: {date}",
    progressMeta: "{current} / {total}",
    rateLimitLabel: "Requests left:",
    globalRateLimitLabel: "Global limit:",
    downloadCsvName: "sticker-summary.csv",
    downloadCollageName: "sticker-summary-collage",
    csvStickerHeader: "Item",
    csvAverageHeader: "Average per skin",
    csvGradeMultiplierHeader: "Grade multiplier",
    csvCollectionCountHeader: "Collection count",
    csvEstimateHeader: "Openings estimate",
    capsuleEstimateLabel: "Approx opened capsules: {value}",
    keychainEstimateLabel: "Approx opened keychains: {value}"
  }
};

let currentLanguage = "uk";
let currentTheme = "light";
let summaryItems = [];
let progressTotal = 0;
let isPaused = false;
let isDownloadingAllImages = false;
let isDownloadingCollage = false;
let resumeTimerId = null;
let pausePromise = null;
let pausePromiseResolve = null;
let lastRateLimitPayload = null;
let lastGlobalRateLimitPayload = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatFloat = (value) => Number(value).toFixed(6);

const t = (key) => translations[currentLanguage]?.[key] ?? key;

const formatLocaleNumber = (value) =>
  Number(value).toLocaleString(currentLanguage === "uk" ? "uk-UA" : "en-US");

const formatStickerCountLabel = (count) =>
  currentLanguage === "uk" ? `${count} наліпки` : `${count} stickers`;

const formatKeychainCountLabel = () =>
  currentLanguage === "uk" ? "1 брелок" : "1 keychain";

const formatAverageStickerLabel = (value) => {
  const formatted = Number(value).toLocaleString(
    currentLanguage === "uk" ? "uk-UA" : "en-US",
    {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }
  );
  return currentLanguage === "uk"
    ? `${formatted} стікера на скін`
    : `${formatted} stickers per skin`;
};

const formatAverageStickerValue = (value) =>
  Number(value).toLocaleString(currentLanguage === "uk" ? "uk-UA" : "en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  });

const formatLocaleDate = (value) =>
  new Date(value).toLocaleString(currentLanguage === "uk" ? "uk-UA" : "en-US");

const updateThemeToggleLabel = () => {
  if (!themeToggle) {
    return;
  }
  const nextTheme = currentTheme === "dark" ? "light" : "dark";
  themeToggle.textContent = t(
    nextTheme === "dark" ? "themeToggleDark" : "themeToggleLight"
  );
  themeToggle.setAttribute("aria-pressed", String(currentTheme === "dark"));
};

const applyTranslations = () => {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (key && t(key)) {
      element.textContent = t(key);
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (key && t(key)) {
      element.setAttribute("placeholder", t(key));
    }
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    const key = element.dataset.i18nAria;
    if (key && t(key)) {
      element.setAttribute("aria-label", t(key));
    }
  });

  if (languageSelect) {
    languageSelect.value = currentLanguage;
  }

  updateProgress(0, progressTotal);
  renderSelectedStickers([...selectedStickerMap.values()]);
  renderSelectedKeychains([...selectedKeychainMap.values()]);
  renderSummary(summaryItems);
  if (lastRateLimitPayload) {
    updateRateLimitDisplay(lastRateLimitPayload);
  }
  if (lastGlobalRateLimitPayload) {
    updateGlobalRateLimitDisplay(lastGlobalRateLimitPayload);
  }
  updateThemeToggleLabel();
};

const getPreferredTheme = () =>
  window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const setTheme = (value) => {
  currentTheme = value;
  document.documentElement.dataset.theme = value;
  localStorage.setItem("csfloat-theme", value);
  updateThemeToggleLabel();
};

const updateProgress = (current, total) => {
  const safeTotal = Math.max(total, 0);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const percent = safeTotal === 0 ? 0 : (safeCurrent / safeTotal) * 100;
  progressBar.style.width = `${percent}%`;
  progressBar.setAttribute("aria-valuenow", Math.round(percent));
  progressMeta.textContent = t("progressMeta")
    .replace("{current}", safeCurrent)
    .replace("{total}", safeTotal);
};

const updateRateLimitDisplay = ({ remaining, limit, resetTime } = {}) => {
  if (!rateLimitDisplay) {
    return;
  }
  lastRateLimitPayload = { remaining, limit, resetTime };
  if (remaining == null || limit == null || !resetTime) {
    rateLimitDisplay.textContent = "—";
    return;
  }
  rateLimitDisplay.textContent = `${t("rateLimitLabel")} ${remaining}/${limit}/ ${resetTime}`;
};

const updateGlobalRateLimitDisplay = ({ remaining, limit, resetTime } = {}) => {
  if (!globalRateLimitDisplay) {
    return;
  }
  lastGlobalRateLimitPayload = { remaining, limit, resetTime };
  if (remaining == null || limit == null || !resetTime) {
    globalRateLimitDisplay.textContent = "—";
    return;
  }
  globalRateLimitDisplay.textContent = `${t("globalRateLimitLabel")} ${remaining}/${limit}/ ${resetTime}`;
};

const clearResumeTimer = () => {
  if (resumeTimerId) {
    clearTimeout(resumeTimerId);
    resumeTimerId = null;
  }
};

const setPauseState = ({ paused, resumeAtMs } = {}) => {
  if (paused) {
    isPaused = true;
    if (!pausePromiseResolve) {
      pausePromise = new Promise((resolve) => {
        pausePromiseResolve = resolve;
      });
    }
    if (resumeAtMs) {
      clearResumeTimer();
      const delay = Math.max(resumeAtMs - Date.now(), 0);
      resumeTimerId = setTimeout(() => {
        setPauseState({ paused: false });
      }, delay);
    }
    return;
  }
  isPaused = false;
  clearResumeTimer();
  if (pausePromiseResolve) {
    pausePromiseResolve();
    pausePromiseResolve = null;
    pausePromise = null;
  }
};

const waitForResumeIfPaused = async () => {
  if (!isPaused || !pausePromise) {
    return;
  }
  await pausePromise;
};

const initCardToggles = () => {
  document.querySelectorAll(".card").forEach((card) => {
    const heading = card.querySelector("h2");
    const content = card.querySelector(".card-content");
    if (!heading || !content) {
      return;
    }
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "card-toggle";
    toggle.setAttribute("aria-expanded", "false");
    toggle.textContent = "▸";
    heading.appendChild(toggle);
    card.classList.add("is-collapsed");
    toggle.addEventListener("click", () => {
      const isCollapsed = card.classList.toggle("is-collapsed");
      toggle.textContent = isCollapsed ? "▸" : "▾";
      toggle.setAttribute("aria-expanded", String(!isCollapsed));
    });
  });
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

const buildCsv = (items) => {
  const headers = [
    t("csvStickerHeader"),
    "1x",
    "2x",
    "3x",
    "4x",
    "5x",
    t("summaryTotalLabel").replace("{total}", "").trim(),
    t("csvAverageHeader"),
    t("csvGradeMultiplierHeader"),
    t("csvCollectionCountHeader"),
    t("csvEstimateHeader"),
    t("summaryDateLabel").replace("{date}", "").trim()
  ];
  const rows = items.map((item) => [
    item.name,
    item.pureCounts[0],
    item.pureCounts[1],
    item.pureCounts[2],
    item.pureCounts[3],
    item.pureCounts[4],
    item.total,
    item.average == null ? "" : formatAverageStickerValue(item.average),
    item.gradeMultiplier == null ? "" : formatLocaleNumber(item.gradeMultiplier),
    item.collectionCount == null ? "" : formatLocaleNumber(item.collectionCount),
    item.capsuleEstimate == null ? "" : formatLocaleNumber(item.capsuleEstimate),
    formatLocaleDate(item.date)
  ]);
  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
};

const sanitizeFileName = (value) =>
  String(value).replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

const waitForImage = (image) =>
  new Promise((resolve) => {
    if (!image) {
      resolve();
      return;
    }
    if (image.complete) {
      resolve();
      return;
    }
    image.onload = () => resolve();
    image.onerror = () => resolve();
  });

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isSteamImageUrl = (url) =>
  typeof url === "string" &&
  url.startsWith("https://community.akamai.steamstatic.com/economy/image/");

const fetchSteamImageBlob = (url) =>
  new Promise((resolve) => {
    if (!url || typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
      resolve(null);
      return;
    }

    chrome.runtime.sendMessage({ action: "fetchSteamImage", url }, (response) => {
      if (chrome.runtime.lastError || !response?.ok || !response.arrayBuffer) {
        resolve(null);
        return;
      }

      resolve(
        new Blob([response.arrayBuffer], {
          type: response.contentType || "image/png"
        })
      );
    });
  });

const fetchImageAsBlobUrl = async (url) => {
  if (!url) {
    return null;
  }
  try {
    const response = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!response.ok) {
      return null;
    }
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    return null;
  }
};

const exportSummaryImage = async (summary, element) => {
  if (typeof html2canvas === "undefined") {
    return;
  }
  if (!element) {
    return;
  }
  const image = element.querySelector("img.summary-image");
  let blobUrl = null;
  if (image?.src) {
    blobUrl = await fetchImageAsBlobUrl(image.src);
    if (!blobUrl && isSteamImageUrl(image.src)) {
      const blob = await fetchSteamImageBlob(image.src);
      if (blob) {
        blobUrl = URL.createObjectURL(blob);
      }
    }
    if (blobUrl) {
      image.src = blobUrl;
    }
  }
  element.classList.add("is-exporting");
  await waitForImage(image);
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  const backgroundColor = getComputedStyle(element).backgroundColor || "#ffffff";
  try {
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
      backgroundColor
    });

    const link = document.createElement("a");
    const fileBase = summary.title || summary.name || "sticker-summary";
    link.download = `${sanitizeFileName(fileBase)}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl);
      if (summary.image) {
        image.src = summary.image;
      }
    }
    element.classList.remove("is-exporting");
  }
};

const exportAllSummaryImages = async () => {
  if (summaryItems.length === 0 || isDownloadingAllImages) {
    return;
  }
  isDownloadingAllImages = true;
  if (downloadImagesButton) {
    downloadImagesButton.disabled = true;
  }
  const elements = Array.from(summaryList.querySelectorAll(".summary-item"));
  for (let index = 0; index < summaryItems.length; index += 1) {
    const element = elements[index];
    if (!element) {
      continue;
    }
    await exportSummaryImage(summaryItems[index], element);
    await delay(150);
  }
  isDownloadingAllImages = false;
  if (downloadImagesButton) {
    downloadImagesButton.disabled = summaryItems.length === 0;
  }
};

const buildSummaryCollageContainer = async () => {
  const elements = Array.from(summaryList.querySelectorAll(".summary-item"));
  if (elements.length === 0) {
    return null;
  }
  const collageRoot = document.createElement("div");
  collageRoot.className = "summary-collage-root";
  const collage = document.createElement("div");
  collage.className = "summary-collage";
  collageRoot.appendChild(collage);
  document.body.appendChild(collageRoot);

  const blobUrls = [];
  for (const element of elements) {
    const clone = element.cloneNode(true);
    clone.classList.add("is-collage");
    const exportButton = clone.querySelector(".summary-export");
    if (exportButton) {
      exportButton.remove();
    }
    collage.appendChild(clone);

    const image = clone.querySelector("img.summary-image");
    if (image?.src) {
      let blobUrl = await fetchImageAsBlobUrl(image.src);
      if (!blobUrl && isSteamImageUrl(image.src)) {
        const blob = await fetchSteamImageBlob(image.src);
        if (blob) {
          blobUrl = URL.createObjectURL(blob);
        }
      }
      if (blobUrl) {
        image.src = blobUrl;
        blobUrls.push(blobUrl);
      }
    }
    await waitForImage(image);
  }
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }
  return { collageRoot, collage, blobUrls };
};

const exportSummaryCollage = async () => {
  if (summaryItems.length === 0 || isDownloadingCollage) {
    return;
  }
  isDownloadingCollage = true;
  if (downloadCollageButton) {
    downloadCollageButton.disabled = true;
  }

  const prepared = await buildSummaryCollageContainer();
  if (!prepared) {
    isDownloadingCollage = false;
    if (downloadCollageButton) {
      downloadCollageButton.disabled = summaryItems.length === 0;
    }
    return;
  }
  const { collageRoot, collage, blobUrls } = prepared;
  const backgroundColor = getComputedStyle(collage).backgroundColor || "#ffffff";
  try {
    const canvas = await html2canvas(collage, {
      useCORS: true,
      scale: 2,
      backgroundColor
    });
    const link = document.createElement("a");
    link.download = `${sanitizeFileName(t("downloadCollageName"))}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    blobUrls.forEach((url) => URL.revokeObjectURL(url));
    collageRoot.remove();
    isDownloadingCollage = false;
    if (downloadCollageButton) {
      downloadCollageButton.disabled = summaryItems.length === 0;
    }
  }
};

const syncDisplays = (minValue, maxValue) => {
  minDisplay.textContent = formatFloat(minValue);
  maxDisplay.textContent = formatFloat(maxValue);
};

const syncInputs = (minValue, maxValue) => {
  minRange.value = minValue;
  maxRange.value = maxValue;
  minInput.value = formatFloat(minValue);
  maxInput.value = formatFloat(maxValue);
  syncDisplays(minValue, maxValue);
};

const ensureValidRange = ({ minValue, maxValue, source }) => {
  let min = clamp(minValue, 0, 1);
  let max = clamp(maxValue, 0, 1);

  if (min > max) {
    if (source === "min") {
      max = min;
    } else {
      min = max;
    }
  }

  syncInputs(min, max);
};

const handleRangeChange = (event) => {
  const source = event.target.id === "min-range" ? "min" : "max";
  const minValue = parseFloat(minRange.value);
  const maxValue = parseFloat(maxRange.value);
  ensureValidRange({ minValue, maxValue, source });
};

const handleNumberChange = (event) => {
  const source = event.target.id === "min-input" ? "min" : "max";
  const minValue = parseFloat(minInput.value || 0);
  const maxValue = parseFloat(maxInput.value || 0);
  ensureValidRange({ minValue, maxValue, source });
};

const updateCategorySelection = (changed) => {
  if (!changed.checked) {
    const anyChecked = categoryCheckboxes.some((checkbox) => checkbox.checked);
    if (!anyChecked) {
      categoryCheckboxes[0].checked = true;
    }
    return;
  }

  if (changed.value === "all") {
    categoryCheckboxes.forEach((checkbox) => {
      checkbox.checked = checkbox.value === "all";
    });
    return;
  }

  categoryCheckboxes.forEach((checkbox) => {
    checkbox.checked = checkbox === changed;
  });
};

categoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    updateCategorySelection(event.target);
  });
});

rarityCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    if (event.target.value === "all" && event.target.checked) {
      rarityCheckboxes.forEach((checkboxItem) => {
        checkboxItem.checked = checkboxItem.value === "all";
      });
    } else {
      rarityCheckboxes.find((checkboxItem) => checkboxItem.value === "all").checked = false;
    }

    const anySelected = rarityCheckboxes.some((checkboxItem) => checkboxItem.checked);
    if (!anySelected) {
      rarityCheckboxes.find((checkboxItem) => checkboxItem.value === "all").checked = true;
    }

    updateStickerSuggestions();
    updateCollectionSuggestions();
  });
});

minRange.addEventListener("input", handleRangeChange);
maxRange.addEventListener("input", handleRangeChange);
minInput.addEventListener("change", handleNumberChange);
maxInput.addEventListener("change", handleNumberChange);

const buildStickerPayload = (stickerId, count) => {
  const items = Array.from({ length: count }, () => ({ i: String(stickerId) }));
  return JSON.stringify(items);
};

const buildStickerUrl = (stickerId, count) => {
  const minValue = parseFloat(minRange.value);
  const maxValue = parseFloat(maxRange.value);
  const url = new URL("https://csfloat.com/db");
  const categoryValue = categoryCheckboxes.find((checkbox) => checkbox.checked)
    ?.value;

  if (categoryValue && categoryValue !== "all") {
    url.searchParams.set("category", categoryValue);
  }

  url.searchParams.set("min", formatFloat(minValue));
  url.searchParams.set("max", formatFloat(maxValue));
  url.searchParams.set("stickers", buildStickerPayload(stickerId, count));

  return url.toString();
};

const buildKeychainPayload = (keychainId) =>
  JSON.stringify([{ i: String(keychainId) }]);

const buildKeychainUrl = (keychainId) => {
  const minValue = parseFloat(minRange.value);
  const maxValue = parseFloat(maxRange.value);
  const url = new URL("https://csfloat.com/db");
  const categoryValue = categoryCheckboxes.find((checkbox) => checkbox.checked)
    ?.value;

  if (categoryValue && categoryValue !== "all") {
    url.searchParams.set("category", categoryValue);
  }

  url.searchParams.set("min", formatFloat(minValue));
  url.searchParams.set("max", formatFloat(maxValue));
  url.searchParams.set("keychains", buildKeychainPayload(keychainId));

  return url.toString();
};

const parseItemsFoundCount = (text) => {
  if (!text) {
    return null;
  }
  if (/found\s+no\s+items/i.test(text)) {
    return 0;
  }
  const match = text.match(/([\d,.\s]+)\s+Items\s+Found/i);
  if (!match) {
    return null;
  }
  const value = parseInt(match[1].replace(/[^\d]/g, ""), 10);
  return Number.isFinite(value) ? value : null;
};

const computeTotalStickers = (items) => {
  const counts = items.map((item) => parseItemsFoundCount(item.found));
  if (counts.some((count) => count === null)) {
    return null;
  }

  const pureCounts = [
    counts[0] - counts[1],
    counts[1] - counts[2],
    counts[2] - counts[3],
    counts[3] - counts[4],
    counts[4]
  ];

  return pureCounts.reduce((sum, value, index) => sum + value * (index + 1), 0);
};

const computeAverageStickersPerSkin = (items) => {
  const pureCounts = computePureCounts(items);
  if (!pureCounts) {
    return null;
  }
  const totalSkins = pureCounts.reduce((sum, value) => sum + value, 0);
  if (totalSkins === 0) {
    return 0;
  }
  const totalStickers = pureCounts.reduce(
    (sum, value, index) => sum + value * (index + 1),
    0
  );
  return totalStickers / totalSkins;
};

const computePureCounts = (items) => {
  const counts = items.map((item) => parseItemsFoundCount(item.found));
  if (counts.some((count) => count === null)) {
    return null;
  }
  return [
    counts[0] - counts[1],
    counts[1] - counts[2],
    counts[2] - counts[3],
    counts[3] - counts[4],
    counts[4]
  ];
};

const computeStickerTotals = (items) => {
  const pureCounts = computePureCounts(items);
  if (!pureCounts) {
    return null;
  }
  const total = pureCounts.reduce((sum, value, index) => sum + value * (index + 1), 0);
  return { pureCounts, total };
};

const computeKeychainTotals = (item) => {
  const count = parseItemsFoundCount(item.found);
  if (count === null) {
    return null;
  }
  return {
    pureCounts: [count, 0, 0, 0, 0],
    total: count
  };
};

const renderStickerResults = (sticker, items) => {
  const existing = resultsList.querySelector(
    `[data-sticker-id="${sticker.def_index}"]`
  );
  if (existing) {
    existing.remove();
  }

  const block = document.createElement("div");
  block.className = "sticker-block";
  block.dataset.stickerId = sticker.def_index;

  const title = document.createElement("h3");
  title.textContent = `${sticker.name} (${sticker.def_index})`;
  block.appendChild(title);

  items.forEach((item) => {
    const listItem = document.createElement("div");
    listItem.className = "result-item";

    const meta = document.createElement("div");
    meta.className = "result-meta";
    const countLabel = document.createElement("span");
    countLabel.textContent = formatStickerCountLabel(item.count);
    const valueLabel = document.createElement("span");
    if (item.loading) {
      valueLabel.textContent = t("waiting");
    } else if (item.found === null) {
      valueLabel.textContent = t("notFound");
    } else {
      valueLabel.textContent = item.found;
    }
    meta.append(countLabel, valueLabel);

    const link = document.createElement("a");
    link.href = item.url;
    link.textContent = item.url;
    link.target = "_blank";
    link.rel = "noreferrer";

    listItem.append(meta, link);
    block.appendChild(listItem);
  });

  const total = computeTotalStickers(items);
  const totalLabel = document.createElement("div");
  totalLabel.className = "sticker-total";
  totalLabel.textContent =
    total === null
      ? `${t("totalStickersLabel")} —`
      : `${t("totalStickersLabel")} ${formatLocaleNumber(total)}`;
  block.appendChild(totalLabel);

  const average = computeAverageStickersPerSkin(items);
  const averageLabel = document.createElement("div");
  averageLabel.className = "sticker-average";
  averageLabel.textContent =
    average === null
      ? `${t("averageStickersLabel")} —`
      : `${t("averageStickersLabel")} ${formatAverageStickerLabel(average)}`;
  block.appendChild(averageLabel);

  resultsList.appendChild(block);
};

const renderKeychainResults = (keychain, item) => {
  const existing = resultsList.querySelector(
    `[data-keychain-id="${keychain.def_index}"]`
  );
  if (existing) {
    existing.remove();
  }

  const block = document.createElement("div");
  block.className = "sticker-block";
  block.dataset.keychainId = keychain.def_index;

  const title = document.createElement("h3");
  title.textContent = `${keychain.name} (${keychain.def_index})`;
  block.appendChild(title);

  const listItem = document.createElement("div");
  listItem.className = "result-item";

  const meta = document.createElement("div");
  meta.className = "result-meta";
  const countLabel = document.createElement("span");
  countLabel.textContent = formatKeychainCountLabel();
  const valueLabel = document.createElement("span");
  if (item.loading) {
    valueLabel.textContent = t("waiting");
  } else if (item.found === null) {
    valueLabel.textContent = t("notFound");
  } else {
    valueLabel.textContent = item.found;
  }
  meta.append(countLabel, valueLabel);

  const link = document.createElement("a");
  link.href = item.url;
  link.textContent = item.url;
  link.target = "_blank";
  link.rel = "noreferrer";

  listItem.append(meta, link);
  block.appendChild(listItem);

  const total = parseItemsFoundCount(item.found);
  const totalLabel = document.createElement("div");
  totalLabel.className = "sticker-total";
  totalLabel.textContent =
    total === null
      ? `${t("totalKeychainsLabel")} —`
      : `${t("totalKeychainsLabel")} ${formatLocaleNumber(total)}`;
  block.appendChild(totalLabel);

  resultsList.appendChild(block);
};

const renderSummary = (summaryItems) => {
  summaryList.innerHTML = "";
  downloadCsvButton.disabled = summaryItems.length === 0;
  if (downloadImagesButton) {
    downloadImagesButton.disabled = summaryItems.length === 0 || isDownloadingAllImages;
  }
  if (downloadCollageButton) {
    downloadCollageButton.disabled =
      summaryItems.length === 0 || isDownloadingCollage;
  }
  if (summaryItems.length === 0) {
    const empty = document.createElement("div");
    empty.className = "summary-item";
    empty.textContent = t("summaryEmpty");
    summaryList.appendChild(empty);
    return;
  }

  summaryItems.forEach((summary) => {
    const item = document.createElement("div");
    item.className = "summary-item";

    const content = document.createElement("div");
    content.className = "summary-content";

    const title = document.createElement("strong");
    title.textContent = summary.name;

    const counts = document.createElement("div");
    const countsTemplate =
      summary.type === "keychain"
        ? t("summaryKeychainCountsLabel")
        : t("summaryCountsLabel");
    counts.textContent = countsTemplate
      .replace("{c1}", formatLocaleNumber(summary.pureCounts[0]))
      .replace("{c2}", formatLocaleNumber(summary.pureCounts[1]))
      .replace("{c3}", formatLocaleNumber(summary.pureCounts[2]))
      .replace("{c4}", formatLocaleNumber(summary.pureCounts[3]))
      .replace("{c5}", formatLocaleNumber(summary.pureCounts[4]));

    const total = document.createElement("div");
    total.textContent = t("summaryTotalLabel").replace(
      "{total}",
      formatLocaleNumber(summary.total)
    );

    const average = document.createElement("div");
    if (summary.type === "sticker") {
      average.textContent =
        summary.average == null
          ? `${t("averageStickersLabel")} —`
          : `${t("averageStickersLabel")} ${formatAverageStickerLabel(
              summary.average
            )}`;
    }

    const capsuleEstimate = document.createElement("div");
    const estimateValue =
      summary.capsuleEstimate == null
        ? "—"
        : `${formatLocaleNumber(summary.total)} × ${formatLocaleNumber(
            summary.gradeMultiplier
          )} × ${formatLocaleNumber(summary.collectionCount)} = ${formatLocaleNumber(
            summary.capsuleEstimate
          )}`;
    const estimateLabelKey =
      summary.type === "keychain" ? "keychainEstimateLabel" : "capsuleEstimateLabel";
    capsuleEstimate.textContent = t(estimateLabelKey).replace("{value}", estimateValue);

    const date = document.createElement("div");
    date.textContent = t("summaryDateLabel").replace(
      "{date}",
      formatLocaleDate(summary.date)
    );

    content.append(title, counts, total);
    if (summary.type === "sticker") {
      content.append(average);
    }
    content.append(capsuleEstimate, date);

    const aside = document.createElement("div");
    aside.className = "summary-aside";

    const image = document.createElement("img");
    image.className = "summary-image";
    image.alt = summary.title || summary.name;
    if (summary.image) {
      image.crossOrigin = "anonymous";
      image.referrerPolicy = "no-referrer";
      image.src = summary.image;
    } else {
      image.classList.add("is-empty");
    }

    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.className = "secondary-button summary-export";
    exportButton.textContent = t("exportImage");
    exportButton.addEventListener("click", () => {
      exportSummaryImage(summary, item);
    });

    aside.append(image, exportButton);
    item.append(content, aside);
    summaryList.appendChild(item);
  });
};

const renderSelectedStickers = (stickers) => {
  selectedStickersList.innerHTML = "";
  if (stickers.length === 0) {
    const empty = document.createElement("li");
    empty.className = "selected-item";
    empty.textContent = t("selectedEmpty");
    selectedStickersList.appendChild(empty);
    return;
  }

  stickers.forEach((sticker) => {
    const item = document.createElement("li");
    item.className = "selected-item";
    const label = document.createElement("span");
    label.textContent = `${sticker.name} (${sticker.def_index})`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = t("remove");
    remove.addEventListener("click", () => {
      selectedStickerMap.delete(sticker.def_index);
      renderSelectedStickers([...selectedStickerMap.values()]);
    });
    item.append(label, remove);
    selectedStickersList.appendChild(item);
  });
};

const renderSelectedKeychains = (keychains) => {
  selectedKeychainsList.innerHTML = "";
  if (keychains.length === 0) {
    const empty = document.createElement("li");
    empty.className = "selected-item";
    empty.textContent = t("selectedEmpty");
    selectedKeychainsList.appendChild(empty);
    return;
  }

  keychains.forEach((keychain) => {
    const item = document.createElement("li");
    item.className = "selected-item";
    const label = document.createElement("span");
    label.textContent = `${keychain.name} (${keychain.def_index})`;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = t("remove");
    remove.addEventListener("click", () => {
      selectedKeychainMap.delete(keychain.def_index);
      renderSelectedKeychains([...selectedKeychainMap.values()]);
    });
    item.append(label, remove);
    selectedKeychainsList.appendChild(item);
  });
};

let stickersData = [];
let collectionsData = [];
const selectedStickerMap = new Map();
let keychainsData = [];
let keychainCollectionsData = [];
const selectedKeychainMap = new Map();
const GRADE_MULTIPLIERS = {
  "High Grade": 1.25,
  Remarkable: 6.24,
  Exotic: 31.2,
  Extraordinary: 156
};

const normalizeValue = (value) => value.toLowerCase().trim();

const getActiveRarities = () => {
  const selected = rarityCheckboxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value)
    .filter((value) => value !== "all");
  return selected;
};

const stickerMatchesRarity = (sticker) => {
  const rarities = getActiveRarities();
  if (rarities.length === 0) {
    return true;
  }
  return rarities.includes(sticker.rarity?.name);
};

const getStickerSearchHaystack = (sticker) => {
  return [
    sticker.name,
    sticker.market_hash_name,
    sticker.def_index,
    sticker.id
  ]
    .filter(Boolean)
    .map((value) => normalizeValue(String(value)));
};

const updateStickerSuggestions = () => {
  const query = normalizeValue(stickerSearchInput.value);
  stickerSuggestions.innerHTML = "";
  if (!query) {
    return;
  }

  const matches = stickersData
    .filter((sticker) => stickerMatchesRarity(sticker))
    .filter((sticker) =>
      getStickerSearchHaystack(sticker).some((value) => value.includes(query))
    )
    .slice(0, 8);

  matches.forEach((sticker) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${sticker.name} (${sticker.def_index})`;
    button.addEventListener("click", () => {
      selectedStickerMap.set(sticker.def_index, sticker);
      renderSelectedStickers([...selectedStickerMap.values()]);
      stickerSearchInput.value = "";
      stickerSuggestions.innerHTML = "";
    });
    item.appendChild(button);
    stickerSuggestions.appendChild(item);
  });
};

const stickerHasCollection = (sticker, collection) => {
  const inCrates = sticker.crates?.some((crate) => crate.name === collection);
  const inCollections = sticker.collections?.some(
    (entry) => entry.name === collection
  );
  return Boolean(inCrates || inCollections);
};

const getStickerPrimaryCollectionName = (sticker) =>
  sticker.crates?.[0]?.name || sticker.collections?.[0]?.name || null;

const countStickersInCollectionByRarity = (collectionName, rarityName) => {
  if (!collectionName || !rarityName) {
    return null;
  }
  return stickersData.filter(
    (sticker) =>
      stickerHasCollection(sticker, collectionName) &&
      sticker.rarity?.name === rarityName
  ).length;
};

const updateCollectionSuggestions = () => {
  const query = normalizeValue(collectionSearchInput.value);
  collectionSuggestions.innerHTML = "";
  if (!query) {
    return;
  }

  const matches = collectionsData
    .filter((collection) => normalizeValue(collection).includes(query))
    .slice(0, 8);

  matches.forEach((collection) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = collection;
    button.addEventListener("click", () => {
      addCollectionStickers(collection);
      collectionSearchInput.value = "";
      collectionSuggestions.innerHTML = "";
    });
    item.appendChild(button);
    collectionSuggestions.appendChild(item);
  });
};

const addCollectionStickers = (collection) => {
  const rarities = getActiveRarities();
  stickersData
    .filter((sticker) => {
      if (!stickerHasCollection(sticker, collection)) {
        return false;
      }
      if (rarities.length === 0) {
        return true;
      }
      return rarities.includes(sticker.rarity?.name);
    })
    .forEach((sticker) => {
      selectedStickerMap.set(sticker.def_index, sticker);
    });
  renderSelectedStickers([...selectedStickerMap.values()]);
};

const getKeychainSearchHaystack = (keychain) => {
  return [keychain.name, keychain.market_hash_name, keychain.def_index, keychain.id]
    .filter(Boolean)
    .map((value) => normalizeValue(String(value)));
};

const updateKeychainSuggestions = () => {
  const query = normalizeValue(keychainSearchInput.value);
  keychainSuggestions.innerHTML = "";
  if (!query) {
    return;
  }

  const matches = keychainsData
    .filter((keychain) =>
      getKeychainSearchHaystack(keychain).some((value) => value.includes(query))
    )
    .slice(0, 8);

  matches.forEach((keychain) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = `${keychain.name} (${keychain.def_index})`;
    button.addEventListener("click", () => {
      selectedKeychainMap.set(keychain.def_index, keychain);
      renderSelectedKeychains([...selectedKeychainMap.values()]);
      keychainSearchInput.value = "";
      keychainSuggestions.innerHTML = "";
    });
    item.appendChild(button);
    keychainSuggestions.appendChild(item);
  });
};

const keychainHasCollection = (keychain, collection) =>
  keychain.collections?.some((entry) => entry.name === collection);

const getKeychainPrimaryCollectionName = (keychain) =>
  keychain.collections?.[0]?.name || null;

const countKeychainsInCollectionByRarity = (collectionName, rarityName) => {
  if (!collectionName || !rarityName) {
    return null;
  }
  return keychainsData.filter(
    (keychain) =>
      keychainHasCollection(keychain, collectionName) &&
      keychain.rarity?.name === rarityName
  ).length;
};

const updateKeychainCollectionSuggestions = () => {
  const query = normalizeValue(keychainCollectionSearchInput.value);
  keychainCollectionSuggestions.innerHTML = "";
  if (!query) {
    return;
  }

  const matches = keychainCollectionsData
    .filter((collection) => normalizeValue(collection).includes(query))
    .slice(0, 8);

  matches.forEach((collection) => {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = collection;
    button.addEventListener("click", () => {
      addCollectionKeychains(collection);
      keychainCollectionSearchInput.value = "";
      keychainCollectionSuggestions.innerHTML = "";
    });
    item.appendChild(button);
    keychainCollectionSuggestions.appendChild(item);
  });
};

const addCollectionKeychains = (collection) => {
  keychainsData
    .filter((keychain) => keychainHasCollection(keychain, collection))
    .forEach((keychain) => {
      selectedKeychainMap.set(keychain.def_index, keychain);
    });
  renderSelectedKeychains([...selectedKeychainMap.values()]);
};

stickerSearchInput.addEventListener("input", updateStickerSuggestions);
collectionSearchInput.addEventListener("input", updateCollectionSuggestions);
keychainSearchInput.addEventListener("input", updateKeychainSuggestions);
keychainCollectionSearchInput.addEventListener(
  "input",
  updateKeychainCollectionSuggestions
);
clearStickersButton.addEventListener("click", () => {
  selectedStickerMap.clear();
  renderSelectedStickers([]);
});
clearKeychainsButton.addEventListener("click", () => {
  selectedKeychainMap.clear();
  renderSelectedKeychains([]);
});

downloadCsvButton.addEventListener("click", () => {
  if (summaryItems.length === 0) {
    return;
  }
  const csv = buildCsv(summaryItems);
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = t("downloadCsvName");
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

if (downloadImagesButton) {
  downloadImagesButton.addEventListener("click", () => {
    exportAllSummaryImages();
  });
}

if (downloadCollageButton) {
  downloadCollageButton.addEventListener("click", () => {
    exportSummaryCollage();
  });
}

languageSelect.addEventListener("change", (event) => {
  currentLanguage = event.target.value;
  applyTranslations();
});

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

const loadStickerData = async () => {
  try {
    const buildUrl = (name) =>
      typeof chrome !== "undefined" && chrome.runtime?.getURL
        ? chrome.runtime.getURL(name)
        : name;
    const response = await fetch(buildUrl("stickers_clean.json"));
    let data = null;
    if (response.ok) {
      data = await response.json();
    } else {
      const fallbackResponse = await fetch(buildUrl("stickers.clean.json"));
      if (!fallbackResponse.ok) {
        throw new Error("Failed to load stickers.json");
      }
      data = await fallbackResponse.json();
    }
    if (!Array.isArray(data)) {
      throw new Error("Invalid sticker data");
    }
    stickersData = data;
    collectionsData = Array.from(
      new Set(
        data.flatMap((sticker) => [
          ...(sticker.crates || []).map((crate) => crate.name),
          ...(sticker.collections || []).map((collection) => collection.name)
        ])
      )
    ).sort();
  } catch (error) {
    stickersData = [];
    collectionsData = [];
  } finally {
    renderSelectedStickers([...selectedStickerMap.values()]);
  }
};

const loadKeychainData = async () => {
  try {
    const buildUrl = (name) =>
      typeof chrome !== "undefined" && chrome.runtime?.getURL
        ? chrome.runtime.getURL(name)
        : name;
    const response = await fetch(buildUrl("keychains.json"));
    if (!response.ok) {
      throw new Error("Failed to load keychains.json");
    }
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error("Invalid keychain data");
    }
    keychainsData = data;
    keychainCollectionsData = Array.from(
      new Set(
        data.flatMap((keychain) =>
          (keychain.collections || []).map((collection) => collection.name)
        )
      )
    ).sort();
  } catch (error) {
    keychainsData = [];
    keychainCollectionsData = [];
  } finally {
    renderSelectedKeychains([...selectedKeychainMap.values()]);
  }
};

if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.action !== "rateLimitUpdate") {
      return;
    }
    const payload = message.payload || {};
    updateRateLimitDisplay(payload);
    if (payload.remaining != null) {
      if (payload.remaining < 20) {
        setPauseState({ paused: true, resumeAtMs: payload.resetTimeMs });
      } else if (isPaused) {
        setPauseState({ paused: false });
      }
    }
  });
}

if (typeof chrome !== "undefined" && chrome.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((message) => {
    if (message?.action !== "globalRateLimitUpdate") {
      return;
    }
    const payload = message.payload || {};
    updateGlobalRateLimitDisplay(payload);
  });
}

runBtn.addEventListener("click", () => {
  const selectedItems = [
    ...[...selectedStickerMap.values()].map((sticker) => ({
      type: "sticker",
      data: sticker
    })),
    ...[...selectedKeychainMap.values()].map((keychain) => ({
      type: "keychain",
      data: keychain
    }))
  ];
  if (selectedItems.length === 0) {
    alert(t("alertSelect"));
    return;
  }

  resultsList.innerHTML = "";
  summaryList.innerHTML = "";
  generatedLink.href = "#";
  generatedLink.textContent = "—";
  summaryItems = [];
  isDownloadingAllImages = false;
  isDownloadingCollage = false;
  progressTotal = selectedItems.length;
  updateProgress(0, progressTotal);
  downloadCsvButton.disabled = true;
  if (downloadImagesButton) {
    downloadImagesButton.disabled = true;
  }
  if (downloadCollageButton) {
    downloadCollageButton.disabled = true;
  }
  runBtn.disabled = true;
  stopBtn.disabled = false;
  let stopRequested = false;
  stopBtn.onclick = () => {
    stopRequested = true;
    stopBtn.disabled = true;
  };
  let processed = 0;
  const runSequential = async () => {
    for (const entry of selectedItems) {
      if (stopRequested) {
        break;
      }
      await waitForResumeIfPaused();
      if (stopRequested) {
        break;
      }

      if (entry.type === "sticker") {
        const sticker = entry.data;
        const urls = [1, 2, 3, 4, 5].map((count) => ({
          count,
          url: buildStickerUrl(sticker.def_index, count)
        }));

        if (generatedLink.textContent === "—") {
          generatedLink.href = urls[0].url;
          generatedLink.textContent = urls[0].url;
        }

        renderStickerResults(
          sticker,
          urls.map((item) => ({ ...item, found: null, loading: true }))
        );

        const response = stopRequested
          ? null
          : await new Promise((resolve) => {
              chrome.runtime.sendMessage(
                { action: "runCounts", urls: urls.map((u) => u.url) },
                resolve
              );
            });

        if (!response?.results) {
          renderStickerResults(
            sticker,
            urls.map((item) => ({ ...item, found: null, loading: false }))
          );
          processed += 1;
          updateProgress(processed, progressTotal);
          continue;
        }

        const results = response.results.map((result, index) => ({
          count: index + 1,
          url: result.url,
          found: result.count,
          loading: false
        }));
        renderStickerResults(sticker, results);

        const totals = computeStickerTotals(results);
        if (totals) {
          const average = computeAverageStickersPerSkin(results);
          const gradeMultiplier = GRADE_MULTIPLIERS[sticker.rarity?.name] ?? null;
          const collectionName = getStickerPrimaryCollectionName(sticker);
          const collectionCount = countStickersInCollectionByRarity(
            collectionName,
            sticker.rarity?.name
          );
          const capsuleEstimate =
            gradeMultiplier == null || collectionCount == null
              ? null
              : totals.total * gradeMultiplier * collectionCount;
          summaryItems.push({
            type: "sticker",
            name: `${sticker.name} (${sticker.def_index})`,
            title: sticker.name,
            defIndex: sticker.def_index,
            image: sticker.image,
            pureCounts: totals.pureCounts.map((value, index) => value * (index + 1)),
            total: totals.total,
            average,
            gradeMultiplier,
            collectionCount,
            capsuleEstimate,
            date: new Date().toISOString()
          });
        }
      } else {
        const keychain = entry.data;
        const url = buildKeychainUrl(keychain.def_index);

        if (generatedLink.textContent === "—") {
          generatedLink.href = url;
          generatedLink.textContent = url;
        }

        renderKeychainResults(keychain, { url, found: null, loading: true });

        const response = stopRequested
          ? null
          : await new Promise((resolve) => {
              chrome.runtime.sendMessage(
                { action: "runCounts", urls: [url] },
                resolve
              );
            });

        if (!response?.results?.length) {
          renderKeychainResults(keychain, { url, found: null, loading: false });
          processed += 1;
          updateProgress(processed, progressTotal);
          continue;
        }

        const result = {
          url: response.results[0].url,
          found: response.results[0].count,
          loading: false
        };
        renderKeychainResults(keychain, result);

        const totals = computeKeychainTotals(result);
        if (totals) {
          const gradeMultiplier = GRADE_MULTIPLIERS[keychain.rarity?.name] ?? null;
          const collectionName = getKeychainPrimaryCollectionName(keychain);
          const collectionCount = countKeychainsInCollectionByRarity(
            collectionName,
            keychain.rarity?.name
          );
          const capsuleEstimate =
            gradeMultiplier == null || collectionCount == null
              ? null
              : totals.total * gradeMultiplier * collectionCount;
          summaryItems.push({
            type: "keychain",
            name: `${keychain.name} (${keychain.def_index})`,
            title: keychain.name,
            defIndex: keychain.def_index,
            image: keychain.image,
            pureCounts: totals.pureCounts.map((value, index) => value * (index + 1)),
            total: totals.total,
            average: null,
            gradeMultiplier,
            collectionCount,
            capsuleEstimate,
            date: new Date().toISOString()
          });
        }
      }

      processed += 1;
      updateProgress(processed, progressTotal);
    }
  };

  runSequential().finally(() => {
    runBtn.disabled = false;
    stopBtn.disabled = true;
    renderSummary(summaryItems);
    downloadCsvButton.disabled = summaryItems.length === 0;
    if (downloadImagesButton) {
      downloadImagesButton.disabled = summaryItems.length === 0 || isDownloadingAllImages;
    }
    if (downloadCollageButton) {
      downloadCollageButton.disabled =
        summaryItems.length === 0 || isDownloadingCollage;
    }
  });
});

syncInputs(0, 1);
initCardToggles();
loadStickerData();
loadKeychainData();
currentTheme = localStorage.getItem("csfloat-theme") || getPreferredTheme();
setTheme(currentTheme);
applyTranslations();
