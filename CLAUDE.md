# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

GitHub Pages site for Blue Variable Studio, served at `bluevariablestudio.com` (CNAME) from the `main` branch. It is a Jekyll site built by GitHub Pages itself: no local build step is required to deploy, and there are no runtime dependencies (no CDNs, no frameworks, no JS libraries). The design source is the Canva file "Blue Variable" (pages 1–9, 1366×768 artboards); local exports of it live in the git-ignored `_design/` folder.

The source files carry no comments on purpose: names are meant to explain themselves and this file holds the reasoning. When something needs explaining, add it here rather than as a comment.

## Structure

- `_config.yml` — site title, description, all external links (`links.*`, `wishlist_url`, `presskit_url`), post permalinks and defaults.
- `_layouts/default.html` — page shell (head, page-transition band, splash, icon sprite, header, main, footer, video modal, script). `_layouts/post.html` — devlog post page.
- `_includes/` — `head.html`, `header.html` (sticky header with a masked torn bottom + mobile menu; nav links carry `data-nav`), `footer.html` (newsletter placeholder + socials), `socials.html`, `splash.html` (its `data-src` points at the reveal SVG), `wishlist.html` (the brush-stroke Steam button; params `href` and optional `class`), `video-modal.html` (the `<dialog>` for YouTube embeds, rendered once per page), `icons.html` (SVG sprite: steam, discord, itch, x, instagram, youtube, reddit, arrow, play).
- Pages: `index.html` (home, `nav: home`, `splash: true`), `games.html`, `news.html`, `about.html`, `contact.html` (press kit lives under `#presskit`). Each sets `nav:` for the active link and `permalink:`.
- `_posts/` — devlogs rendered on the News timeline (newest first, expandable with "see more"). Front matter: `title`, `date`, `game`, optional `steam` (wishlist URL, shows the button), `image` + `image_alt` + `caption` ("line one|line two") for the media card, `video` (YouTube URL, enables the play button/modal), `tags`. The first paragraph is the excerpt. `future: true` is set so scheduled dates still render.
- `404.html` — branded not-found page.
- `_tools/tears.js` + `_tools/tuner.html` — generator and visual tuner for the torn-edge masks (see Conventions). Underscore-prefixed, so Jekyll does not publish them.
- `assets/css/site.css` — all handwritten styles, in this order: fonts, tokens, reset, torn edges, cursor, header, mobile menu, buttons, decorations, footer, splash, page transition, then one block per page (home, about/team, games, news/post, contact/press kit, 404) and the mobile block at the end. `assets/css/tears.css` — generated, never edited by hand.
- `assets/js/site.js` — all behaviour, one `init*` function per feature: compact header, tagline ticker, mobile menu, newsletter placeholder, devlog expand, video modal, mailto contact form, blue-band page transition (`initRouter`), the dot cursor/trail/splat (`initDot`), the tuner bridge, first-visit splash. Content behaviour (expand buttons, play buttons, contact form) is bound once on `document` by delegation, so nothing needs re-initialising after a page swap.
- Internal links do not reload the document: `initRouter` fetches the next page, swaps `<main>`, title, description, body class and the active nav link under the blue band, then drops the band (history/back-forward handled via `pushState`/`popstate`). The active link is set twice: from the URL on press (so it turns blue immediately) and from the fetched page's `page-<nav>` body class after the swap (which also covers post pages, whose URL is not a nav item).
- `assets/fonts/` — self-hosted fonts: Darumadrop One, Londrina Solid 300/400/900, Urbanist 700/800/900, Glacial Indifference Regular/Bold (OFL).
- `assets/img/brand/` — `logo.svg` (header wordmark), `logo-compact.svg` (compact header), `logo-reveal.svg` (animated intro for the splash), `mark-float.svg` (the blu.e mark with an idle float, About page), `favicon.svg`.
- `assets/img/presskit/` — the PNG logos shown on the press kit: `wordmark-white/black.png`, `mark-white/black.png`.
- `assets/img/team/` — team illustrations (`defne.svg`, `gokay.svg`, `nova.svg`).
- `assets/img/decor/` — recolourable mask art (`arrows.svg`, `brush.svg`, `bubble.svg`) and the `paper.webp` texture.
- `assets/img/purrfect-fit/` — game artwork: `keyart.webp` (home, Games, default OG image), `trailer.webp` (news media card). Any images dropped into `assets/img/purrfect-fit/screenshots/` appear automatically in the Games page grid.

