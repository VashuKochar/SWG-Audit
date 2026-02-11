# Style and layout

Consistent visual design and page structure for SWG Audit. See [src/css/style.css](src/css/style.css) for implementation.

## Design tokens (CSS variables)

Use these in CSS; avoid hardcoded colours or spacing.

| Token | Usage |
|-------|--------|
| `--color-primary` | Links, buttons, banner accent |
| `--color-primary-hover` | Button hover |
| `--color-text` | Body text |
| `--color-text-muted` | Footer, breadcrumbs |
| `--color-border` | Footer top border |
| `--color-bg` | Page background |
| `--color-bg-banner` | Simulation banner background |
| `--color-flow-perimeter` | Flow diagram perimeter box (SWG) |
| `--color-error` | Failure / error messages |
| `--color-success` | Pass / success messages |
| `--color-button-text` | Text on primary buttons |
| `--font-sans` | Body font stack |
| `--text-base`, `--text-small`, `--text-small-muted` | Type scale |
| `--line-height` | Prose line height |
| `--space-1` … `--space-5` | Spacing scale |
| `--radius` | Button/border radius |
| `--shadow-drop` | Dropdown and overlay box-shadow (theme‑aware) |

Dark mode is handled via `prefers-color-scheme: dark` overrides in the same file. The stylesheet sets `color-scheme: light` and `color-scheme: dark` so browser chrome (scrollbars, form controls) matches the page theme. The GitHub icon in the header uses `filter: invert(1)` in dark mode for contrast.

## Header pattern

- **Layout:** Sticky horizontal bar (`.header-bar`): left = brand (logo + `<h1>`), center = Simulations nav (four direct links), right = secondary links (About Us, Contribute, GitHub icon). Logo links to `/`; use inline SVG or `img` with class `header-logo`. GitHub link uses class `header-github` with icon (SVG or img) linking to the repository.
- **Site title:** `SWG Audit` (home) or `SWG Audit – Section` (e.g. `SWG Audit – Phishing – Level 1`) as `<h1>` inside `.header-brand`.
- **Nav:** Four direct links inside `<nav>`: Phishing → `/phishing/`, Malware → `/malware/`, Data Theft → `/data-theft/`, Cyber-Slacking → `/cyberslacking/`. Right block: About Us (`/about/`), Contribute (`/contribute/`), GitHub icon (repository URL). No breadcrumbs.
- **Sticky:** Header uses `position: sticky; top: 0` and `background: var(--color-bg)` so content does not show through when scrolling.

## Footer pattern

- Same on every page: one paragraph only. Text: "All tests are non-malicious and safe for production environments. No real threats are delivered. By continuing, you agree to our Terms of Use and Privacy Policy." Links: "Terms of Use" → `/terms/`, "Privacy Policy" → `/privacy/`.
- Markup: `<footer><p>…</p></footer>` with the sentence and links inside the `<p>`.
- **Sticky:** Footer uses `position: sticky; bottom: 0` and `background: var(--color-bg)`. Body uses flex column with `min-height: 100vh` and `main { flex: 1 }` so the footer sits at the bottom of the viewport on short pages and stays visible when scrolling long pages.

## Simulation banner

- Use `.simulation-banner` on simulation pages so users know the context is a test.
- Place once per page, directly after `<body>`, before `<header>`.
- Example: `<div class="simulation-banner" role="status">Phishing simulation – Level 3: credential submission. This is a test form; submitted data is discarded.</div>`.

## Feedback (result messages)

- Use the **`.error`** class for failure messages (e.g. “Perimeter Security Failed”, validation errors).
- Use the **`.success`** class for pass/success messages (e.g. “Perimeter may have passed”, “Blocked”).
- Do not set `style.color` in HTML or JS; toggle `element.className = 'error'` or `'success'` so colours stay consistent and respect dark mode.

## Section strips and sections

- **Section strip** (`.section-strip`): full‑width band that breaks out of main padding; use for each logical block of page content. Alternate background with **`.section-strip--alt`** (uses `--color-bg-banner`) for visual separation.
- **Section** (`.section`): inner content container inside a section strip; max‑width constrained, centred. Place one or more `<section class="section">` (with optional `aria-labelledby`) inside each `.section-strip`.
- Markup pattern: `<div class="section-strip">` (or `section-strip section-strip--alt`) → `<section class="section" aria-labelledby="…">` → content → `</section></div>`.

## Two-column layout

- For long content (e.g. About, Privacy), wrap the content in a container with class **`layout-two-column`**.
- Grid uses golden ratio: `1.618fr 1fr` (main content, supporting column). Stacks to one column below 640px.

## CSS file structure

[public/css/style.css](public/css/style.css) is organised in sections: Variables → Reset / base → Layout → Components → Utilities. Add new rules in the appropriate section.
