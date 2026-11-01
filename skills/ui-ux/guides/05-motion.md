# 05. Motion

Motion should explain change, direct attention or confirm an action. If an animation does none of those, remove it. Frequent interactions should feel instant; expressive motion is for rare, meaningful moments.

## 1. Purposes (an animation needs at least one)

| Purpose | Example |
|---------|---------|
| Show relationship | A menu grows from its trigger; a card expands into its detail view |
| Preserve context | A list item slides out and the rest close the gap |
| Give feedback | A button depresses on press; a checkmark draws in on success |
| Direct attention | A new item briefly highlights where it appeared |
| Mask waiting | A skeleton shimmer or progress indicator |
| Add polish at rare moments | A first-run welcome, an achievement |

## 2. Timing guidelines

| Kind | Duration |
|------|----------|
| Instant feedback (hover color, press) | 80 to 150ms |
| Small element changes (toggle, tooltip, icon swap) | 150 to 250ms |
| Panels, menus, modals entering | 200 to 350ms |
| Page or large layout transitions | 250 to 450ms |
| Anything over about 500ms | Needs a strong reason; users will wait on it |

- **Exits are faster than enters.** Roughly 60 to 70% of the enter duration. Users are already leaving.
- **Easing:** use ease-out (decelerating) for things entering or responding to the user, ease-in for things leaving, ease-in-out for things that move across the screen. Avoid linear except for progress bars and continuous loops. Avoid bouncy or elastic easing in utility interfaces.
- **Distance:** keep moves small (8 to 24px) for entrances. Large travel feels slow and distracting.
- **Stagger:** only for infrequent, staged entrances (for example a first-load list or onboarding). Use small offsets (40 to 100ms) and cap the total sequence so the last item is not waiting more than about 400ms. Never stagger routine interactions.

## 3. High-frequency interactions must feel instant

Typing, tab switching, row hover, menu open on a power-user tool, toggles used constantly: respond immediately, with at most a very short opacity or color transition. Reserve expressive motion for moments the user sees rarely.

## 4. What to animate (performance)

- Animate `transform` (`translate`, `scale`, `rotate`) and `opacity`. They run on the compositor and avoid layout and paint cost.
- Avoid animating `width`, `height`, `top`, `left`, `margin`, `padding`, `box-shadow` size on large areas or `filter: blur` on large surfaces. For expanding panels, use techniques such as `grid-template-rows: 0fr to 1fr` or measured heights with care, or animate a transform and opacity instead.
- Name the properties you transition (`transition-property: transform, opacity`). Never use `transition: all`.
- Use `will-change` only after you observe stutter, only on the property you animate, and remove it when finished. Overuse wastes memory.
- Keep animations off the main thread when possible (CSS transitions, Web Animations API, or a library that uses them).

## 5. Transitions vs keyframes

- Use **CSS transitions** (or springs from a motion library) for interactive state changes. They can be interrupted and reversed smoothly mid-flight when the user changes their mind.
- Use **keyframe animations** for sequences that run once or loop (loading indicators, entrance choreography, attention pulses). Keyframes do not retarget when reversed, so avoid them for toggles.
- Do not start an `animation` from a class that is toggled on and off for interactive state; use a transition.

## 6. Reduced motion is required

Always honor the user's setting.

```css
/* Pattern A: opt in to movement only when allowed */
@media (prefers-reduced-motion: no-preference) {
  .panel { transition: transform 220ms var(--ease-out), opacity 220ms var(--ease-out); }
}

/* Pattern B: neutralize movement but keep state clear */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

Better than removing everything: under reduced motion, replace movement, scale, parallax and blur with a simple opacity cross-fade or an instant state change, and keep any essential progress indication. Never autoplay large motion, looping background video or parallax for users who prefer less.

Also:
- Do not flash content more than three times per second.
- Provide pause/stop for any auto-updating or moving content that lasts over 5 seconds.

## 7. Motion must never be the only signal

Every animated state change must also leave a static cue (a color change, icon swap, text, position). Someone who disables animation, or looks away for a moment, must still understand the result.

## 8. Patterns

- **Enter:** fade in plus a small translate (8 to 16px) toward rest, ease-out, 200 to 300ms.
- **Exit:** fade out, small translate, ease-in or ease-out, about 150ms. Remove from the DOM after the animation ends. Fully slide out only where the destination carries meaning (a drawer closing).
- **Icon swap** (play to pause, copy to copied): cross-fade with a small scale change, 150 to 250ms; keep both icons in the DOM or use a transition library.
- **Press feedback:** scale to about 0.96 to 0.98 over about 100 to 150ms, only for enabled buttons, with an opt-out for contexts where it distracts.
- **Skeleton to content:** fade the content in; do not move layout.
- **Theme switch:** temporarily disable transitions during the switch so every color does not animate at once, then re-enable on the next frame.
- **First render:** do not animate the default state in on mount unless it is an intentional entrance.
- **Scroll-linked effects:** use sparingly, avoid hijacking scroll, and always provide a non-animated fallback.

## 9. Checklist

- [ ] Each animation has a stated purpose.
- [ ] Durations and easings come from shared tokens.
- [ ] Only compositor-friendly properties are animated; no `transition: all`.
- [ ] Interactive changes use transitions (reversible); keyframes only for one-shot sequences.
- [ ] Reduced-motion path exists and is tested.
- [ ] Frequent interactions feel instant.
- [ ] A static cue accompanies every animated state change.
- [ ] No layout shift introduced by the animation.