## Conventions

- The cursor is the logo dot: on fine pointers `site.js` hides the native cursor (`html.has-cursor`) and moves a `.cursor` element masked with the wobbling `--tear-dot` frames (the dot path is traced from `logo-reveal.svg` and lives in the generator). It grows over links, hides over text fields, turns paper-white over brand-blue backgrounds, sheds droplets while moving (`.trail`), and every press flings a ring of droplets (`.splat`, droplets only, no core dot). Droplet counts/sizes/timings (design px) are the `DOT` object at the top of `site.js`; the cursor size is the `--cursor-size` token in `site.css`. The tuner's "Cursor & droplets" panel drives all of them live on the embedded site and prints the block to paste.
- Brand colors: ink `#1e1d1d`, paper `#f7f3ed`, cream text `#f5f3ef`, blue `#558eff`, yellow `#f5cb49`. Page backgrounds use `.paper` (cream + multiplied texture) so artwork blends.
- Desktop layout scales like the artboard: sizes are written as `calc(N * var(--px))` where N is the pixel value measured on the 1366-wide Canva page. `--px` is the 1366×768 artboard fitted to the viewport (width or height, whichever binds, no upper cap: a 4K screen gets the design at about 2.8×, floor 0.72px), so borders, the cursor and the droplets are in design px too. About, Team, Contact and Press kit are at least `--section-min-h` (80vh) tall with their content centred, so tall screens scroll one section at a time. Below 900px `--px` is 1px and layouts stack (mobile rules live at the end of `site.css`).
- Recolorable vector art (`assets/img/decor/`) is applied with CSS `mask-image` so it takes `background-color`; the SVG files use `currentColor`. The News timeline line, the About divider and the tagline brackets are generated the same way as the torn edges (`--tear-line`, `--tear-bl`, `--tear-br`, see below) and boil with them.
- Torn paper edges are generated, not images. `assets/css/tears.css` holds the 24 `--tear-*` frame variables (SVG data-URI masks: gradient + `feTurbulence` speckle, hard-thresholded; `b`/`t`/`l`/`r` edges, `line`, `bl`/`br` brackets and `dot`, three frames each with the same speckle and a different low-frequency displacement). It is the output of `node _tools/tears.js > assets/css/tears.css`, and the recipe is the `DEFAULTS` object in that script. To change the look, open `_tools/tuner.html` in a browser (presets, sliders, live boil preview), press Copy and save the block as `tears.css`, then mirror the printed recipe into `DEFAULTS` so the script and the file agree. While `jekyll serve` runs, the tuner also embeds the live site and pushes the frames into it as you drag (a localhost-only `message` listener, `initTunerBridge` in `site.js`; browsers resolve `var()` inside `@keyframes` only when the animation starts, so the bridge restarts the boil).
- Tear geometry lives in three `site.css` tokens: `--tear-band` (height of the mask band, 45 design px), `--tear-depth-b` (how much of the band shows on a torn bottom, 10) and `--tear-depth-t` (22 on a torn top); the mobile block only overrides the tokens (30/7/15). `.torn-bottom` sections (and the header bar and the Games wrapper, which share the rule) are masked with the solid area plus the `--tear-b` band (`mask-size: 100% <band>`, no repeat so there are no seams) and the next block is pulled up under them; `.torn-top` sections, the news bands and the page-transition band use `--tear-t` (the band sets `--tear-depth-t` to the bottom depth so its tear is as shallow as the header's); the Games panel adds `--tear-l`/`--tear-r`. A `steps(1)` animation on `:root` cycles `--tear-*` through the three frames for a subtle line boil; the reduced-motion rule stops it on frame 1.
- Keep the site dependency-free: no build tools, package managers, or external CDNs.

## Local preview

Ruby 3.3 + MSYS2 are installed on the dev machine (`C:\Ruby33-x64`). Run:

```
bundle install            # once
bundle exec jekyll serve  # http://127.0.0.1:4000
```

The `github-pages` gem pins the same Jekyll version GitHub uses.

## Deployment

Pushing to `main` publishes the site via GitHub Pages. There are no tests.
