# Personal Website 2

An improved portfolio for **Shamir Khan**, built as a separate project from the original `Personal Website` folder. Same content and brand; refined Apple-style design system, accessibility, and interactions.

## What's different from v1

- **Spec-aligned tokens** — Action Blue `#0066cc`, focus `#0071e3`, sky link on dark `#2997ff`, parchment `#f5f5f7`
- **44px global nav** with frosted glass and visible **active section** indicator
- **80px section rhythm** (Apple `spacing.section`) instead of 120px
- **Cards use hairline borders** — no heavy box shadows on UI chrome; product shadow only on hero graphic
- **Scroll reveals** with `prefers-reduced-motion` support
- **Semantic HTML** — `dl` metrics, `article`, skip link, ARIA on filters and form
- **Breakpoints** at 1068px, 834px, 640px, 419px (closer to Apple.com)

## Run locally

Open `index.html` in a browser, or:

```bash
npx serve .
```

## Structure

```
Personal Website 2/
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── hero_tech_graphic.png
│   └── Shamir_Khan_SER.pdf
└── README.md
```

## Deploy

Static site — deploy the folder to GitHub Pages, Netlify, or Vercel. No build step required.

## Original site

The first version remains untouched at:

`../Personal Website/`
