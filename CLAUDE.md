# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

GitHub Pages site for Blue Variable Studio, served at `bluevariablestudio.com` (CNAME) from the `main` branch. It is a Jekyll site built by GitHub Pages itself: no local build step is required to deploy, and there are no runtime dependencies (no CDNs, no frameworks, no JS libraries). The design source is the Canva file "Blue Variable" (pages 1–9, 1366×768 artboards).

## Structure

- `_config.yml` — site title, description, all external links (`links.*`, `wishlist_url`, `presskit_url`), post permalinks and defaults.
- `_layouts/default.html` — page shell (head, splash, icon sprite, nav, main, footer, script). `_layouts/post.html` — devlog post page.
- `_includes/` — `head.html`, `nav.html` (sticky header + mobile menu), `footer.html` (newsletter placeholder + socials), `socials.html`, `splash.html`, `icons.html` (generated SVG sprite: steam, discord, itch, x, instagram, youtube, reddit, arrow, play).
- Pages: `index.html` (home, `nav: home`, `splash: true`), `games.html`, `news.html`, `about.html`, `contact.html` (press kit lives under `#presskit`). Each sets `nav:` for the active link and `permalink:`.
- `_posts/` — devlogs rendered on the News timeline. Front matter: `title`, `date`, `game`, optional `steam` (wishlist URL), `video` (YouTube URL), `image`, `tags`.
- `assets/css/site.css` — all styles. `assets/js/site.js` — all behaviour (compact header, tagline ticker, mobile menu, newsletter placeholder, side-label highlighting, devlog expand, first-visit splash).
- `assets/fonts/` — self-hosted fonts: Darumadrop One, Londrina Solid 300/400/900, Urbanist 700/800/900, Glacial Indifference Regular/Bold (OFL).
- `assets/img/` — optimized artwork extracted from the Canva export (key art, torn edges, team illustrations, arrows, brackets, brush, paw, speech bubble, logos, background texture).
- `assets/blue_logo*.svg` — logo SVGs authored by the studio: `blue_logo.svg` (wordmark), `blue_logo_reveal.svg` (splash intro), `blue_logo_scale.svg` (dot pop), `blue_logo_float.svg` (idle float, used on About).

## Conventions

- Brand colors: ink `#1e1d1d`, paper `#f7f3ed`, cream text `#f5f3ef`, blue `#558eff`, yellow `#f5cb49`. Page backgrounds use `.paper` (cream + multiplied texture) so artwork blends.
- Desktop layout scales like the artboard: sizes are written as `calc(N * var(--px))` where N is the pixel value measured on the 1366-wide Canva page. Below 900px `--px` is 1px and layouts stack (mobile rules live at the end of `site.css`).
- Recolorable vector art (brush, arrows, brackets, paw, bubble, timeline line) is applied with CSS `mask-image` so it takes `background-color`; the SVG files use `currentColor`.
- Keep the site dependency-free: no build tools, package managers, or external CDNs.
- `assets/Blue Variable.zip` and `assets/BLUE - Website.png` are design sources, git-ignored and excluded from the build.

## Local preview

Ruby 3.3 + MSYS2 are installed on the dev machine (`C:\Ruby33-x64`). Run:

```
bundle install            # once
bundle exec jekyll serve  # http://127.0.0.1:4000
```

The `github-pages` gem pins the same Jekyll version GitHub uses.

## Deployment

Pushing to `main` publishes the site via GitHub Pages. There are no tests.
