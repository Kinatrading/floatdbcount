import html2canvas from "./html2canvas.esm.js";
import {
  computeKeychainTotals,
  computeStickerTotals,
  parseItemsFoundCount
} from "./modules/stickers/charms.js";
import {
  computeAverageStickersPerSkin,
  computeTotalSkins
} from "./modules/skins.js";

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
const collectionSelect = document.getElementById("collection-select");
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
const progressEstimate = document.getElementById("progress-estimate");
const rateLimitDisplay = document.getElementById("rate-limit");
const globalRateLimitDisplay = document.getElementById("rate-limit-global");
const downloadCsvButton = document.getElementById("download-csv");
const downloadImagesButton = document.getElementById("download-images");
const downloadCollageButton = document.getElementById("download-collage");
const downloadCollageHorizontalButton = document.getElementById(
  "download-collage-horizontal"
);
const languageSelect = document.getElementById("language-select");
const themeToggle = document.getElementById("theme-toggle");
const moduleSwitchButtons = Array.from(document.querySelectorAll(".module-switch-button"));
const modulePanels = Array.from(document.querySelectorAll("[data-module-panel]"));
const summaryShowImageCheckbox = document.getElementById("summary-show-image");
const summaryShowTitleCheckbox = document.getElementById("summary-show-title");
const summaryShowCountsCheckbox = document.getElementById("summary-show-counts");
const summaryShowTotalCheckbox = document.getElementById("summary-show-total");
const summaryShowAverageCheckbox = document.getElementById("summary-show-average");
const summaryShowEstimateCheckbox = document.getElementById("summary-show-estimate");
const summaryShowHiddenEstimateCheckbox = document.getElementById(
  "summary-show-hidden-estimate"
);
const summaryShowDateCheckbox = document.getElementById("summary-show-date");
const retryFailedCheckbox = document.getElementById("retry-failed");

