# Features

Spec for each feature, concrete enough to implement without pinging the group chat. Keep this updated as decisions get made.

---

## Public profile — `/[username]`

The page anyone can visit to see a developer's portfolio. Server-rendered, no auth required.

Layout top to bottom:

1. **Hero** — avatar, display name, headline, location, "available for work" badge (if toggled on), bio paragraph
2. **Projects** — grid of project cards, each showing title, description, tech stack tags, GitHub and live links
3. **Experience** — timeline of roles, most recent first, with company, title, dates, and description
4. **Skills** — grouped by category (Frontend, Backend, Tools, Other), displayed as tag clouds
5. **Socials** — footer row of icons linking to external profiles

Sections with no data are hidden entirely, not shown as empty. A user with no projects yet just doesn't see a Projects heading.

If the username doesn't exist, render `not-found.tsx` with a friendly message and a CTA to create your own portfolio.

Metadata is generated per profile via `generateMetadata`:

- `title` — `"{name} — Developer Portfolio"` or `"@{username} — DevFolio"` if no name
- `description` — the user's bio, truncated to 160 chars
- `og:image` — points at `/api/og/[username]`, which generates a PNG with the user's name, headline, and avatar on a branded background

---

## Dashboard editor

Every dashboard page follows the same shape: a header with the section title, a form filling the main column, and a completeness score + quick actions in the sidebar. All forms use React Hook Form with the corresponding Zod schema from `src/schemas/`.

### `/dashboard/profile`

One form with: display name, headline, bio (textarea), location, avatar URL, "available for work" toggle. Bio field has an "Improve with AI" button next to it and a "Generate from scratch" button at the top.

### `/dashboard/projects`

List view with "Add project" button at top. Each project card in the list has edit and delete actions. Clicking add or edit opens a dialog with the project form: title, description (textarea with AI-improve button), tech stack (tag input — type to add, click X to remove), GitHub URL, live URL.

Drag-to-reorder support via `dnd-kit` — optional if time runs short; just show them in creation order otherwise.

### `/dashboard/skills`

Single form with a section per category (Frontend, Backend, Tools, Other). Each section is a tag input. At the top of the page, a panel titled "Suggested skills from your projects" shows aggregated tech stack tags that aren't already in the skills list, each with an "Add to {category}" button.

### `/dashboard/experience`

List view, same pattern as projects. Dialog form has: company, role, start date, end date (with "currently working here" checkbox that nulls the end date), description.

### `/dashboard/socials`

Single form with one row per social platform. Fixed list of platforms: GitHub, LinkedIn, X, website, email. Each row is just a URL input. Leave blank to omit.

### `/dashboard/settings`

Username change (with warning that it breaks old share links), account deletion, sign out.

---

## AI assist

Three AI features, all routed through server actions in `src/server-actions/ai.ts`. Each one makes a single Claude API call, returns the result, and lets the user edit before saving.

The client side uses Tanstack Query mutations so we get loading states on the buttons. On success, the form field gets updated via `setValue` and the user can edit further.

### Bio generator

**Trigger:** "Generate bio" button on `/dashboard/profile`.

**Input:** user's current role (headline field), years of experience (small number input shown in a dialog when the button is clicked), top 3 skills (auto-pulled from their skills list).

**Server action:** `generateBio({ role, yearsExperience, topSkills })`

**Prompt skeleton:**

```
You are writing a short professional bio for a developer's portfolio page.

Role: {role}
Years of experience: {yearsExperience}
Top skills: {topSkills.join(', ')}

Write a 2-3 sentence bio in first person. Keep it direct and specific — no
buzzwords like "passionate" or "results-driven". Focus on what they build
and what they're good at. Do not include a name or contact info.
```

**Output:** plain text, 2-3 sentences, dropped into the bio field.

### Project description improver

**Trigger:** "Improve" button next to the description field in the project dialog.

**Input:** the current description, the project title, the tech stack tags.

**Server action:** `improveDescription({ title, techStack, description })`

**Prompt skeleton:**

```
You are polishing a project description for a developer's portfolio.

Project title: {title}
Tech stack: {techStack.join(', ')}
Current description: {description}

Rewrite this as 2-4 sentences. Keep all the specific facts and technical
details. Remove filler words. Write in a direct voice — describe what the
project does and what was interesting to build. Do not add technologies
that weren't mentioned.
```

**Output:** rewritten description, replaces the current value.

