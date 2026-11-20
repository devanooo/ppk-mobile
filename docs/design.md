---
version: alpha
name: Apple-design-analysis
description: A photography-first interface that turns marketing into a museum gallery. Edge-to-edge product tiles alternate light and dark canvases, framed by SF Pro Display headlines with negative letter-spacing and a single Action Blue (#0066cc) interactive color. UI chrome recedes so the product can speak — no decorative gradients, no shadows on chrome, only the one signature drop-shadow under product imagery resting on a surface.

colors:
  primary: "#0066cc"
  primary-focus: "#0071e3"
  primary-on-dark: "#2997ff"
  ink: "#1d1d1f"
  body: "#1d1d1f"
  body-on-dark: "#ffffff"
  body-muted: "#cccccc"
  ink-muted-80: "#333333"
  ink-muted-48: "#7a7a7a"
  divider-soft: "#f0f0f0"
  hairline: "#e0e0e0"
  canvas: "#ffffff"
  canvas-parchment: "#f5f5f7"
  surface-pearl: "#fafafc"
  surface-tile-1: "#272729"
  surface-tile-2: "#2a2a2c"
  surface-tile-3: "#252527"
  surface-black: "#000000"
  surface-chip-translucent: "#d2d2d7"
  on-primary: "#ffffff"
  on-dark: "#ffffff"

typography:
  hero-display:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.07
    letterSpacing: -0.28px
  display-lg:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: 0
  display-md:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.47
    letterSpacing: -0.374px
  lead:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 28px
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: 0.196px
  lead-airy:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 24px
    fontWeight: 300
    lineHeight: 1.5
    letterSpacing: 0
  tagline:
    fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif"
    fontSize: 21px
    fontWeight: 600
    lineHeight: 1.19
    letterSpacing: 0.231px
  body-strong:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.24
    letterSpacing: -0.374px
  body:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.47
    letterSpacing: -0.374px
  dense-link:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 2.41
    letterSpacing: 0
  caption:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: -0.224px
  caption-strong:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.29
    letterSpacing: -0.224px
  button-large:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 18px
    fontWeight: 300
    lineHeight: 1.0
    letterSpacing: 0
  button-utility:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.29
    letterSpacing: -0.224px
  fine-print:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.12px
  micro-legal:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 10px
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: -0.08px
  nav-link:
    fontFamily: "SF Pro Text, system-ui, -apple-system, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.0
    letterSpacing: -0.12px

rounded:
  none: 0px
  xs: 5px
  sm: 8px
  md: 11px
  lg: 18px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 17px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 80px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
  button-primary-focus:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-primary-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-secondary-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.primary}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 11px 22px
  button-dark-utility:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-dark}"
    typography: "{typography.button-utility}"
    rounded: "{rounded.sm}"
    padding: 8px 15px
  button-pearl-capsule:
    backgroundColor: "{colors.surface-pearl}"
    textColor: "{colors.ink-muted-80}"
    typography: "{typography.caption}"
    rounded: "{rounded.md}"
    padding: 8px 14px
  button-store-hero:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-large}"
    rounded: "{rounded.pill}"
    padding: 14px 28px
  button-icon-circular:
    backgroundColor: "{colors.surface-chip-translucent}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    size: 44px
  text-link:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.body}"
  text-link-on-dark:
    backgroundColor: transparent
    textColor: "{colors.primary-on-dark}"
    typography: "{typography.body}"
  global-nav:
    backgroundColor: "{colors.surface-black}"
    textColor: "{colors.on-dark}"
    typography: "{typography.nav-link}"
    height: 44px
  sub-nav-frosted:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.tagline}"
    height: 52px
  product-tile-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-parchment:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-dark:
    backgroundColor: "{colors.surface-tile-1}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  product-tile-dark-2:
    backgroundColor: "{colors.surface-tile-2}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
  product-tile-dark-3:
    backgroundColor: "{colors.surface-tile-3}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.none}"
  store-utility-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.lg}"
    padding: 24px
  configurator-option-chip:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 12px 16px
  configurator-option-chip-selected:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  search-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 12px 20px
    height: 44px
  floating-sticky-bar:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    height: 64px
    padding: 12px 32px
  environment-quote-card:
    backgroundColor: "{colors.surface-tile-1}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-lg}"
    rounded: "{rounded.none}"
    padding: 80px
  footer:
    backgroundColor: "{colors.canvas-parchment}"
    textColor: "{colors.ink-muted-80}"
    typography: "{typography.fine-print}"
    padding: 64px
---

## Platform scope

PraktikumKU adalah aplikasi mobile untuk iOS dan Android. Analisis web Apple di dokumen ini dipakai sebagai referensi bahasa visual, bukan target platform. Layout, breakpoint, dan komponen HTML web tidak diterapkan. Adaptasi mobile ada di bagian akhir dokumen.

## Overview

Apple's digital presence is a masterclass in **reverent product photography framed by near-invisible UI**. Every page is a stack of edge-to-edge product "tiles" — alternating light and dark canvases, each centered on a hero headline, a one-line tagline, two tiny blue pill CTAs, and an impossibly crisp product render. Nothing competes with the product. Typography is confident but quiet; color is either pure white, an off-white parchment, or a near-black tile; interactive elements are a single, quiet blue.

Density is unusually low even by contemporary SaaS standards. Each tile occupies roughly one viewport, and there is no decorative chrome — no borders, no gradients, no decorative frames, no shadows on headlines. Elevation appears only when a product image rests on a surface (a single soft `rgba(0, 0, 0, 0.22) 3px 5px 30px` drop for visual weight). The result is a catalog that feels more like a museum gallery: the wall disappears and the artifact takes over.

Store and shop surfaces retain the same chassis but switch modes. The product configurator (iPhone 17 Pro, accessories grid) introduces a tight grid of white utility cards at `{rounded.lg}` (18px) radius with a thin border, paired with a persistent thin sub-nav strip. The environment page leans darker and more editorial. Across all five surfaces the typographic system, spacing rhythm, and the single blue accent are consistent — this is one design language expressed at different volumes.

