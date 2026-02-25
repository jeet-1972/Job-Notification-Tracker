# Job Notification App — Design System

Premium SaaS design system. Calm, intentional, coherent, confident. B2C product quality.

---

## Design Philosophy

- **Calm, intentional, coherent, confident** — not flashy, playful, or hackathon-style
- **No gradients, glassmorphism, neon colors, or animation noise**
- **Maximum 4 colors** across the entire UI
- **Whitespace is intentional** — use only the spacing scale

---

## Color System

| Token | Hex | Use |
|-------|-----|-----|
| Background | `#F7F6F3` | Page and surface background (off-white) |
| Primary text | `#111111` | Headings and body |
| Accent | `#8B0000` | Primary actions, links, focus |
| Success | `#5A6B5A` | Success states, completed items |
| Warning | `#8B7355` | Warnings, in-progress |

Borders and muted text use `#E5E4E0` and `#4A4A4A` derived from the palette.

---

## Typography

- **Headings:** `Source Serif 4` (serif), large, confident, generous spacing
- **Body:** `Source Sans 3` (sans-serif), 16–18px, line-height 1.6–1.8
- **Max width for text blocks:** 720px
- **No decorative fonts or random sizes**

---

## Spacing Scale (only these values)

- `8px` — xs
- `16px` — sm
- `24px` — md
- `40px` — lg
- `64px` — xl

**Never use values like 13px or 27px.**

---

## Global Layout Structure

Every page must follow this order:

1. **Top Bar** — App name (left), Progress Step X / Y (center), Status badge (right)
2. **Context Header** — Large serif headline + one-line subtext. Clear purpose, no hype.
3. **Primary Workspace (70%)** — Clean cards, predictable components, subtle borders, no heavy shadows
4. **Secondary Panel (30%)** — Step explanation, copyable prompt box, consistent buttons
5. **Proof Footer** — Checklist: UI Built, Logic Working, Test Passed, Deployed

---

## Components

- **Primary button:** Solid deep red (`#8B0000`)
- **Secondary button:** Outlined, same border radius
- **Same border radius everywhere:** `6px`
- **Inputs:** Clean borders, clear focus state (accent border)
- **Cards:** Subtle border only, no drop shadows

---

## Interaction

- **Transitions:** 150–200ms, `ease-in-out`
- **No bounce, no parallax**

---

## Error & Empty States

- **Errors:** Clearly explain what went wrong and how to fix it. Never blame the user.
- **Empty states:** Guide next action. Never leave blank screens.

---

## File Structure

```
design-system/
  tokens.css      — Colors, typography, spacing, radii, transitions
  base.css        — Reset, typography, links, focus
  components.css  — Buttons, inputs, cards, badges, prompt box, checklist
  layout.css      — Top bar, context header, workspace, panel, proof footer
  design-system.css — Single import for the full system
  DESIGN_SYSTEM.md — This document
```

---

## Usage

Link the design system in your HTML:

```html
<link rel="stylesheet" href="design-system/design-system.css">
```

Use the layout classes and component classes as shown in the demo page.
