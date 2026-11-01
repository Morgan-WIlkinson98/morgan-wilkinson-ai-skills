# 03. Layout and responsive design

## 1. Structure before styling

Decide the page's anatomy in words first: regions (header, navigation, main, aside, footer), the reading order, and which content is primary. Build it with semantic landmarks (`header`, `nav`, `main`, `aside`, `footer`, `section` with a heading). Source order should match the visual and reading order so keyboard and screen-reader users get the same sequence. Do not rely on CSS reordering to fix a bad source order.

## 2. Choose the right layout tool

| Need | Use |
|------|-----|
| One-dimensional row or column, alignment, distribution | Flexbox |
| Two-dimensional structure, aligned rows and columns | CSS Grid |
| Components that adapt to their own container, not the viewport | Container queries |
| Fluid type and spacing between two sizes | `clamp()` |
| Centering a block | `margin-inline: auto` with a `max-width`, or grid `place-items` |
| Equal-width responsive card list | `grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr))` |
| Content that should not stretch forever | `max-width` in `ch` or `rem` on the content container |
| Gaps between children | `gap`, not margins on each child |

Avoid absolute positioning for layout, fixed pixel heights on content containers, and magic numbers. Let content determine height.

## 3. Responsive approach

**Design mobile-first, then enhance.** Start with the narrow layout as the base, add complexity at wider sizes with `min-width` queries. Base styles work everywhere; wider layouts are additions.

**Breakpoints follow the content, not devices.** Add a breakpoint where the layout starts to look wrong, not at specific phone sizes. Common reference widths to test: 320, 375, 768, 1024, 1280, 1536+. Keep the number of breakpoints small (often 2 to 4).

**Required checks:**
- 320px wide: no horizontal scroll, nothing clipped, still usable (WCAG reflow).
- 200% and 400% zoom or enlarged text: nothing overlaps, content reflows into one column.
- Very wide screens: content stays readable (max width) and does not drift to the edges.
- Landscape phones and short viewports: sticky headers and bottom bars must not consume the screen.

**Viewport units.** Use `dvh` / `svh` instead of `vh` for full-height mobile layouts so browser chrome does not clip content. Avoid `height: 100vh` on scrolling content.

**Safe areas.** For edge-to-edge mobile layouts, respect `env(safe-area-inset-*)` on fixed headers and footers.

**Responsive patterns that work:**
- Navigation: full bar on wide, collapsed menu or bottom bar on narrow. Keep the primary destinations reachable in one tap.
- Tables: scroll within their own container, or restructure to stacked cards on narrow screens. The page body must never scroll sideways.
- Multi-column forms: collapse to one column on narrow screens; labels above fields.
- Sidebars: become drawers or move below the main content.
- Images and media: `max-width: 100%`, intrinsic `aspect-ratio`, and `object-fit` set deliberately.

## 4. Spacing and rhythm in layout

- Use the spacing scale (see `02-foundations.md`) for all margins, padding and gaps.
- Keep a consistent vertical rhythm between sections.
- Use a consistent page gutter and max content width.
- Align elements to a shared edge. Misaligned left edges are the most common reason a layout feels sloppy. Use a grid and verify alignment visually.
- Group related elements with proximity. Use dividers only when spacing cannot do the job.

## 5. Handling real content

Test every layout with:
- Very long words, long names and URLs (`overflow-wrap: anywhere` or `word-break` where appropriate; `min-width: 0` on flex/grid children that must shrink).
- Empty and single-item lists.
- Hundreds of items (pagination or virtualization plan).
- Large numbers, negative numbers, units and currencies.
- Text 30 to 40% longer than English (translations), and right-to-left languages if relevant.
- User-generated content with unexpected line breaks or no spaces.

## 6. Internationalization and direction

- Use logical properties: `margin-inline-start`, `padding-block`, `inset-inline-end`, `text-align: start`, rather than left/right and top/bottom, when the product might be translated or mirrored.
- Mirror layout and directional icons (back arrows, chevrons) in RTL; do not mirror logos, media controls or numerals.
- Do not hard-code text widths into containers (buttons, tabs, labels).

## 7. Scrolling, stickiness and overlays

- Prefer natural page scroll. Avoid nested scroll areas unless needed (code blocks, tables, chat panes).
- Sticky headers should be short and must not cover content when jumping to anchors (`scroll-padding-top`).
- Overlays (menus, drawers, dialogs) that scroll should contain their scroll (`overscroll-behavior: contain`) so the page behind does not move.
- Lock background scroll when a modal is open without causing layout shift (account for the scrollbar width).
- Reserve space for content that loads late (images with dimensions or `aspect-ratio`, skeletons with matching size) to avoid layout shift.

## 8. Layout checklist

- [ ] Semantic landmarks present; source order matches visual order.
- [ ] Grid/flex used appropriately; no absolute-position hacks.
- [ ] Works from 320px upward without horizontal page scroll.
- [ ] Readable at 200% zoom and with larger user font size.
- [ ] Max content width set; prose lines around 45 to 75 characters.
- [ ] Spacing from the token scale; consistent gutters and edges.
- [ ] Long, short, empty and many-item content tested.
- [ ] Layout shift avoided for images and async content.
- [ ] Overlays contain scroll; sticky elements don't hide content.
