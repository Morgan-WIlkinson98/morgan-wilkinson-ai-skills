# 06. Accessibility (target: WCAG 2.2 AA)

Accessibility is built into each component as you write it. The goal is that anyone can perceive, operate, understand and rely on the interface, with a keyboard, a screen reader, voice control, zoom, switch devices or a touch screen, in any lighting.

## 1. Start with semantic HTML

The right element gives you role, keyboard behavior and screen-reader semantics for free.

| Need | Use | Not |
|------|-----|-----|
| Action | `<button>` | `<div onclick>` |
| Navigation | `<a href>` | `<span>` with a click handler |
| Page regions | `header`, `nav`, `main`, `aside`, `footer` | generic divs only |
| Headings | `h1` to `h6` in logical order, one `h1` per page/view | bold text styled as a heading |
| Lists | `ul`, `ol`, `dl` | divs with bullets |
| Form fields | `label` + `input`/`select`/`textarea` | placeholder-only fields |
| Data | `table` with `th scope`, `caption` | grid of divs |
| Dialog | `<dialog>` or a tested primitive | a positioned div |
| Disclosure | `<details>`/`<summary>` or a button with `aria-expanded` | click-to-toggle div |

**ARIA is a repair kit, not a starting point.** First rule: do not use ARIA if a native element does the job. If you use ARIA, implement the full keyboard pattern and keep states in sync (`aria-expanded`, `aria-selected`, `aria-pressed`, `aria-current`, `aria-invalid`). Incorrect ARIA is worse than none.

## 2. Keyboard operability

- Everything that works with a mouse works with the keyboard: `Tab`/`Shift+Tab` to move, `Enter`/`Space` to activate, arrow keys within composite widgets (tabs, menus, radio groups, listboxes), `Escape` to dismiss.
- **Logical focus order** that matches visual order. Avoid positive `tabindex`. Use `tabindex="0"` only for custom controls that need it and `tabindex="-1"` for programmatic focus targets.
- **No keyboard traps.** Focus can always leave a component, except inside an open modal where it cycles until closed.
- **Skip link** to main content at the top of pages with repeated navigation.
- **Visible focus** on every focusable element (see section 3).
- **Manage focus on change.** After opening a dialog, move focus into it; on close, return it to the trigger. After route changes in a single-page app, move focus to the new page's heading or main region. After deleting an item, move focus to a sensible neighbor.
- Provide keyboard shortcuts only if they can be turned off or remapped, and avoid single-key shortcuts that trigger while typing.

## 3. Focus indicators

- Use `:focus-visible` so mouse users are not distracted but keyboard users always see focus.
- Make the indicator clearly visible: at least 2px, 3:1 contrast against adjacent colors, and not hidden by sticky headers or overlays (WCAG 2.2 Focus Not Obscured).
- Never `outline: none` without a replacement of equal or greater visibility.

```css
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
```

## 4. Color and contrast

- Normal text 4.5:1, large text 3:1, UI components and meaningful graphics 3:1 (see `02-foundations.md`).
- Never use color alone to convey information. Pair with text, icon or pattern.
- Check text over images and gradients at the worst-case spot, or add a scrim.
- Respect `prefers-contrast` and forced-colors modes where practical. Keep a transparent border under shadow-only edges so forced-colors still draws them. Do not rely on background images or box-shadows to convey meaning.
- Support `prefers-color-scheme` and set `color-scheme`.

## 5. Names, labels and descriptions

- Every interactive control has an accessible name that matches its visible label (WCAG Label in Name). Voice-control users say what they see.
- Icon-only controls: add `aria-label` (or visually hidden text) and, ideally, a tooltip.
- Decorative images: `alt=""`. Informative images: concise `alt` that conveys purpose. Complex images and charts: a longer description or a data table alternative.
- Decorative icons next to text: `aria-hidden="true"`.
- Link text makes sense out of context ("Read the pricing guide", not "Click here").
- Set the page `<title>` and `lang` attribute, and mark language changes inline with `lang`.

