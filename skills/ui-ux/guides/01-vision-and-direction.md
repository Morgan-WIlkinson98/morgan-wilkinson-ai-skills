# 01. Vision and direction

Good UI has a point of view. Generic UI is what you get when every decision is the default one. This guide is about making deliberate choices before you write code, so the result feels designed rather than assembled.

If the project already has an established look, your "direction" is to extend it faithfully. Skip to section 5.

## 1. Write a brief first

Answer these in a few lines before building. If you can't answer one, make a reasonable assumption and say so.

| Question | Why it matters |
|----------|----------------|
| Who uses this, and in what situation? (expert at a desk, a parent on a phone, someone glancing at a wall tablet) | Sets density, size, tone and input method |
| What is the one thing they came to do on this screen? | That becomes the primary action and the focal point |
| What do they need to know to do it? | Decides what is shown, what is hidden, what is secondary |
| What can go wrong? | Defines error, empty and recovery states |
| How often is it used? | Daily tools can be dense and fast; one-off flows need guidance |
| What should it feel like? (calm, precise, playful, serious, premium, utilitarian) | Drives type, color, motion and copy tone |
| What are the constraints? (brand, platform, existing components, performance, accessibility needs) | Prevents rework |

## 2. Choose a direction on purpose

Pick one clear direction and commit to it across type, color, spacing, shape, motion and copy. A direction is a small set of decisions that agree with each other. Examples (illustrative, not a menu to copy):

- **Quiet utility:** neutral palette, one restrained accent, tight spacing, system-like type, almost no motion. Feels like a precise tool.
- **Warm editorial:** generous whitespace, a serif for headlines, a soft off-white and ink palette, large type contrast. Feels considered and human.
- **Dense control room:** dark theme, monospace numerals, small type, high information density, strong status colors used sparingly. Feels powerful and fast.
- **Friendly and rounded:** large radii, a lively accent color, soft shadows, playful but clear microcopy. Feels approachable.
- **Bold and graphic:** large type, strong contrast, limited palette, sharp geometry. Feels confident.

State your direction in one sentence, for example: "Quiet utility: neutral grays, a single blue accent, 14px base type, 8px grid, 150ms transitions, plain direct copy."

Rules for a good direction:

- It must suit the audience and context. A hospital intake form and a game launcher should not look alike.
- It limits itself. Commit to few colors, two type roles at most, one corner-radius family, one icon style.
- It is consistent. A single off-direction element reads as a mistake.

## 3. Where character comes from (in order of leverage)

1. **Typography.** Typeface choice, scale contrast, weight and line length shape the feel more than anything else. Dramatic size contrast between headline and body is an easy win.
2. **Space.** Generous, rhythmic whitespace reads as confident and premium. Cramped reads as cheap or stressful. Pick a density on purpose.
3. **Color.** A restrained palette with a deliberate accent beats a rainbow. Neutrals do most of the work; accent marks what matters.
4. **Shape.** Radius, border weight and shadow style carry personality. Keep them from one family.
5. **Imagery and iconography.** One consistent style. Real content and real imagery beat stock filler.
6. **Motion.** Small, purposeful and consistent. It should explain change, not decorate.
7. **Voice.** Copy tone is part of the interface (see `07-ux-writing.md`).

## 4. Common signs of generic output (check yourself)

These patterns are not forbidden, but if your result has several of them, you probably defaulted instead of deciding:

- A purple-to-blue gradient on a white page.
- A centered hero with a headline, one sentence, and two buttons, regardless of the product.
- A grid of identical cards with an icon, a title and two lines of text.
- Every section has the same structure, spacing and background.
- Emoji or random icons used as decoration.
- Heavy shadows, glassmorphism or glow on everything.
- One font at one or two weights with little size contrast.
- Equal visual weight on every element; no clear focal point.
- Placeholder-ish copy ("Welcome to our platform", "Get started today").
- Decorative animation on scroll with no purpose.

When you notice one, ask what the content actually needs, and design for that.

## 5. Extending an existing look

When a design system or established visual language exists:

- Use its tokens, components and patterns exactly. Do not introduce a new color, radius or spacing value.
- When something is missing, build it from existing tokens, and flag it as a proposed addition.
- When the existing system conflicts with accessibility (for example, low-contrast text), fix it minimally and call it out; do not silently ignore it.
- Match tone and density of neighboring screens. Open two or three existing screens and compare yours side by side.

## 6. Make it feel real

- Design with realistic content: real names, long names, empty fields, numbers with many digits, text in other languages, and the ugly edge cases.
- Show real states, not a staged hero shot.
- Prefer showing the actual product, data or output over illustrations about it.
- Cut anything that does not help the user do the one thing they came to do.

## 7. Output of this step

Produce a short "direction note" (it can live in the PR description or the top of your reply):

```
Audience & context:
Primary goal / primary action:
Direction (one sentence):
Type: <families, base size, scale>
Color: <neutrals, accent, status colors>
Shape & spacing: <radius, base unit, density>
Motion: <level and durations>
Voice: <tone in a few words>
```
