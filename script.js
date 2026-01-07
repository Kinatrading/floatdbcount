const categoryCheckboxes = Array.from(
  document.querySelectorAll('input[name="category"]')
);
const minRange = document.getElementById("min-range");
const maxRange = document.getElementById("max-range");
const minInput = document.getElementById("min-input");
const maxInput = document.getElementById("max-input");
const minDisplay = document.getElementById("min-display");
const maxDisplay = document.getElementById("max-display");
const stickerIdInput = document.getElementById("sticker-id");
const runBtn = document.getElementById("run-btn");
const generatedLink = document.getElementById("generated-link");
const resultsList = document.getElementById("results-list");

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

const renderResults = (items) => {
  resultsList.innerHTML = "";
  items.forEach((item) => {
    const listItem = document.createElement("li");
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
      valueLabel.textContent = `${item.found} Items Found`;
    }
    meta.append(countLabel, valueLabel);

    const link = document.createElement("a");
    link.href = item.url;
    link.textContent = item.url;
    link.target = "_blank";
    link.rel = "noreferrer";

    listItem.append(meta, link);
    resultsList.appendChild(listItem);
  });
};

runBtn.addEventListener("click", () => {
  const stickerId = stickerIdInput.value.trim();
  if (!stickerId) {
    alert("Вкажіть номер наліпки.");
    return;
  }

  const urls = [1, 2, 3, 4, 5].map((count) => ({
    count,
    url: buildUrl(stickerId, count)
  }));

  generatedLink.href = urls[0].url;
  generatedLink.textContent = urls[0].url;
  renderResults(urls.map((item) => ({ ...item, found: null, loading: true })));

  runBtn.disabled = true;
  chrome.runtime.sendMessage({ action: "runCounts", urls: urls.map((u) => u.url) }, (response) => {
    runBtn.disabled = false;
    if (!response?.results) {
      renderResults(urls.map((item) => ({ ...item, found: null, loading: false })));
      return;
    }

    const results = response.results.map((result, index) => ({
      count: index + 1,
      url: result.url,
      found: result.count,
      loading: false
    }));
    renderResults(results);
  });
});

syncInputs(0, 1);