## 6. Forms and errors

- Visible, programmatically associated labels on every field; group with `fieldset`/`legend`.
- Required state exposed (`required` or `aria-required`) and not only by color or an asterisk without explanation.
- Errors: text message adjacent to the field, linked via `aria-describedby`, field marked `aria-invalid="true"`, error also announced. On failed submit, move focus to the first invalid field or an error summary with links.
- Use correct `autocomplete` tokens for common fields (WCAG Identify Input Purpose).
- Do not require users to re-enter data already provided in the same process (Redundant Entry).
- Authentication must not rely only on remembering or transcribing (allow paste and password managers; avoid cognitive tests as the only option).

## 7. Dynamic content and announcements

- Announce important updates to screen readers with live regions: `role="status"` (polite) for confirmations and counts, `role="alert"` (assertive) only for urgent errors. Render the region in the DOM before changing its content.
- Loading states use `aria-busy` or a status message; do not leave screen-reader users guessing.
- Toasts must be announced, not disappear too quickly, and not hold the only copy of critical information.
- Single-page apps must update the document title and manage focus on navigation.

## 8. Motion, time and flashing

- Honor `prefers-reduced-motion` (see `05-motion.md`).
- Nothing flashes more than three times per second.
- Provide pause/stop/hide for auto-moving or auto-updating content longer than 5 seconds.
- Do not impose short timeouts; warn and allow extension where time limits are required.

## 9. Targets, zoom and reflow

- Pointer targets at least 24 by 24 CSS px (WCAG 2.2 minimum) and ideally 44 by 44 on touch.
- Content reflows at 320px wide without two-dimensional scrolling (except truly two-dimensional content like maps or data tables).
- Works at 200% browser zoom and with text-only enlargement; do not disable zoom (`user-scalable=no` or `maximum-scale=1`).
- Text spacing overrides (line height 1.5, letter spacing 0.12em, word spacing 0.16em, paragraph spacing 2em) must not clip or hide content, so avoid fixed heights on text containers.
- Dragging has a non-dragging alternative (WCAG 2.2 Dragging Movements).
- Orientation is not locked unless essential.
- Hover/focus-triggered content (tooltips, popovers) is dismissible, hoverable and persistent until dismissed.

## 10. Media

- Captions for prerecorded video with speech, transcripts for audio.
- No autoplay with sound. Provide visible controls with keyboard access.
- Provide audio description or a text alternative where visuals carry information.

## 11. Testing routine (do this every time)

1. **Keyboard only:** unplug the mouse mentally. Tab through the entire view; confirm order, focus visibility, activation, dismissal, no traps.
2. **Zoom and reflow:** 200% zoom and 320px width.
3. **Contrast:** verify text and UI colors with a calculator.
4. **Screen reader sanity pass** when possible: headings outline, landmarks, form labels, announcements. Where you cannot run one, inspect the accessibility tree in browser dev tools and say you did not run a screen reader.
5. **Reduced motion** and **dark/forced colors** if supported.
6. **Automated scan** (axe, Lighthouse or equivalent) as a floor, not a ceiling. Automated tools catch only a portion of issues.

## 12. Quick checklist

- [ ] Semantic elements used; ARIA only where needed and complete.
- [ ] Full keyboard operation, logical order, no traps, skip link.
- [ ] Visible `:focus-visible` on everything; not obscured.
- [ ] Contrast 4.5:1 text, 3:1 large text and UI components.
- [ ] No info by color alone; icon-only controls named.
- [ ] Labels, errors and help text programmatically associated.
- [ ] Live regions for async feedback; focus managed on route and dialog changes.
- [ ] Reduced motion honored; no flashing; pausable moving content.
- [ ] Targets at least 24px (44px on touch); reflows at 320px; zoom allowed.
- [ ] Page title, language and heading structure correct.
