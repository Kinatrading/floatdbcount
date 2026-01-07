# floatdbcount

CSFloat DB Sticker Linker created by Kina.

## What it does
This Chrome extension helps generate CSFloat DB search links and counts sticker matches:
- Search stickers by name, collection, or ID.
- Filter by rarity grades.
- Run sequential counts for 1–5 stickers and see per-sticker summaries.

## Installation
1. Open Chrome and go to `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this repository folder.
4. Make sure `stickers_clean.json` is present in the root of the repo.

## Usage
1. Click the extension icon to open the UI in a new tab.
2. Search for a sticker or collection and add one or more stickers.
3. Adjust float range and category filters if needed.
4. Click **Run** to generate links and collect counts.
5. Use **Stop** to cancel an active run.
6. Review results and the summary block at the bottom.

## Data file
The extension expects a `stickers_clean.json` file in the repository root with entries like:
```json
{
  "id": "sticker-19",
  "name": "Sticker | Fearsome",
  "def_index": "19",
  "rarity": { "name": "High Grade" },
  "crates": [{ "id": "crate-4007", "name": "Sticker Capsule" }],
  "collections": [{ "name": "Elemental Craft Sticker Pack" }]
}
```

## Disclaimer
The code is provided **as-is** without any warranties or guarantees.
