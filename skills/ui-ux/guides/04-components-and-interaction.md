# 04. Components and interaction

## 1. Every interactive element has a full state set

Build and verify each of these. Missing states are the most common cause of "feels broken".

| State | Requirement |
|-------|-------------|
| Default | Clearly looks interactive (affordance) |
| Hover | Subtle change, only on hover-capable pointers (`@media (hover: hover)`) |
| Focus-visible | A clear, high-contrast focus indicator, never removed without replacement |
| Active / pressed | Immediate feedback (slight scale, darker fill, inset) |
| Disabled | Visually muted, not focusable (or `aria-disabled` with explanation), no hover/press effects |
| Loading / pending | Shows progress, prevents duplicate submission, keeps its size (no layout jump) |
| Selected / current | Distinguishable without color alone |
| Error | Visible message plus icon or text, tied to the control programmatically |
| Success | Brief, unobtrusive confirmation |
| Read-only | Looks different from disabled; text still selectable and readable |

## 2. Hit areas and spacing

- Interactive targets should be at least 44 by 44 CSS pixels on touch interfaces (WCAG 2.2 AA minimum is 24 by 24, and larger is better). The clickable area can exceed the visible icon through padding or a pseudo-element.
- Keep adjacent targets separated enough to avoid mis-taps.
- Never put destructive and common actions next to each other with identical styling.

## 3. Buttons and links

- **Button** performs an action on the current page (submit, open dialog, toggle). **Link** navigates. Use `<button>` and `<a href>` respectively; do not make `<div>`s clickable.
- Hierarchy: primary (filled), secondary (outlined or tonal), tertiary (text). One primary per view or section.
- Labels start with a verb and say what happens ("Save changes", "Delete project"), not "OK" or "Submit".
- Show a pending state on async actions and disable repeat clicks; keep the button width stable.
- Icon-only buttons need an accessible name and, ideally, a tooltip.
- Links are distinguishable from surrounding text by more than color (underline or other cue) and describe their destination.

## 4. Forms

Forms are where UX is most often lost. Follow these:

- **One column** is usually best. Group related fields; label groups with `fieldset` and `legend`.
- **Visible labels above fields**, always associated with the input (`<label for>` or wrapping). Placeholders are hints, never labels, and disappear on input.
- Mark optional fields rather than required ones when most are required (or vice versa), and be consistent.
- Use the right input `type`, `inputmode`, `autocomplete` and `enterkeyhint` so mobile keyboards and autofill help.
- Help text sits near the field and is linked with `aria-describedby`.
- **Validation:** validate on blur or submit, not on every keystroke, except for helpful live feedback (password strength, character count). Show errors next to the field, in text, with an icon, tied by `aria-describedby` and `aria-invalid`. On submit failure, move focus to the first error or an error summary that links to each field.
- Never wipe the user's input after an error. Preserve everything.
- Allow paste, allow password managers, do not block autofill, and support showing/hiding passwords.
- Do not ask for information twice in the same flow; reuse what was already given.
- Use appropriate controls: radio for 2 to 5 mutually exclusive options, checkbox for independent, toggle for immediate on/off with instant effect, select or combobox for long lists, segmented control for view modes.
- Provide sensible defaults. Do not preselect options with consequences.
- Long forms: show progress, save drafts, allow going back without losing data.

## 5. Navigation

- Show where the user is (current page indicator) and how to get elsewhere. Use `aria-current="page"`.
- Keep primary navigation short (about 5 to 7 destinations) and stable across pages.
- Use familiar patterns: top bar, sidebar, tabs, bottom bar on mobile.
- **Tabs** switch views of the same content at the same level; they do not navigate to other pages. Implement with the proper tab pattern (roles, arrow-key navigation) or use real links styled as tabs.
- Breadcrumbs for deep hierarchies. Back behavior must work (do not trap the browser back button or break history).
- Search: make it findable, forgiving and fast; show results with context and handle "no results" helpfully.

## 6. Feedback and system status

- **Immediate response** (under about 100ms) to every input; if work takes longer, show a pending state.
- **Loading:**
  - Under about 1 second: usually no indicator needed beyond a pending control.
  - 1 to 10 seconds: skeleton or spinner with context.
  - Over 10 seconds: determinate progress, what is happening, and a way to cancel or continue elsewhere.
  - Skeletons match the final layout's size and shape to avoid layout shift.
- **Success:** confirm briefly in place (inline message, button state) rather than with a blocking dialog.
- **Errors:** say what happened, why if known, and what to do next. Offer retry. Distinguish user mistakes, network failures and system faults.
- **Toasts:** only for non-critical, transient messages that do not require action. They must be announced to assistive tech, persist long enough to read (or until dismissed), pause on hover/focus, and never carry the only copy of important information.
- **Optimistic updates:** update immediately, show pending, and roll back visibly with an explanation if the server rejects.
- **Undo over confirm:** for reversible actions, perform and offer undo. Reserve confirmation dialogs for destructive or irreversible actions, and name the consequence ("Delete 12 files permanently").

## 7. Dialogs, popovers, menus, drawers

- Use a modal only when the user must decide before continuing. Prefer inline or non-modal patterns otherwise.
- Prefer the native `<dialog>` element or a well-tested primitive. Whatever you use must: trap focus inside while open, move focus in on open, return focus to the trigger on close, close on `Escape`, have an accessible name, and make the background inert.
- Include a clear close control and a primary/secondary action pair with specific labels.
- Dismiss on outside click only if no data would be lost.
- Menus and popovers: keyboard navigable (arrow keys, `Escape`, type-ahead), positioned to stay in the viewport, and dismissible.
- Do not stack modals.

## 8. Data display

- **Tables** for comparing structured data: real `<table>` with `<th scope>`, aligned numbers (right-aligned, tabular numerals), sticky header for long tables, row hover without hijacking selection, sortable columns announced to assistive tech.
- **Lists/cards** for browsing items with mixed content.
- Pagination, infinite scroll or "load more": prefer pagination or "load more" for findability and footer access; if infinite scroll is used, keep position on back navigation.
- **Empty states:** explain why it is empty and give the next action ("No projects yet. Create your first project.").
- **Charts:** direct labels over legends when possible, accessible color choices, units on axes, a text or table alternative, and no decoration that does not carry data.
- Show units, time zones and formats consistently. Use relative time with an absolute time available.
- Sorting, filtering and search state should be reflected in the URL when users would want to share or return to it.

## 9. Selection, drag and drop, gestures

- Anything doable by dragging or gesture must also be doable with a simple pointer or keyboard alternative (WCAG 2.2 dragging movements).
- Multi-select shows a count and offers clear bulk actions.
- Do not hide essential actions behind hover or long press.

## 10. Component API quality (when you write reusable components)

- Smallest sensible API; sensible defaults; prop names describe intent, not appearance (`variant="danger"` not `color="red"`).
- Support `className`/style overrides or composition slots without breaking internals.
- Forward refs and spread remaining props to the root element where the framework supports it.
- Controlled and uncontrolled usage for stateful inputs.
- Document each state and show it in examples (a story, demo page or test page).
- Accessibility is built in: roles, labels, keyboard handling and focus management are part of the component, not left to callers.
