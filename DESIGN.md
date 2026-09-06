---
name: Blue Variable Studio
description: Hand-inked paper, torn edges that boil at two frames a second, and one unpredictable Blue.
colors:
  ink: "#1e1d1d"
  paper: "#f7f3ed"
  cream: "#f5f3ef"
  white: "#ffffff"
  blue: "#558eff"
  yellow: "#f5cb49"
  grey: "#9f938c"
  lilac: "#8e95ba"
  purple: "#545daa"
  teal: "#73d0bb"
typography:
  display:
    fontFamily: "Londrina Solid, Impact, Arial Narrow, sans-serif"
    fontSize: "calc(50.8 * var(--px))"
    fontWeight: 900
    lineHeight: 0.83
    letterSpacing: "0.02em"
  headline:
    fontFamily: "Londrina Solid, Impact, Arial Narrow, sans-serif"
    fontSize: "calc(38.4 * var(--px))"
    fontWeight: 900
    lineHeight: 0.83
    letterSpacing: "0.02em"
  title:
    fontFamily: "Darumadrop One, Comic Sans MS, cursive"
    fontSize: "calc(28.6 * var(--px))"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "0.02em"
  body:
    fontFamily: "Urbanist, Segoe UI, system-ui, sans-serif"
    fontSize: "calc(19 * var(--px))"
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: "normal"
  label:
    fontFamily: "Darumadrop One, Comic Sans MS, cursive"
    fontSize: "calc(20.5 * var(--px))"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.02em"
  reading:
    fontFamily: "Glacial Indifference, Segoe UI, system-ui, sans-serif"
    fontSize: "calc(17.2 * var(--px))"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "normal"
  side-label:
    fontFamily: "Darumadrop One, Comic Sans MS, cursive"
    fontSize: "calc(67.8 * var(--px))"
    fontWeight: 400
    lineHeight: 0.81
    letterSpacing: "0.02em"
rounded:
  sm: "calc(9 * var(--px))"
  md: "calc(12 * var(--px))"
  lg: "calc(16 * var(--px))"
  xl: "calc(26 * var(--px))"
  full: "50%"
spacing:
  xs: "calc(6 * var(--px))"
  sm: "calc(10 * var(--px))"
  md: "calc(14 * var(--px))"
  lg: "calc(22 * var(--px))"
  xl: "calc(40 * var(--px))"
  2xl: "calc(60 * var(--px))"
  section: "calc(130 * var(--px))"
  tear: "calc(45 * var(--px))"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "calc(4 * var(--px)) calc(18 * var(--px))"
    height: "calc(37 * var(--px))"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.blue}"
  button-brush:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.headline}"
    padding: "calc(8 * var(--px)) calc(22 * var(--px)) calc(8 * var(--px)) calc(6 * var(--px))"
  button-brush-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.yellow}"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.blue}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "calc(6 * var(--px)) calc(12 * var(--px))"
    height: "calc(37 * var(--px))"
  newsletter-field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.blue}"
    rounded: "{rounded.md}"
    width: "calc(237 * var(--px))"
    height: "calc(37 * var(--px))"
  nav-link:
    textColor: "{colors.cream}"
    typography: "{typography.title}"
  nav-link-active:
    textColor: "{colors.blue}"
  play-button:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.full}"
    size: "calc(70 * var(--px))"
  logo-tile:
    backgroundColor: "{colors.cream}"
    rounded: "{rounded.md}"
    padding: "calc(12 * var(--px)) calc(18 * var(--px))"
  media-frame:
    rounded: "{rounded.xl}"
---

# Design System: Blue Variable Studio

## Overview

**Creative North Star: "Unpredictably Blue"**

The site is a stack of hand-inked paper. Every edge that meets another background is torn rather than cut, and every drawn thing on the page, the dot, the brush stroke, the scribbled arrows, the speech bubble, the tagline brackets, the timeline line, is masked artwork that cycles through three frames at about two frames a second, the way an animator's line breathes on a lightbox. On that paper lives one loud colour: Blue. It is the dot at the end of the studio's name, and it turns up wherever the page is alive or current: the cursor, the full stop after the active nav item, the timeline nodes, the page-transition band, dates, links and the emphasised word in a sentence. The name is the brief. The variable is blue, and where it lands should feel a little unplanned.

