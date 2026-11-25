---
name: Vishnu Vardhan Addanki Tirumala
description: A research portfolio drawn as a transit network; themes are lines, papers and projects are stations.
colors:
  ground: "#f5f6f8"
  ground-2: "#e9ecf0"
  panel: "#ffffff"
  panel-2: "#f2f4f7"
  rule: "#d8dde4"
  rule-2: "#b4bcc8"
  ink: "#0d1117"
  ink-dim: "#3b4452"
  ink-faint: "#545d6c"
  sign: "#121519"
  sign-ink: "#ffffff"
  line-multimodal: "#0062cf"
  line-interpretable: "#d42a31"
  line-edge: "#00843d"
  line-agentic: "#e8a200"
  line-shipped: "#6f3fb0"
  night-ground: "#0d1117"
  night-panel: "#161d26"
  night-ink: "#eef2f7"
typography:
  display:
    fontFamily: "Archivo, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
    fontSize: "clamp(38px, 3.9vw, 56px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(26px, 3vw, 38px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.3
    fontFeature: "\"tnum\" 1"
  section-label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.03em"
rounded:
  chip: "4px"
  base: "6px"
  bullet: "50%"
spacing:
  xs: "6px"
  sm: "12px"
  md: "20px"
  lg: "48px"
  section: "84px"
components:
  button-primary:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.base}"
    padding: "12px 20px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.ink-dim}"
    textColor: "{colors.ground}"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "12px 20px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
  signage-band:
    backgroundColor: "{colors.sign}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.base}"
    padding: "16px 24px"
    typography: "{typography.headline}"
  card:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.base}"
    padding: "20px 22px 22px"
  chip:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.chip}"
    padding: "3px 10px"
  line-bullet:
    backgroundColor: "{colors.line-multimodal}"
    textColor: "{colors.sign-ink}"
    rounded: "{rounded.bullet}"
    size: "26px"
  nav-link:
    textColor: "{colors.ink-dim}"
    rounded: "{rounded.base}"
    padding: "8px 12px"
  nav-link-hover:
    backgroundColor: "{colors.ground-2}"
    textColor: "{colors.ink}"
---

# Design System: Vishnu Vardhan Addanki Tirumala

## Overview

**Creative North Star: "The Research Transit Map"**

The whole site is signage for a transit network of research. Themes are lines, each with a letter and a saturated route colour; papers and projects are stations along them; publication status is the station marker (filled, open, dotted, dashed). The language is Vignelli and Beck: a cool white ground, white panels with ink borders, black signage bands that carry section titles in white with lettered line bullets, and one grotesk doing every job. Nothing is costume: no terminal, no glow, no grid paper.

Density is calm and editorial. Sections breathe at 84px, content lives in a 1200px column, and the strongest graphic weight comes from 2px ink rules under the nav and hero, the signage bands, and the 9px route strokes of the map. Colour is functional, not decorative: the five route colours appear only where a line or its bullet appears, and the rest of the page is ink on white.

Motion has one signature: the network draws itself once on load (staggered route draw, then termini fade in). Everything else is static, except the hand-built animated diagrams inside cards and station previews. Reduced motion shows the finished map.

**Key Characteristics:**
- Ink on cool white; black signage bands for section titles.
- Five route colours, used only as lines, bullets and the contact page's route strip.
- Station markers encode status: accepted (filled), under review (open ring), ongoing (dot in ring), planned (dashed ring), project (rounded square), interchange (pill).
- One grotesk, Archivo, at 800 for display and 400 to 700 for text.
- Square-ish 6px corners everywhere; circles only for bullets and markers.
- A light theme by default, and a full night theme that inverts the signage.

## Colors

Signage white and ink, with a five-colour route palette that is never used for surfaces or body text.

### Primary
- **Signage Black** (sign): section-title bands, the primary button, the contact terminus panel, logo tiles, the play pill. In the night theme it flips to the near-white ink and its text flips to ink, so the band always reads as the strongest object on the page.
- **Ink** (ink): all headings and primary text, the 2px structural rules, station marker strokes, the timeline spine, the focus ring and the reading-progress bar. Ink is also the accent (`--acc`): the site has no separate brand hue.

### Secondary: the route palette
- **Multimodal Blue** (line-multimodal), line M.
- **Interpretable Red** (line-interpretable), line I. Also the halo ring on the accepted-paper marker and the `:target` ring on the publication row.
- **Edge Green** (line-edge), line E.
- **Agentic Amber** (line-agentic), line A. Also text selection. Its bullet letter is ink, never white, because white fails contrast on amber.
- **Shipped Purple** (line-shipped), line S (shipped projects).

Night values (lighter, same hues): #4b9bff, #ff5d64, #33c072, #ffc23a, #b58cf3. In the night theme every bullet letter is ink.

