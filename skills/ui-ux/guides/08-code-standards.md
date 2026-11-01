# 08. Code standards for UI

"Proper code" here means: it renders correctly, is accessible, is easy to change, and does not surprise the next person. Always follow the project's existing conventions, linters and formatters first; use this guide where the project is silent.

## 1. General principles

- **Match the codebase.** Naming, file layout, import style, component patterns, styling approach. Read two or three neighboring files before writing.
- **Smallest correct change.** Do not refactor unrelated code. Fix root causes, not symptoms, and apply the fix everywhere the cause appears.
- **Readable over clever.** Clear names, small functions and components, early returns, no deep nesting.
- **Explicit over implicit.** Typed props, named constants, no magic numbers (use tokens), no hidden global state.
- **Prefer the platform.** Native elements, native CSS features and native browser behavior before libraries. Add a dependency only when it clearly earns its weight, and ask first.

## 2. Markup (HTML / JSX / templates)

- Semantic elements; correct heading order; landmarks (see `06-accessibility.md`).
- One component, one responsibility. Extract a component when it has its own state, is reused, or has a clear name.
- Keys on list items must be stable and unique (not array index when items reorder).
- Avoid deep div nesting; use fragments and layout CSS instead of wrapper divs.
- Do not use `dangerouslySetInnerHTML` or `innerHTML` with untrusted content. Escape or sanitize.
- Images: `alt`, `width`/`height` or `aspect-ratio`, `loading="lazy"` below the fold, responsive `srcset`/`sizes`, modern formats.
- Buttons inside forms: set `type` explicitly (`type="button"` unless submitting).
- Links to external sites that open new tabs include `rel="noopener noreferrer"` and signal the behavior to users.

## 3. CSS