### Job title suggestions

**Trigger:** "Suggest titles" button next to the headline field on `/dashboard/profile`.

**Input:** the user's full skill list with categories.

**Server action:** `suggestTitles({ skills })`

**Prompt skeleton:**

```
Suggest 4-5 short professional titles (e.g. "Full-stack Developer",
"Frontend Engineer", "DevOps Specialist") for a developer with the
following skills:

{skills.map(s => `${s.name} (${s.category})`).join('\n')}

Return just the titles, one per line. No numbering, no explanation.
```

**Output:** rendered as a list of clickable chips above the headline field. Clicking a chip fills the headline.

---

## Skills from projects (no AI)

Aggregates the unique tech stack tags across all the user's projects, filters out anything already in the skills list (case-insensitive match), and presents the rest as suggestions on `/dashboard/skills`.

Each suggestion is a tag with a category dropdown (defaults to "Tools") and an "Add" button. Clicking Add fires an `addSkill` server action.

Implementation lives entirely in the server component that renders the skills page — it's just a query and a set difference. No API call needed, no AI.

---

## Portfolio completeness score

A progress bar in the dashboard sidebar showing how fleshed out the profile is, with a message pointing at the next thing to fill in.

Weights:

| Item | Points | Condition |
|---|---|---|
| Display name set | 10 | `profile.name` not empty |
| Headline set | 10 | `profile.headline` not empty |
| Bio set | 15 | `profile.bio` at least 40 characters |
| Avatar set | 5 | `profile.avatarUrl` not empty |
| At least 1 project | 15 | `projects.length >= 1` |
| At least 3 projects | 10 | `projects.length >= 3` |
| At least 5 skills | 15 | `skills.length >= 5` |
| At least 1 experience entry | 10 | `experience.length >= 1` |
| At least 1 social link | 10 | `socials.length >= 1` |

Total: 100.

The score component is a pure function of the user's data, computed in a server component and passed as a prop to the sidebar. No state, no effect. The "what to add next" message picks the highest-weight unmet item and formats it as a suggestion.

---

## Broken link checker

A button on the dashboard home that scans every external URL the user has added — GitHub URLs and live URLs across all projects, social links — and reports their status.

**Server action:** `checkLinks()` — pulls all URLs for the current user, pings each one, returns an array of `{ url, status }` results.

**Ping behavior:**

- HEAD request first, with a 5-second timeout
- If HEAD returns a method-not-allowed error (405), retry with GET
- Status codes 200–399 → `ok`
- Status codes 400–499 → `broken`
- Status codes 500–599 → `server-error`
- Timeout or network error → `unreachable`

Results render in a table on the client, grouped by category (projects, socials). Each broken link has a direct "edit" link to the form field so the user can fix it in one click.

Checks run in parallel — `Promise.all` over the URLs. Expected to complete within 10 seconds even with 20+ links; if not, we can add a queue later.

Client-side, use a Tanstack Query mutation to call the action. Show a spinner while it runs and a summary count in a toast when it finishes ("3 broken, 2 unreachable, 15 ok").

---

## Live preview

A toggle button at the top of every editor page that switches the main column between the form and a live preview of the public profile.

Implementation: the `<PublicProfile>` component is already designed to take a user object as a prop (see `architecture.md` on the public profile page). The preview mode wraps the same component, but instead of the saved DB data, it passes in the current form values merged with the rest of the user's saved data.

Because the form values are live, the preview updates on every keystroke without extra work. No debounce needed — it's just React re-rendering.

If the user is editing projects or experience (list views), the preview mode shows the whole profile as it stands, not just the one item being edited. The dialog stays open, the preview renders behind it.

---

## Onboarding — username claim

After the first GitHub login, the user has no username and gets redirected to `/onboarding` when they try to hit the dashboard.

The page shows a single input and a submit button. Validation:

- 3–20 characters
- Letters, numbers, and hyphens only
- Must start with a letter
- Can't be in the reserved list: `admin`, `api`, `dashboard`, `login`, `onboarding`, `settings`, `www`, plus anything else we think of
- Must be unique in the `users` table

Username validation runs in the Zod schema (client) and again in the server action (server). The server action also checks uniqueness — client-side we could show a live "available / taken" indicator via a separate server action, but that's polish; the submit-and-fail path is fine for v1.

On success, the action updates the user row, revalidates the relevant paths, and redirects to `/dashboard/profile`.