# DESIGN.md — Enciclopedia Naturista de Chile

Generated from `styles.css` (4,200+ lines). Update after major CSS changes with `/anthropic-skills:impeccable document`.

---

## Color System

All tokens defined as CSS custom properties on `:root`.

### Base palette

| Token | Value | Role |
|---|---|---|
| `--bg-deep` | `#14180f` | Page background (darkest) |
| `--bg` | `#1c2218` | Surface level 1 |
| `--bg-2` | `#232a1d` | Surface level 2 (cards) |
| `--moss` | `#6a8a52` | Primary green, inactive states |
| `--moss-bright` | `#9bbb7a` | Accent, CTAs, highlights |
| `--moss-deep` | `#3d5530` | Deep green, borders on dark |
| `--terracotta` | `#c97b56` | Warnings, danger, alerts |
| `--terracotta-soft` | `#e2a585` | Soft warning, secondary |
| `--amber` | `#d4a574` | Ancestral/traditional accent |
| `--off-white` | `#f5f1e8` | Primary text |
| `--cream` | `#ebe4d2` | Secondary text, labels |

### Text opacity scale

```css
--text:           #f5f1e8          /* 100% — headings, primary */
--text-soft:      rgba(..., 0.72)  /* 72% — body copy */
--text-mute:      rgba(..., 0.50)  /* 50% — hints, metadata */
--text-secondary: rgba(..., 0.55)  /* 55% — secondary labels */
```

### Glass tokens

```css
--glass-bg:        rgba(245,241,232, 0.06)
--glass-bg-hi:     rgba(245,241,232, 0.12)
--glass-border:    rgba(245,241,232, 0.14)
--glass-border-hi: rgba(245,241,232, 0.28)
--glass-shadow:    0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)
```

### Category gradients (body-system identity)

Each system has a unique gradient used on card art headers and system buttons.

| System | Token | Direction |
|---|---|---|
| Respiratorio | `--grad-respiratorio` | teal → sage |
| Digestivo | `--grad-digestivo` | terracotta → amber → cream |
| Piel | `--grad-piel` | warm tan → off-white |
| Nervioso | `--grad-nervioso` | deep purple → lavender |
| Músculo/Dolor | `--grad-musculo` | dark terracotta → salmon |
| Circulatorio | `--grad-circulatorio` | crimson → coral |
| Renal | `--grad-renal` | slate teal → light blue |
| Mujer | `--grad-mujer` | rose → blush |
| Defensas/Inmuno | `--grad-defensas` | moss → lime |
| Espiritual | `--grad-espiritual` | near-black → gold |
| Mapuche | `--grad-mapuche` | deep green → amber |
| Maternidad | `--grad-maternidad` | plum → blush |
| Lactancia | `--grad-lactancia` | slate blue → pale blue |
| Cosmético | `--grad-cosmetico` | amber → cream |

---

## Typography

**Fonts loaded**: Google Fonts — `Playfair Display` (serif, titles) + `Inter` (sans-serif, UI).

```css
body { font-family: 'Inter', -apple-system, 'Segoe UI', system-ui, sans-serif; }
/* Plant names, modal titles, section headings */
.playfair { font-family: 'Playfair Display', Georgia, serif; font-weight: 600–700; }
```

**Scale** (inferred from usage):
- Hero/modal title: ~28–32px, Playfair, weight 700
- Card title: ~17–18px, Inter, weight 600
- Body: 15–16px, Inter, weight 400
- Label/chip: 12–13px, Inter, weight 500–600, uppercase or sentence case
- Base line-height: 1.5

---

## Shape / Border Radius

```css
--r-sm:  12px   /* Chips, badges, inputs, small buttons */
--r:     20px   /* Standard cards */
--r-lg:  28px   /* Modal content panels, large cards */
--r-xl:  36px   /* Hero sections, modal container */
```

---

## Motion

```css
--ease:     cubic-bezier(.22, .61, .36, 1)    /* standard transitions */
--ease-out: cubic-bezier(.16, 1, .3, 1)       /* entrances, reveals */
/* Standard durations: 0.18s (micro), 0.22s (UI), 0.32s (panels) */
```

Animated background: `orbDrift` and `gradShift` keyframes on `.bg-stage` — purely decorative, can slow screenshots.

---

## Elevation / Layering

Three tiers:
1. **Page**: `--bg-deep` (`#14180f`)
2. **Surface**: `--bg` + `--bg-2` for card backgrounds
3. **Floating**: modals, panels — use `--glass-shadow` + `backdrop-filter: blur(12–20px)`

Glass used purposefully on overlays and the detail modal. Not on every card.

---

## Component Patterns

### Cards (plants grid)
- Background: `var(--glass-bg)` + `border: 1px solid var(--glass-border)`
- Hover: lift via `transform: translateY(-4px)`, border to `--glass-border-hi`
- Never nested cards

### Modals (plant + recipe detail)
- Full-height overlay (`#detailModal` with class `.show`)
- Scrollable `.modal-content` inside
- Top bar with close (×) and share buttons
- Art header: full-bleed gradient + SVG illustration
- Reading progress bar on scroll

### Recipe search cards (`.rsearch-card`)
- Category pill (colored gradient background, small, top-left)
- Title (Inter 600)
- `uso` field below title with bullseye icon (therapeutic purpose)
- Propiedades chips (small, glass-bordered)
- Click opens recipe detail modal

### Body system grid (`.receta-sistemas-grid`)
- 12 buttons in 4×3 grid (responsive: 3×4 on mobile)
- Each: emoji + label + desc, colored dot accent per system
- Drill-down to dolencias chips on click

### Chips / Badges
- Border-radius: `--r-sm`
- Small: 11–12px, padded 4px 10px
- Glass style or solid colored (category pills)

### Toast notifications
- Bottom-center, slide up
- Types: `ok` (moss), `warn` (amber), `remove` (terracotta), `info` (glass)

---

## Maternidad palette (special case)

```css
--matern-rose:      #d4789a
--matern-rose-soft: rgba(212,120,154,0.2)
--matern-blue:      #70a8cc
--matern-blue-soft: rgba(112,168,204,0.2)
```

Used only in the Maternidad tab. Signals safety/care context.
