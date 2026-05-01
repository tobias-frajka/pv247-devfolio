# Handoff — DevFolio Design System

A complete design language for **DevFolio**, the portfolio builder for developers being built in [`pv247-devfolio`](https://github.com/tobias-frajka/pv247-devfolio). This bundle gives a developer everything they need to drop the system into the existing Next.js + shadcn/ui scaffold.

---

## About these files

The files in `preview/` are **design references created in HTML** — interactive prototypes that show the intended look, behavior, and component-level details. They are **not production code to copy directly**.

Your job is to **recreate them in the existing Next.js + Tailwind + shadcn/ui codebase** using the patterns the README and `docs/architecture.md` already establish (server components by default, shadcn primitives in `src/components/ui/`, etc.).

`globals.css` at the root of this folder **is** production-ready — it's a drop-in replacement for `src/app/globals.css`.

---

## Fidelity

**High-fidelity.** Final colors (oklch), typography scale, spacing, radii, shadows, and component states are all locked. Recreate the UI pixel-faithfully using shadcn/ui primitives styled by the tokens in `globals.css`.

---

## How to use this in the repo

### 1. Replace `src/app/globals.css`

Copy `globals.css` from this bundle into `src/app/globals.css`. It includes:
- Raw DevFolio tokens (`--paper`, `--ink`, `--accent`, spacing, radii, type)
- shadcn/ui aliases (`--background`, `--foreground`, `--primary`, `--border`, etc.) — every shadcn component will inherit the look automatically
- Tailwind v4 `@theme inline` bridge so utilities like `bg-card text-muted-foreground` work
- Light + dark themes scoped via `[data-theme]`

### 2. Set the theme on `<html>`

In `src/app/layout.tsx`:
```tsx
<html lang="en" data-theme="dark" className={`${GeistSans.variable} ${GeistMono.variable}`}>
```

For now, hardcode `data-theme="dark"` (it's the primary mode). A theme toggle can come later — `next-themes` works out of the box because everything is variable-driven.

### 3. Use Geist via next/font

```tsx
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
```
The variables `--font-geist-sans` and `--font-geist-mono` are referenced by `--font-sans` and `--font-mono` in the CSS.

### 4. Add shadcn components as you need them

```bash
pnpm dlx shadcn@latest add button input textarea card dialog badge switch progress label
```
Every one of these will pick up the DevFolio look from the variables. No further customization needed for v1.

### 5. Build feature components

Use `preview/design-system.html` (open it in a browser) as the source of truth for layouts, copy, and interactions. The "Components" section shows every primitive; the "Page mockups" section shows three pages assembled.

---

## Design tokens

### Colors — dark (primary)
| Token | Value | Use |
|---|---|---|
| `--paper` | `oklch(0.165 0.008 80)` | Page background |
| `--paper-2` | `oklch(0.205 0.008 80)` | Cards, surfaces |
| `--paper-3` | `oklch(0.245 0.008 80)` | Hover, secondary buttons |
| `--ink` | `oklch(0.97 0.005 90)` | Primary text |
| `--ink-2` | `oklch(0.78 0.006 85)` | Secondary text |
| `--ink-3` | `oklch(0.58 0.006 85)` | Placeholder, hints |
| `--hairline` | `oklch(0.32 0.006 80)` | Borders |
| `--hairline-soft` | `oklch(0.26 0.006 80)` | Inner dividers |
| `--accent` | `oklch(0.78 0.12 145)` | Brand, primary, focus, "Available" |
| `--danger` | `oklch(0.7 0.16 25)` | Destructive, broken links |
| `--warn` | `oklch(0.78 0.13 75)` | Server errors |

### Colors — light
Same shape; lightness inverted. See `globals.css` `[data-theme="light"]` block.

### Typography
**Family:** Geist (sans) + Geist Mono. Mono is reserved for *literal values* — tech-stack tags, URLs, file paths, kbd, dates, counts.

| Token | px | Weight | Use |
|---|---|---|---|
| `--t-5xl` | 64 | 500 | Landing display |
| `--t-3xl` | 36 | 500 | Page titles |
| `--t-2xl` | 28 | 500 | Section headings |
| `--t-xl`  | 22 | 500 | Subheads, headlines |
| `--t-lg`  | 18 | 400 | Lead paragraphs |
| `--t-base`| 15 | 400 | Body |
| `--t-sm`  | 13 | 400 | Form labels, secondary |
| `--t-xs`  | 12 | 400 | Captions, eyebrow, mono |

Letter-spacing: `-0.03em` at display, `-0.022em` at title, `-0.012em` at heading, `0` below.

### Spacing — 4pt grid
`--space-1`…`--space-20` → `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80` px.

### Radius
`xs 4 · sm 6 · md 10 · lg 14 · xl 20`. **Default is `md` (10px)** for buttons and inputs; `lg` for cards and dialogs.

### Shadow
`sm`, `md`, `lg`, `pop` — all warm-tinted on light, deep on dark. Used sparingly; most surfaces rely on a 1px hairline instead.

---

## Components (recreate as React components in `src/components/`)

Every component below has a live, interactive version in `preview/design-system.html` → **Section 05 — Components**.

### Button (`<Button>` — shadcn `button`)
Variants: `default` (= primary, accent fill), `secondary` (paper-3), `outline`, `ghost`, `destructive`. Plus a custom **AI variant** with a leading `✦` glyph in `--accent` — used for "Improve with AI", "Generate bio", "Suggest titles". Sizes: `sm 28px`, `default 36px`, `lg 44px`.

### Input / Textarea / Label (shadcn)
36px height, 10px radius, hairline border, focus ring uses `--accent` + 3px `--accent-ghost`. Error state swaps border to `--danger`. Hints in `--ink-3` at 12px below the field.

### Tag / Chip — *custom*, not shadcn
The workhorse for **tech stack** entry. Mono font, 11.5px, `--paper-3` fill, hairline border, 6px radius. Variants: default, `accent` (focused/selected), `outline`, `dashed` (used for "+ add" and "Suggested skills" — clickable).

### Badge (shadcn)
Pill shape (999px radius). Status tones: `ok` (green dot in accent, with halo), `warn`, `danger`, neutral. Used for "Available for work", broken-link results, "live"/"draft".

### Switch / Toggle (shadcn `switch`)
32×18, accent fill when on. Used for "Available for work" toggle, "currently working here" checkbox alternative.

### Progress (shadcn `progress`)
6px tall, 999px radius. Drives the **portfolio completeness score**. Always paired with a counter `65 / 100` in mono on the right.

### Card (shadcn `card`)
Paper-2 background, hairline border, 14px radius, 20px padding, 12px gap inside. Two demonstrated layouts: project card (title + URL + stack tags + "Live" badge) and experience card (role + company + dates + body).

### Dialog (shadcn `dialog`)
560px max-width, paper-2 background, 14px radius, `--shadow-pop`. Three regions: head (title + close), body (form fields, scrollable), foot (action buttons, right-aligned). Backdrop blurs the page at 6px + 70% paper overlay. Used for **project create/edit** and **experience create/edit**.

---

## Layout patterns

### Dashboard shell — `src/app/(dashboard)/layout.tsx`
Three-column grid: **220px sidebar · 1fr main · 280px right rail**. Sidebar is sticky, scrolls independently. Right rail holds the completeness card, broken-link checker, and contextual suggestions (e.g. "Suggested skills" on the skills page). Collapse the right rail on `< 1100px`.

### Public profile — `src/app/[username]/page.tsx`
Single column, max-width ~880px, centered. Sections in order: **hero** (avatar 120px round + name + headline + bio + Available badge) → **projects** (2-col grid) → **experience** (timeline rows: 200px date column, 1fr body) → **skills** (label-value rows: 200px category eyebrow, 1fr tag cloud) → **socials footer**. Sections with no data are *removed entirely*, never rendered as empty.

### Landing — `src/app/page.tsx`
Centered hero (max-width 760px) with eyebrow, display headline, lede, two CTAs ("Sign in with GitHub →" primary + "See an example" outline), trust line in mono ("· no credit card · export anytime · open source"). Three feature cards below in a 3-col grid.

---

## Voice & copy rules

- **Address one person.** "Pick a username" not "Choose your username".
- **No filler superlatives** — never "stunning", "passionate", "results-driven", "unlock your potential".
- **Honest counts.** "3 broken, 2 unreachable, 15 ok" — not "Some links need attention".
- **Mono for literals.** URLs, paths, dates, counts, tags. Sans for everything else.
- **Errors stay technical.** "That URL doesn't resolve." beats "Oh no, something went wrong 😢".

---

## Interactions & state

### AI assist buttons
- Idle: `<Button variant="ai">Improve with AI</Button>`
- Loading: same button, label swaps to `Improving…`, leading glyph rotates (`animation: spin 1s linear infinite`).
- Success: replace form value via `setValue` (RHF). No toast, no celebration. The user can re-edit immediately.

### Tag input
Type → press Enter / comma / Tab → tag commits. Click `×` on a tag to remove. Backspace on empty input removes last tag. Suggested-skills row is identical visually but with `dashed` style.

### Broken link checker
Button kicks a Tanstack Query mutation calling `checkLinks()` server action. Results render as a list of rows: `mono URL` + `<Badge>` (`ok` / `404 broken` / `unreachable` / `server-error`). Each broken row has a deep-link `Edit` button that takes the user to the relevant form field.

### Completeness score
Pure server-side calculation — no client state. Recomputed on every dashboard render. The "what to add next" sentence picks the highest-weight unmet item from the spec table in `docs/features.md`.

---

## Files in this bundle

```
design_handoff_devfolio/
├── README.md                    ← you are here
├── globals.css                  ← drop into src/app/globals.css
└── preview/
    ├── design-system.html       ← open in a browser to see everything live
    ├── ds.css                   ← styles used by the preview only
    ├── ds-tokens.jsx            ← token data
    ├── ds-primitives.jsx        ← Btn / Tag / Badge / Input / Card / Logo
    ├── ds-components.jsx        ← Brand / Color / Type / Geometry / Components sections
    ├── ds-mocks.jsx             ← Landing / Profile / Dashboard mockups
    ├── ds-app.jsx               ← preview shell (nav, scrollspy, tweaks)
    └── tweaks-panel.jsx         ← preview tweaks UI
```

To preview: open `preview/design-system.html` in any browser. No build step required.

---

## Recommended implementation order

1. **Install** `globals.css`, Geist via `next/font`, `data-theme="dark"` on `<html>`.
2. **Add shadcn primitives** (`button input textarea card dialog badge switch progress label`).
3. **Build the dashboard shell** (`src/app/(dashboard)/layout.tsx`) — sidebar nav + right rail with completeness card placeholder.
4. **Build the public profile** (`src/app/[username]/page.tsx`) using static seed data.
5. **Build the projects editor** (`/dashboard/projects`) — list + dialog form. The other editor pages reuse the same patterns.
6. **Wire AI assist** — drop the AI-variant `<Button>` next to bio / description fields, hook to the server actions.
7. **Wire broken link checker** — right-rail card + results rendering.
8. **Polish** — light mode toggle, responsive collapses, loading skeletons.
