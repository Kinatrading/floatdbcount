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
const generatedLink = document.getElementById("generated-link");
const resultsList = document.getElementById("results-list");
const summaryList = document.getElementById("summary-list");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const formatFloat = (value) => Number(value).toFixed(6);

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
    countLabel.textContent = `${item.count} наліпки`;
    const valueLabel = document.createElement("span");
    if (item.loading) {
      valueLabel.textContent = "Очікування...";
    } else if (item.found === null) {
      valueLabel.textContent = "Не знайдено";
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
      ? "Загальна кількість поклеєних стікерів: —"
      : `Загальна кількість поклеєних стікерів: ${total.toLocaleString()}`;
  block.appendChild(totalLabel);

  resultsList.appendChild(block);
};

const renderSummary = (summaryItems) => {
  summaryList.innerHTML = "";
  if (summaryItems.length === 0) {
    const empty = document.createElement("div");
    empty.className = "summary-item";
    empty.textContent = "Підсумок буде доступний після запуску.";
    summaryList.appendChild(empty);
    return;
  }

  summaryItems.forEach((summary) => {
    const item = document.createElement("div");
    item.className = "summary-item";

    const title = document.createElement("strong");
    title.textContent = summary.name;

    const counts = document.createElement("div");
    counts.textContent = `1х: ${summary.pureCounts[0]}, 2х: ${summary.pureCounts[1]}, 3х: ${summary.pureCounts[2]}, 4х: ${summary.pureCounts[3]}, 5х: ${summary.pureCounts[4]}`;

    const total = document.createElement("div");
    total.textContent = `Сумарна кількість поклеєних: ${summary.total}`;

    const date = document.createElement("div");
    date.textContent = `Дата: ${summary.date}`;

    item.append(title, counts, total, date);
    summaryList.appendChild(item);
  });
};

const renderSelectedStickers = (stickers) => {
  selectedStickersList.innerHTML = "";
  if (stickers.length === 0) {
    const empty = document.createElement("li");
    empty.className = "selected-item";
    empty.textContent = "Наліпки не обрані.";
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
    remove.textContent = "Видалити";
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

const loadStickerData = async () => {
  try {
    const url =
      typeof chrome !== "undefined" && chrome.runtime?.getURL
        ? chrome.runtime.getURL("stickers_clean.json")
        : "stickers_clean.json";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to load stickers.json");
    }
    const data = await response.json();
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

runBtn.addEventListener("click", () => {
  const selectedStickers = [...selectedStickerMap.values()];
  if (selectedStickers.length === 0) {
    alert("Оберіть хоча б одну наліпку.");
    return;
  }

  resultsList.innerHTML = "";
  summaryList.innerHTML = "";
  generatedLink.href = "#";
  generatedLink.textContent = "—";
  runBtn.disabled = true;
  const summaryItems = [];
  const runSequential = async () => {
    for (const sticker of selectedStickers) {
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

      const response = await new Promise((resolve) => {
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
        continue;
      }

      const results = response.results.map((result, index) => ({
        count: index + 1,
        url: result.url,
        found: result.count,
        loading: false
      }));
      renderStickerResults(sticker, results);

      const pureCounts = computePureCounts(results);
      const total = computeTotalStickers(results);
      if (pureCounts && total !== null) {
        summaryItems.push({
          name: `${sticker.name} (${sticker.def_index})`,
          pureCounts: pureCounts.map((value) => value.toLocaleString()),
          total: total.toLocaleString(),
          date: new Date().toLocaleString()
        });
      }
    }
  };

  runSequential().finally(() => {
    runBtn.disabled = false;
    renderSummary(summaryItems);
  });
});

syncInputs(0, 1);
loadStickerData();
renderSummary([]);
