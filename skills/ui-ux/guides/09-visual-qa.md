# 09. Visual QA: look at what you built

Code that should look right often does not. If you can run the app and capture screenshots, do it every time and critique what you see. This guide is the "vision" step: a repeatable way to inspect, judge and fix.

If you cannot run or screenshot the UI, say so plainly, review the code against the checklists instead, and mark visual claims **Not verified**. Never claim something looks correct without having seen it.

## 1. The loop

1. **Run** the app or component (dev server, preview, static file).
2. **Capture** screenshots of the states and sizes below.
3. **Critique** each screenshot using section 3.
4. **Fix** the most important issues first (broken > confusing > inconsistent > polish).
5. **Re-capture** and confirm. Repeat until nothing important remains. Do not stop after one pass.

Limit yourself to a sensible number of iterations. If the same issue persists after two attempts, step back and rethink the approach rather than nudging values.

## 2. What to capture

**Viewports:** 320, 375 (phone), 768 (tablet), 1280 (laptop), 1920 (large) wide, at least the extremes and one middle size. Add landscape phone height if relevant.

**Themes:** light and dark, if supported. High-contrast or forced-colors if the product targets it.

**States** (as relevant to the screen):
- Default with realistic data.
- Empty, loading (skeleton/spinner), error, success.
- Long content, very short content, many items, one item.
- Hover, focus-visible (via keyboard), active, disabled, selected.
- Open overlays: menu, dialog, popover, tooltip, toast.
- Form with validation errors.
- 200% zoom (and larger text).

**Behavior:**
- Tab through the whole view; screenshot focus positions.
- Watch the browser console for errors and warnings.
- Check network/performance: layout shift on load, slow-loading images, jank when animating.

When automation is available, script this (for example with a headless browser such as Playwright) so it is repeatable, and save screenshots to a predictable folder.

## 3. How to critique a screenshot

Ask these in order. Name concrete problems with locations, not vague impressions.

**Hierarchy and focus**
- Squint test: is the main thing obvious? Is there one primary action?
- Do headings, body and captions differ enough in size and weight?
- Is anything competing for attention that should not be?

**Layout and alignment**
- Do elements share clear left edges and align on a grid?
- Is spacing consistent and from the scale? Are groups visibly grouped by proximity?
- Any overlap, clipping, overflow or cut-off text? Any unexplained empty areas?
- Is there horizontal scroll at the page level on narrow widths?

**Typography**
- Readable size and line height? Line length reasonable?
- Consistent text styles? Any orphans, awkward wrapping or truncation hiding important info?

**Color and contrast**
- Does text clearly stand out from its background? Are placeholders, disabled and muted text still legible?
- Are accents used sparingly and consistently? Is meaning ever carried by color alone?
- In dark mode: any elements that kept light-theme colors, glaring whites, invisible borders or icons?

**Components and states**
- Do buttons look like buttons, inputs like inputs? Are focus rings clearly visible?
- Are states distinct (hover, active, selected, disabled, error)?
- Are icons consistent in style, size and weight, and aligned with text?

**Consistency and polish**
- Consistent corner radius, border weight, shadow style, icon style?
- Does it match neighboring screens and the stated direction?
- Does anything look generic, unfinished or accidental (see `01-vision-and-direction.md` section 4)?

**Content**
- Is the copy clear and specific? Any placeholder text left?
- Do numbers, dates and units format correctly?

**Responsive**
- Does the layout adapt gracefully at each size, rather than just shrinking?
- Are touch targets big enough and spaced on small screens?

## 4. Interaction pass (keyboard and screen reader)

- Keyboard only: reach everything, see focus everywhere, activate with Enter/Space, dismiss with Escape, no traps, sensible order.
- Check the accessibility tree in dev tools: roles, names, states, headings outline, landmarks.
- If a screen reader is available, do a quick pass; if not, state that you did not.
- Reduced motion: toggle the OS or devtools setting and confirm motion is replaced, not just broken.

## 5. Measure, don't guess

- Contrast: compute ratios for text and UI colors.
- Spacing and alignment: use dev tools to inspect computed values and confirm they come from tokens.
- Targets: check computed sizes of clickable areas.
- Layout shift and timing: use performance tooling when behavior looks off.

## 6. Reporting findings

When reviewing (or reporting your own self-review), use one row per root cause, listing every location it appears. Do not pad the list and do not hide real problems to keep it short.

| # | Severity | Area | Location | Observed (before) | Fix (after) | Why it matters |
|---|----------|------|----------|-------------------|-------------|----------------|

**Severity**
- **HIGH:** blocks a task, hides or breaks content or controls, fails keyboard or screen-reader access, causes data-loss risk, or repeats systemically.
- **MEDIUM:** meaningfully harms comprehension, efficiency, consistency or adaptability.
- **LOW:** isolated polish.

Then add:
- **Considered but rejected:** candidates you inspected and chose not to change, with the reason (intentional convention, insufficient evidence, change adds complexity without benefit).
- **Verified:** exact commands run, viewports/themes/states captured, interaction checks done.
- **Not verified:** anything you could not run or see, with the reason. A verification gap is not a finding and not a pass.
- **Verdict:** `Block` (HIGH remains), `Needs changes` (only MEDIUM/LOW remain), or `Approve` (nothing actionable and coverage actually verified).

## 7. Common visual defects to look for

- Text touching container edges; inconsistent padding between similar components.
- Buttons of different heights or radii in the same row.
- Icons not vertically aligned with adjacent text.
- Images stretched, cropped badly or causing layout shift.
- Orphaned single words in headings; ugly wraps in buttons and tabs.
- Dark mode with unthemed images, shadows, borders or third-party widgets.
- Focus ring clipped by `overflow: hidden` or hidden under a sticky bar.
- Sticky header covering anchor targets or form errors.
- Scroll containers inside scroll containers.
- Placeholder or lorem ipsum text left in.
- Hover-only controls that do not exist on touch.
- Different spacing between sections that should share rhythm.
- Disabled elements that look enabled (or vice versa).
- Skeletons that do not match final layout (visible jump on load).

## 8. Done means seen

Before reporting completion, confirm that you have:
- [ ] Captured and reviewed screenshots at the required sizes and themes.
- [ ] Reviewed the key states, not only the default.
- [ ] Tabbed through the UI.
- [ ] Fixed visible defects and re-captured to confirm.
- [ ] Listed what you verified and what you could not.
