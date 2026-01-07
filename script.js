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
const rarityCheckboxes = Array.from(
  document.querySelectorAll('input[name="rarity"]')
);
const selectedStickersList = document.getElementById("selected-stickers");
const clearStickersButton = document.getElementById("clear-stickers");
const runBtn = document.getElementById("run-btn");
const stopBtn = document.getElementById("stop-btn");
const generatedLink = document.getElementById("generated-link");
const resultsList = document.getElementById("results-list");
const summaryList = document.getElementById("summary-list");
const progressBar = document.getElementById("progress-bar");
const progressMeta = document.getElementById("progress-meta");
const rateLimitDisplay = document.getElementById("rate-limit");
const downloadCsvButton = document.getElementById("download-csv");
const languageSelect = document.getElementById("language-select");

const translations = {
  uk: {
    title: "CSFloat DB Sticker Linker created by Kina",
    subtitle: "Згенеруйте посилання для пошуку скінів по наліпках та float.",
    language: "Мова",
    categoryTitle: "Категорія предметів",
    categoryAll: "Усі",
    categoryAria: "Категорія",
    floatTitle: "Діапазон float",
    minFloatAria: "Мінімальний float",
    maxFloatAria: "Максимальний float",
    minLabel: "Мінімум",
    maxLabel: "Максимум",
    stickersTitle: "Наліпки",
    gradeLabel: "Грейд:",
    gradeAria: "Грейд наліпок",
    gradeAll: "Усі",
    stickerSearch: "Пошук наліпки",
    stickerSearchPlaceholder: "Sticker | Fearsome",
    collectionSearch: "Пошук колекції",
    collectionSearchPlaceholder: "Sticker Capsule",
    selectedStickers: "Обрані наліпки:",
    clearAll: "Видалити всі",
    run: "Run",
    stop: "Stop",
    progressLabel: "Прогрес обробки:",
    generatedLink: "Згенероване посилання:",
    resultsLabel: "Посилання та кількість:",
    summaryLabel: "Збережений підсумок:",
    downloadCsv: "Завантажити CSV",
    exportImage: "Експорт картинки",
    exportTitle: "CS2 STICKER HIGHLIGHT",
    exportTotalLabel: "ЗАГАЛЬНО ПОКЛЕЄНО",
    resultsTitle: "Результати",
    waiting: "Очікування...",
    notFound: "Не знайдено",
    totalStickersLabel: "Загальна кількість поклеєних стікерів:",
    summaryEmpty: "Підсумок буде доступний після запуску.",
    selectedEmpty: "Наліпки не обрані.",
    remove: "Видалити",
    alertSelect: "Оберіть хоча б одну наліпку.",
    summaryCountsLabel: "1х: {c1}, 2х: {c2}, 3х: {c3}, 4х: {c4}, 5х: {c5}",
    summaryTotalLabel: "Сумарна кількість поклеєних: {total}",
    summaryDateLabel: "Дата: {date}",
    progressMeta: "{current} / {total}",
    rateLimitLabel: "Лишилось запитів:",
    downloadCsvName: "sticker-summary.csv",
    csvStickerHeader: "Наліпка"
  },
  en: {
    title: "CSFloat DB Sticker Linker created by Kina",
    subtitle: "Generate links to search skins by stickers and float range.",
    language: "Language",
    categoryTitle: "Item category",
    categoryAll: "All",
    categoryAria: "Category",
    floatTitle: "Float range",
    minFloatAria: "Minimum float",
    maxFloatAria: "Maximum float",
    minLabel: "Minimum",
    maxLabel: "Maximum",
    stickersTitle: "Stickers",
    gradeLabel: "Grade:",
    gradeAria: "Sticker grade",
    gradeAll: "All",
    stickerSearch: "Sticker search",
    stickerSearchPlaceholder: "Sticker | Fearsome",
    collectionSearch: "Collection search",
    collectionSearchPlaceholder: "Sticker Capsule",
    selectedStickers: "Selected stickers:",
    clearAll: "Clear all",
    run: "Run",
    stop: "Stop",
    progressLabel: "Processing progress:",
    generatedLink: "Generated link:",
    resultsLabel: "Links and count:",
    summaryLabel: "Saved summary:",
    downloadCsv: "Download CSV",
    exportImage: "Export image",
    exportTitle: "CS2 STICKER HIGHLIGHT",
    exportTotalLabel: "TOTAL POOLS",
    resultsTitle: "Results",
    waiting: "Waiting...",
    notFound: "Not found",
    totalStickersLabel: "Total applied stickers:",
    summaryEmpty: "Summary will be available after running.",
    selectedEmpty: "No stickers selected.",
    remove: "Remove",
    alertSelect: "Select at least one sticker.",
    summaryCountsLabel: "1x: {c1}, 2x: {c2}, 3x: {c3}, 4x: {c4}, 5x: {c5}",
    summaryTotalLabel: "Total applied: {total}",
    summaryDateLabel: "Date: {date}",
    progressMeta: "{current} / {total}",
    rateLimitLabel: "Requests left:",
    downloadCsvName: "sticker-summary.csv",
    csvStickerHeader: "Sticker"
  }
};