The mood is bold, handmade, playful. Bold means poster-weight display type and flat, saturated colour with no gradients or tints. Handmade means hand lettering for every interface word, torn edges, wobbling droplets, decor that tilts a degree or two on hover. Playful means things spring on hover and squash on press, the tagline flips when clicked, the letters of the mark flinch under the pointer. Underneath the play the drawing is exact: every size is a design pixel measured on a 1366×768 artboard, and the whole page scales as one sheet.

Confirmed rejections, all visible in the incumbent code: no gradients, no blurred shadows, no vector-clean geometry on anything hand-drawn, no dark theme, no third-party UI, no icon fonts, nothing loaded from a CDN.

**Key Characteristics:**
- One sheet: sizes are `calc(N * var(--px))`, the 1366×768 artboard fitted to the viewport, so borders, cursor and droplets scale with the type.
- Torn, boiling edges between every paper and white surface, generated as SVG masks, never images.
- Blue is the only accent on paper; Yellow belongs to the brush stroke; everything else is ink, paper, cream, white.
- Four typefaces with four jobs, all self-hosted, all uppercased by CSS from lowercase copy.
- Motion overshoots: one pop easing for anything that moves, a stepped boil for anything drawn, and the dot cursor sheds droplets.
- Cut-paper depth: flat layers, hard offset shadows only on things you can press.

## Colors

A paper-and-ink palette with a single loud Blue, a Yellow reserved for the brush stroke, and three soft role colours that only the team cards use.