**Key Characteristics:**
- Photography-first presentation; UI recedes so the product can speak.
- Alternating full-bleed tile sections: white/parchment ↔ near-black, with the color change itself acting as the section divider.
- Single blue accent (`{colors.primary}` — #0066cc) carries every interactive element. No second brand color exists.
- Two button grammars: tiny blue pill CTAs (`{rounded.pill}`) and compact utility rects (`{rounded.sm}`).
- SF Pro Display + SF Pro Text — negative letter-spacing at display sizes for the signature "Apple tight" headline feel.
- Whisper-soft elevation used only when a product image needs to breathe — exactly one drop-shadow in the entire system.
- Tight two-row nav: slim `{component.global-nav}` + product-specific `{component.sub-nav-frosted}` with persistent right-aligned primary CTA.
- Section rhythm across multiple pages: light hero → dark product tile → light utility tile → dark tile → parchment footer — a predictable pulse.

## Colors

> **Source pages analyzed:** homepage, environment, store, iPhone 17 Pro buy page, accessories index. The color system is identical across all five surfaces; only the surface-mode mix differs.

### Brand & Accent
- **Action Blue** (`{colors.primary}` — #0066cc): The single brand-level interactive color. All text links, all blue pill CTAs ("Learn more", "Buy"), and the focus ring root. This is Apple's quiet but universal "click me" signal. Press state shifts to a slightly darker variant via the active scale transform rather than a hex change.
- **Focus Blue** (`{colors.primary-focus}` — #0071e3): A marginally brighter sibling of Action Blue, reserved for the keyboard focus ring on buttons (`outline: 2px solid`).
- **Sky Link Blue** (`{colors.primary-on-dark}` — #2997ff): A brighter blue used on dark surfaces for in-copy links and inline callouts, where Action Blue would disappear against the tile background.

### Surface
- **Pure White** (`{colors.canvas}` — #ffffff): The dominant canvas. Content, utility cards, store tiles, configurator grids.
- **Parchment** (`{colors.canvas-parchment}` — #f5f5f7): The signature Apple off-white. Used for alternating light tiles, footer region, and the default page canvas in store utility sections. Just different enough from white to create rhythm.
- **Pearl Button** (`{colors.surface-pearl}` — #fafafc): A near-white used as the fill for secondary "ghost" buttons — lighter than the parchment canvas so the button still reads as a button against `{colors.canvas-parchment}`.
- **Near-Black Tile 1** (`{colors.surface-tile-1}` — #272729): The primary dark-tile surface on the homepage product grid.
- **Near-Black Tile 2** (`{colors.surface-tile-2}` — #2a2a2c): A micro-step lighter — used where a dark tile sits directly above or below Tile 1 to create the faintest separation.
- **Near-Black Tile 3** (`{colors.surface-tile-3}` — #252527): A micro-step darker — used at the bottom of the stack and in embedded video/player frames.
- **Pure Black** (`{colors.surface-black}` — #000000): Reserved for true void — video player backgrounds, edge-to-edge photographic overlays, the global nav bar background.
- **Translucent Chip Gray** (`{colors.surface-chip-translucent}` — #d2d2d7): The base hex of the translucent gray chip used over photography for circular control buttons. In production, applied at ~64% alpha as `rgba(210, 210, 215, 0.64)`.

### Text
- **Near-Black Ink** (`{colors.ink}` — #1d1d1f): The voice of every headline, every body paragraph, and the dark utility button's fill. Chosen instead of pure black to keep the page feeling photographic rather than printed.
- **Body** (`{colors.body}` — #1d1d1f): Same hex as ink — Apple uses one near-black tone for all text on light surfaces.
- **Body On Dark** (`{colors.body-on-dark}` — #ffffff): All text on dark tiles and on the global nav bar.
- **Body Muted** (`{colors.body-muted}` — #cccccc): Secondary copy on dark tiles where pure white would be too loud.
- **Ink Muted 80** (`{colors.ink-muted-80}` — #333333): Body text on the white Pearl Button surface — slightly softer than pure black.
- **Ink Muted 48** (`{colors.ink-muted-48}` — #7a7a7a): Disabled button text and legal fine-print.

### Hairlines & Borders
- **Divider Soft** (`{colors.divider-soft}` — #f0f0f0): The "border" tone on secondary buttons — functions as a ring shadow rather than a hard line. In production, often applied as `rgba(0, 0, 0, 0.04)`.
- **Hairline** (`{colors.hairline}` — #e0e0e0): The 1px hairline border on store utility cards and configurator chips.

### Brand Gradient
**No decorative gradients.** Atmospheric depth on product photography (the iPhone 17 Pro camera plate, the Apple Watch bands, AirPods reflections) is inherent to the imagery, not a CSS gradient overlay. The environment page's hero uses photographic atmosphere (mountain vista at dawn) but no gradient tokens are defined. Apple is the rare luxury-brand site with zero gradient-based design tokens.

## Typography

### Font Family
- **Display**: `SF Pro Display, system-ui, -apple-system, sans-serif` — Apple's proprietary display face, optimized for sizes ≥ 19px. Defines the voice of every headline.
- **Body / UI**: `SF Pro Text, system-ui, -apple-system, sans-serif` — the text-optimized variant used for body copy, captions, buttons, and links below 20px.
- **OpenType features**: `font-variant-numeric: numerator` is enabled on numeric links (pricing tables, spec sheets). Display sizes rely on tight tracking rather than contextual ligatures.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 56px | 600 | 1.07 | -0.28px | Hero headline; the signature "Apple tight" tracking |
| `{typography.display-lg}` | 40px | 600 | 1.10 | 0 | Tile headlines atop every product tile |
| `{typography.display-md}` | 34px | 600 | 1.47 | -0.374px | Section heads (SF Pro Text at display proportions) |
| `{typography.lead}` | 28px | 400 | 1.14 | 0.196px | Product tile subcopy |
| `{typography.lead-airy}` | 24px | 300 | 1.5 | 0 | Environment-page lead paragraphs (the rare weight 300) |
| `{typography.tagline}` | 21px | 600 | 1.19 | 0.231px | Sub-tile tagline; sub-nav category name |
| `{typography.body-strong}` | 17px | 600 | 1.24 | -0.374px | Inline strong emphasis |
| `{typography.body}` | 17px | 400 | 1.47 | -0.374px | Default paragraph |
| `{typography.dense-link}` | 17px | 400 | 2.41 | 0 | Footer / store utility link lists (relaxed leading) |
| `{typography.caption}` | 14px | 400 | 1.43 | -0.224px | Secondary captions, button text |
| `{typography.caption-strong}` | 14px | 600 | 1.29 | -0.224px | Emphasized captions |
| `{typography.button-large}` | 18px | 300 | 1.0 | 0 | Store hero CTAs (the rare weight 300) |
| `{typography.button-utility}` | 14px | 400 | 1.29 | -0.224px | Utility/nav button labels |
| `{typography.fine-print}` | 12px | 400 | 1.0 | -0.12px | Fine-print, footer body |
| `{typography.micro-legal}` | 10px | 400 | 1.3 | -0.08px | Micro legal disclaimers |
| `{typography.nav-link}` | 12px | 400 | 1.0 | -0.12px | Global nav menu items |

### Principles

- **Negative letter-spacing at display sizes.** Every headline at 17px and up carries a slight tracking tighten (`-0.12 → -0.374px`). This produces the iconic "Apple tight" headline cadence. Never used at 12px or below.
- **Body copy at 17px, not 16px.** Apple breaks the SaaS convention and runs paragraph text at 17px. The extra pixel gives the page an unmistakable "reading, not scanning" pace.
- **Weight 300 is real and rare.** Used deliberately on a handful of large-size reads (`{typography.button-large}` at 18px/300 and `{typography.lead-airy}` at 24px/300). It's not an accident — it's a light-atmosphere cue reserved for moments where the content should feel airy.
- **Weight 600, not 700, for headlines.** Apple's headlines sit at weight 600. Weight 700 is used sparingly for `{typography.tagline}` (21px) when a touch more assertion is needed.
- **Line-height is context-specific.** Display sizes use 1.07–1.19 (tight). Body uses 1.47. Utility link stacks in the footer/store use an unusually relaxed 2.41 (`{typography.dense-link}`). The 2.41 is not a bug — it's how the footer's dense link columns breathe.
- **Weight 500 is deliberately absent.** The ladder is 300 / 400 / 600 / 700. Mid-weight readings always use 600.

### Note on Font Substitutes
SF Pro is Apple's proprietary system font. When building off-system:

- Use `system-ui, -apple-system, BlinkMacSystemFont` as the first stack entry — on macOS/iOS/Safari this resolves to the real SF Pro.
- For non-Apple platforms, **Inter** (Google Fonts, variable) is the closest open-source equivalent. Inter at weight 600 with `font-feature-settings: "ss03"` approximates SF Pro's rounded "a" character.
- Nudge `letter-spacing` down by `-0.01em` on display sizes to re-create the Apple tight feel; Inter's default tracking runs slightly wider than SF Pro.
- For body text, tighten line-height by `0.03` (from 1.47 → 1.44) when substituting Inter — Inter's taller x-height needs less leading.

## Layout

### Spacing System
- **Base unit:** 8px. Sub-base values (2, 4, 5, 6, 7) are used for tight typographic adjustments; structural layout snaps to 8/12/16/20/24.
- **Tokens:** `{spacing.xxs}` 4px · `{spacing.xs}` 8px · `{spacing.sm}` 12px · `{spacing.md}` 17px · `{spacing.lg}` 24px · `{spacing.xl}` 32px · `{spacing.xxl}` 48px · `{spacing.section}` 80px.
- **Section vertical padding:** `{spacing.section}` (80px) inside a product tile; tiles stack edge-to-edge with 0 gap (the color change provides the break).
- **Card padding:** `{spacing.lg}` (24px) inside utility grid cards.
- **Button padding:** 8–11px vertical, 15–22px horizontal.
- **Universal rhythm constants:** the 17px body line-height multiplier (~25px line) and 21px tagline size show up on every analyzed page.

### Grid & Container
- **Max content width:** ~980px on text-heavy sections (environment), ~1440px on product grids (store, accessories), full-bleed for product tiles (homepage).
- **Column patterns:** 3 to 5 column utility card grid on store/accessories; 2-column side-by-side tiles on homepage occasional sections; single-column centered stack on product tile heroes.
- **Gutters:** 20–24px between cards in a utility grid.

### Whitespace Philosophy
Apple's whitespace is the product's pedestal. Every tile begins with at least 64px of air above its headline and 48–64px below. Product renders are never crowded; the nearest content to a product image is at least 40px away. The footer is the only area that breaks this — there, Apple goes deliberately dense to make the full information architecture visible at a glance.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow, no border | Full-bleed tiles, global nav, footer, body sections |
| Soft hairline | 1px `rgba(0, 0, 0, 0.08)` border | Utility cards, sub-nav frosted-glass separator |
| Backdrop blur | `backdrop-filter: blur(N)` on Parchment 80% | Sub-nav and the iPhone buy floating sticky bar |
| Product shadow | `rgba(0, 0, 0, 0.22) 3px 5px 30px 0` | Product renders resting on a surface (the only true "shadow" in the system) |

**Shadow philosophy.** Apple uses **exactly one** drop-shadow, and it is applied to photographic product imagery — never to cards, never to buttons, never to text. Elevation in the UI comes from (a) surface-color change (light tile ↔ dark tile) and (b) backdrop-blur on sticky bars. The single shadow is about giving the product weight, not about UI hierarchy.

### Decorative Depth
- **Atmospheric imagery** on the environment page (photographic vista) supplies mood; no CSS gradient involved.
- **Edge-to-edge tile alternation** creates rhythm without borders or shadows — the color change itself is the divider.
- **Backdrop-filter blur** on `{component.sub-nav-frosted}` and `{component.floating-sticky-bar}` creates a "floating over content" effect that's functional, not decorative.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed product tiles (no corner rounding) |
| `{rounded.xs}` | 5px | Inline links when styled as subtle chips (rare) |
| `{rounded.sm}` | 8px | Dark utility buttons (Sign In, Bag), inline card imagery |
| `{rounded.md}` | 11px | White Pearl Button capsules |
| `{rounded.lg}` | 18px | Store utility cards, accessories grid cards |
| `{rounded.pill}` | 9999px | Primary blue pill CTAs, sub-nav buy button, configurator option chips, search input — the signature Apple pill |
| `{rounded.full}` | 9999px / 50% | Circular control chips floating over photography |

### Photography Geometry
- **Hero imagery**: full-bleed, 21:9 or taller on the homepage; 16:9 on environment and shop pages. Product renders are photographic-realistic, often shot on a tinted surface that becomes the tile background.
- **Product renders**: PNG/WebP with transparency; rest on a surface tile and pick up the system shadow.
- **Accessory grid**: square 1:1 crops at `{rounded.lg}` (18px) radius, light neutral backgrounds, product centered with 20–40px internal padding.
- **No rounded imagery in hero tiles** — images are full-bleed rectangular. Rounding (`{rounded.sm}`, `{rounded.lg}`) appears only on inline card imagery.
- Lazy-loading via responsive `srcset` and `sizes` across all breakpoints; CDN-optimized WebP.

## Components

### Top Navigation

**`global-nav`** — Persistent, ultra-thin black nav bar pinned to the top of every page. Background `{colors.surface-black}`, height 44px, text `{colors.on-dark}` in `{typography.nav-link}` (12px / 400 / -0.12px tracking). Links are quiet, spaced ~20px apart, running edge-to-edge across the top. Right-aligned cluster: Search, Bag icons — always visible. On mobile, collapses to hamburger at ~834px and the Apple logo centers.

**`sub-nav-frosted`** — Surface-specific nav that sticks below the global nav. Background `{colors.canvas-parchment}` at 80% opacity with backdrop-filter blur, creating a frosted-glass effect. Height 52px. Content on left: product category name ("iPhone", "Store", "Accessories") in `{typography.tagline}` (21px / 600). Content right: inline nav links in `{typography.button-utility}` (14px), ending in a persistent `{component.button-primary}` ("Buy") or a utility link.

### Buttons

**`button-primary`** — The signature Apple action. Background `{colors.primary}` (Action Blue #0066cc), text `{colors.on-primary}` in `{typography.body}` (SF Pro Text 17px / 400), rounded `{rounded.pill}` (full pill — capsule-shaped), padding 11px × 22px. The full-pill radius IS the brand action signal.
- Active state: `{component.button-primary-active}` — `transform: scale(0.95)` (the system-wide micro-interaction).
- Focus state: `{component.button-primary-focus}` — 2px solid `{colors.primary-focus}` outline.

**`button-secondary-pill`** — Used as the second CTA when two blue pills appear together ("Learn more" / "Buy"). Background transparent, text `{colors.primary}`, 1px solid `{colors.primary}` border, rounded `{rounded.pill}`, padding 11px × 22px. Reads as a "ghost pill."

**`button-dark-utility`** — Global nav actions (Sign In, Bag, language selector). Background `{colors.ink}` (#1d1d1f), text `{colors.on-dark}` in `{typography.button-utility}` (14px / 400 / -0.224px tracking), rounded `{rounded.sm}` (8px), padding 8px × 15px. Active state shrinks via `transform: scale(0.95)`.

**`button-pearl-capsule`** — Product-card secondary button. Background `{colors.surface-pearl}` (#fafafc), text `{colors.ink-muted-80}` in `{typography.caption}` (14px), 3px solid `{colors.divider-soft}` border (functions as a soft ring rather than a visible line), rounded `{rounded.md}` (11px), padding 8px × 14px.

**`button-store-hero`** — A larger primary CTA used on store hero surfaces. Same Action Blue + Paper White as `{component.button-primary}`, but with `{typography.button-large}` (18px / 300 — note the rare weight 300) and slightly more padding (14px × 28px). Used sparingly on the store landing.

**`button-icon-circular`** — Floats over photography. 44 × 44px, background `{colors.surface-chip-translucent}` at ~64% alpha, icon in `{colors.ink}`, rounded `{rounded.full}`. Used for carousel controls, close buttons, and in-image controls (product image thumbnails on the iPhone buy page).

**`text-link`** — Inline body links in `{colors.primary}` (Action Blue). Underlined or non-underlined per context.

**`text-link-on-dark`** — Inline body links on dark tiles in `{colors.primary-on-dark}` (Sky Link Blue #2997ff) — Action Blue would disappear against `{colors.surface-tile-1}`.

### Cards & Containers

**`product-tile-light`** — Full-bleed light tile. Background `{colors.canvas}` (white), text `{colors.ink}`, rounded `{rounded.none}` (0 — tiles touch edges), vertical padding `{spacing.section}` (80px). Centered stack: product name in `{typography.display-lg}` (40px / 600) → one-line tagline in `{typography.lead}` (28px / 400) → two `{component.button-primary}` CTAs ("Learn more" / "Buy") → product render resting on the surface with the system shadow.

**`product-tile-parchment`** — Same as `{component.product-tile-light}` but on `{colors.canvas-parchment}` (#f5f5f7). Used to break two consecutive white tiles.

**`product-tile-dark`** — Full-bleed dark tile. Background `{colors.surface-tile-1}` (#272729), text `{colors.on-dark}`, rounded `{rounded.none}`, vertical padding `{spacing.section}` (80px). Same content stack as the light tile but with `{component.text-link-on-dark}` for inline copy and `{component.button-primary}` (Action Blue still works on the dark surface). Used on the homepage product grid as the alternating dark band.

**`product-tile-dark-2`** — Variant on `{colors.surface-tile-2}` (#2a2a2c). Used where a dark tile sits directly above or below `{component.product-tile-dark}` to create the faintest separation through micro-step lightness change.

**`product-tile-dark-3`** — Variant on `{colors.surface-tile-3}` (#252527). Used at the bottom of the stack and in embedded video/player frames.

**`store-utility-card`** — Used in store grid and accessories grid. Background `{colors.canvas}` (white), 1px solid `{colors.hairline}` border, rounded `{rounded.lg}` (18px), padding `{spacing.lg}` (24px). Top: product image (1:1 crop with `{rounded.sm}` (8px) inner image radius). Below: product name in `{typography.body-strong}` (17px / 600), price in `{typography.body}` (17px / 400), and a `{component.text-link}` ("Buy" or "Learn more"). No shadow by default; product render itself carries the system product-shadow.

**`configurator-option-chip`** — Pill-shaped tappable cell used in the iPhone 17 Pro buy page. Background `{colors.canvas}`, text `{colors.ink}` in `{typography.caption}`, rounded `{rounded.pill}`, padding 12px × 16px. Contains a small product thumbnail + label + price delta. Arranged in a grid of 4–5 options per row.

**`configurator-option-chip-selected`** — Selected state. Border upgrades to 2px solid `{colors.primary-focus}`. Same shape, same content.

**`environment-quote-card`** — A photographic-canvas hero specific to the environment page. Dark photographic backdrop (mountain vista at dawn) with `{colors.surface-tile-1}` as the fallback color, centered white-text headline in `{typography.display-lg}` (40px), small green "Apple 2030" pictographic logo above the headline, single `{component.button-primary}` below. Padding `{spacing.section}` (80px).

**`floating-sticky-bar`** — Floats at the bottom of the viewport on the iPhone 17 Pro buy page during scroll. Background `{colors.canvas-parchment}` at 80% opacity with `backdrop-filter: blur(N)`, height 64px, padding 12px × 32px. Left: running price total in `{typography.body}`. Right: `{component.button-primary}` ("Add to Bag").

### Inputs & Forms

**`search-input`** — The accessories search input. Background `{colors.canvas}`, text `{colors.ink}` in `{typography.body}` (17px), 1px solid `rgba(0, 0, 0, 0.08)` border, rounded `{rounded.pill}` (full pill — search is also pill-shaped, matching the CTA grammar), padding 12px × 20px, height 44px. Leading icon: search glyph at 14px, muted tint.

Error and validation states were not surfaced in the analyzed pages.

### Footer

**`footer`** — Background `{colors.canvas-parchment}` (#f5f5f7), text `{colors.ink-muted-80}`. Link columns in `{typography.dense-link}` (17px / 400 / 2.41 line-height — the relaxed leading is what makes the dense columns scannable). Column headings in `{typography.caption-strong}` (14px / 600). Legal row at the very bottom in `{typography.fine-print}` (12px / 400) with `{colors.ink-muted-48}` text. Vertical padding 64px.

## Do's and Don'ts

### Do
- Use `{colors.primary}` (Action Blue #0066cc) for every interactive element — links, pill CTAs, focus signals — and nothing else. The single accent is non-negotiable.
- Set headlines in `{typography.hero-display}` or `{typography.display-lg}` with negative letter-spacing (`-0.28 → -0.374px`) to get the signature "Apple tight" cadence.
- Run body copy at `{typography.body}` (17px / 400 / 1.47 / -0.374px) — not 16px. The extra pixel defines the brand's reading pace.
- Alternate `{component.product-tile-light}` (or parchment) and `{component.product-tile-dark}` for full-bleed section rhythm. The color change IS the divider.
- Reserve `{rounded.pill}` for the primary blue CTA and any other element that should read as an "action" (configurator chips, search input, sticky bar CTA).
- Apply the single product-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) only to product renders resting on a surface — never on cards, buttons, or text.
- Use `transform: scale(0.95)` as the active/press state on every button — it's the system-wide micro-interaction.
- Keep the global nav `{colors.surface-black}` (true black) — it's the only place pure black appears on most pages.

### Don't
- Don't introduce a second accent color; every "click me" signal is `{colors.primary}` (Action Blue).
- Don't add shadows to cards, buttons, or text — shadow is reserved for product imagery.
- Don't use gradients as decorative backgrounds; atmosphere comes from photography.
- Don't set body copy at weight 500 — Apple's ladder is 300 / 400 / 600 / 700, with 500 deliberately absent. Body is always 400; strong inline is 600; display is 600.
- Don't round full-bleed tiles — tiles are rectangular and edge-to-edge; the color change is the divider.
- Don't tighten line-height below 1.47 for body copy — the editorial leading is part of the brand.
- Don't mix radii grammars — use `{rounded.sm}` for compact utility, `{rounded.lg}` for utility cards, `{rounded.pill}` for pills, and nothing in between (except the rare `{rounded.md}` Pearl Button).
- Don't use `{colors.primary-on-dark}` (Sky Link Blue) on light surfaces — it's the dark-tile-only variant. Action Blue is for light surfaces.

## Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Small phone | ≤ 419px | Single-column tiles; sub-nav collapses to category name + primary CTA only; hero typography drops to 28px |
| Phone | 420–640px | Single-column stack; product renders scale to 80% of tile width; hero h1 drops to 34px |
| Large phone | 641–735px | Tiles transition to tighter padding (48px vertical vs 80px); fine-print wraps |
| Tablet portrait | 736–833px | Global nav collapses to hamburger; sub-nav hides category chips, keeps primary CTA |
| Tablet landscape | 834–1023px | Global nav returns fully expanded; 3-column utility grids become 2-column |
| Small desktop | 1024–1068px | Product tiles use 2/3 width with margin gutters; hero h1 stays at 40px |
| Desktop | 1069–1440px | Full layout; 4–5 column store grids; 1440px content max |
| Wide desktop | ≥ 1441px | Content locks at 1440px, margins absorb extra width |

The structural breakpoints that matter for agents: 1440px (content lock), 1068px (small-desktop), 833px (tablet landscape switch), 734px (tablet portrait), 640px (phone), 480px (small phone).

### Touch Targets
- Minimum 44 × 44px. `{component.button-primary}` lands at ~44 × 100px (with the full-pill radius making the visible hit area more generous than the label suggests).
- `{component.button-icon-circular}` is exactly 44 × 44px.
- Global nav utility links are smaller (~32 × 80px) — they deliberately sit at a tighter target because they're precision desktop actions, and the mobile hamburger replaces them at ≤ 833px.

### Collapsing Strategy
- **Global nav**: full horizontal link row on desktop → collapses to Apple logo + hamburger + bag icon at 834px and below.
- **Sub-nav**: category name + inline links + primary CTA → category name + primary CTA only at mobile; inline links move into a hamburger tray.
- **Product tiles**: stack from 2-column to 1-column at 834px; vertical padding tightens from 80px → 48px at small-phone.
- **Utility grids** (store, accessories): 5-col → 4-col (1440px) → 3-col (1068px) → 2-col (834px) → 1-col (640px).
- **Hero typography**: `{typography.hero-display}` (56px) → `{typography.display-lg}` (40px) at 1068px → 34px at 640px → 28px at 419px.

### Image Behavior
- All product imagery uses responsive `srcset` with breakpoint-matched crops.
- Hero photography may switch art direction at mobile (e.g., the environment page's vista crops to a taller aspect ratio on mobile, framing the subject differently).
- Product renders maintain their 1:1 or 4:3 aspect ratios across breakpoints; only scale changes.
- Lazy-loading is default; the above-fold hero loads eagerly.

## Iteration Guide

1. Focus on ONE component at a time. Reference its YAML key directly (`{component.product-tile-dark}`, `{component.search-input}`).
2. Variants of an existing component (`-active`, `-focus`, `-2`, `-3`) live as separate entries in `components:`.
3. Use `{token.refs}` everywhere — never inline hex.
4. Never document hover. Default and Active/Pressed states only.
5. Display headlines stay SF Pro Display 600 with negative letter-spacing. Body stays SF Pro Text 400 at 17px. The boundary is unbreakable.
6. The single drop-shadow (`rgba(0, 0, 0, 0.22) 3px 5px 30px`) is reserved for product photography only.
7. When in doubt about emphasis: alternate surface (light → dark tile) before adding chrome.

## Known Gaps

- Form validation and error states were not surfaced on the analyzed pages; only the neutral search input is documented.
- The homepage's embedded video/player frame uses `{colors.surface-black}`; interior player controls are not documented (they're a platform widget, not a design token).
- Some component imagery is dynamic (rotating product hero) and its specific copy varies per surface — component specs name the structure, not the rotating content.
- Dark-mode counterparts for store and accessories utility cards were not surfaced on the analyzed pages; the system documented is the daytime/light-dominant variant Apple ships by default.
- Atmospheric photography (environment page mountain vista) is a content asset, not a design token; the documented `{component.environment-quote-card}` describes the structural surface only.
- The exact backdrop-filter blur radius on `{component.sub-nav-frosted}` and `{component.floating-sticky-bar}` is platform-dependent; production CSS uses `saturate(180%) blur(20px)` as a typical baseline but the value isn't formalized as a token.

## Adaptasi Mobile untuk PraktikumKU

Dokumen ini menganalisis Apple.com. Bagian ini menerjemahkan arah visual tersebut ke aplikasi React Native PraktikumKU. Yang diambil adalah prinsipnya: Action Blue, parchment, tipografi sistem, tombol pill, dan satu shadow untuk mockup. Layout Apple.com tidak disalin.

**Design read:** aplikasi kehadiran praktikum untuk mahasiswa dan asisten, dengan bahasa visual Apple yang tenang, dial ENERGY 2 / RHYTHM 2 / MOTION 1.

### Token mobile

| Token | Nilai | Pemakaian |
|---|---|---|
| `action-blue` | `#0066cc` | tombol utama, tautan, fokus |
| `parchment` | `#f5f5f7` | latar halaman |
| `surface` | `#ffffff` | kartu dan sheet |
| `ink` | `#1d1d1f` | teks utama |
| `muted` | `#6e6e73` | teks sekunder |
| `hairline` | `#d2d2d7` | garis dan border |
| `success` | `#248a3d` | badge sesi dibuka dan feedback sukses |
| `warning` | `#b25000` | badge belum dibuka |
| `danger` | `#d70015` | error dan aksi keluar |

- Radius: kartu 16, input 12, bottom sheet 24 di sudut atas, tombol dan badge pill.
- Spacing: 4, 8, 12, 16, 24, 32. Padding layar 16.
- Tipografi: 34/40 untuk judul landing, 28 untuk judul layar, 22 untuk judul kartu besar, 17 untuk body, 15 untuk meta, 13 untuk label. iOS memakai SF Pro, Android memakai system sans. Tidak ada dependency font eksternal.
- Shadow hanya untuk dropdown profil dan bottom sheet. Kartu memakai border tipis, bukan shadow.

### Layout

- Layar memakai safe area dan flexbox. Tidak ada container 1440px atau padding section 80px.
- Di tablet, konten dibatasi sekitar 720px dan tetap di tengah.
- Header peran setinggi 44pt. Profil menjadi tombol avatar inisial 44 x 44 di kanan. Tombol Beranda menjadi tombol teks dengan chevron di kiri pada halaman detail.
- Kartu jadwal memakai padding 16, jarak antar kartu 12, dan seluruh area kartu dapat ditekan.
- Bottom sheet konfirmasi muncul dari bawah, punya handle, tinggi maksimal 85%, dan tombol aksi di bawah.
- Dropdown profil berlabuh di kanan atas, lebar sekitar 280, radius 12, dengan item setinggi minimal 44.

### Pola layar

- **Landing:** judul 34 sampai 40, satu paragraf nilai produk, tombol utama **Masuk**, lalu dua ringkasan peran. Tidak ada statistik, testimoni, atau logo palsu.
- **Login:** judul 28, dua field, tombol **Masuk** yang nonaktif sampai form terisi, dan banner error di atas tombol. Tidak ada kartu pengisi otomatis.
- **Jadwal:** kartu berisi nama praktikum, kelas dan lab, hari dan tanggal, jam, serta badge status. Satu kartu punya satu fokus: nama praktikum.
- **Detail:** judul, badge status, grid meta, lalu area aksi. Tombol nonaktif selalu disertai alasan.
- **Profil:** header identitas berisi nama, NIM/NIP, dan peran. Item Beranda, Ganti peran (demo), dan Keluar akun. Keluar akun memakai style danger.
- **Rekap:** ringkasan jumlah hadir di atas, daftar peserta di bawah, urut waktu.

### Motion dan aksesibilitas

- Motion hanya untuk membuka bottom sheet dan dropdown, sekitar 150 sampai 200ms. Tidak ada parallax, autoplay, atau animasi dekoratif.
- Semua target sentuh minimal 44 x 44pt.
- Status sesi memakai teks, bukan warna saja.
- Teks mendukung dynamic type sampai sekitar 1.3x tanpa terpotong.
- Kontras teks minimal 4.5:1 untuk teks normal dan 3:1 untuk teks besar.
- Hormati reduce motion.

### Yang tidak dipakai

- Hero 56px dan padding section 80px dari Apple.com.
- Grid produk, fotografi produk, logo Apple, dan navigasi global desktop.
- Glassmorphism, gradient dekoratif, dan shadow di semua kartu.
- Tombol atau tautan yang tidak punya tujuan nyata.

## Arah Visual PraktikumKU (Sprint 3, resmi)

Bagian ini ditambahkan pada Sprint 3 di akhir dokumen. Isinya arah visual resmi, struktur token, dan dokumen kerja P3. Tidak ada bagian lama yang dihapus atau diubah.

### 1.1 Status dan sumber

- Seluruh isi di atas (front matter, analisis Apple.com, dan `## Adaptasi Mobile untuk PraktikumKU`) adalah catatan historis. Mulai Sprint 3, isi itu bukan lagi acuan arah visual.
- Arah resmi adalah bahasa visual navy pada `docs/design-references/flows/*`.
- Rujukan baris di kode tetap sah karena bagian ini ditulis setelah baris 625: `src/components/ui/shadow-style.ts:5` (baris 591), `src/constants/theme.ts:47` (baris 596), `src/components/ui/status-badge.tsx:10` (baris 615) dan `src/components/ui/status-badge.tsx:9` (baris 617), `src/components/ui/motion.ts:4` (baris 618).
- Sumber keputusan ada di luar repo: `~/.commandcode/plans/praktikumku-sprint3-decisions.md` dan `~/.commandcode/plans/praktikumku-phase1-design-audit.md`.

Label status yang dipakai di seluruh bagian ini:

| Label | Arti |
|---|---|
| `[TERKONFIRMASI]` | Keputusan yang sudah diambil, sumbernya disebut. |
| `[TERBUKA]` | Detail desain yang belum diputuskan. Bukan usulan P3. |
| `[EKSTERNAL]` | Dependency milik PM atau owner lain. Tidak dibahas teknis di sini. |

`[TERKONFIRMASI]`:

1. Bahasa visual navy dari `docs/design-references/flows/*` menggantikan arah Apple.com.
2. Design token dimiliki P3: `src/constants/tokens.js` dan `src/constants/theme.ts`.
3. `src/global.css`, konfigurasi Tailwind, dan konfigurasi native app dimiliki P1.
4. Implementasi Maps (US-02 dan US-03) dimiliki P1 dengan `react-native-maps`.
5. P3 menyumbang styling marker dan activity card hanya bila diminta P1.
6. P3 tidak mengambil alih pekerjaan P1 atau P2.

### 1.2 Arah visual navy

`[TERKONFIRMASI]` Navy menggantikan Action Blue `#0066cc` dan parchment `#f5f5f7` yang tercatat di baris 578 dan 579 dokumen ini.

`[TERBUKA]` Nilai hex navy belum diputuskan. Tiga kandidat yang sudah ada di repo:

| Kandidat | Sumber | Catatan |
|---|---|---|
| `≈#0F1B3D` | Pengukuran acuan visual pada audit Phase 1 | Belum diverifikasi terhadap Figma |
| `#192858` | `src/constants/tokens.js:40` (`loginInk`) | Sudah dipakai layar login dan register |
| Belum ada | Figma | Tidak dapat diakses dari lingkungan ini |

Penetapan nilai akhir ada di luar kewenangan P3. Sampai nilai itu ada, `src/constants/tokens.js` tetap sumber tunggal nilai desain dan dokumen ini tidak menetapkan hex final baru.

Aturan visual yang berlaku tanpa menunggu hex:

| Area | Aturan |
|---|---|
| Kanvas | Latar terang. Gelap bukan default. |
| Permukaan | Kartu dan field memakai permukaan lavender muda, bukan putih di atas putih. |
| Aksi utama | Satu tombol navy berbentuk pill, tinggi 56dp. |
| Aksi sekunder | Outline dengan warna aksi, bukan pill terisi kedua. |
| Baris meta | Setiap baris informasi penting didampingi ikon. |
| Status | Badge memakai teks, bukan warna saja (baris 615). |
| Elevasi | Hanya dropdown profil dan bottom sheet (baris 591). |

### 1.3 Struktur token semantik, terang dan gelap

Struktur dibagi tiga lapisan. Nama token mempertahankan nama yang sudah ada di `src/constants/tokens.js` agar tidak memicu rename massal di file milik P1 dan P2.

**Lapisan 1: primitif.** Ramp navy (50 sampai 900), ramp netral, dan hue status. `[TERBUKA]` untuk nilai.

**Lapisan 2: semantik.** Nilai di bawah adalah yang berlaku hari ini. Bila berbeda, `src/constants/tokens.js` yang menang.

| Token | Terang | Gelap | Pemakaian |
|---|---|---|---|
| `text` | `#1d1d1f` | `#f5f5f7` | Teks utama |
| `textSecondary` | `#6e6e73` | `#cccccc` | Teks sekunder |
| `textInverse` | `#ffffff` | `#1d1d1f` | Teks di atas warna aksi |
| `background` | `#f5f5f7` | `#000000` | Latar layar |
| `backgroundElement` | `#ffffff` | `#272729` | Kartu dan sheet |
| `backgroundSelected` | `#e8e8ed` | `#2a2a2c` | Baris terpilih |
| `border` | `#d2d2d7` | `#3a3a3c` | Garis dan border |
| `primary` | `#0066cc`, diganti navy `[TERBUKA]` | `#2997ff`, diganti navy `[TERBUKA]` | Aksi utama, tautan, fokus |
| `primaryText` | `#ffffff` | `#00131f` | Label di atas `primary` |
| `success` / `successSurface` | `#248a3d` / `#e4f5ec` | `#30d158` / `#10291e` | Status dibuka, feedback sukses |
| `warning` / `warningSurface` | `#b25000` / `#fff4e0` | `#ff9f0a` / `#2b2213` | Status belum dibuka |
| `danger` / `dangerSurface` | `#d70015` / `#fdecea` | `#ff453a` / `#2e1715` | Error dan aksi keluar |
| `overlay` | `#000000` | `#000000` | Scrim modal |
| `loginBackground` | `#ffffff` | `#ffffff` | Kanvas layar auth |
| `loginInk` | `#192858` | `#192858` | Teks dan CTA navy di layar auth |
| `loginMuted` | `#5f6880` | `#5f6880` | Teks sekunder layar auth |
| `loginField` | `#f1f4f8` | `#f1f4f8` | Isian field layar auth |

Slot baru yang diusulkan sebagai struktur, belum sebagai nilai. Semua `[TERBUKA]`:

| Slot | Pemakaian |
|---|---|
| `surfaceMuted` | Permukaan lavender muda untuk kartu terpilih dan field |
| `chip`, `chipSelected` | Chip filter dan pemilih kategori |
| `notificationDot` | Titik merah pada ikon lonceng |
| `focusRing` | Cincin fokus keyboard dan TV |
| `statusOngoing`, `statusUpcoming`, `statusDone` | Kosakata status sesi |
| `statusPresent`, `statusPermission`, `statusAbsent` | Kosakata kehadiran dan izin |
| Permukaan tiap status | Pasangan tone dan latar, wajib lolos kontras 4.5:1 |

**Lapisan 3: komponen.** Satuan dimensi memakai dp.

| Token | Nilai | Pemakaian |
|---|---|---|
| `button` | 56dp | Tinggi tombol aksi utama |
| `touch` | 44dp | Target sentuh minimum |
| `field` | 52dp | Tinggi field input |
| `fieldPadding` | 18dp | Padding horizontal field |
| `card radius` | 16dp | Sudut kartu |
| `sheet radius` | 24dp | Sudut atas bottom sheet |
| `pill` | 999dp | Tombol, badge, chip |
| `menuWidth` | 280dp | Dropdown profil |
| `sheetMax` | 85% | Tinggi maksimum bottom sheet |
| `shadow` | tunggal | Hanya dropdown dan bottom sheet |

`[TERBUKA]` Mekanisme dark mode belum diputuskan. Bukti yang saling bertentangan: `tailwind.config.js:23` memakai `darkMode: 'class'`; `src/global.css:33` memakai `@media (prefers-color-scheme: dark)`; komentar `src/global.css:8` dan `AGENTS.md` menyebut `media`; `app.json` memakai `userInterfaceStyle: "automatic"`; tidak ada theme provider atau toggle. Bagian ini mendokumentasikan **struktur** token gelap, bukan menyatakan dark mode sudah dikirim. Perbaikan mekanisme berada di `src/global.css` dan `tailwind.config.js`, keduanya milik P1.

### 1.4 Tipografi

- Keluarga font tetap font sistem. Baris 590 sudah menyatakan tidak ada dependency font eksternal, dan menambah font memerlukan persetujuan owner dependency.
- Skala yang berlaku dari `src/constants/tokens.js:112`. Ukuran dan line-height dalam dp.

| Token | Ukuran / baris | Pemakaian |
|---|---|---|
| `caption` | 13 / 18 | Label, badge, keterangan |
| `small` | 15 / 20 | Meta dan teks pendukung |
| `body` | 17 / 24 | Teks isi |
| `subtitle` | 22 / 26 | Judul kartu besar |
| `title` | 28 / 36 | Judul layar |
| `display` | 34 / 40 | Judul landing |
| `authTitle` | 30 / 38 | Judul layar auth |
| `authBody` | 15 / 21 | Teks bantu layar auth |
| `authButton` | 16 / 24 | Label tombol layar auth |

- `[TERBUKA]` Skala tipografi exact dan keluarga font dari Figma. Headline pada acuan visual lebih rapat daripada default sistem.
- Tambahan yang diusulkan berupa struktur, bukan nilai: token `letterSpacing` dengan tiga tingkat (`rapat`, `normal`, `lebar`). Nilainya menunggu Figma.
- Aturan aksesibilitas yang sudah berlaku dan dipertahankan: dynamic type sampai sekitar 1.3x (baris 616), kontras 4.5:1 untuk teks normal dan 3:1 untuk teks besar (baris 617), status tidak dibedakan hanya lewat warna (baris 615).

### 1.5 Spacing, radius, dan elevasi

Spacing 4-based yang berlaku dari `src/constants/tokens.js:73`:

| Token | Nilai | Pemakaian |
|---|---|---|
| `half` | 2dp | Koreksi tipografis |
| `one` | 4dp | Jarak dalam komponen |
| `two` | 8dp | Jarak antar elemen kecil |
| `twoHalf` | 12dp | Jarak antar kartu (baris 598) |
| `three` | 16dp | Padding kartu dan padding layar (baris 589) |
| `four` | 24dp | Padding blok |
| `five` | 32dp | Jarak antar bagian |
| `six` | 64dp | Jarak besar |

Radius yang berlaku dari `src/constants/tokens.js:102`:

| Token | Nilai | Pemakaian |
|---|---|---|
| `sm` | 8dp | Elemen kecil |
| `md` | 12dp | Input dan dropdown |
| `lg` | 16dp | Kartu |
| `authCard` | 20dp | Kartu layar auth |
| `xl` | 24dp | Bottom sheet |
| `pill` | 999dp | Tombol dan badge |

Elevasi: satu bayangan untuk dropdown profil dan bottom sheet saja (baris 591 dan `src/constants/tokens.js:92`). Kartu tidak memakai shadow (baris 624). Arah navy tidak menambah shadow kartu.

### 1.6 Varian komponen bersama

| Komponen | Varian hari ini | Diusulkan | Status |
|---|---|---|---|
| `AppButton` | `primary`, `secondary`, `ghost`, `danger`, `auth` (`app-button.tsx:5`) | Tambah `size` sm/md/lg dan `fullWidth` | MODIFY |
| `StatusBadge` | `belum-dibuka`, `dibuka`, `ditutup` (`status-badge.tsx:12`) | Tambah peta tone untuk kosakata baru, label tetap sampai kosakata diputuskan | MODIFY |
| `TextField` | `default`, `auth` (`text-field.tsx:15`) | Tambah `helper` dan `counter` | MODIFY |
| `EmptyState` | `judul`, `deskripsi`, `ikon` (`empty-state.tsx:23`) | Tambah `tone` dan slot `aksi` | MODIFY |
| `Card` | Statis dan dapat ditekan (`card.tsx`) | Tetap | KEEP |
| `Screen`, `Banner`, `BottomSheet`, `ProfileMenu`, `HomeButton` | Satu varian | Tetap | KEEP |

Rincian dan API ada di Lampiran A.

### 1.7 Yang sengaja tidak diubah

- Nilai Apple di front matter.
- Tabel token mobile lama dan pola layar lama.
- Lima rujukan baris 591, 596, 615, 617, dan 618.
- Tidak ada penghapusan di bagian mana pun.

## Lampiran A: Rencana implementasi design system (P3)

Lampiran ini dokumen kerja P3. Bukan keputusan PM dan bukan janji jadwal.

### A.1 Kondisi kit hari ini

Sepuluh ekspor di `src/components/ui/index.ts`, ditambah dua helper yang tidak diekspor:

| Ekspor | Berkas | Catatan |
|---|---|---|
| `AppButton` | `app-button.tsx` | 5 varian, `loading`, `disabledReason`, tinggi 44dp |
| `Banner` | `banner.tsx` | Feedback sukses dan gagal |
| `BottomSheet` | `bottom-sheet.tsx` | Memakai `shadow-style.ts` dan `motion.ts` |
| `Card` | `card.tsx` | Statis dan dapat ditekan |
| `EmptyState` | `empty-state.tsx` | Tanpa slot aksi |
| `HomeButton` | `home-button.tsx` | Tombol kembali di header |
| `ProfileMenu` | `profile-menu.tsx` | Dropdown identitas |
| `Screen` | `screen.tsx` | Safe area dan padding |
| `StatusBadge` | `status-badge.tsx` | Tiga status, teks dan tone |
| `TextField` | `text-field.tsx` | Dua varian, `error`, toggle kata sandi |
| `shadow-style.ts` | Bukan ekspor | Satu-satunya bayangan proyek |
| `motion.ts` | Bukan ekspor | `useReduceMotion`, `useAnimasiMuncul` |

### A.2 Matriks KEEP, MODIFY, ADD, DEFER

| Item | Keputusan | Alasan satu baris | Owner path | Koordinasi |
|---|---|---|---|---|
| `tokens.js` sebagai sumber tunggal dan strategi CSS variable | KEEP | Menjaga satu sumber nilai dan dark mode yang dapat ditimpa | P3 (`src/constants/tokens.js`) | P1 membaca nilai yang sama di `global.css` |
| `Screen`, `Card`, `Banner`, `BottomSheet`, `ProfileMenu`, `HomeButton` | KEEP | Sudah dipakai lintas fitur dan tidak menghambat arah navy | P3 (`src/components/ui/**`) | Tidak ada |
| `shadow-style.ts`, `motion.ts` | KEEP | Satu bayangan dan reduce motion sudah benar | P3 | Tidak ada |
| Pola `StatusBadge` (teks dan tone) | KEEP | Alasan kontras sudah terdokumentasi di `status-badge.tsx:8-10` | P3 | Tidak ada |
| `teksKosong` | KEEP | Salinan copy PRD, `empty-state.tsx:5` | P3 | Perubahan copy lewat PM |
| `AppButton` | MODIFY | Perlu ukuran 56dp dan lebar penuh agar sesuai aksi utama navy | P3 | Tidak ada untuk pembuatan |
| `EmptyState` | MODIFY | State gagal butuh aksi "Coba lagi" tanpa komponen baru | P3 | Tidak ada |
| `StatusBadge` | MODIFY | Perlu peta tone baru tanpa mengubah label | P3 | Label menunggu keputusan kosakata |
| `TextField` | MODIFY | Perlu `helper` dan `counter` untuk form P2 | P3 | Kebutuhan form dari P2 |
| `index.ts` | MODIFY | Menambah ekspor komponen baru | P3 | Aturan tambah ekspor ada di `PEMBAGIAN-TUGAS.md` bagian 3 |
| `Skeleton` dan `LoadingState` | ADD | Mengganti teks "Memuat" dengan state memuat yang nyata | P3 (`src/components/ui/**`) | Tidak ada |
| `SectionHeader` | ADD | Judul bagian dan aksi "Semua" belum punya komponen | P3 | Tidak ada |
| `StatCard` | ADD | Rekap butuh angka ringkas dengan tone | P3 | Struktur rekap di route P3 |
| `FilterChips` | ADD | Filter kategori izin butuh chip dan reset | P3 | Tidak ada |
| `SearchBar` | ADD | Pencarian peserta butuh field dengan ikon dan hapus | P3 | Tidak ada |
| `IconButton` | ADD | Tombol ikon 44dp untuk lonceng, kembali, dan tutup | P3 | Tidak ada |
| `ConfirmSheet` | ADD | Menggantikan `Alert.alert` dengan konfirmasi bottom sheet | P3 | Pemasangan ke layar P1/P2 butuh PR ke owner |
| `AppHeader` | ADD | Header wordmark, lonceng, dan pill peran belum ada | P3 | Pemasangan ke layout P1/P2 butuh PR ke owner |
| Restrukturisasi `design.md` dan pembaruan lima rujukan baris | DEFER | Semua pengutip milik P3, dikerjakan saat source boleh diubah | P3 | Tidak ada |
| Toggle dark mode dan perbaikan mekanisme | DEFER | `tailwind.config.js:23` dan `global.css:33` milik P1 | P1 | Butuh PR P1 |
| Bundling font eksternal | DEFER | Perlu persetujuan dependency | PM | Butuh persetujuan |
| Shadow kartu | DEFER | Dilarang baris 624 dan membuat semua elemen melayang | P3 | Tidak ada |
| Tab bar floating dan label tab | DEFER | Layout milik P1 dan P2 | P1, P2 | Butuh PR ke owner |
| Marker map dan activity card | DEFER | Map milik P1, P3 hanya bila diminta | P1 | Permintaan dari P1 |
| Komponen QR dan notifikasi | DEFER | Bergantung kontrak eksternal | PM, P2 | `[EKSTERNAL]` |
| Elevasi `Card`, `multiline`, `TimeField`, `FormField` penuh | DEFER | Menunggu kebutuhan form P2 yang konkret | P2, P3 | Kebutuhan dari P2 |

Batasan yang berlaku untuk semua item ADD: membuat komponen di `src/components/ui/**` adalah milik P3. Memasang komponen itu ke layar milik P1 atau P2 memerlukan koordinasi dan PR ke owner layar tersebut, bukan penggabungan sepihak.

### A.3 API yang diusulkan

Gaya mengikuti `AppButtonProps` yang ada: props eksplisit, `className` opsional, dan `accessibilityLabel` untuk kontrol ikon.

```ts
// MODIFY
type AppButtonProps = {
  // ...props yang ada
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
};

type EmptyStateProps = {
  // ...props yang ada
  tone?: 'kosong' | 'gagal';
  aksi?: { label: string; onPress: () => void };
};

// ADD
type SectionHeaderProps = {
  judul: string;
  aksi?: { label: string; onPress: () => void };
};

type StatCardProps = {
  label: string;
  nilai: string;
  tone?: 'netral' | 'hadir' | 'izin' | 'absen';
};

type FilterChipsProps = {
  opsi: Array<{ nilai: string; label: string }>;
  terpilih: string;
  onPilih: (nilai: string) => void;
  onReset?: () => void;
};

type SearchBarProps = {
  nilai: string;
  onUbah: (nilai: string) => void;
  placeholder?: string;
};

type IconButtonProps = {
  ikon: ReactNode;
  onPress: () => void;
  label: string;
  badge?: boolean;
};

type SkeletonProps = { baris?: number; className?: string };

type ConfirmSheetProps = {
  terbuka: boolean;
  judul: string;
  deskripsi?: string;
  labelKonfirmasi: string;
  onKonfirmasi: () => void;
  onTutup: () => void;
  loading?: boolean;
  tone?: 'utama' | 'bahaya';
};

type AppHeaderProps = {
  judul?: string;
  denganBell?: boolean;
  badgeNotifikasi?: boolean;
  peran?: Peran;
};
```

Keputusan tentang `ErrorState`: **tidak dibuat sebagai komponen terpisah.** State gagal memakai `EmptyState` dengan `tone="gagal"` dan slot `aksi`. Dua komponen dengan isi yang sama akan cepat berbeda sendiri, dan `EmptyState` sudah memegang copy kondisi kosong dari PRD. Bila nanti state gagal butuh struktur yang benar-benar berbeda (misalnya kode galat dan tombol coba ulang bertingkat), pemisahan dievaluasi ulang dengan bukti pemakaian.

Setiap komponen wajib memenuhi: target sentuh minimum 44dp, `accessibilityLabel` untuk kontrol ikon, dan state nonaktif disertai alasan yang terlihat.

### A.4 Koordinasi lintas owner

| Perubahan | Owner | Isi koordinasi | Dampak bila tertunda |
|---|---|---|---|
| Token navy berlaku di layar | P1 | Kanal RGB di `src/global.css` harus disamakan dengan `src/constants/tokens.js` | `tokens.js` berubah tetapi utility tetap memakai warna lama |
| Mekanisme dark mode | P1 | Menyamakan `tailwind.config.js:23` dengan `global.css:33` | Token gelap tidak dapat diverifikasi |
| `AppHeader` dipakai di header peran | P1, P2 | PR ke layout `src/app/(praktikan)` dan `src/app/(asisten)` | Komponen siap tetapi tidak terpasang |
| `ConfirmSheet` menggantikan `Alert.alert` | P2 | PR ke `src/app/(asisten)/kelas/**` | Konfirmasi tetap memakai dialog platform |
| Konfigurasi map native dan izin perangkat | P1, PM | `[EKSTERNAL]` | Tidak menghambat kit P3 |
| Kontrak QR | P2, PM | `[EKSTERNAL]` | Menahan komponen QR |
| Trigger notifikasi | P2 | `[EKSTERNAL]`, berada di `src/lib/sesi.ts` dan `src/lib/izin.ts` | Menahan komponen notifikasi |

## Lampiran B: Readiness P3 (perencanaan)

Lampiran ini perencanaan. Tidak ada source code, komponen, atau fitur Sprint 3 yang diimplementasikan pada fase ini.

### B.1 Dapat dimulai mandiri

- Amandemen `docs/design.md` beserta Lampiran A dan B.
- `Skeleton` dan `LoadingState`, karena menggantikan teks "Memuat" dan tidak memerlukan token baru.
- `SectionHeader` dan `StatCard` dengan tone yang sudah tersedia (`success`, `warning`, `danger` beserta permukaannya).
- `SearchBar`, `FilterChips`, lalu US-15 dan US-16 memakai token yang ada.
- Restrukturisasi bagian atas rekap (US-17) memakai `Card` dan `StatusBadge` yang ada.
- Modul validasi bersama untuk US-18 sebagai fungsi murni tanpa UI.

### B.2 Tertahan dependency eksternal

| Pekerjaan P3 | Penahan | Pemilik penahan | Yang dapat dikerjakan sementara menunggu |
|---|---|---|---|
| Sapuan warna navy ke layar | Nilai hex dan type scale | PM dan akses Figma | Struktur token dan komponen di `src/components/ui/**` |
| Verifikasi dark mode | Mekanisme di P1 | P1 | Dokumentasi struktur token gelap |
| Label status baru | Kosakata status | PM | Peta tone tanpa mengubah label |
| Label dan gaya tab | Layout tab | P1, P2 | Tidak ada, tab bukan milik P3 |
| Komponen QR | Kontrak QR | P2, PM | Tidak ada |
| Komponen notifikasi | Mekanisme push dan trigger | PM, P2 | Tidak ada |
| Styling marker dan activity card | Implementasi map | P1 | Menunggu permintaan P1 |
| Adopsi `AppHeader` dan `ConfirmSheet` | PR ke layar P1 dan P2 | P1, P2 | Komponen dibuat dan diuji mandiri |

### B.3 Urutan usulan P3

1. Dokumen ini.
2. `Skeleton`, `SectionHeader`, `StatCard`, dan perluasan `EmptyState`.
3. `SearchBar`, `FilterChips`, lalu US-15 dan US-16.
4. US-17 rekap dengan kit yang sudah ada.
5. Modul validasi bersama, lalu `ConfirmSheet` sebagai kesiapan PR ke P2.
6. Setelah token final: sapuan warna navy dan `AppHeader`.
