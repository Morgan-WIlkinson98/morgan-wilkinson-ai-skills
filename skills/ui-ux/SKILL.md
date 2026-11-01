---
name: ui-ux
description: "UI/UX design and review guide. Invoke whenever building, changing, or reviewing a user interface — covers visual direction, design foundations, layout, components, motion, accessibility (WCAG 2.2 AA), UX writing, code standards, and visual QA."
allowed-tools:
  - read
  - grep
  - glob
---

You are building or changing a user interface. This guide tells you how to produce UI that looks intentional, works for everyone, and is built with clean code. It is framework-agnostic: the principles hold for React, Vue, Svelte, plain HTML/CSS, native shells, or server-rendered templates.

Read this file fully. Then load the detailed guides only when the task needs them (see section 3).

## 1. The five rules that override everything else

1. **Match the project first.** If the project already has a design system, tokens, components or a visual language, use them. Consistency beats your preferences. Only apply the defaults in these guides where the project is silent.
2. **Decide before you decorate.** Know who the screen is for, what the one primary action is, and what the visual direction is (see `guides/01-vision-and-direction.md`) before writing markup.
3. **Look at what you built.** If you can run the app and take screenshots, you must. Code that "should" look right often does not. See `guides/09-visual-qa.md`.
4. **Every state is part of the design.** Loading, empty, error, disabled, focus, hover, pressed, long content, no content, slow network, no permission. A screen with only a happy path is unfinished.
5. **Accessible by construction, not by audit.** Semantic HTML, visible focus, sufficient contrast, keyboard operability and reduced-motion support are part of building the component, not a later pass.

## 2. Workflow

Follow these steps in order. Do not skip step 1 or step 6.

1. **Recon.** Find the stack, styling system, tokens, component library, existing patterns, supported viewports, themes and how to run the app. Write down what you found in two or three lines. Do not invent tokens or components that the project lacks without saying so.
2. **Brief.** State, in a few lines: audience, the user's goal on this screen, the primary action, constraints (platform, density, brand), and the visual direction you will take. If something essential is missing, ask one focused question; otherwise state your assumption and proceed.
3. **Structure.** Decide information hierarchy and layout on paper (in words) first: what is most important, what groups together, what order people read and tab through.
4. **Build.** Use semantic elements, design tokens and the project's components. Build every state as you go. Keep the diff as small as the task allows.
5. **Check.** Run the project's type check, lint, tests and build. Fix what you broke.
6. **Look.** Run it, screenshot it at the required sizes and themes, tab through it with the keyboard, and critique it using the checklist in `guides/09-visual-qa.md`. Fix what you find, then look again.
7. **Report.** Say what you built, which assumptions you made, what you verified and what you could not verify.

## 3. Which guide to read

| If the task involves | Read |
|----------------------|------|
| Starting a new screen, page or product; choosing a look | `guides/01-vision-and-direction.md` |
| Typography, color, spacing, elevation, tokens | `guides/02-foundations.md` |
| Page structure, grids, responsive behavior | `guides/03-layout-and-responsive.md` |
| Buttons, forms, navigation, tables, feedback, modals, any interactive part | `guides/04-components-and-interaction.md` |
| Transitions, animation, loading choreography | `guides/05-motion.md` |
| Anything a person interacts with (always, in practice) | `guides/06-accessibility.md` |
| Labels, errors, empty states, confirmations, microcopy | `guides/07-ux-writing.md` |
| Writing or refactoring the code | `guides/08-code-standards.md` |
| Verifying your work (always) | `guides/09-visual-qa.md` |

For a new screen, read 01, then 02 and 03, then the rest as needed. For a small fix, read only the relevant guide plus 09.

## 4. Principles in one page

- **Hierarchy first.** One thing should win on every screen. Use size, weight, contrast, position and space to rank content. If everything is emphasized, nothing is.
- **Fewer choices, clearer paths.** Remove before you add. Each extra control, color or font weight must earn its place.
- **Consistency.** Same thing, same look, same behavior, everywhere. Use a small set of spacing, type and color values and reuse them.
- **Feedback.** Every action gets an acknowledgement. Every wait gets an indicator. Every failure gets an explanation and a next step.
- **Forgiveness.** Make mistakes hard to make and easy to undo. Confirm only what is destructive or irreversible.
- **Respect attention.** Do not interrupt, autoplay, nag or animate for decoration.
- **Content leads.** Design around real content, including the longest, shortest and weirdest realistic cases. Never design around lorem ipsum.
- **Performance is UX.** Fast and stable beats pretty and janky. Avoid layout shift, reserve space for async content.
- **Inclusive by default.** Keyboard, screen reader, low vision, motor and cognitive differences, small and large screens, slow networks.

## 5. Definition of done

A UI task is done only when all of these are true:

- [ ] It matches the project's existing conventions, or any deviation is stated and justified.
- [ ] There is a clear visual hierarchy and one obvious primary action.
- [ ] All states exist: default, hover, focus-visible, active, disabled, loading, empty, error, success where relevant.
- [ ] It works at 320px, 768px and 1280px wide with no horizontal scroll and no overlapping or clipped content.
- [ ] It works in light and dark themes if the project supports both.
- [ ] Everything is operable by keyboard with a visible focus indicator and a logical order.
- [ ] Text and UI contrast meet WCAG 2.2 AA (`guides/06-accessibility.md`).
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] No hard-coded colors, font sizes or spacing where a token exists.
- [ ] Type check, lint, tests and build pass, or failures are reported.
- [ ] You looked at screenshots (or state clearly that you could not) and fixed visible defects.
- [ ] The report lists assumptions and anything not verified.

## 6. Reporting format

Be specific and complete. Do not compress findings into a vague summary.

```
Built: <what, where, files touched>
Direction: <one or two lines on the visual direction and why>
Assumptions: <list>
Verified: <commands run, viewports/themes screenshotted, keyboard pass>
Not verified: <list, with reason>
Known issues / follow-ups: <list>
```

When reviewing existing UI instead of building, use the findings table in `guides/09-visual-qa.md`.

## 7. Things you must not do

- Do not add a dependency to solve a styling problem without asking.
- Do not rewrite copy, rename things or restructure folders as a side effect of a UI change.
- Do not use color alone to convey meaning.
- Do not remove focus outlines without replacing them with something at least as visible.
- Do not use `transition: all`, `!important` as a fix, or inline styles for things that belong in the design system.
- Do not hide problems. If you cannot verify something, say so; never imply it passed.
