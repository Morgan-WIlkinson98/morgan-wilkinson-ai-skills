# 02. Foundations: hierarchy, type, color, spacing, surfaces

Numbers here are sensible defaults. If the project defines its own scale, use that instead.

## 1. Visual hierarchy

Rank content by importance, then express rank with a small set of tools:

| Tool | Use it to |
|------|-----------|
| Size | Separate headline, body, caption |
| Weight | Emphasize without growing |
| Contrast (color/lightness) | Pull primary content forward and push secondary back |
| Position | Top-left and top-center are read first in left-to-right languages |
| Space | Isolate what matters; group what belongs together |
| Shape/fill | A filled button outranks an outlined one, which outranks a text link |

**Squint test:** blur your eyes or view a small screenshot. You should still see the structure: what is the title, what is the main action, which blocks are groups. If it looks like a flat texture, strengthen the hierarchy.

**One primary action per view.** One filled/prominent button; others are secondary or tertiary. Destructive actions are not primary unless the screen is about destruction, and then they require confirmation.

## 2. Typography

**Roles.** Define a small set of text styles and reuse them: display, heading levels, body, small/caption, label, code. Do not invent one-off sizes.

**Scale.** Use a ratio scale (for example 1.2 or 1.25) and round to whole pixels. A typical web set at a 16px base: 12, 14, 16, 18, 20, 24, 30, 36, 48. Dense tools often use a 13 to 14px base.

**Body text.**
- Size: 16px for reading-heavy content; 14px acceptable for dense UI. Never below 12px for anything that must be read.
- Line height: 1.4 to 1.6 for body; 1.1 to 1.3 for large headings.
- Line length: roughly 45 to 75 characters. Cap prose containers (for example `max-width: 65ch`).
- Inputs on mobile: at least 16px font size, or iOS Safari zooms the page on focus.

**Hierarchy.** Use at most 2 typefaces (often 1 family with several weights). Use 2 to 3 weights. Create contrast through size and weight together, not by adding fonts.

**Details that signal quality:**
- Tabular numerals for columns, tables, counters and anything that updates (`font-variant-numeric: tabular-nums`).
- Left-align body text. Avoid justified text and long centered paragraphs.
- Balance short headings (`text-wrap: balance`) and avoid orphans in paragraphs (`text-wrap: pretty`) where supported.
- Truncate with intent: one-line ellipsis for secondary labels, clamp lines for previews, never truncate the only copy of important info without a way to see it all.
- Use real typographic characters: ’ “ ” … – — and a non-breaking space between a number and its unit.
- Relative units for type (`rem`) so user font-size settings work.
- Provide a fallback stack that matches metrics reasonably, and avoid invisible text while fonts load (`font-display: swap` or `optional`).

## 3. Color

**Structure the palette in layers.**

1. **Neutrals:** 9 to 12 steps from near-white to near-black. These carry most of the interface (backgrounds, surfaces, borders, text).
2. **Accent (brand/primary):** one main hue with a few steps (default, hover, active, subtle tint, on-accent text).
3. **Status:** success, warning, danger, info. Each with a strong shade (for text/icons/fills) and a subtle tint (for backgrounds).
4. **Optional secondary accent.** Only if the direction needs it.

**Name tokens by role, not by value.** Prefer `--text`, `--text-muted`, `--surface`, `--surface-raised`, `--border`, `--accent`, `--danger` over `--blue-500` in components. Keep raw palette values in one place and map roles onto them. This is what makes dark mode and rebranding cheap.

**Use accent sparingly.** If accent color is on everything, it marks nothing. Reserve it for primary actions, active/selected state, links and key data.

**Neutral tinting.** Slightly tint neutrals toward the brand hue for warmth and cohesion. Avoid pure `#000` on pure `#fff` for long reading; very slightly softened pairs are easier on the eyes.

**Contrast targets (WCAG 2.2 AA).**
- Body text: at least 4.5:1.
- Large text (about 24px regular or 18.66px bold and up): at least 3:1.
- UI components and meaningful graphics (input borders, icons, focus rings, chart lines): at least 3:1 against adjacent colors.
- Disabled controls are exempt, but keep them distinguishable and readable enough to understand.

