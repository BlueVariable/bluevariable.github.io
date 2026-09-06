# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences carry equal weight; neither is a footnote on any page.

- **Players.** People who like cosy, cat-shaped puzzle games, arriving from a social post, a trailer, a Steam search or a devlog link. Their job: understand what Purrfect Fit is in seconds, wishlist it once a store page exists, and have an easy way to keep following (news, Discord).
- **Press and content creators.** Journalists, curators, streamers and YouTubers deciding whether to cover the game. Their job: get the facts sheet, logos, key art and trailer without asking, and find a person to email.

Secondary, confirmed by the site's own copy: collaborators (the studio is actively looking for a music composer), players reporting bugs or sending feedback, and supporters, including Turkish-speaking ones (the Contact page closes its list of reasons with "destek için^^").

## Product Purpose

The public home of Blue Variable Studio, a two-person independent game studio in Ankara, Turkey, founded in 2026 and working on its debut game, Purrfect Fit. The site introduces the studio and the game, collects Steam wishlists, hands press everything they need, and publishes devlogs as the game is made.

Success is measured equally in wishlists and in coverage, with a community that follows the making of the game as the long-term outcome.

## Positioning

The makers are the brand. Two named people (and Nova) building their first game, in their own voice, on a site they designed and built themselves with no frameworks, dependencies or third-party services. A visitor should leave remembering the studio's personality as clearly as the game's premise. Studio motto, binding: "Games we'd love to play, crafted into existence."

## Operating Context

- Jekyll site built by GitHub Pages from `main`, served at `bluevariablestudio.com`. No local build step to deploy; `bundle exec jekyll serve` for preview. Work currently happens on the `feature/website` branch.
- Content workflow: a devlog is a Markdown file in `_posts/` with `title`, `date`, `game`, optional `steam`, `image`/`image_alt`/`caption`, `video` (YouTube) and `tags`; the first paragraph is the excerpt. Screenshots dropped into `assets/img/purrfect-fit/screenshots/` appear on the Games page automatically. An RSS feed (`/feed.xml`) and sitemap are generated.
- Design source of truth for the site is the Canva file "Blue Variable" (pages 1–9, 1366×768 artboards); exports live in the git-ignored `_design/` folder. Visual tokens and conventions are recorded in `CLAUDE.md`, not here.
- Channels the studio intends to run: Steam, itch.io, Discord, X, Instagram, YouTube, Reddit, plus email at `info@bluevariablestudio.com`. None of the linked accounts exist yet (see Evidence on Hand).
- Contact is a `mailto:` form and a direct address; there is no backend. The newsletter box tells the visitor it is coming and points at Discord.

## Capabilities and Constraints

- Pages: Home (key art, wishlist, latest-news teaser), Games (Purrfect Fit), News (timeline of expandable devlogs with an optional media card and video modal), About (studio and team), Contact (form, reasons to write, Discord, press kit with facts sheet and logos), post pages with older/newer links, and a branded 404.
- Dependency-free by rule: no build tools, package managers, frameworks or CDNs. Everything is handwritten HTML, CSS and JS plus self-hosted fonts. Keep it cheap to run and easy for two people to update.
- Site language is English (`lang: en`); the occasional Turkish aside is voice, not localisation. A Turkish version is not planned or ruled out (undecided).
- Purrfect Fit, confirmed: the title; the premise (at Purrfect Fit, Inc. you "fit" cats into shipping boxes and ship them to their new owners, buy treats, plan every fit, and try to be the best employee the company has ever seen; "Plan-Fit-Repeat"); status "coming soon". A demo is mentioned in the copy as intended.
- Purrfect Fit, undecided and not to be stated as fact: storefronts (Steam is the intended first one, but no store page exists), platforms, release window, demo date, price. "Coming soon" is the entire release promise until the studio changes it.
- Undecided elsewhere: newsletter provider, press kit zip contents, whether coverage is tracked anywhere.
- Terminology: "wishlist now" is the call to action; "devlog" for posts; "Purrfect Fit, Inc." is the in-game company; "purr-fect" is the game's pun and stays spelled that way; the studio mark reads "blu.e" and its dot recurs as the site's punctuation (nav full stop, cursor, timeline dots). The press kit lists the developer as "Blue Variable"; the repo is called BLUE inside the team.

## Brand Commitments

- Name: Blue Variable Studio (short form Blue Variable). Location Ankara, Turkey. Founded 2026. Team: Defne Tunçer ("Netrunner, Wanderer"), Gökay Atay ("Firefly, Transistor") and Nova ("Bringer of Chaos", the studio's three-year-old companion).
- Tagline, used verbatim in the header ticker, mobile menu and press kit: "Two-person independent indie game studio." followed by "Games we'd love to play, crafted into existence."
- Voice: lowercase headings and buttons, warm, playful and a little self-deprecating; speaks as "we"; cat puns for the game; emoticons (":3", "^^") and a Turkish wink are in character. Never corporate.
- Assets, all in the repo: `assets/img/brand/` (`logo.svg`, `logo-compact.svg`, `logo-reveal.svg`, `favicon.svg`, `social.jpg`), `_includes/mark-float.svg` (the blu.e mark), `assets/img/presskit/` (wordmark and mark in white and black PNGs), `assets/img/team/` (illustrations of Defne, Gökay and Nova), `assets/img/purrfect-fit/keyart.webp` and `trailer.webp`.
- Brand colours and fonts are fixed by the Canva design and recorded in `CLAUDE.md`.

## Evidence on Hand

Real:

- Studio facts above (name, place, year, founders) and the Purrfect Fit title and premise.
- Purrfect Fit key art (`assets/img/purrfect-fit/keyart.webp`) and a trailer thumbnail (`assets/img/purrfect-fit/trailer.webp`).
- Logos, the animated mark, team illustrations and the share image listed under Brand Commitments.

Placeholders, confirmed by the studio (2026-09-06). Future work must not treat these as facts or extend them:

- Both posts in `_posts/` (Devlog 12, Announcement Trailer) are sample content. Nothing in them (six months of work, a Steam page going live, a trailer) is a fact.
- Every external link is a placeholder: the Steam developer/wishlist URL, itch.io, Discord invite, X, Instagram, YouTube and Reddit handles.
- The press kit download points at `assets/presskit/blue-variable-presskit.zip`, which does not exist in the repo.
- No screenshots, no trailer video, no newsletter provider.

Absent, do not invent: testimonials, press quotes, awards, wishlist or player counts, release date, price, platforms, publisher.

## Product Principles

1. **Two jobs at every door.** A player who wants to wishlist and a journalist who wants the facts both find their next step on any page; neither audience is demoted.
2. **Say only what is true.** "Coming soon" is the whole promise. No store, platform, date, demo timing or number appears as fact until the studio adds it.
3. **The makers are the product.** The two people, their voice and Nova are as memorable as the game; copy sounds like them, never like a publisher.
4. **Handmade all the way down.** No dependencies, no services, nothing two people cannot maintain; a new devlog is one Markdown file.
5. **Playful, never sloppy.** The jokes ride on precise, accessible craft.

## Accessibility & Inclusion

No formal standard has been adopted (undecided). Commitments already in the code, to preserve: a skip link; hidden headings where the visual design has none; live-region status notes on forms; `prefers-reduced-motion` stops the boils, the ticker and the splash; hover effects only on hover-capable devices so nothing sticks after a tap; the custom cursor only replaces the native one on fine pointers; text alternatives on key art and logos.
