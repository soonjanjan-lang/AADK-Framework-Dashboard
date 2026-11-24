# SKUAD Antidadah: data, evidence and framework

**Live:** https://soonjanjan-lang.github.io/AADK-Framework-Dashboard/

An illustrative companion to a GPI AADK 2027 research proposal (Bidang 5, Skop 6). On one page it shows:

1. **The data.** Five de-identified record sets that AADK already keeps, shaped like the proposal's Table 4. A downloadable workbook includes a data dictionary.
2. **RDD diagrams.** Interactive regression discontinuity charts comparing clients who entered just before and just after their local SKUAD unit started. The default view reproduces Figure 2 of the proposal.
3. **The framework.** The proposed *Community-Based SKUAD Antidadah Empowerment Framework* (*Kerangka Pemerkasaan SKUAD Antidadah Berasaskan Komuniti*), with:
   - programme effectiveness indicators,
   - a community engagement mechanism,
   - a community support model.

> **Important.** All numbers are **synthetic**: made up for illustration with a fixed random seed. District and locality codes such as `KDH-03` or `KDH-03-M07` are not real places. This is **not an official AADK website or product**.

## Files

| Path | What it is |
|---|---|
| `index.html` | The page (static, no build step) |
| `assets/styles.css` | Styles |
| `assets/app.js` | Charts, dataset browser, framework, navigation |
| `assets/data.js` | Generated data: datasets, RDD estimates, framework |
| `assets/qr.svg` | QR code for this page |
| `data/SKUAD_illustrative_dataset.xlsx` | The illustrative dataset (Excel), with a data dictionary and formulas |
| `data/csv/` | The five datasets as CSV files |

## Accessibility

- Body text is 18px, and no text is smaller than 16px.
- The page is keyboard operable, works at phone width and respects reduced-motion settings.
- Every chart has a table view.