- **Tokens everywhere.** Colors, spacing, radius, shadows, type sizes and durations come from variables or the theme, never hard-coded.
- **Low specificity, flat selectors.** Use classes (or the project's utility system). No ID selectors for styling, no deep descendant chains, no `!important` as a fix. Use cascade layers (`@layer`) or scoping if the project does.
- **Naming:** follow the project (BEM, CSS Modules, utility classes, CSS-in-JS). Names describe purpose (`.card-header`), not appearance (`.red-bold`).
- **Layout:** flexbox, grid, `gap`, logical properties, `clamp()`, container queries as appropriate (see `03-layout-and-responsive.md`).
- **Units:** `rem` for type and most spacing, `em` for component-relative sizing, `ch` for measure, `%`/`fr` for fluid layout, `px` for borders and hairlines, `dvh`/`svh` instead of `vh` for mobile.
- **State styling:** use attribute and pseudo-class selectors (`:hover` inside `@media (hover: hover)`, `:focus-visible`, `:disabled`, `[aria-expanded="true"]`, `[aria-current="page"]`) so styling follows real state.
- **Do not** remove outlines, use `display: none` to hide content that should remain available to assistive tech (use a visually-hidden utility for screen-reader-only text), or rely on `user-select: none` broadly.
- Reset only what is needed; respect the project's reset/base styles.
- Dark mode via role tokens redefined under `prefers-color-scheme` and/or a `data-theme` attribute; set `color-scheme`.
- Set `box-sizing: border-box` globally if the project does not already.
- Provide print styles only when the product needs them.

If using **Tailwind** or another utility system:
- Use design tokens from the config/theme, not arbitrary values (`w-[137px]`) unless justified.
- Extract repeated patterns into components rather than repeating long class strings.
- Mind version differences (for example, whether `hover:` is gated behind a hover media query).
- Keep class ordering consistent (use the project's formatter plugin if present).
- Do not generate class names dynamically by string concatenation (they will be purged); use full class names or a lookup map.

## 4. JavaScript / TypeScript

- Use TypeScript types for props and state when the project uses TS. Avoid `any`; model states with discriminated unions (for example `{status:'loading'} | {status:'error', error} | {status:'ready', data}`) so every UI state is handled.
- Keep state minimal and derive the rest. Lift state only as high as needed. Avoid duplicating the same state in two places.
- Handle async properly: loading, success, error and cancellation. Abort stale requests, avoid race conditions, and never leave a spinner running forever.
- Debounce or throttle high-frequency handlers (resize, scroll, input search). Prefer `IntersectionObserver` and `ResizeObserver` to scroll/resize listeners.
- Event handlers are small and named; clean up listeners, timers and subscriptions on unmount.
- Do not read layout (`offsetHeight`) and write styles in alternating loops (layout thrashing).
- Validate and sanitize all external and user input at boundaries.
- No secrets, tokens or API keys in client code.
- Avoid `console.log` debris. Remove commented-out code.

## 5. Component design (framework-agnostic)

- **Props/inputs** describe intent (`variant`, `size`, `disabled`, `loading`), with sensible defaults and a minimal surface.
- **Composition over configuration:** prefer slots/children for flexible content instead of dozens of props.
- Controlled and uncontrolled modes for stateful inputs.
- Forward refs and rest props so callers can attach attributes, handlers and test IDs.
- Accessibility lives inside the component: roles, labels, keyboard handling, focus management.
- Every component handles its states (loading, empty, error, disabled) or documents that it does not.
- Co-locate styles, tests and examples with the component, following the project's layout.
- Do not hide data-fetching inside presentational components; separate presentation from data where the project does.

## 6. Performance

- Optimize the metrics users feel: LCP (main content shown fast), INP (input responsiveness), CLS (no layout shift).
- Reserve space for images, embeds and async content. Preload critical fonts and hero images sparingly.
- Lazy-load below-the-fold images and heavy components; code-split routes.
- Limit re-renders: stable keys, memoization where profiling shows a problem (not by default), virtualize long lists.
- Keep bundles lean: avoid importing whole libraries for one function, prefer tree-shakeable imports, check what a dependency costs.
- Avoid large blocking scripts and render-blocking CSS beyond what is needed.
- Animate compositor-friendly properties only (see `05-motion.md`).
- Test on a throttled CPU and network, not only a fast dev machine.

## 7. Robustness

- Never assume data shape; handle `null`, empty arrays, missing fields, very long strings and unexpected types gracefully.
- Make failure visible and recoverable: error boundaries or equivalent, retry affordances, graceful degradation.
- Support progressive enhancement where it is cheap: forms that work without JS, links that are real links.
- Handle offline and slow-network states for apps that can be used on the go.
- Do not break browser features: back/forward, refresh, copy/paste, text selection, zoom, find-in-page, right-click on links.
- Respect user settings: color scheme, reduced motion, contrast, text size, language.

## 8. Security basics for UI code

- Escape output; avoid injecting raw HTML.
- Use `rel="noopener noreferrer"` for `target="_blank"` links.
- Do not store sensitive data in localStorage; prefer secure, HttpOnly cookies for session tokens where the architecture permits.
- Validate on the server as well as the client; client validation is for UX only.
- Do not leak internal errors to the UI.

## 9. Testing

- Unit-test logic and state transitions. Component-test behavior from the user's perspective (roles, labels, text) rather than implementation details.
- Query by accessible role and name in tests; this doubles as an accessibility check.
- Test each state: loading, empty, error, success, disabled.
- Add visual regression or screenshot tests for key screens if the project has the tooling.
- Run an automated accessibility scan in CI if available.
- A bug fix includes a test that fails without the fix.

## 10. Git and handoff hygiene

- Small, focused commits and PRs; descriptive messages.
- Include before/after screenshots (light and dark, narrow and wide) in the PR description for visual changes.
- Note assumptions, known limitations and follow-ups.
- Do not commit generated files, secrets, large binaries or debug code.

## 11. Code checklist

- [ ] Follows project conventions and passes lint, format, types, tests, build.
- [ ] Semantic markup; accessible names; keyboard handled.
- [ ] Tokens used; no hard-coded colors, sizes or spacing; low specificity; no `!important`.
- [ ] All async and UI states handled; errors visible and recoverable.
- [ ] No layout shift, no unnecessary re-renders, lazy-loaded where appropriate.
- [ ] Listeners and timers cleaned up; no memory or request leaks.
- [ ] No unsafe HTML injection; no secrets in client code.
- [ ] Tests cover behavior and states.
- [ ] Diff is minimal and focused; no unrelated changes.