const translations = {
  uk: {
    title: "CSFloat DB Sticker Linker created by Kina",
    subtitle: "Згенеруйте посилання для пошуку скінів по наліпках та float.",
    language: "Мова",
    themeLabel: "Тема",
    themeToggleDark: "Темна тема",
    themeToggleLight: "Світла тема",
    moduleSwitchLabel: "Модуль",
    moduleSwitchAria: "Перемикач модулів",
    moduleStickersCharms: "stickers/charms",
    moduleSkins: "skins",
    skinsCollectionTitle: "Колекція",
    skinsCollectionSelectLabel: "Оберіть колекцію",
    skinsCollectionSelectPlaceholder: "Оберіть колекцію",
    skinsCollectionSelectAria: "Список колекцій скінів",
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
    estimatedTimeLabel: "Очікуваний час:",
    runSettingsLabel: "Налаштування запуску:",
    runSettingsAria: "Налаштування запуску",
    retryFailedLabel: "Повторно перевіряти биті посилання після завершення",
    generatedLink: "Згенероване посилання:",
    resultsLabel: "Посилання та кількість:",
    summaryLabel: "Збережений підсумок:",
    summarySettingsLabel: "Налаштування підсумку:",
    summarySettingsAria: "Налаштування підсумку",
    summaryShowImage: "Показувати картинку",
    summaryShowTitle: "Показувати назву",
    summaryShowCounts: "Показувати кількість",
    summaryShowTotal: "Показувати суму",
    summaryShowAverage: "Показувати середнє",
    summaryShowEstimate: "Показувати оцінку відкриттів",
    summaryShowHiddenEstimate: "Показувати приховану оцінку",
    summaryShowDate: "Показувати дату",
    downloadCsv: "Завантажити CSV",
    downloadImages: "Завантажити всі картинки",
    downloadCollage: "Завантажити однією картинкою",
    downloadCollageHorizontal: 'Завантажити однією картинкою "горизонтально"',
    exportImage: "Експорт картинки",
    exportTitle: "CS2 STICKER HIGHLIGHT",
    exportTotalLabel: "ЗАГАЛЬНО ПОКЛЕЄНО",
    resultsTitle: "Результати",
    waiting: "Очікування...",
    notFound: "Не знайдено",
    totalStickersLabel: "Загальна кількість поклеєних стікерів:",
    totalSkinsLabel: "Загальна кількість скінів:",
    averageStickersLabel: "Середня кількість:",
    totalKeychainsLabel: "Загальна кількість закріплених брелків:",
    summaryEmpty: "Підсумок буде доступний після запуску.",
    selectedEmpty: "Нічого не обрано.",
    remove: "Видалити",
    alertSelect: "Оберіть колекцію.",
    summaryCountsLabel: "1х: {c1}, 2х: {c2}, 3х: {c3}, 4х: {c4}, 5х: {c5}",
    summaryKeychainCountsLabel: "1х: {c1}",
    summaryTotalLabel: "Сумарна кількість поклеєних: {total}",
    summaryDateLabel: "Дата: {date}",
    progressMeta: "{current} / {total}",
    rateLimitLabel: "Лишилось запитів:",
    globalRateLimitLabel: "Глобальний ліміт:",
    downloadCsvName: "sticker-summary.csv",
    downloadCollageName: "sticker-summary-collage",
    downloadCollageHorizontalName: "sticker-summary-collage-horizontal",
    csvStickerHeader: "Предмет",
    csvAverageHeader: "Середня кількість на скін",
    csvGradeMultiplierHeader: "Множник грейду",
    csvCollectionCountHeader: "Кількість у колекції",
    csvEstimateHeader: "Оцінка відкриттів",
    capsuleEstimateLabel:
      "Приблизна кількість відкритих капсул (стосується лише предметів після 2020 року): {value}",
    keychainEstimateLabel:
      "Приблизна кількість відкритих брелоків (стосується лише предметів після 2020 року): {value}",
    hiddenEstimateLabel: "Приблизно сховано цього предмета: {value}",
    recheck: "Перевірити повторно"
  },
  en: {
    title: "CSFloat DB Sticker Linker created by Kina",
    subtitle: "Generate links to search skins by stickers and float range.",
    language: "Language",
    themeLabel: "Theme",
    themeToggleDark: "Dark theme",
    themeToggleLight: "Light theme",
    moduleSwitchLabel: "Module",
    moduleSwitchAria: "Module switch",
    moduleStickersCharms: "stickers/charms",
    moduleSkins: "skins",
    skinsCollectionTitle: "Collection",
    skinsCollectionSelectLabel: "Choose collection",
    skinsCollectionSelectPlaceholder: "Choose collection",
    skinsCollectionSelectAria: "Skins collections list",
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
    estimatedTimeLabel: "Estimated time:",
    runSettingsLabel: "Run settings:",
    runSettingsAria: "Run settings",
    retryFailedLabel: "Retry failed links after finishing",
    generatedLink: "Generated link:",
    resultsLabel: "Links and count:",
    summaryLabel: "Saved summary:",
    summarySettingsLabel: "Summary settings:",
    summarySettingsAria: "Summary settings",
    summaryShowImage: "Show image",
    summaryShowTitle: "Show name",
    summaryShowCounts: "Show counts",
    summaryShowTotal: "Show total",
    summaryShowAverage: "Show average",
    summaryShowEstimate: "Show opening estimate",
    summaryShowHiddenEstimate: "Show hidden estimate",
    summaryShowDate: "Show date",
    downloadCsv: "Download CSV",
    downloadImages: "Download all images",
    downloadCollage: "Download as single image",
    downloadCollageHorizontal: 'Download as single image "horizontal"',
    exportImage: "Export image",
    exportTitle: "CS2 STICKER HIGHLIGHT",
    exportTotalLabel: "TOTAL POOLS",
    resultsTitle: "Results",
    waiting: "Waiting...",
    notFound: "Not found",
    totalStickersLabel: "Total applied stickers:",
    totalSkinsLabel: "Total skins:",
    averageStickersLabel: "Average:",
    totalKeychainsLabel: "Total attached keychains:",
    summaryEmpty: "Summary will be available after running.",
    selectedEmpty: "No items selected.",
    remove: "Remove",
    alertSelect: "Select a collection.",
    summaryCountsLabel: "1x: {c1}, 2x: {c2}, 3x: {c3}, 4x: {c4}, 5x: {c5}",
    summaryKeychainCountsLabel: "1x: {c1}",
    summaryTotalLabel: "Total applied: {total}",
    summaryDateLabel: "Date: {date}",
    progressMeta: "{current} / {total}",
    rateLimitLabel: "Requests left:",
    globalRateLimitLabel: "Global limit:",
    downloadCsvName: "sticker-summary.csv",
    downloadCollageName: "sticker-summary-collage",
    downloadCollageHorizontalName: "sticker-summary-collage-horizontal",
    csvStickerHeader: "Item",
    csvAverageHeader: "Average per skin",
    csvGradeMultiplierHeader: "Grade multiplier",
    csvCollectionCountHeader: "Collection count",
    csvEstimateHeader: "Openings estimate",
    capsuleEstimateLabel:
      "Approx opened capsules (items after 2020 only): {value}",
    keychainEstimateLabel:
      "Approx opened keychains (items after 2020 only): {value}",
    hiddenEstimateLabel: "Approx hidden for this item: {value}",
    recheck: "Recheck"
  }
};

