# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is the GitHub Pages site for Blue Variable Studio, served at `bluevariablestudio.com` (see `CNAME`). It is a static site with no build step, no dependencies, and no framework — plain HTML/CSS/vanilla JS deployed directly by GitHub Pages from the `main` branch.

## Structure

- `index.html` — the homepage, a fixed-viewport shell (no page scrolling): header menu, one active view, footer. The menu switches views via hash routing (`#studio` default, `#purrfect-fit`, `#contact`); Devlogs links out to `devlogs.html`. Opens with the signature intro: the inlined wordmark-reveal SVG animation plays, then a blue dot floods the screen (adapted from the `blue_dot_scale` icon animation) and unveils the page. The two large SVGs are inlined directly in the file.
- `devlogs.html` — devlog list + post reader. Uses hash routing (`#/slug`) so individual posts are linkable.
- `press.html` — public press kit: factsheet, boilerplate, brand asset downloads, press contact.
- `devlogs/index.json` — post manifest: array of `{slug, title, date, summary}`, newest first.
- `devlogs/<slug>.md` — devlog posts, plain markdown, rendered client-side.
- `assets/css/style.css` — shared styles; design tokens live in `:root`.
- `assets/js/main.js` — intro sequence (sessionStorage-gated, click-to-skip, reduced-motion aware) + homepage view switching.
- `assets/js/markdown.js` — small hand-rolled markdown renderer (`window.BVSMarkdown.render`).
- `assets/js/devlogs.js` — devlog manifest fetch + hash routing.
- `assets/svg/reveal.svg`, `assets/svg/icon.svg` — source copies of the brand animation SVGs (the live pages use inlined, lightly adapted copies).
- `assets/logo.gif` — the animated brand logo (legacy asset, kept).

## Adding a devlog post

1. Add `devlogs/<slug>.md` (slug convention: `YYYY-MM-DD-title-words`). First line should be an `# H1` title.
2. Prepend an entry to `devlogs/index.json`: `{"slug", "title", "date" (YYYY-MM-DD), "summary"}`.

Nothing else — both the devlogs page and the homepage teaser read the manifest.

## Conventions

- Keep the site dependency-free: no build tools, package managers, or external CDNs unless explicitly requested.
- Brand palette: background `#F3EFE8`, ink `#1e1c1c`, blue `#558eff` (tokens in `style.css` `:root`).
- Static assets go in `assets/`.
- The intro must stay skippable (click/key), play once per session (`sessionStorage.bvsIntroSeen`), and never show under `prefers-reduced-motion`.

## Deployment

Pushing to `main` publishes the site via GitHub Pages. There are no tests or build commands; verify by serving the repo root (`python3 -m http.server`) and loading both pages — `fetch()` of devlog files requires http, not `file://`.
