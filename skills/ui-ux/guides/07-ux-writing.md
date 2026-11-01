# 07. UX writing and microcopy

Interface text is part of the design. Good copy helps people act; bad copy makes good layouts fail. If the project has a voice guide or existing copy, match it before applying anything here.

## 1. Principles

- **Clear before clever.** Say plainly what will happen.
- **Concise.** Cut every word that does not help. Front-load the important words.
- **Specific.** Name the object and the outcome ("Delete 3 photos", not "Are you sure?").
- **Useful.** Every message answers: What is this? What happened? What can I do now?
- **Human and consistent.** Plain language, one term per concept, one tone throughout.
- **Respectful.** Never blame the user, never use fear or guilt to steer choices.
- **Inclusive.** Avoid idioms, jargon, gendered or ableist wording, and cultural references that do not translate.

## 2. Voice and tone

Set voice once for the product (for example: calm, direct, friendly). Tone flexes with the moment: light on success, steady and plain on errors, minimal on destructive confirmations. Do not use humor in error states or when the user has lost data.

## 3. Labels and buttons

- Buttons and menu items start with a verb and describe the result: "Save changes", "Create project", "Send invite".
- Avoid "OK", "Submit", "Yes/No" when a specific verb works. For dialogs, mirror the question in the action: "Discard draft" / "Keep editing".
- Use the same word for the same action everywhere (do not mix Remove, Delete and Discard for one operation).
- Sentence case by default; keep casing consistent.
- Navigation labels are nouns or short noun phrases; keep them short and predictable.
- Do not use "click here" or "learn more" without context. Links describe where they lead.
- Avoid truncated ambiguous abbreviations. Spell it out unless the term is universal.

## 4. Errors

Structure: **what happened, why (if known), what to do.** Place the message next to where the problem is. Keep a calm tone.

| Weak | Better |
|------|--------|
| "Error" | "We couldn't save your changes. Check your connection and try again." |
| "Invalid input" | "Enter a date in the format DD/MM/YYYY." |
| "Something went wrong." | "We couldn't load your projects. Retry, or contact support if this keeps happening." |
| "You entered the wrong password." | "That password doesn't match. Try again or reset your password." |

Guidelines:
- Say what the user can fix, and give the fix. Include a retry or alternative path.
- Do not expose raw error codes or stack traces as the only message; offer a reference ID if support needs it.
- Distinguish user mistakes, connectivity problems and system faults.
- Do not use "please" excessively, exclamation marks, or alarming words for minor issues.
- For field validation, describe the requirement before the failure when possible (help text), then confirm what to fix.

## 5. Empty states

An empty state is an onboarding moment. Provide:
1. What this place is for (one short line).
2. Why it is empty now (first use, filtered to nothing, cleared).
3. The next action as a clear button.

Example: "No invoices yet. Invoices you create appear here. Create invoice".
For filtered-to-nothing: say which filters apply and offer "Clear filters".

## 6. Confirmations and destructive actions

- Reserve confirmation for destructive or irreversible actions. Prefer undo for reversible ones.
- Title states the action and object. Body states the consequence, including what cannot be undone. Buttons repeat the verb.
- Example: Title "Delete project 'Atlas'?" Body "This removes 14 files and cannot be undone." Buttons "Delete project" and "Cancel".
- Make the safe option the easiest to hit; make the destructive option visually distinct (but do not make it the default focus).

## 7. Success and status

- Confirm briefly and specifically: "Changes saved", "Invite sent to sam@example.com".
- Avoid celebrating routine success. Save emphasis for milestones.
- Status labels are short and unambiguous (Draft, Scheduled, Published, Failed). Pair with an icon or shape, not only color.
- Loading text describes what is happening when it takes a while ("Importing 2,400 contacts"), not just "Loading".

## 8. Onboarding, tooltips and help

- Teach in context, at the moment it is needed, not in a long up-front tour.
- Tooltips supplement; they never contain essential or only-copy information. They must also work on focus.
- Placeholder text shows an example format, not instructions, and never replaces a label.
- Keep help text short and adjacent to the field; link out for long explanations.

## 9. Numbers, dates, units

- Use locale-aware formatting (`Intl` APIs). Do not hard-code formats.
- Show units, currency and time zones where ambiguity is possible.
- Prefer relative time for recent events ("5 minutes ago") with the exact time available on hover/focus or in a tooltip that is keyboard reachable.
- Pluralize correctly with a real pluralization mechanism, not "item(s)".

## 10. Localization readiness

- No string concatenation to build sentences; use full-sentence templates with placeholders.
- Allow for text expansion (30 to 40% longer) and different word order.
- Keep text out of images.
- Avoid culturally specific idioms, puns and humor in core flows.

## 11. Copy checklist

- [ ] Buttons start with a verb and say the outcome.
- [ ] Same concept, same word, everywhere.
- [ ] Errors say what, why and what next, with a recovery action.
- [ ] Empty states explain and offer a next step.
- [ ] Destructive confirmations name the object and the consequence.
- [ ] No jargon, blame, filler or exclamation overload.
- [ ] Links and icon buttons make sense out of context.
- [ ] Strings are localizable and formatted with locale APIs.