let currentLanguage = "uk";
let currentTheme = "light";
let currentModule = "skins";
let summaryItems = [];
let progressTotal = 0;
let isPaused = false;
let isDownloadingAllImages = false;
let isDownloadingCollage = false;
let isDownloadingHorizontalCollage = false;
let resumeTimerId = null;
let pausePromise = null;
let pausePromiseResolve = null;
let lastRateLimitPayload = null;
let lastGlobalRateLimitPayload = null;
let selectedStickerCollection = null;
let selectedKeychainCollection = null;
let runCounter = 0;
let activeRunId = null;
let estimatedLinksTotal = 0;
let stickerResultsCache = new Map();
let keychainResultsCache = new Map();
let summaryDisplaySettings = {
  image: true,
  title: true,
  counts: true,
  total: true,
  average: true,
  estimate: true,
  hiddenEstimate: true,
  date: true
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatFloat = (value) => Number(value).toFixed(6);

const t = (key) => translations[currentLanguage]?.[key] ?? key;

const nextRunId = () => {
  runCounter += 1;
  return `${Date.now()}-${runCounter}`;
};

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

const formatDurationLabel = (totalMs) => {
  const totalMinutes = Math.max(Math.round(totalMs / 60000), 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const parts = [];
  if (hours > 0) {
    parts.push(
      currentLanguage === "uk" ? `${hours} год` : `${hours}h`
    );
  }
  if (minutes > 0 || parts.length === 0) {
    parts.push(
      currentLanguage === "uk" ? `${minutes} хв` : `${minutes}m`
    );
  }
  return parts.join(" ");
};

const getNextHourStart = (baseMs = Date.now()) => {
  const nextHour = new Date(baseMs);
  nextHour.setMinutes(0, 0, 0);
  nextHour.setHours(nextHour.getHours() + 1);
  return nextHour;
};

const estimateProcessingMs = (totalLinks, secondsPerLink, startMs = Date.now()) => {
  if (!Number.isFinite(totalLinks) || totalLinks <= 0) {
    return 0;
  }
  const perLinkMs = secondsPerLink * 1000;
  const hourlyLimit = 105;
  let remaining = totalLinks;
  let currentMs = startMs;
  let elapsedMs = 0;

  while (remaining > 0) {
    const nextHour = getNextHourStart(currentMs);
    const timeLeftMs = nextHour.getTime() - currentMs;
    const capacityByTime = Math.floor(timeLeftMs / perLinkMs);
    const capacity = Math.min(hourlyLimit, capacityByTime);

    if (capacity <= 0) {
      elapsedMs += timeLeftMs;
      currentMs = nextHour.getTime();
      continue;
    }

    const toProcess = Math.min(remaining, capacity);
    const batchMs = toProcess * perLinkMs;
    elapsedMs += batchMs;
    currentMs += batchMs;
    remaining -= toProcess;

    if (remaining > 0) {
      const waitMs = nextHour.getTime() - currentMs;
      if (waitMs > 0) {
        elapsedMs += waitMs;
        currentMs = nextHour.getTime();
      }
    }
  }

  return elapsedMs;
};

const updateProgressEstimate = (totalLinks) => {
  if (!progressEstimate) {
    return;
  }
  if (!Number.isFinite(totalLinks) || totalLinks <= 0) {
    progressEstimate.textContent = "—";
    return;
  }
  const now = Date.now();
  const minMs = estimateProcessingMs(totalLinks, 7, now);
  const maxMs = estimateProcessingMs(totalLinks, 15, now);
  progressEstimate.textContent = `${formatDurationLabel(minMs)} — ${formatDurationLabel(
    maxMs
  )}`;
};

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

const updateModuleSwitch = () => {
  moduleSwitchButtons.forEach((button) => {
    const isActive = button.dataset.module === currentModule;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  modulePanels.forEach((panel) => {
    panel.hidden = panel.dataset.modulePanel !== currentModule;
  });
};

const rerenderResultsFromCache = () => {
  selectedStickerMap.forEach((sticker, defIndex) => {
    const cachedItems = stickerResultsCache.get(defIndex);
    if (cachedItems) {
      renderStickerResults(sticker, cachedItems);
    }
  });

  selectedKeychainMap.forEach((keychain, defIndex) => {
    const cachedItem = keychainResultsCache.get(defIndex);
    if (cachedItem) {
      renderKeychainResults(keychain, cachedItem);
    }
  });
};

const setActiveModule = (module) => {
  if (module !== "stickers-charms" && module !== "skins") {
    return;
  }
  currentModule = module;
  updateModuleSwitch();
  rerenderResultsFromCache();
  renderSummary(summaryItems);
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
  summaryDisplaySettings = readSummaryDisplaySettings();
  renderSummary(summaryItems);
  if (lastRateLimitPayload) {
    updateRateLimitDisplay(lastRateLimitPayload);
  }
  if (lastGlobalRateLimitPayload) {
    updateGlobalRateLimitDisplay(lastGlobalRateLimitPayload);
  }
  updateProgressEstimate(estimatedLinksTotal);
  updateThemeToggleLabel();
  updateModuleSwitch();
};

const readSummaryDisplaySettings = () => ({
  image: summaryShowImageCheckbox?.checked ?? true,
  title: summaryShowTitleCheckbox?.checked ?? true,
  counts: summaryShowCountsCheckbox?.checked ?? true,
  total: summaryShowTotalCheckbox?.checked ?? true,
  average: summaryShowAverageCheckbox?.checked ?? true,
  estimate: summaryShowEstimateCheckbox?.checked ?? true,
  hiddenEstimate: summaryShowHiddenEstimateCheckbox?.checked ?? true,
  date: summaryShowDateCheckbox?.checked ?? true
});

const updateSummaryDisplaySettings = () => {
  summaryDisplaySettings = readSummaryDisplaySettings();
  renderSummary(summaryItems);
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

const countTotalLinks = (items) =>
  items.reduce((sum, entry) => sum + (entry.type === "sticker" ? 5 : 1), 0);

const mergeRetryResults = (items, response) => {
  const resultMap = new Map(
    (response?.results || []).map((result) => [result.url, result.count])
  );
  return items.map((item) => {
    if (!item.loading) {
      return item;
    }
    const nextFound = resultMap.has(item.url) ? resultMap.get(item.url) : item.found;
    return {
      ...item,
      found: nextFound,
      loading: false
    };
  });
};

const retryFailedItems = async (selectedItems, stopRequestedRef) => {
  for (const entry of selectedItems) {
    if (stopRequestedRef.stopRequested) {
      break;
    }
    await waitForResumeIfPaused();
    if (stopRequestedRef.stopRequested) {
      break;
    }

    if (entry.type === "sticker") {
      const sticker = entry.data;
      const cachedItems = stickerResultsCache.get(sticker.def_index) || [];
      const failedItems = cachedItems.filter((item) => item.found === null);
      if (failedItems.length === 0) {
        continue;
      }
      const markedItems = cachedItems.map((item) =>
        item.found === null ? { ...item, loading: true } : item
      );
      renderStickerResults(sticker, markedItems);
      const response = stopRequestedRef.stopRequested
        ? null
        : await requestCounts(
            failedItems.map((item) => item.url),
            activeRunId
          );
      const mergedItems = mergeRetryResults(markedItems, response);
      renderStickerResults(sticker, mergedItems);
      const summaryItem = createStickerSummaryItem(sticker, mergedItems);
      if (summaryItem) {
        upsertSummaryItem(summaryItem);
      }
    } else {
      const keychain = entry.data;
      const cachedItem = keychainResultsCache.get(keychain.def_index);
      if (!cachedItem || cachedItem.found !== null) {
        continue;
      }
      renderKeychainResults(keychain, { ...cachedItem, loading: true });
      const response = stopRequestedRef.stopRequested
        ? null
        : await requestCounts([cachedItem.url], activeRunId);
      const mergedItems = mergeRetryResults([{ ...cachedItem, loading: true }], response);
      const nextItem = mergedItems[0] || { ...cachedItem, loading: false };
      renderKeychainResults(keychain, nextItem);
      const summaryItem = createKeychainSummaryItem(keychain, nextItem);
      if (summaryItem) {
        upsertSummaryItem(summaryItem);
      }
    }
    refreshSummaryDisplay();
  }
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

const requestCounts = (urls, runId) =>
  new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "runCounts", urls, runId }, resolve);
  });

const stopCounts = (runId) =>
  new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "stopCounts", runId }, resolve);
  });

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

