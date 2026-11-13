# Kerangka Pemerkasaan SKUAD Antidadah Berasaskan Komuniti — interactive dashboard

**Live:** https://soonjanjan-lang.github.io/AADK-Framework-Dashboard/

An interactive, bilingual (Bahasa Malaysia / English) companion to a research proposal submitted under the GPI AADK 2027 call (Bidang 5, Skop 6). It presents the proposed *Community-Based SKUAD Antidadah Empowerment Framework*:

1. **Indikator Keberkesanan Program** (Programme Effectiveness Indicators): the 15-indicator SKUAD Scorecard, filterable by district, year and level, with a trend chart for each indicator.
2. **Mekanisme Penglibatan Komuniti** (Community Engagement Mechanism): the engagement ladder, channels, partners and ways to keep volunteers.
3. **Model Sokongan Komuniti** (Community Support Model): three tiers of support and the five-step support pathway.

It also covers the cross-cutting enablers, the evidence base and a value-for-money calculator.

> **Important.** This is a *proposed* framework. **All numbers are synthetic** (randomly generated for illustration), and district codes such as `KDH-03` do not refer to real places. This is **not an official AADK website or product**.

## Structure

| Path | What it is |
|---|---|
| `index.html` | The page (static, no build step) |
| `assets/styles.css` | Styles (Public Sans; palette taken from the proposal's Figure 4) |
| `assets/app.js` | Rendering, filters, charts, language switch |
| `assets/data.js` | Generated: framework content, synthetic district data and BM/EN interface text |
| `assets/kerangka.json` | The framework definition (single source of truth shared with the proposal document) |

## Reusing it with real data

`assets/data.js` is generated from `kerangka.json` and a district-by-year table of the 15 indicator values. To show real AADK figures, replace that table and regenerate the file; nothing else changes.

## Accessibility

Body text is 18px and no text is smaller than 16px. The page uses WCAG AA contrast, is fully keyboard operable, works at phone width, and respects reduced-motion settings.
