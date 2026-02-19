import { computePureCounts } from "./stickers/charms.js";

export const computeTotalSkins = (items) => {
  const pureCounts = computePureCounts(items);
  if (!pureCounts) {
    return null;
  }
  return pureCounts.reduce((sum, value) => sum + value, 0);
};

export const computeAverageStickersPerSkin = (items) => {
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
