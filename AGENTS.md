# AGENTS.md — SWG Audit

## First Steps

1. **Read `README.md`** at the repository root before making changes, adding features, or answering questions.
2. Use the README to understand project purpose, setup, structure, and conventions.
3. Follow any setup, run, or contribution steps described there.

---

## Project Structure

```
src/
  templates/       3 HTML layout templates (home, overview, simulation)
  content/         Page content: JSON metadata + HTML snippets + optional JS
    home.json        Homepage content
    {category}/
      overview.json    Category metadata + level list
      level*.json      Simulation metadata (title, instructions, feedback)
      level*.sim.html  Unique simulation content (HTML inside #sim-content)
      level*.script.js Per‑simulation client script (optional)
  pages/           Static pages (about, contribute, privacy, terms) — partial replacement only
  partials/        Reusable HTML fragments (header.html, footer.html)
  css/             Stylesheets (style.css)
public/            Static assets only (icons/, images/) — never generated files
dist/              Build output (gitignored) — served by Express
lib/               Build script + server utilities
server.js          Express server (serves dist/)
```

### Build commands

| Command | Action |
|---|---|
| `npm run build` | Compile templates + copy assets → `dist/` |
| `npm start` | Start Express (serves `dist/`) |
| `npm run dev` | Build then start |
| `npm run watch` | Rebuild on file changes |

### How templates work

The build script (`lib/build.js`) renders three page types:

1. **Homepage** — `templates/home.html` + `content/home.json`
2. **Overviews** — `templates/overview.html` + `content/{category}/overview.json`
3. **Simulations** — `templates/simulation.html` + `content/{category}/level*.json` + `.sim.html` + optional `.script.js`

Static pages in `src/pages/` use `{{> header }}` / `{{> footer }}` partial replacement (no template).

All simulation pages share a single template with: verification gate, two‑column layout (instructions + simulation box), pass/fail feedback, session check + reCAPTCHA script, and sibling level navigation.

### Adding a new simulation level

1. Add the level to `src/content/{category}/overview.json` → `levels` array.
2. Create `level{N}.json` — title, description, keywords, instructions, feedback text.
3. Create `level{N}.sim.html` — unique simulation content.
4. Optionally create `level{N}.script.js` — client‑side logic.
5. Run `npm run build`.

The build script derives the URL, return path, and sibling navigation automatically.

---

## Content Guidelines

### Target Audience

**Primary:** CISOs and Security Technicians

- Compliance with national cybersecurity guidelines
- Protection of critical infrastructure
- Prevention of data breaches
- Expect: scalable, cost‑effective solutions with training

### Buying Triggers

- New or updated cybersecurity directives
- Recent data breach incidents
- Fresh or increased IT security budgets
- Deployment of new critical systems
- Security upgrades by peer organizations

### Content Structure (PBAC)

Follow **Problem → Benefit → Advantage → Call‑to‑Action** in a single, clear flow. Focus heavily on the problem; use narrative to tell the story of problem and solution in a natural, deducing flow. Cover all cases to avoid ambiguity.

1. **Problem Statement** — security challenge, real‑world scenarios, business context
2. **Key Benefits** — desired outcome, value proposition, competitive advantage
3. **Prerequisites** — client‑side preparations, SafeSquid‑side setup, system requirements
4. **Call to Action** — step‑by‑step actions, verification at every step, congruence check
5. **Solution Verification** — interface checks, log analysis, performance validation
6. **Troubleshooting** — common issues, resolution steps, escalation procedures

### Core Narrative Rules

1. Sell the problem, tell about the solution (~90% problem, ~10% solution)
2. Position technology evolution as the driver of new security requirements
3. Emphasize architecture and execution models over features
4. Frame security outcomes as consequences of design choices, not product claims
5. Present solutions as inevitable responses to systemic constraints
6. Maintain credibility through precision, not hype

---

## Voice and Tone

- **Professional** — enterprise‑grade technical documentation standards
- **Clear and Direct** — precise, unambiguous; active voice only
- **Consistent** — established terminology and naming conventions
- **Accessible** — varying technical expertise; simple but never dumbed down
- **Neutral** — no glorifying words, no adverbs, no hype
- **Technical Level** — high, strategic, with attention to data flows and compliance logging

---

## Writing Style

- Minimum words — remove anything not adding value
- No pronouns — use proper nouns only
- Active voice only (e.g. "Create a new policy" not "A new policy should be created")
- Present tense for procedures (e.g. "Click the Button" not "You should click")
- Short sentences — ≤ 20 words, declarative, high signal density
- Narrative style — tell the story in a natural deducing flow
- Cover all cases — avoid ambiguity
- Technically precise — correct terminology; explain terms on first use
- Memorable phrases where they add clarity
- Headings state the key point directly (headings = bottom line)
- **Hyphens:** Use non‑breaking hyphens (U+2011, ‑) in user‑facing content for compound terms (e.g. Zero‑Trust, real‑time). Do not change hyphens in code, URLs, or class names.
- **Orphans:** Avoid single words on the last line. Use `text-balance` on headings, `orphans: 2; widows: 2` on body text.

---

## Style and Layout

When editing pages or CSS:

1. **Follow `STYLE.md`** (project root) for design tokens, header/footer pattern, simulation banner, and feedback classes.
2. **Header:** Sticky horizontal bar with `.header-bar` — brand (logo + h1), four nav links (Phishing, Malware, Data Theft, Cyberslacking), right block (About Us, Contribute, GitHub icon). No breadcrumbs.
3. **Footer:** Same on every page — single paragraph with safety/legal text and links to Terms of Use and Privacy Policy. Sticky at bottom.
4. **Feedback:** Use `.error` and `.success` CSS classes for result messages — never inline `style.color`.
5. **CSS:** Edit `src/css/style.css` using existing variables (`--color-*`, `--space-*`, etc.) and place new rules in the correct section (Variables, Reset/base, Layout, Components, Utilities).
6. **Layout:** Prefer golden‑ratio proportions (φ ≈ 1.618) for two‑column splits: `1.618fr 1fr`; for three columns: `1fr 1.618fr 1fr`.

---

## Document Structure

- **Frontmatter:** Title, description, keywords (and SEO metatags where applicable)
- **Headings:** Clear hierarchy — H1 title, H2 main sections, H3 subsections
- **Instructions:** Step‑by‑step, present tense, active voice
- **Code:** Examples with proper syntax highlighting
- **Troubleshooting:** Include for complex procedures
- **Visuals:** Diagrams wherever possible; screenshots and logs tied to each feature
- **Links:** Interlink related docs; external links for third‑party tools

---

## Landing Page Improvement Plan

Key items for the homepage conversion:

- Single primary hero CTA ("Run simulations" → `#run-simulations`); secondary category links
- Trust strip under hero (open‑source, no lock‑in)
- Outcome cards instead of bullet list (use existing `.outcomes-cards` CSS)
- Two‑step framing for simulation section (Verify → Run from network)
- Clearer loading state and gate layout