### Neutral
- **Cool Ground** (ground) and **Ground Shade** (ground-2): page background; ground-2 is the hover wash for nav links, icon buttons and map stations.
- **Panel White** (panel) and **Panel Shade** (panel-2): cards, frames, chips; panel-2 fills thumbnails and hover rows.
- **Hairline** (rule) and **Rule** (rule-2): 1px internal dividers, and the 1px resting border of cards and chips.
- **Dim Ink** (ink-dim): secondary text, ledes, paragraphs inside cards, metadata.
- **Faint Ink** (ink-faint): the quietest metadata (kind labels, figure captions, dates in lists). It is the lowest contrast allowed; do not go lighter.
- **Night ground / panel / ink**: the dark theme's ground, card and text (night theme also defines #141a22, #1b232e, #2a3441, #3d4958, #b6bfcc, #97a1b0 as its shade, panel-2, rule, rule-2, dim and faint).

### Named Rules
**The Lines-Only Rule.** Route colours appear only as route strokes, line bullets, and the five-part route strip. Never as a background, a heading colour, a button fill or a tint.

**The Ink-Is-The-Accent Rule.** Emphasis is made with ink, weight and the signage band, not with a hue. The primary action is black, not blue.

**The Amber Letter Rule.** Text on an amber bullet is ink (#0d1117); text on the other four light-theme bullets is white; in the night theme all bullet letters are ink.

## Typography

**Display Font:** Archivo (with system-ui, -apple-system, Segoe UI, Roboto, sans-serif)
**Body Font:** Archivo
**Code:** ui-monospace, SFMono-Regular, Menlo, Consolas (inline `code` only)

**Character:** One transit grotesk doing everything, the way station signage does. Heavy 800 headings with tight negative tracking; plain 400 body; 600 to 700 for labels and metadata.

### Hierarchy
- **Display** (800, clamp(38px, 3.9vw, 56px), 1.05, -0.025em): the name in the hero. Project pages run clamp(36px, 5vw, 60px); the contact terminus clamp(32px, 4.6vw, 56px).
- **Headline** (800, clamp(26px, 3vw, 38px), 1.05, -0.02em): section titles, always inside a signage band. Plain `h2` outside a band is clamp(30px, 3.6vw, 44px).
- **Title** (800, 22px, 1.2, -0.02em): research and project card headings; timeline roles at 23px.
- **Body** (400, 17px, 1.6; 16px under 640px): running text. Ledes and about paragraphs 18px in ink-dim, max 66 to 68ch; prose 17.5px at 64ch. Card paragraphs 15.5px.
- **Label** (600 to 700, 13.5 to 15px): status badges, venues, nav links, kind lines, dates. Dates and counts use tabular figures.
- **Section label** (800, 15px, uppercase, +0.03em): sub-headings inside a section (Education, Honours, skill groups), followed by a 2px ink rule that runs to the column edge.

### Named Rules
**The One Grotesk Rule.** Archivo is the only face. There is no serif and no mono voice; the `--serif` and `--mono` variables exist only as aliases that resolve to Archivo.

**The Balanced Heading Rule.** Headings use `text-wrap: balance`; paragraphs and list items use `text-wrap: pretty`.

## Layout

A single centred column, `min(1200px, 100% - 40px)`. Sections pad 84px top and bottom (60px under 640px). The hero is a 5/12 by 7/12 grid (48px gap): identity, claim, accepted-paper row and actions on the left, the map frame on the right. Under 1100px the hero copy becomes a two-column area grid with the map below; under 760px the SVG map, preview panel and legend are replaced by a vertical line list (each line a coloured 8px left border with stations as 44px rows).

Research cards sit on a 6-column grid: the first two span 3, the rest span 2 (2 columns under 980px, 1 under 640px). Projects are 2 columns, 1 under 760px. Skills use `repeat(auto-fit, minmax(280px, 1fr))`. Credentials sit in two columns (48px gap), one under 980px. Grid gaps are 20px for cards, 12 to 16px for small tiles, 6px between chips.

The nav is sticky, 64px tall, ground-coloured with a 2px ink bottom rule; under 980px the links collapse behind a menu button into a full-width panel. On coarse pointers and under 760px every interactive row, button and summary is at least 44px tall.

## Elevation & Depth

Flat by default. Depth comes from borders: a 1px rule-2 border at rest, an ink border on hover, and 1.5px ink borders on framed objects (the map, the accepted-paper row, project art, the profile card, buttons). One soft shadow exists, and it appears only on hover of cards and on the two framed showpieces (the hero map and the profile card).

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 1px 2px rgba(13,17,23,.06), 0 10px 24px -14px rgba(13,17,23,.22)`; night: `0 1px 2px rgba(0,0,0,.4), 0 12px 28px -14px rgba(0,0,0,.7)`): card hover, hero map frame, profile card.
- **Target ring** (`box-shadow: 0 0 0 4px` route red): the publication row when it is the URL target.

### Named Rules
**The Border-Before-Shadow Rule.** A surface earns an ink border before it earns a shadow. Hover changes the border to ink first; the lift shadow is a secondary cue, never a resting state for ordinary cards.

## Shapes

Square-ish corners: 6px on every panel, card, band, button and frame; 4px on chips, tags, logo tiles and inline code. Circles are reserved for the transit vocabulary: line bullets (26px; 22px in the legend; 32px in bands), station markers, the avatar and timeline stations. Project stations are rounded squares and interchanges are pills, matching the map. Route strokes are 9px with round caps and joins; termini are 9px bars. The timeline is a 5px ink spine with 29px ring stations, the first one filled.

## Components

### Buttons
- **Shape:** gently squared (6px), 1.5px border, 700 weight, 16px, padding 12px 20px, optional 16px drawn icon.
- **Primary:** signage black fill, white text. Hover: fill and border shift to ink-dim, text to ground.
- **Secondary:** panel white with an ink border and ink text. Hover inverts to an ink fill.
- **Nav variants:** the same pair at 15px and 9px 15px padding (Contact is primary, CV is the ink-outlined ghost).
- **On the terminus:** inside the black contact panel the pair inverts: primary is white with black text, secondary is a transparent white outline.
- **Focus:** a 3px ink outline offset 3px, site-wide.

### Line bullets (signature)
A filled circle in the line's route colour carrying the line letter (M, I, E, A, S) at 800. They mark lines in the map, the legend, the section bands and the mobile line list. They are the only filled use of route colour.

### Signage band
Every section title sits in a full-width black band (6px corners, 16px 24px padding; 14px 16px on phones) with the white headline on the left and the bullets of the lines that section covers on the right.

### Cards / Containers
- **Corner Style:** 6px.
- **Background:** panel white; thumbnail wells in panel-2 behind a 1px hairline.
- **Border:** 1px rule-2 at rest, ink on hover, plus the lift shadow.
- **Internal Padding:** 20px 22px 22px (research), 18px 20px 20px (projects), 14px 16px (mini tiles).
- **Status badge:** a 14px ring in ink with a 3px border, filled, dotted or dashed by status, followed by the status label at 14px 700.

### Chips
- **Style:** 13.5px text in ink-dim on panel white, 1px rule-2 border, 4px corners, 3px 10px padding. Linked chips turn ink on hover.
- **Project tag:** 13px 700 ink on ground-2, 4px corners, no border.

### Navigation
Brand mark (a three-line route glyph drawn in SVG) plus the name at 800. Links are 15px 600 ink-dim with a ground-2 hover wash; the active link is ink with a 3px underline offset 9px. Theme toggle is a 42px outlined icon button.

### Disclosures
`details` blocks (more projects, beyond research, certificate groups) are bordered panels with a 52px summary row and a drawn "+" that rotates 45 degrees when open; the summary hover fills panel-2.

### Research map (signature)
A white framed SVG of routes, stations and termini. Hover or focus on a station fills its hit area with ground-2 and fills a preview panel below (diagram, title, status, link). Labels carry a panel-coloured halo stroke so they read over routes. Station marker legend sits under the panel, separated by a hairline.

### Links
Inline and "go" links are ink with a 2px rule-2 underline offset 5px that darkens to ink on hover, followed by a drawn SVG arrow.

## Do's and Don'ts

### Do:
- **Do** keep every section title inside a black signage band with the bullets of the lines it covers.
- **Do** encode status with the station marker shapes (filled accepted, open under review, dotted ongoing, dashed planned) and spell the status in words beside it.
- **Do** use 6px corners on panels and 4px on chips; reserve circles for bullets, markers and the avatar.
- **Do** make hover states with an ink border or an ink fill inversion, not with a hue.
- **Do** keep the map's draw-in as the only page-level motion, and show the finished map under reduced motion.
- **Do** keep interactive targets at 44px on touch and phone widths.

### Don't:
- **Don't** use route colours as backgrounds, heading colours, button fills or tints.
- **Don't** introduce a second typeface, a serif voice or a monospace label style; inline code is the only monospace.
- **Don't** return to the dark canvas, neon accent or terminal costume this world replaced.
- **Don't** add glow, decorative gradients or grid-paper textures (the ongoing marker's dot-in-ring radial fill is a marker, not decoration).
- **Don't** put white text on the amber bullet.
- **Don't** give ordinary cards a resting shadow.