### Primary
- **Blue** (#558eff): the studio's dot and everything that shares its life: the cursor and its droplets, the nav full stop, the timeline line and nodes, the About divider, the page-transition band, the footer, the primary button fill, links, dates, years, "see more", field text and placeholders, and `em` inside body copy. It is the colour of "current" and "alive", not a decorative fill.

### Secondary
- **Yellow** (#f5cb49): the brush stroke behind ink lettering on the wishlist and Discord buttons; on hover the pair inverts to yellow lettering on an ink stroke. Its only appearance as text in the incumbent is the "coming soon" status line on Games.

### Tertiary
- **Lilac** (#8e95ba), **Purple** (#545daa), **Teal** (#73d0bb): role colours for the three team cards, set per card with `--role-color`. Purple also tints the small game label on News entries at 40% opacity. They appear nowhere else.

### Neutral
- **Ink** (#1e1d1d): all body text and headings, the header bar, the mobile menu, borders on buttons, fields and screenshots, the arrows and bubble decor, the hard offset shadow at 28% opacity, and the video backdrop at 85%.
- **Paper** (#f7f3ed): the page ground, the hero and the odd timeline entries; on Home and Games it carries the multiplied paper texture at 72%.
- **White** (#ffffff): the Team, Games panel and Press kit sections, the even timeline entries, button and field fills, primary button text, the tagline and its brackets, and the cursor when it crosses a blue surface.
- **Cream** (#f5f3ef): text on ink surfaces (nav links, newsletter label, mobile menu) and the logo tiles on the press kit.
- **Grey** (#9f938c): secondary hand-lettered text: the reasons list, entry tags, form notes, the empty-news line.

### Named Rules
**The Blue Is Alive Rule.** Blue marks what moves or what is current. It never fills a large resting surface except the footer and the transition band, and it never appears as a tint or a lighter shade.

**The Ink-or-Paper Rule.** Text is ink on paper or white, or cream and white on ink. The only other text colours are Blue for links, dates and emphasis, Grey for secondary lists and notes, and the role colours on team cards.

**The Inversion Rule.** Hover swaps a pair rather than tinting it: blue on white becomes blue on ink, ink on a yellow stroke becomes yellow on an ink stroke. There is no hover shade.

## Typography

**Display Font:** Londrina Solid (with Impact, Arial Narrow)
**Body Font:** Urbanist (with Segoe UI, system-ui)
**Label/Hand Font:** Darumadrop One (with Comic Sans MS, cursive)
**Reading Font:** Glacial Indifference (with Segoe UI, system-ui)

**Character:** a poster voice shouting a few words in Londrina 900, a studio hand writing every interface word in Darumadrop, a heavy geometric Urbanist carrying paragraphs, and a quiet Glacial Indifference for the small print. All four are self-hosted; the hand and display faces are set uppercase by CSS from lowercase copy with 0.02em tracking.

### Hierarchy
- **Display** (Londrina Solid 900, `calc(50.8 * var(--px))` on the hero title, 46.4 on the game title, 120 on the 404 code, line-height 0.83, uppercase): the two or three words per page that carry the poster. Blue on the hero, ink on Games.
- **Headline** (Londrina Solid 900, 38.4, line-height 0.83, uppercase): the hero kicker and the brush button label (37.8). Londrina 300 with 0.22em tracking is the Games status line; Londrina 400 at 21.5 / 1.12 is the game description.
- **Title** (Darumadrop One 400, 28.6, line-height 0.9, uppercase, 0.02em): nav links (28.7, 23 compact), entry titles, dates and years (line-height 0.81), the post title (40), the mobile menu links (40px).
- **Body** (Urbanist 800, 16.7 for excerpts, 19 for post content, 21.5 on About, line-height 1.12): paragraphs; `em` is Blue, not italic. Excerpts run about 262 design px wide, post content 600.
- **Label** (Darumadrop One 400, 13 to 24, line-height about 1, uppercase, 0.02em): buttons (20.5), fields and placeholders (20.5), the tagline (18.5 / 0.9), the latest-news teaser (17), "see more" (17), tags (14), form notes (13 to 14), the newsletter label (19.6 / 0.81), the contact heading (21.2 / 0.85). The reasons list is the one lowercase label (19.9 / 1.05, Grey).
- **Side label** (Darumadrop One 400, 67.8, line-height 0.81, uppercase): the huge white and cream section names on About and Contact; the current one turns Blue.
- **Reading** (Glacial Indifference 400 and 700, 17.2 / 1.1 for team bios and favourites, 14.7 / 1.26 for the press kit tagline and body, 15.6 / 1.06 for the facts list): the small print.

### Named Rules
**The Four Hands Rule.** Each family has one job. Darumadrop is the studio's handwriting and carries every interface word; Londrina 900 is the poster voice for the few words that must shout; Urbanist 800 carries paragraphs; Glacial Indifference is the small print. Emphasis is Blue, never a different font or an italic.

**The Uppercase-by-CSS Rule.** Interface words are typed lowercase in the markup and shouted by `text-transform`. The copy stays in the studio's lowercase voice; the rendering does the volume.

**The Tight-Leading Rule.** Hand and display faces sit between 0.81 and 0.9; body sits at 1.12; small print between 1.06 and 1.26. Never loosen the display or hand faces.

## Layout

The page is the Canva artboard scaled as one drawing. `--px` is `max(0.72px, min(100vw / 1366, 100vh / 768))`, so width or height binds, there is no upper cap, and a 4K screen gets the design at about 2.8×. Every desktop size, including borders, the cursor and the droplets, is written as `calc(N * var(--px))` with N measured on the 1366-wide page. `.wrap` is 1366 design px, centred.

The header is a sticky ink bar 92 tall (72 once the page scrolls) with a torn bottom; the wordmark sits 31 in from the left, the nav starts at 294 with 56 between links, the tagline ticker sits at the right. About, Team, Contact and Press kit are at least 80vh tall with their content centred, so tall screens scroll one section at a time; Home is a single centred viewport. The Games panel is 1207 wide with torn left, right and bottom edges. News is a timeline: a 12-wide torn blue line at 227, entries on a 161 | 300 | 1fr grid with 249 of left padding and a 292-wide media card. Contact is two columns (306 and 380) pushed right by 361; the press kit is 430 plus the logo grid, pushed right by 255. Posts read in a 760 wrap with 600-wide content.

Sections alternate Paper and White and overlap by the tear band (45 design px): a `.torn-bottom` section adds the band as bottom padding and the next block is pulled up under it; a `.torn-top` section pulls itself up by the band. Torn bottoms show 10 of the band, torn tops 22.

Spacing steps observed and reused: xs 6, sm 10, md 14, lg 22, xl 40, 2xl 60; 130 above a torn-top section; the tear band 45.

Below 900px `--px` is 1px, the header is 72 (60 compact), the band is 30 (depths 7 and 15), `.wrap` is full width with 20px padding, every layout stacks to one column, the nav becomes a full-screen ink menu behind a 48px hamburger, side labels disappear, buttons grow to a 44px minimum height, and the Games panel drops its torn sides.

Layers, bottom to top: content 1, header bar 40 (45 on mobile), page-transition band 90, splat 95, splash 100, droplet trail 119, cursor 120, footer content 121, mobile menu 122, header content 123. The dot therefore passes behind nav text and social icons and in front of everything else.

## Elevation & Depth

Cut paper. Surfaces are flat torn-paper layers, paper on white on paper, and they cast no shadow. The hard offset shadow belongs only to things you can press or pick up: the primary button, the play button and the screenshot tiles. Keyboard focus is a ring, field focus is a soft blue glow, and the video dialog sits on ink at 85%.

### Shadow Vocabulary
- **Cutout, at rest** (`box-shadow: calc(4 * var(--px)) calc(4 * var(--px)) 0 rgba(30, 29, 29, .28)`): primary buttons and the play button; screenshots use 5 / 5.
- **Cutout, lifted** (`calc(6 * var(--px)) calc(6 * var(--px)) 0 rgba(30, 29, 29, .28)` with `translate(-1px, -1px)`): hover on the same elements.
- **Cutout, pressed** (`calc(2 * var(--px)) calc(2 * var(--px)) 0 rgba(30, 29, 29, .28)` with a 2 / 2 translate): `:active`.
- **Field glow** (`0 0 0 3px rgba(85, 142, 255, .35)`): focused text fields.
- **Focus ring** (`outline: 3px solid Blue; outline-offset: 3px`): every `:focus-visible`.
- **Backdrop** (`rgba(30, 29, 29, .85)`): behind the video dialog, fading in over 0.3s.

### Named Rules
**The Pressables-Only Shadow Rule.** A shadow means "you can press this". Cards, tiles, frames and sections stay flat; depth between surfaces comes from the torn edge and the paper-to-white change, never from a shadow.

**The Hard Shadow Rule.** Shadows are offset, never blurred. A shadow with a blur radius is not from this system.

## Shapes

Torn edges are generated, not drawn: `assets/css/tears.css` holds 24 SVG data-URI masks (bottom, top, left and right edges, the timeline line, left and right brackets, and the dot, three frames each) built by `_tools/tears.js` from a gradient thresholded through turbulence speckle. The band is 45 design px tall (30 on mobile); a torn bottom reveals 10 of it and a torn top 22 (7 and 15 on mobile), so tops tear deeper than bottoms; the page-transition band uses the shallow bottom depth. `tear-boil` cycles the three frames every 0.45s in steps of one, and reduced motion holds frame 1.

Geometric things are rounded rectangles with an ink border: buttons, fields and logo tiles at 12 design px with a 2 border (white on the cream logo tiles), screenshots at 16 with border and shadow, the News media frame at 26 with no border, the newsletter arrow at 9, the mobile-menu bars at 2. The play button and the splash pop are circles.

The dot is a traced blob, not a circle: its path comes from the animated wordmark and lives in the tear generator; as a mask it wobbles with `dot-boil` (rotate −5°, 4°, −1°; scale ±6%). Droplets are asymmetric ellipses (`border-radius: 46% 54% 50% 50% / 52% 48% 52% 48%`). The arrows, the speech bubble and the brush stroke are `currentColor` SVGs in `assets/img/decor/` applied as `mask-image` so they take any background colour, and they boil with `decor-boil`, whose `--boil` amplitude is 1 by default and 0.4 on the brush. Borders elsewhere are 2 design px: the post navigation's top rule, the blue underline under the latest-news title, the currentColor underline under "see more".

### Named Rules
**The Everything Boils Rule.** Anything drawn (tears, dot, brush, arrows, bubble, brackets, timeline line) cycles three frames at 0.45s steps(1). Nothing hand-drawn is ever static while motion is allowed, and nothing geometric (buttons, fields, tiles) ever boils.

**The Torn, Not Cut Rule.** Wherever paper meets white, the edge is torn with `.torn-top` or `.torn-bottom` and the two blocks overlap by the band. A straight seam between two backgrounds does not exist on this site.

## Components

### Buttons
Springy and tactile: they lift on hover, squash on press, and every transition overshoots on `--ease-pop`.
- **Shape:** rounded rectangle (12 design px) with a 2 ink border; the brush button has no box at all, only its stroke.
- **Primary** (`.btn`): Blue fill, White hand-lettered uppercase label (20.5), minimum height 37 (44 on mobile), padding 4 / 18, cutout shadow 4 / 4. An icon variant puts a 1em sprite icon before the label (the RSS button).
- **Hover / Focus:** Ink fill with Blue label, lifts −1 / −1 with the 6 / 6 shadow; press drops +2 / +2 onto the 2 / 2 shadow; 0.15s throughout. Focus is the global 3px Blue ring.
- **Brush** (`.brush-btn`): a Yellow brush stroke (`brush.svg` mask, boiling at 0.4 amplitude) behind Ink lettering; Londrina 900 label at 37.8 with a 45 Steam or Discord icon filled with `currentColor`. Hover rotates −2° and scales 1.03 while the pair inverts to Yellow on Ink; press rotates −1° and scales 0.96. Variants: `--sm` (hand label 24.3, icon 35) on News entries, `--hand` (two-line hand label 21.2, left aligned) for Discord.
- **Text links:** Blue by default; hover swaps to Ink ("see more") or Ink to Blue (entry titles, post navigation). The latest-news teaser underlines its Ink title in Blue and lifts −2 with a −1° tilt on hover.
- **Icon buttons:** the newsletter arrow (28 square, 9 radius, Blue with a White arrow 14 × 12; hover scales 1.1, press 0.92) and the play button (70 circle, Blue, 2 Ink border, cutout shadow; hover 1.08, press 0.94).

### Inputs / Fields
- **Style:** White fill, 2 Ink border, 12 radius, hand-lettered Blue text at 20.5 with Blue uppercase placeholders, padding 6 / 12, minimum height 37 (44 on mobile). The textarea starts at 115 tall and resizes vertically. The newsletter field is 237 × 37 with the arrow button inside its right edge.
- **Focus:** the Blue glow (`0 0 0 3px rgba(85, 142, 255, .35)`), no outline.
- **Error / Status:** a hand-lettered uppercase note under the form (13 to 14, Grey on paper, White on the blue footer), filled through `aria-live`; empty notes collapse.

### Navigation
- Sticky ink bar 92 tall with a torn bottom, compacting to 72 as the page scrolls; the full wordmark (120 wide) crossfades to the compact mark (70) and the links shrink from 28.7 to 23.
- Links are hand-lettered uppercase Cream with 56 between them; hover lifts −2 and rotates −2°; the active link is Blue and ends with the boiling Blue dot (0.3em) placed just past its right edge on the baseline, which hops to the next link over 0.45s.
- The tagline ticker sits at the right between two torn White brackets: White hand type at 18.5, one line at a time, flipping every 4s and on click.
- Mobile: a 48px toggle of three Cream 3px bars that fold into an X, opening a full-screen Ink menu whose 40px links rise in with a 50ms stagger, followed by the taglines and the social icons.
- Side labels on About and Contact: 67.8 hand type in White and Cream down the left edge, the section under the middle of the viewport in Blue; hover nudges +4px.

### Cards / Containers
- **Team card:** illustration 135 tall, name in Urbanist 900 uppercase at 30, role in the card's role colour at 23.3, bio and favourites in Glacial Indifference 17.2 / 1.1 at most 290 wide. Hover tilts the art −4° and scales it 1.05 while the bio and favourites fade up (hover-capable devices only; touch always shows them).
- **Logo tile:** Cream, 2 White border, 12 radius, 5:3, centred image at most 66 tall; two columns of 176.
- **Media frame:** 26 radius, clipped, the play button in the bottom-right corner.
- **Screenshot:** 16 radius, 2 Ink border, 5 / 5 cutout shadow, three columns (two on mobile).
- **Timeline entry:** full-bleed Paper and White backgrounds alternating with a torn top, the 26 Blue boiling dot on the line, date and year in Blue hand type at 28.6, title at 28.6, excerpt in body at 16.7 up to 262 wide, tags in Grey hand type at 14; "see more" unfolds the rest with a 0.45s grid-row transition.
- **Facts list:** Glacial Indifference 15.6, terms bold uppercase followed by " -", values regular, links underlined with a 2px offset.

### The Dot (signature)
On fine pointers the native cursor is replaced by a 44 design-px Blue dot masked with the boiling `--tear-dot` frames. The wrapper only translates and scales; the mask carries the boil. It grows 1.3× over anything clickable and pulses to 1.55× every 0.6s while it stays there, shrinks to 0.8× on press, hides over text fields and iframes, and turns White over Blue surfaces. Moving sheds droplets (7 to 16 wide, one every 20ms, gone in 1.5s); every press flings a ring of 13 to 15 droplets 17 to 37 wide, 54 to 134 far, over 0.6s. The same dot is the nav full stop, the timeline node, the About divider's line and the waiting indicator in the band.

### The Band (signature)
Internal links do not reload: a Blue sheet with a torn top rises from the bottom over 0.35s (0.25s for back and forward) on `--ease-out`, the page swaps underneath, and the sheet drops. If the fetch outlasts the cover a White boiling dot appears in its centre. On arrival the children of every `.wrap` rise 28 design px and fade in over 0.45s with delays of 100, 160, 220, 280, 340 and 400ms; sections marked `data-reveal` play the same stagger when they scroll into view instead.

### Motion tokens
`--dur-quick` 0.15s for presses and the cursor, `--dur-base` 0.3s for hovers, the header, the menu and the dialog, `--dur-slow` 0.45s for arrival, the nav dot's hop and expanding entries, `--dur-band` 0.35s (0.25s quick). `--ease-pop` (`cubic-bezier(.22, 1.18, .36, 1)`) overshoots and is used for anything that moves; `--ease-out` (`cubic-bezier(.4, 0, .2, 1)`) is for the band. Boils step every 0.45s; the ticker flips every 4s; the key art tilts up to 7° towards the pointer, easing 18% per frame; the splash pop fills the screen in 0.7s on `cubic-bezier(.32, 0, .67, 0)`. Reduced motion collapses every duration to 0.001ms, holds the boils on frame 1, skips the splash and lets the router reload.

## Do's and Don'ts

### Do:
- **Do** write every desktop size as `calc(N * var(--px))` with N measured on the 1366-wide artboard; plain px belongs only inside the `max-width: 899px` block.
- **Do** tear every edge where Paper meets White with `.torn-top` or `.torn-bottom`, and let the blocks overlap by the 45 design-px band.
- **Do** put every `:hover` inside `@media (any-hover: hover)` and leave `:active` outside it, so presses read on touch and nothing sticks after a tap.
- **Do** let Blue mean alive or current, and mark emphasis with `em` (which renders Blue), never with italics or a change of font.
- **Do** invert pairs on hover: Blue on White to Blue on Ink, Ink on a Yellow stroke to Yellow on an Ink stroke.
- **Do** boil anything hand-drawn with `decor-boil` or the `--tear-*` frames at 0.45s steps(1), and keep buttons, fields and tiles geometric and still.
- **Do** use `--ease-pop` for anything that moves and `--dur-quick`, `--dur-base`, `--dur-slow` for its timing; keep the cursor behind header and footer content (z 119 to 120 under 121 to 123) and turn it White over Blue.
- **Do** honour `prefers-reduced-motion`: frame 1, no splash, no band, no boil.

### Don't:
- **Don't** blur a shadow. Shadows are offset (4 / 4 at rest, 6 / 6 lifted, 2 / 2 pressed) in Ink at 28%, and only on pressables.
- **Don't** add gradients, tints, transparencies for colour, or lighter and darker shades of a token; the palette is ten flat colours.
- **Don't** leave a straight seam between Paper and White.
- **Don't** introduce a fifth typeface or new weights, and never an icon font; icons come from the SVG sprite and fill with `currentColor`.
- **Don't** loosen hand or display type above a 0.9 line-height, and don't set interface words in mixed case.
- **Don't** set Yellow as text anywhere new; it is the brush stroke's colour (the Games status line is the incumbent's one exception).
- **Don't** load anything from a CDN or add a build step; fonts are self-hosted and decor is masked SVG.
- **Don't** hand-edit `tears.css`; change the recipe in `_tools/tears.js` (or the tuner) and regenerate it.