const buildSummaryTextLines = (summary, settings) => {
  const lines = [];
  if (settings.title) {
    lines.push(summary.name);
  }
  if (settings.counts) {
    const countsTemplate =
      summary.type === "keychain"
        ? t("summaryKeychainCountsLabel")
        : t("summaryCountsLabel");
    lines.push(
      countsTemplate
        .replace("{c1}", formatLocaleNumber(summary.pureCounts[0]))
        .replace("{c2}", formatLocaleNumber(summary.pureCounts[1]))
        .replace("{c3}", formatLocaleNumber(summary.pureCounts[2]))
        .replace("{c4}", formatLocaleNumber(summary.pureCounts[3]))
        .replace("{c5}", formatLocaleNumber(summary.pureCounts[4]))
    );
  }
  if (settings.total) {
    lines.push(
      t("summaryTotalLabel").replace("{total}", formatLocaleNumber(summary.total))
    );
  }
  if (summary.type === "sticker" && settings.average) {
    const averageText =
      summary.average == null
        ? `${t("averageStickersLabel")} —`
        : `${t("averageStickersLabel")} ${formatAverageStickerLabel(summary.average)}`;
    lines.push(averageText);
  }
  if (settings.estimate) {
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
    lines.push(t(estimateLabelKey).replace("{value}", estimateValue));
  }
  if (settings.hiddenEstimate) {
    const shouldShowHiddenEstimate =
      (summary.type === "sticker" && selectedStickerCollection) ||
      (summary.type === "keychain" && selectedKeychainCollection);
    if (shouldShowHiddenEstimate) {
      const hiddenValue =
        summary.hiddenEstimate == null
          ? "—"
          : `${formatLocaleNumber(summary.hiddenCapsules)} ÷ ${formatLocaleNumber(
              summary.collectionCount
            )} ÷ ${formatLocaleNumber(summary.gradeMultiplier)} = ${formatLocaleNumber(
              summary.hiddenEstimate
            )}`;
      lines.push(t("hiddenEstimateLabel").replace("{value}", hiddenValue));
    }
  }
  if (settings.date) {
    lines.push(
      t("summaryDateLabel").replace("{date}", formatLocaleDate(summary.date))
    );
  }
  return lines;
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

const applyHiddenEstimates = () => {
  const types = [
    { type: "sticker", collection: selectedStickerCollection },
    { type: "keychain", collection: selectedKeychainCollection }
  ];

  types.forEach(({ type, collection }) => {
    if (!collection) {
      return;
    }
    const estimateValues = summaryItems
      .filter((item) => item.type === type && typeof item.capsuleEstimate === "number")
      .map((item) => item.capsuleEstimate);
    if (estimateValues.length === 0) {
      summaryItems.forEach((item) => {
        if (item.type === type) {
          item.hiddenEstimate = null;
        }
      });
      return;
    }

    const maxEstimate = Math.max(...estimateValues);
    summaryItems.forEach((item) => {
      if (item.type !== type) {
        return;
      }
      if (
        typeof item.capsuleEstimate === "number" &&
        typeof item.gradeMultiplier === "number" &&
        typeof item.collectionCount === "number"
      ) {
        const hiddenCapsules = Math.max(0, maxEstimate - item.capsuleEstimate);
        const hiddenEstimate = Math.max(
          0,
          Math.round(hiddenCapsules / (item.gradeMultiplier * item.collectionCount))
        );
        item.hiddenCapsules = hiddenCapsules;
        item.hiddenEstimate = hiddenEstimate;
      } else {
        item.hiddenCapsules = null;
        item.hiddenEstimate = null;
      }
    });
  });
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

const buildSummaryHorizontalCollageContainer = async () => {
  if (summaryItems.length === 0) {
    return null;
  }
  const collageRoot = document.createElement("div");
  collageRoot.className = "summary-collage-root";
  const collage = document.createElement("div");
  collage.className = "summary-collage-horizontal";
  collageRoot.appendChild(collage);
  document.body.appendChild(collageRoot);

  const blobUrls = [];
  for (const summary of summaryItems) {
    const card = document.createElement("div");
    card.className = "summary-collage-card";

    const text = document.createElement("div");
    text.className = "summary-collage-text";
    const lines = buildSummaryTextLines(summary, summaryDisplaySettings);
    if (lines.length === 0) {
      const emptyLine = document.createElement("div");
      emptyLine.textContent = "—";
      text.appendChild(emptyLine);
    } else {
      lines.forEach((line) => {
        const row = document.createElement("div");
        row.textContent = line;
        text.appendChild(row);
      });
    }

    const imageWrap = document.createElement("div");
    imageWrap.className = "summary-collage-image-wrap";
    const image = document.createElement("img");
    image.className = "summary-collage-image";
    image.alt = summary.title || summary.name;
    if (summaryDisplaySettings.image && summary.image) {
      image.crossOrigin = "anonymous";
      image.referrerPolicy = "no-referrer";
      image.src = summary.image;
    } else {
      image.classList.add("is-empty");
    }
    imageWrap.appendChild(image);

    card.append(text, imageWrap);
    collage.appendChild(card);

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

const exportSummaryCollageHorizontal = async () => {
  if (summaryItems.length === 0 || isDownloadingHorizontalCollage) {
    return;
  }
  isDownloadingHorizontalCollage = true;
  if (downloadCollageHorizontalButton) {
    downloadCollageHorizontalButton.disabled = true;
  }

  const prepared = await buildSummaryHorizontalCollageContainer();
  if (!prepared) {
    isDownloadingHorizontalCollage = false;
    if (downloadCollageHorizontalButton) {
      downloadCollageHorizontalButton.disabled = summaryItems.length === 0;
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
    link.download = `${sanitizeFileName(t("downloadCollageHorizontalName"))}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.92);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    blobUrls.forEach((url) => URL.revokeObjectURL(url));
    collageRoot.remove();
    isDownloadingHorizontalCollage = false;
    if (downloadCollageHorizontalButton) {
      downloadCollageHorizontalButton.disabled = summaryItems.length === 0;
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

const createStickerSummaryItem = (sticker, results) => {
  const totals = computeStickerTotals(results);
  if (!totals) {
    return null;
  }
  const average = computeAverageStickersPerSkin(results);
  const skinsCount = computeTotalSkins(results);
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
  return {
    type: "sticker",
    name: sticker.name,
    title: sticker.name,
    defIndex: sticker.def_index,
    image: sticker.image,
    pureCounts: totals.pureCounts.map((value, index) => value * (index + 1)),
    total: totals.total,
    skinsCount,
    average,
    gradeMultiplier,
    collectionCount,
    capsuleEstimate,
    hiddenEstimate: null,
    date: new Date().toISOString()
  };
};

const createKeychainSummaryItem = (keychain, result) => {
  const totals = computeKeychainTotals(result);
  if (!totals) {
    return null;
  }
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
  return {
    type: "keychain",
    name: keychain.name,
    title: keychain.name,
    defIndex: keychain.def_index,
    image: keychain.image,
    pureCounts: totals.pureCounts.map((value, index) => value * (index + 1)),
    total: totals.total,
    average: null,
    gradeMultiplier,
    collectionCount,
    capsuleEstimate,
    hiddenEstimate: null,
    date: new Date().toISOString()
  };
};

const upsertSummaryItem = (item) => {
  const index = summaryItems.findIndex(
    (existing) => existing.type === item.type && existing.defIndex === item.defIndex
  );
  if (index === -1) {
    summaryItems.push(item);
  } else {
    summaryItems[index] = item;
  }
};

const refreshSummaryDisplay = () => {
  applyHiddenEstimates();
  renderSummary(summaryItems);
  downloadCsvButton.disabled = summaryItems.length === 0;
  if (downloadImagesButton) {
    downloadImagesButton.disabled = summaryItems.length === 0 || isDownloadingAllImages;
  }
  if (downloadCollageButton) {
    downloadCollageButton.disabled = summaryItems.length === 0 || isDownloadingCollage;
  }
  if (downloadCollageHorizontalButton) {
    downloadCollageHorizontalButton.disabled =
      summaryItems.length === 0 || isDownloadingHorizontalCollage;
  }
};

const createRecheckButton = (onClick) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "secondary-button recheck-button";
  button.textContent = t("recheck");
  button.addEventListener("click", async () => {
    if (button.disabled) {
      return;
    }
    button.disabled = true;
    try {
      await onClick();
    } finally {
      button.disabled = false;
    }
  });
  return button;
};

const recheckStickerCount = async (sticker, count) => {
  const cachedItems = stickerResultsCache.get(sticker.def_index) || [];
  const existingItem =
    cachedItems.find((item) => item.count === count) || {
      count,
      url: buildStickerUrl(sticker.def_index, count)
    };
  const updatedItems = cachedItems.length
    ? cachedItems.map((item) =>
        item.count === count ? { ...existingItem, ...item, loading: true } : item
      )
    : [existingItem];
  renderStickerResults(sticker, updatedItems);
  const response = await requestCounts([existingItem.url], nextRunId());
  if (!response?.results?.length) {
    renderStickerResults(
      sticker,
      updatedItems.map((item) =>
        item.count === count ? { ...item, loading: false } : item
      )
    );
    return;
  }
  const refreshedItem = {
    ...existingItem,
    url: response.results[0].url,
    found: response.results[0].count,
    loading: false
  };
  const mergedItems = updatedItems
    .filter((item) => item.count !== count)
    .concat(refreshedItem)
    .sort((a, b) => a.count - b.count);
  renderStickerResults(sticker, mergedItems);
  const summaryItem = createStickerSummaryItem(sticker, mergedItems);
  if (summaryItem) {
    upsertSummaryItem(summaryItem);
    refreshSummaryDisplay();
  }
};

const recheckKeychain = async (keychain) => {
  const url = buildKeychainUrl(keychain.def_index);
  renderKeychainResults(keychain, { url, found: null, loading: true });
  const response = await requestCounts([url], nextRunId());
  if (!response?.results?.length) {
    renderKeychainResults(keychain, { url, found: null, loading: false });
    return;
  }
  const result = {
    url: response.results[0].url,
    found: response.results[0].count,
    loading: false
  };
  renderKeychainResults(keychain, result);
  const summaryItem = createKeychainSummaryItem(keychain, result);
  if (summaryItem) {
    upsertSummaryItem(summaryItem);
    refreshSummaryDisplay();
  }
};

const renderStickerResults = (sticker, items) => {
  stickerResultsCache.set(sticker.def_index, items);
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
  title.textContent = sticker.name;
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

    const actions = document.createElement("div");
    actions.className = "result-actions";
    const recheckButton = createRecheckButton(() =>
      recheckStickerCount(sticker, item.count)
    );
    actions.append(link, recheckButton);

    listItem.append(meta, actions);
    block.appendChild(listItem);
  });

  const totals = computeStickerTotals(items);
  const total = totals?.total ?? null;
  const skinsCount = computeTotalSkins(items);
  const totalLabel = document.createElement("div");
  totalLabel.className = "sticker-total";
  if (currentModule === "skins") {
    totalLabel.textContent =
      skinsCount === null
        ? `${t("totalSkinsLabel")} —`
        : `${t("totalSkinsLabel")} ${formatLocaleNumber(skinsCount)}`;
  } else {
    totalLabel.textContent =
      total === null
        ? `${t("totalStickersLabel")} —`
        : `${t("totalStickersLabel")} ${formatLocaleNumber(total)}`;
  }
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
  keychainResultsCache.set(keychain.def_index, item);
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
  title.textContent = keychain.name;
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

  const actions = document.createElement("div");
  actions.className = "result-actions";
  const recheckButton = createRecheckButton(() => recheckKeychain(keychain));
  actions.append(link, recheckButton);

  listItem.append(meta, actions);
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
  if (downloadCollageHorizontalButton) {
    downloadCollageHorizontalButton.disabled =
      summaryItems.length === 0 || isDownloadingHorizontalCollage;
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

    const watermark = document.createElement("div");
    watermark.className = "summary-id";
    watermark.textContent = `#${summary.defIndex ?? ""}`;
    watermark.setAttribute("aria-hidden", "true");

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
    if (summary.type === "sticker" && currentModule === "skins") {
      total.textContent =
        summary.skinsCount == null
          ? `${t("totalSkinsLabel")} —`
          : `${t("totalSkinsLabel")} ${formatLocaleNumber(summary.skinsCount)}`;
    } else {
      total.textContent = t("summaryTotalLabel").replace(
        "{total}",
        formatLocaleNumber(summary.total)
      );
    }

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

    const shouldShowHiddenEstimate =
      (summary.type === "sticker" && selectedStickerCollection) ||
      (summary.type === "keychain" && selectedKeychainCollection);
    let hiddenEstimate = null;
    if (shouldShowHiddenEstimate) {
      hiddenEstimate = document.createElement("div");
      const hiddenValue =
        summary.hiddenEstimate == null
          ? "—"
          : `${formatLocaleNumber(summary.hiddenCapsules)} ÷ ${formatLocaleNumber(
              summary.collectionCount
            )} ÷ ${formatLocaleNumber(summary.gradeMultiplier)} = ${formatLocaleNumber(
              summary.hiddenEstimate
            )}`;
      hiddenEstimate.textContent = t("hiddenEstimateLabel").replace(
        "{value}",
        hiddenValue
      );
    }

    const date = document.createElement("div");
    date.textContent = t("summaryDateLabel").replace(
      "{date}",
      formatLocaleDate(summary.date)
    );

    if (summaryDisplaySettings.title) {
      content.append(title);
    }
    if (summaryDisplaySettings.counts) {
      content.append(counts);
    }
    if (summaryDisplaySettings.total) {
      content.append(total);
    }
    if (summary.type === "sticker" && summaryDisplaySettings.average) {
      content.append(average);
    }
    if (summaryDisplaySettings.estimate) {
      content.append(capsuleEstimate);
    }
    if (summaryDisplaySettings.hiddenEstimate && hiddenEstimate) {
      content.append(hiddenEstimate);
    }
    if (summaryDisplaySettings.date) {
      content.append(date);
    }

    const aside = document.createElement("div");
    aside.className = "summary-aside";

    let imageWrap = null;
    if (summaryDisplaySettings.image) {
      imageWrap = document.createElement("div");
      imageWrap.className = "summary-image-wrap";

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
      imageWrap.appendChild(image);
    }

    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.className = "secondary-button summary-export";
    exportButton.textContent = t("exportImage");
    exportButton.addEventListener("click", () => {
      exportSummaryImage(summary, item);
    });

    if (imageWrap) {
      aside.append(imageWrap);
    }
    aside.append(exportButton);
    item.append(watermark, content, aside);
    summaryList.appendChild(item);
  });
};

const renderSelectedStickers = (stickers) => {
  if (!selectedStickersList) {
    return;
  }
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
    label.textContent = sticker.name;
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
  if (!selectedKeychainsList) {
    return;
  }
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
    label.textContent = keychain.name;
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
let skinsData = [];
let skinCollectionsData = [];
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
    button.textContent = sticker.name;
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
  selectedStickerCollection = collection;
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
    button.textContent = keychain.name;
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
  selectedKeychainCollection = collection;
  keychainsData
    .filter((keychain) => keychainHasCollection(keychain, collection))
    .forEach((keychain) => {
      selectedKeychainMap.set(keychain.def_index, keychain);
    });
  renderSelectedKeychains([...selectedKeychainMap.values()]);
};

stickerSearchInput?.addEventListener("input", updateStickerSuggestions);
collectionSearchInput?.addEventListener("input", updateCollectionSuggestions);
keychainSearchInput?.addEventListener("input", updateKeychainSuggestions);
keychainCollectionSearchInput?.addEventListener(
  "input",
  updateKeychainCollectionSuggestions
);
clearStickersButton?.addEventListener("click", () => {
  selectedStickerMap.clear();
  selectedStickerCollection = null;
  renderSelectedStickers([]);
});
clearKeychainsButton?.addEventListener("click", () => {
  selectedKeychainMap.clear();
  selectedKeychainCollection = null;
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

if (downloadCollageHorizontalButton) {
  downloadCollageHorizontalButton.addEventListener("click", () => {
    exportSummaryCollageHorizontal();
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

[
  summaryShowImageCheckbox,
  summaryShowTitleCheckbox,
  summaryShowCountsCheckbox,
  summaryShowTotalCheckbox,
  summaryShowAverageCheckbox,
  summaryShowEstimateCheckbox,
  summaryShowHiddenEstimateCheckbox,
  summaryShowDateCheckbox
].forEach((checkbox) => {
  if (checkbox) {
    checkbox.addEventListener("change", updateSummaryDisplaySettings);
  }
});

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

const normalizeCollectionIdForUrl = (collectionId) =>
  collectionId.replace(/^collection-/, "").replace(/-/g, "_");

const buildCollectionUrl = (collectionId) => {
  const minValue = parseFloat(minRange.value);
  const maxValue = parseFloat(maxRange.value);
  const url = new URL("https://csfloat.com/db");
  url.searchParams.set("min", formatFloat(minValue));
  url.searchParams.set("max", formatFloat(maxValue));
  url.searchParams.set("collection", normalizeCollectionIdForUrl(collectionId));
  return url.toString();
};

const renderCollectionOptions = () => {
  if (!collectionSelect) {
    return;
  }
  collectionSelect.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = t("skinsCollectionSelectPlaceholder");
  collectionSelect.appendChild(placeholder);

  skinCollectionsData.forEach((collection) => {
    const option = document.createElement("option");
    option.value = collection.id;
    option.textContent = collection.name;
    collectionSelect.appendChild(option);
  });
};

const loadSkinsData = async () => {
  try {
    const buildUrl = (name) =>
      typeof chrome !== "undefined" && chrome.runtime?.getURL
        ? chrome.runtime.getURL(name)
        : name;
    const response = await fetch(buildUrl("skins.json"));
    const data = await response.json();
    skinsData = Array.isArray(data) ? data : [];
    const collectionMap = new Map();
    skinsData.forEach((skin) => {
      (skin.collections || []).forEach((collection) => {
        if (collection?.id && collection?.name && !collectionMap.has(collection.id)) {
          collectionMap.set(collection.id, {
            id: collection.id,
            name: collection.name
          });
        }
      });
    });
    skinCollectionsData = Array.from(collectionMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  } catch (error) {
    skinsData = [];
    skinCollectionsData = [];
  } finally {
    renderCollectionOptions();
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
  if (currentModule === "stickers-charms") {
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
    isDownloadingHorizontalCollage = false;
    progressTotal = selectedItems.length;
    estimatedLinksTotal = countTotalLinks(selectedItems);
    updateProgressEstimate(estimatedLinksTotal);
    updateProgress(0, progressTotal);
    downloadCsvButton.disabled = true;
    if (downloadImagesButton) {
      downloadImagesButton.disabled = true;
    }
    if (downloadCollageButton) {
      downloadCollageButton.disabled = true;
    }
    if (downloadCollageHorizontalButton) {
      downloadCollageHorizontalButton.disabled = true;
    }
    runBtn.disabled = true;
    stopBtn.disabled = false;
    const stopRequestedRef = { stopRequested: false };
    activeRunId = nextRunId();
    stopBtn.onclick = async () => {
      stopRequestedRef.stopRequested = true;
      stopBtn.disabled = true;
      setPauseState({ paused: false });
      if (activeRunId) {
        await stopCounts(activeRunId);
      }
    };
    let processed = 0;
    const runSequential = async () => {
      for (const entry of selectedItems) {
        if (stopRequestedRef.stopRequested) {
          break;
        }
        await waitForResumeIfPaused();
        if (stopRequestedRef.stopRequested) {
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

          const response = stopRequestedRef.stopRequested
            ? null
            : await requestCounts(
                urls.map((u) => u.url),
                activeRunId
              );

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

          const summaryItem = createStickerSummaryItem(sticker, results);
          if (summaryItem) {
            summaryItems.push(summaryItem);
          }
        } else {
          const keychain = entry.data;
          const url = buildKeychainUrl(keychain.def_index);

          if (generatedLink.textContent === "—") {
            generatedLink.href = url;
            generatedLink.textContent = url;
          }

          renderKeychainResults(keychain, { url, found: null, loading: true });

          const response = stopRequestedRef.stopRequested
            ? null
            : await requestCounts([url], activeRunId);

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

          const summaryItem = createKeychainSummaryItem(keychain, result);
          if (summaryItem) {
            summaryItems.push(summaryItem);
          }
        }

        processed += 1;
        updateProgress(processed, progressTotal);
      }

      if (!stopRequestedRef.stopRequested && retryFailedCheckbox?.checked) {
        await retryFailedItems(selectedItems, stopRequestedRef);
      }
    };

    runSequential().finally(() => {
      runBtn.disabled = false;
      stopBtn.disabled = true;
      activeRunId = null;
      refreshSummaryDisplay();
    });
    return;
  }

  const selectedCollectionId = collectionSelect?.value || "";
  if (!selectedCollectionId) {
    alert(t("alertSelect"));
    return;
  }

  const selectedCollection = skinCollectionsData.find(
    (collection) => collection.id === selectedCollectionId
  );
  if (!selectedCollection) {
    alert(t("alertSelect"));
    return;
  }

  const url = buildCollectionUrl(selectedCollection.id);

  resultsList.innerHTML = "";
  summaryList.innerHTML = "";
  generatedLink.href = url;
  generatedLink.textContent = url;
  summaryItems = [];
  progressTotal = 1;
  estimatedLinksTotal = 1;
  updateProgressEstimate(estimatedLinksTotal);
  updateProgress(0, progressTotal);
  runBtn.disabled = true;
  stopBtn.disabled = false;

  const block = document.createElement("div");
  block.className = "sticker-block";
  const title = document.createElement("h3");
  title.textContent = selectedCollection.name;
  const resultLine = document.createElement("div");
  resultLine.className = "result-meta";
  resultLine.textContent = t("waiting");
  block.append(title, resultLine);
  resultsList.appendChild(block);

  const stopRequestedRef = { stopRequested: false };
  activeRunId = nextRunId();
  stopBtn.onclick = async () => {
    stopRequestedRef.stopRequested = true;
    stopBtn.disabled = true;
    if (activeRunId) {
      await stopCounts(activeRunId);
    }
  };

  requestCounts([url], activeRunId)
    .then((response) => {
      if (stopRequestedRef.stopRequested) {
        return;
      }
      const countValue = response?.results?.[0]?.count ?? t("notFound");
      resultLine.textContent = `${t("resultsLabel")} ${countValue}`;
      updateProgress(1, 1);
    })
    .catch(() => {
      resultLine.textContent = t("notFound");
      updateProgress(1, 1);
    })
    .finally(() => {
      runBtn.disabled = false;
      stopBtn.disabled = true;
      activeRunId = null;
    });
});

moduleSwitchButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveModule(button.dataset.module);
  });
});

syncInputs(0, 1);
initCardToggles();
loadStickerData();
loadKeychainData();
loadSkinsData();
currentTheme = localStorage.getItem("csfloat-theme") || getPreferredTheme();
setTheme(currentTheme);
applyTranslations();
