export const parseItemsFoundCount = (text) => {
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

export const computePureCounts = (items) => {
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

export const computeStickerTotals = (items) => {
  const pureCounts = computePureCounts(items);
  if (!pureCounts) {
    return null;
  }
  const total = pureCounts.reduce((sum, value, index) => sum + value * (index + 1), 0);
  return { pureCounts, total };
};

export const computeKeychainTotals = (item) => {
  const count = parseItemsFoundCount(item.found);
  if (count === null) {
    return null;
  }
  return {
    pureCounts: [count, 0, 0, 0, 0],
    total: count
  };
};