let currentLanguage = "uk";
let summaryItems = [];
let progressTotal = 0;
let isPaused = false;
let resumeTimerId = null;
let pausePromise = null;
let pausePromiseResolve = null;
let lastRateLimitPayload = null;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatFloat = (value) => Number(value).toFixed(6);

const t = (key) => translations[currentLanguage]?.[key] ?? key;

const formatLocaleNumber = (value) =>
  Number(value).toLocaleString(currentLanguage === "uk" ? "uk-UA" : "en-US");

const formatCountLabel = (count) =>
  currentLanguage === "uk" ? `${count} наліпки` : `${count} stickers`;

const formatLocaleDate = (value) =>
  new Date(value).toLocaleString(currentLanguage === "uk" ? "uk-UA" : "en-US");

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
  renderSummary(summaryItems);
  if (lastRateLimitPayload) {
    updateRateLimitDisplay(lastRateLimitPayload);
  }
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
    formatLocaleDate(item.date)
  ]);
  return [headers, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
};

const sanitizeFileName = (value) =>
  String(value).replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");

const loadImage = (url) =>
  new Promise((resolve) => {
    if (!url) {
      resolve(null);
      return;
    }
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = url;
  });

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const drawWrappedText = (ctx, text, x, y, maxWidth, lineHeight) => {
  const words = String(text).split(" ");
  let line = "";
  let currentY = y;
  words.forEach((word, index) => {
    const testLine = line ? `${line} ${word}` : word;
    const { width } = ctx.measureText(testLine);
    if (width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
    if (index === words.length - 1) {
      ctx.fillText(line, x, currentY);
    }
  });
  return currentY;
};

const exportSummaryImage = async (summary) => {
  const size = 900;
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  ctx.scale(scale, scale);

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, "#0b0a1d");
  gradient.addColorStop(0.5, "#1b1035");
  gradient.addColorStop(1, "#0d0a22");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 60; i += 1) {
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.arc(
      Math.random() * size,
      Math.random() * size,
      Math.random() * 2 + 1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  const panelPadding = 36;
  const panelX = panelPadding;
  const panelY = panelPadding;
  const panelSize = size - panelPadding * 2;
  drawRoundedRect(ctx, panelX, panelY, panelSize, panelSize, 32);
  ctx.fillStyle = "rgba(10, 13, 30, 0.75)";
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "600 20px Inter, sans-serif";
  ctx.fillText(t("exportTitle"), size / 2, panelY + 48);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 36px Inter, sans-serif";
  const titleMaxWidth = panelSize - 120;
  const titleY = panelY + 100;
  drawWrappedText(ctx, summary.title || summary.name, size / 2, titleY, titleMaxWidth, 42);

  const image = await loadImage(summary.image);
  if (image) {
    const imageSize = 260;
    const imageX = size / 2 - imageSize / 2;
    const imageY = panelY + 170;
    ctx.shadowColor = "rgba(255, 255, 255, 0.2)";
    ctx.shadowBlur = 20;
    ctx.drawImage(image, imageX, imageY, imageSize, imageSize);
    ctx.shadowBlur = 0;
  }

  const counts = summary.pureCounts || [];
  const countX = panelX + 80;
  const countY = panelY + 470;
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 32px Inter, sans-serif";
  ctx.fillText(
    `1 / ${formatLocaleNumber(counts[0] || 0)}`,
    countX,
    countY
  );
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.font = "600 20px Inter, sans-serif";
  ctx.fillText(
    `2 / ${formatLocaleNumber(counts[1] || 0)} - 3 / ${formatLocaleNumber(
      counts[2] || 0
    )}`,
    countX,
    countY + 36
  );
  ctx.fillText(
    `4 / ${formatLocaleNumber(counts[3] || 0)} - 5 / ${formatLocaleNumber(
      counts[4] || 0
    )}`,
    countX,
    countY + 66
  );

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  ctx.font = "600 18px Inter, sans-serif";
  ctx.fillText(t("exportTotalLabel"), panelX + panelSize - 80, countY);

  ctx.fillStyle = "#facc15";
  ctx.font = "800 48px Inter, sans-serif";
  ctx.fillText(formatLocaleNumber(summary.total), panelX + panelSize - 80, countY + 52);

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "500 18px Inter, sans-serif";
  ctx.fillText(
    formatLocaleDate(summary.date),
    size / 2,
    panelY + panelSize - 32
  );

  const link = document.createElement("a");
  const fileBase = summary.title || summary.name || "sticker-summary";
  link.download = `${sanitizeFileName(fileBase)}.png`;
  link.href = canvas.toDataURL("image/png");
  document.body.appendChild(link);
  link.click();
  link.remove();
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

const buildUrl = (stickerId, count) => {
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

const parseItemsFoundCount = (text) => {
  if (!text) {
    return null;
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
    countLabel.textContent = formatCountLabel(item.count);
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

  resultsList.appendChild(block);
};

const renderSummary = (summaryItems) => {
  summaryList.innerHTML = "";
  downloadCsvButton.disabled = summaryItems.length === 0;
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
    counts.textContent = t("summaryCountsLabel")
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

    const date = document.createElement("div");
    date.textContent = t("summaryDateLabel").replace(
      "{date}",
      formatLocaleDate(summary.date)
    );

    content.append(title, counts, total, date);

    const aside = document.createElement("div");
    aside.className = "summary-aside";

    const image = document.createElement("img");
    image.className = "summary-image";
    image.alt = summary.title || summary.name;
    if (summary.image) {
      image.src = summary.image;
    } else {
      image.classList.add("is-empty");
    }

    const exportButton = document.createElement("button");
    exportButton.type = "button";
    exportButton.className = "secondary-button summary-export";
    exportButton.textContent = t("exportImage");
    exportButton.addEventListener("click", () => {
      exportSummaryImage(summary);
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

let stickersData = [];
let collectionsData = [];
const selectedStickerMap = new Map();

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

stickerSearchInput.addEventListener("input", updateStickerSuggestions);
collectionSearchInput.addEventListener("input", updateCollectionSuggestions);
clearStickersButton.addEventListener("click", () => {
  selectedStickerMap.clear();
  renderSelectedStickers([]);
});

downloadCsvButton.addEventListener("click", () => {
  if (summaryItems.length === 0) {
    return;
  }
  const csv = buildCsv(summaryItems);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = t("downloadCsvName");
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
});

languageSelect.addEventListener("change", (event) => {
  currentLanguage = event.target.value;
  applyTranslations();
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

runBtn.addEventListener("click", () => {
  const selectedStickers = [...selectedStickerMap.values()];
  if (selectedStickers.length === 0) {
    alert(t("alertSelect"));
    return;
  }

  resultsList.innerHTML = "";
  summaryList.innerHTML = "";
  generatedLink.href = "#";
  generatedLink.textContent = "—";
  summaryItems = [];
  progressTotal = selectedStickers.length;
  updateProgress(0, progressTotal);
  downloadCsvButton.disabled = true;
  runBtn.disabled = true;
  stopBtn.disabled = false;
  let stopRequested = false;
  stopBtn.onclick = () => {
    stopRequested = true;
    stopBtn.disabled = true;
  };
  let processed = 0;
  const runSequential = async () => {
    for (const sticker of selectedStickers) {
      if (stopRequested) {
        break;
      }
      await waitForResumeIfPaused();
      if (stopRequested) {
        break;
      }
      const urls = [1, 2, 3, 4, 5].map((count) => ({
        count,
        url: buildUrl(sticker.def_index, count)
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
        summaryItems.push({
          name: `${sticker.name} (${sticker.def_index})`,
          title: sticker.name,
          defIndex: sticker.def_index,
          image: sticker.image,
          pureCounts: totals.pureCounts.map((value, index) => value * (index + 1)),
          total: totals.total,
          date: new Date().toISOString()
        });
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
  });
});

syncInputs(0, 1);
initCardToggles();
loadStickerData();
applyTranslations();
