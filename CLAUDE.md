# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a GitHub Pages personal website repository (`bluevariable.github.io`). It deploys automatically to GitHub Pages on every push to `main`.

## Deployment

No build step — the entire repository root is deployed as-is via `.github/workflows/static.yml`. To deploy, push to `main`.

The site URL corresponds to the GitHub Pages URL for the BlueVariable account.

## Structure

```
/
├── index.html            ← Studio home (hero, game card, footer)
├── purrfect-fit.html     ← Game landing page
├── about.html            ← About the team
├── css/
│   └── style.css         ← Shared styles (design tokens, nav, layout, components)
├── assets/
│   └── logo.png          ← Studio logo (349×217px)
└── .github/workflows/
    └── static.yml        ← GitHub Actions deployment to GitHub Pages
```

## Development Notes

Since there is no build tooling, editing files and pushing to `main` is sufficient to publish changes. There is no local dev server configured — open `index.html` directly in a browser to preview locally.