Measure with a contrast checker or compute it. Do not eyeball.

**Dark mode.**
- Do not simply invert. Build a second set of role tokens.
- Use dark gray surfaces, not pure black, for most apps (pure black can suit OLED ambient displays). Express elevation with lighter surfaces rather than shadows.
- Desaturate and lighten accents slightly so they do not vibrate against dark backgrounds.
- Re-check contrast; recheck images, shadows and borders.
- Set `color-scheme` so native controls and scrollbars follow the theme.

**Never convey meaning by color alone.** Add an icon, text, pattern or shape (error text plus an icon, not just a red border). Check common color-vision deficiencies for red/green status pairs.

## 4. Spacing

Use a base unit (4px or 8px) and a scale built from it, for example 4, 8, 12, 16, 24, 32, 48, 64, 96. Never use arbitrary values like 13px or 27px without a reason.

**Proximity expresses grouping.** Space between related items is smaller than space between unrelated groups. A rule of thumb: space inside a group is at most half the space between groups. If a divider line is needed to show grouping, the spacing is probably wrong.

**Padding.** Keep padding consistent per component type. Interactive controls need comfortable internal padding (for example 8 to 12px vertical, 12 to 16px horizontal for buttons). Optical adjustments (an icon button's icon slightly off-center, a play triangle shifted toward its point) are fine when they look better.

**Density modes.** Offer compact, comfortable and spacious only if the product needs them. Do not shrink touch targets to gain density on touch devices.

## 5. Surfaces, borders, radius and elevation

- **Radius:** pick a small family (for example 4, 8, 12, 999 for pills) and use it consistently. Nested rounded shapes look right when outer radius = inner radius + the padding between them.
- **Borders:** 1px, low-contrast, for structure (dividers, table cells, inputs, cards). Keep input boundaries at 3:1 contrast against their background.
- **Shadows:** use for elevation (menus, popovers, modals, floating bars), not as general decoration. Prefer soft, layered, low-opacity shadows to one heavy shadow. Keep a transparent border under a shadow-only edge so forced-colors mode still draws an edge.
- **Elevation levels:** define 3 to 4 (flat, raised, overlay, modal). Higher elevation means higher z-index and a stronger shadow (or a lighter surface in dark mode).
- **Images:** give photos a subtle inset outline in a neutral black/white at low opacity so edges stay crisp against any background; round them consistently; always set aspect ratios.

## 6. Iconography

- One library and one style (outline or filled) per product. Use filled to mark active/selected state if outline is the default.
- Draw icons with `currentColor` so they inherit text color and state.
- Match stroke weight to adjacent text weight, and keep optical size consistent (16, 20, 24px grids).
- Icons alone are ambiguous. Pair with a text label, or give an accessible name and a tooltip. Only universally understood icons (close, search) can stand alone, and still need an accessible name.

## 7. Tokens: the single source of truth

Define tokens once and reference them everywhere.

```css
:root {
  /* palette -> roles */
  --color-bg: ...;
  --color-surface: ...;
  --color-text: ...;
  --color-text-muted: ...;
  --color-border: ...;
  --color-accent: ...;
  --color-accent-contrast: ...;   /* text on accent */
  --color-danger: ...;

  /* type */
  --font-sans: ...;
  --text-sm: 0.875rem;
  --text-md: 1rem;
  --text-lg: 1.25rem;

  /* space */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
  --space-4: 1rem;    --space-6: 1.5rem; --space-8: 2rem;

  /* shape and motion */
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px;
  --shadow-raised: ...;
  --duration-fast: 120ms; --duration-base: 200ms;
  --ease-out: cubic-bezier(0.2, 0, 0, 1);
}
@media (prefers-color-scheme: dark) { :root { /* redefine role tokens */ } }
```

If the project uses Tailwind, a CSS-in-JS theme object or design-tokens JSON, express the same structure there. Do not hard-code values that a token covers.
