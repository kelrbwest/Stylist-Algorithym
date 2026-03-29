# Fitme Stylist Tool — CLAUDE.md

## Project Overview

**Fitme** is a React web app used exclusively by Intimo stylists to identify the best-fitting bra styles for a customer. The stylist enters the customer's measurements and physical attributes; the app returns the top 3 NPS-scored bra styles per capsule category.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (JSX) |
| Build tool | Vite 8 |
| Styling | Plain CSS (no UI library) |
| Data | Local JSON (`src/data/styles.json`) |
| Package manager | npm |

---

## Directory Structure

```
07 Fitme Algorithym/              ← project root (was: fitme-app/)
├── 00 Reference Documents/       ← original source data (read-only)
│   ├── Style Capsule.xlsx        # Capsule assignments used to build styles.json
│   ├── Style NPS by Segment v2.0.json  # Raw NPS data source
│   └── Style Sheets.pdf          # Product style reference sheets
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── App.jsx                   # Root component — state, routing between form & results
│   ├── App.css                   # Global app styles
│   ├── index.css                 # CSS reset / root variables
│   ├── main.jsx                  # React entry point
│   ├── assets/
│   │   └── hero.png              # Brand hero image
│   ├── components/
│   │   ├── CustomerForm.jsx      # Input form (age, band, cup, tissue, firmness)
│   │   ├── CapsuleResults.jsx    # Results view — renders one section per capsule
│   │   └── BraCard.jsx           # Single bra card — style, name, NPS, fitting notes
│   ├── data/
│   │   └── styles.json           # Master bra data — NPS scores, capsule, tissue, firmness etc.
│   └── utils/
│       └── recommend.js          # Filtering & ranking logic; CAPSULES constant
├── package.json
├── vite.config.js
└── CLAUDE.md                     # This file
```

---

## How the App Works

### 1. Stylist inputs (CustomerForm.jsx)

| Field | Type | Options |
|---|---|---|
| Customer age | Number input **or** age-group chip | Maps to groups: 25 (Under 35), 40 (35–49), 55 (50+) |
| Band size | Dropdown | 10, 12, 14, 16, 18, 20, 22, 24 |
| Cup size | Dropdown | A, B, C, D, DD, E, EE, F, FF, G |
| Breast tissue type | Chip (Firm / Medium / Soft) | |
| Breast firmness | Chip (Firm / Medium / Soft) | |

Band and cup size are captured and displayed in the results summary but are **not yet used in the filtering algorithm** (planned for a future revision once the NPS data is segmented by bra size).

### 2. Recommendation engine (recommend.js)

`getRecommendations({ ageGroup, breastTissue, bodyFirmness })`

1. Filters `styles.json` by `age_group`, `breast_tissue`, `body_firmness`.
2. Groups matching rows by `capsule`.
3. Sorts each group by `nps_score` descending.
4. Deduplicates by `style` and returns the **top 3 unique styles per capsule**.

### 3. Results display (CapsuleResults → BraCard)

Results are rendered under six capsule headings in this order:

| Capsule key (JSON) | Display label |
|---|---|
| Everyday Bras | Everyday Bras |
| Special Bras | Lace Bras |
| Strapless Bras | Strapless Bras |
| Active Bras | Active Bras |
| Cami Bras | Cami Bras |
| Lounge Bras | Lounge Bras |

Each `BraCard` shows: style number, style name, NPS score (colour-coded), and an optional collapsible **Fitting Guide** note.

---

## Data File — styles.json

Located at `src/data/styles.json`. Each entry must include these fields:

```json
{
  "style": "1234",
  "style_name": "Example Style Name",
  "capsule": "Everyday Bras",
  "age_group": 40,
  "breast_tissue": "Medium",
  "body_firmness": "Firm",
  "nps_score": 0.72,
  "fitting_notes": "Optional fitting guidance for the stylist."
}
```

### Field rules

| Field | Type | Valid values |
|---|---|---|
| `style` | string | SKU / style number |
| `style_name` | string | Display name |
| `capsule` | string | See capsule keys above |
| `age_group` | number | `25`, `40`, or `55` |
| `breast_tissue` | string | `"Firm"`, `"Medium"`, `"Soft"` |
| `body_firmness` | string | `"Firm"`, `"Medium"`, `"Soft"` |
| `nps_score` | number | `-1.0` to `1.0` (decimal) |
| `fitting_notes` | string | Optional — shown in collapsible guide |

The source data was cross-referenced with **Style Capsule.xlsx** (located at `00 Reference Documents/`) to assign the correct `capsule` value to every style.

---

## Running the App

```bash
cd "/Users/KRBWEST/Documents/00 Intimo/00 Claude Code/07 Fitme Algorithym"
npm run dev
```

Open browser at **http://localhost:5173**

Stop server: `Ctrl + C`

Build for production:

```bash
npm run build
```

---

## Planned Revisions

### Revision 1 — AWS image integration
- Add an `image_key` field to each entry in `styles.json` containing the S3 object key.
- In `BraCard.jsx`, replace the `.card-image-placeholder` div with an `<img>` tag.
- Source URL pattern: `https://<bucket>.s3.<region>.amazonaws.com/<image_key>`
- The placeholder div already exists in `BraCard.jsx` with the comment `{/* Image placeholder – AWS hook */}` ready for this change.

### Revision 2 — Band/cup size filtering
- Extend `getRecommendations()` to accept `bandSize` and `cupSize`.
- Add `band_size` and `cup_size` fields to `styles.json` entries.
- Filter data by size before ranking.

---

## Source Data Location

```
/Users/KRBWEST/Documents/00 Intimo/00 Claude Code/07 Fitme Algorithym/00 Reference Documents/
```

This folder contains the original reference files used to build and validate `styles.json`:
- **Style Capsule.xlsx** — capsule assignments per style
- **Style NPS by Segment v2.0.json** — raw NPS scores by segment
- **Style Sheets.pdf** — product style reference

---

## Notes for Claude

- **Do not** use `age` directly — always map through `mapAge()` in `recommend.js`.
- **Capsule keys** in the JSON must match exactly (case-sensitive) the keys in the `CAPSULES` array in `recommend.js`.
- `breast_tissue` and `body_firmness` values are **Title Case** (`"Firm"`, `"Medium"`, `"Soft"`), not lowercase.
- The app is **stylist-facing only** — no customer authentication is required.
- Keep the number of results per capsule capped at **3** (enforced in `recommend.js`).
