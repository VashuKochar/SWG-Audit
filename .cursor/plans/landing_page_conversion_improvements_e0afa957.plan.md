---
name: Landing page conversion improvements
overview: Substantially improve the SWG Audit landing page so it matches the clarity, trust, and conversion patterns of top B2B security pages (Tailscale, Vanta, Stripe) while staying within existing content guidelines and STYLE.md.
todos: []
isProject: false
---

# Landing Page Improvements to Match Top Converters

## Current state vs target

The current page has a strong narrative (problem → what it is → outcomes → how it works) and a clear flow diagram, but it underperforms compared to Tailscale, Vanta, and Stripe on: **one clear hero CTA**, **trust/social proof**, **scannable use-case blocks**, and **a staged verification journey**. The plan below addresses these gaps using existing design tokens, [STYLE.md](STYLE.md), and [.cursor/rules/content-guidelines.mdc](.cursor/rules/content-guidelines.mdc).

---

## 1. Hero: single primary CTA and sharper subline

**Problem:** Four equal CTAs (Phishing, Malware, Data Theft, Cyberslacking) above the fold dilute focus. Top pages (Linear, Stripe, Tailscale) use one primary action; secondary options come later. The subline repeats “vendor claims” and is long.

**Changes:**

- **Primary CTA:** One prominent button in the hero that drives the main conversion: e.g. “Run simulations” or “Start validation” linking to `#run-simulations` (anchor to the verification / simulation section) or directly to `/phishing/` if you prefer no gate in the first click. Recommendation: scroll to `#run-simulations` so the gate stays in flow.
- **Secondary actions:** Replace the four equal buttons with a single secondary line: “By category: Phishing · Malware · Data theft · Cyberslacking” (text links to each category overview). Keep hero actions minimal so the eye goes to one primary button.
- **Subline:** Shorten and differentiate from the headline. Current subline repeats “beyond vendor claims.” Option: “Safe, repeatable Layer‑7 simulations. Run from your network; see what your perimeter blocks or allows.” (Or similar; keep under ~15 words and avoid repeating the headline.)
- **Optional one-liner:** Add a short supporting line under the subline that echoes AuditKit-style clarity, e.g. “Open‑source. No vendor lock‑in. Traffic traverses your perimeter.” (Fits PBAC and builds trust.)

**Files:** [src/index.html](src/index.html) (hero markup), [public/css/style.css](public/css/style.css) (`.landing-hero-actions` — style primary vs secondary; consider `.button-cta-primary` for the single main button, secondary as text links).

---

## 2. Trust and proof block

**Problem:** No “trusted by” logos, metrics, or open-source badge. Top B2B security pages (Vanta, Snyk, Tailscale) all surface trust above or near the fold.

**Changes:**

- Add a **trust strip** section directly under the hero (before “Vendor claims don’t equal control assurance”):
  - **Open-source:** “Open‑source on GitHub” with icon linking to the repo (you already have the icon in the header; reuse or repeat).
  - **No lock-in:** One line: “No vendor lock‑in. Runs against your perimeter.”
  - **Optional:** If you have any adopters or “used by” (e.g. SafeSquid or a partner), add a “Used by” line with logos; otherwise skip or use a single testimonial later.
- Keep copy short and factual; no hype (aligned with content guidelines).
- Reuse existing design tokens (`--color-text-muted`, `--color-border`); no new visual system.

**Files:** [src/index.html](src/index.html) (new section after `.landing-hero`), [public/css/style.css](public/css/style.css) (e.g. `.landing-trust` with flex/grid and small type).

---

## 3. Outcomes as scannable cards (CISO use cases)

**Problem:** The “CISOs use SWG Audit…” section is a single paragraph plus a long bullet list. Tailscale and Vanta use clear use-case cards so visitors can scan quickly.

**Changes:**

- Turn the four outcomes into **cards** using the existing `.outcomes-cards` and `.outcome-card` pattern already in [public/css/style.css](public/css/style.css) (lines 667–695).
- Keep the section heading: “CISOs use SWG Audit to validate controls and generate evidence.”
- Remove the redundant first sentence under the heading (“CISOs use SWG Audit to validate Layer‑7 controls…”).
- Four cards, one per outcome:
  - **Pre‑deployment and post‑upgrade** — Verify enforcement, not configuration, under controlled conditions.
  - **Audit evidence** — Repeatable results for internal assurance, ISO 27001, NIST CSF, and regulatory audits.
  - **Vendor claims verification** — Independent check; traffic traverses your perimeter (on‑prem or hosted).
  - **Incident post‑mortem** — See which layer (DNS, TLS, HTTP, content, policy) allowed or blocked each threat class.
- On small viewports, stack to one column (grid already supports 2 columns; add a media query for 1 column below ~640px if not already present).

**Files:** [src/index.html](src/index.html) (replace `.benefits-outcomes` list with `.outcomes-cards` and `.outcome-card` items).

---

## 4. “Run simulations” as a clear two-step journey

**Problem:** “Run simulations” appears as a bare h2; the verification gate feels like a form dropped into the page. Top pages frame conversion as steps (e.g. “Step 1: Verify → Step 2: Run from your network”).

**Changes:**

- Give the conversion block a clear **section id** (e.g. `id="run-simulations"`) so the hero primary CTA can anchor to it.
- Add a short **section intro**: “Run each simulation from a device inside the network under assessment. Verify once to access all categories.”
- Present the flow as two steps:
  - **Step 1 — Verify:** reCAPTCHA + business email (limits abuse, reserves simulations for legitimate assessment). Keep existing form and consent text.
  - **Step 2 — Run from your network:** “After verification, open the simulation links from a device inside the perimeter you are testing.”
- Optionally add a minimal “progress” hint (e.g. “Step 1 of 2”) above the gate when unverified, and “Step 2” when showing the simulation list.
- Ensure the gate and the post-verification simulation list are in the same scroll context so the primary CTA (“Run simulations”) leads to one coherent block.

**Files:** [src/index.html](src/index.html) (wrap gate + simulations in a section, add step labels and intro copy; ensure `id="run-simulations"` for anchor).

---

## 5. Simulation list and category imagery

**Problem:** Simulation cards are text-heavy and don’t use the existing category images. Making categories more visual and the “next step” obvious improves conversion.

**Changes:**

- **Optional imagery:** You have [public/assets/images/](public/assets/images/) (phishing.webp, malware.webp, data-theft.webp, cyberslacking.webp). Consider adding small thumbnails or icons to each simulation card (e.g. left of the card title) for quick recognition. If the project prefers a more document-like look, keep cards text-only but ensure hierarchy is clear (category name → goal → controls → pass condition).
- **Primary CTA after list:** Keep “Begin validation: Zero‑hour phishing” as the main post-verification CTA; add one line under it: “Then run Malware, Data theft, and Cyberslacking from the same device.”
- **Data Theft card:** The card currently says “Levels: 2” but the README lists three levels (L1 file upload, L2 confidential signatures, L3 DNS tunneling). Correct to “Levels: 3” in the simulation card copy for consistency.

**Files:** [src/index.html](src/index.html) (simulation list and CTA copy; fix Data Theft levels if applicable), optionally [public/css/style.css](public/css/style.css) for card layout with image.

---

## 6. Flow diagram prominence and “How it works”

**Problem:** The flow diagram is strong but could be easier to see at a glance and better tied to the CTA.

**Changes:**

- Keep the existing SVG and figcaption; consider slightly **increasing max-width** of `.flow-svg` (e.g. from 28rem to 32rem) so it reads better on large screens.
- Add one line **below** the figcaption: “Verify below, then run each simulation from a device inside that perimeter.” This links “how it works” to the next section (run simulations) and reinforces the prerequisite.

**Files:** [src/index.html](src/index.html) (one sentence after figcaption), [public/css/style.css](public/css/style.css) (optional `.flow-svg` max-width).

---

## 7. Verification gate and loading state

**Problem:** “Loading…” is plain text; the gate layout could feel more intentional.

**Changes:**

- **Loading state:** Replace raw “Loading…” with a short, accessible message and optional minimal skeleton (e.g. “Checking access…” and a small placeholder where the gate or simulation list will appear). Ensure `id="loading"` is still toggled by the existing script.
- **Gate layout:** Use a clear card-style container for the form (you have `.verify-form-wrap` with padding). Ensure the “After verification” block is visually distinct (e.g. muted background) so the two steps are clearly separated. No major structure change—refinement only.

**Files:** [src/index.html](src/index.html) (loading copy and optional wrapper), [public/css/style.css](public/css/style.css) (minor `.verify-gate` / `.verify-after` tweaks if needed).

---

## 8. Content and copy tweaks (no structural change)

- **CISO section:** Remove duplicate first sentence under the outcomes heading (see section 3).
- **Headline:** Current headline is strong; keep “Validate perimeter controls with evidence, not vendor claims.”
- **Meta/SEO:** Existing title and description are good. Optional: add `og:image` for sharing (e.g. logo or a simple “SWG Audit – Layer‑7 validation” image).

---

## 9. Build and consistency

- After editing [src/index.html](src/index.html) and [public/partials/](public/partials/) (if any partials change), run `npm run build:html` so [public/index.html](public/index.html) is updated.
- Keep header and footer as per [STYLE.md](STYLE.md); no nav or footer changes in this plan unless you add a “Run simulations” nav link (optional).

---

## Summary of deliverables


| Area            | Action                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Hero            | One primary CTA (“Run simulations” → `#run-simulations`); secondary category links; shorter subline; optional one-liner |
| Trust           | New trust strip under hero (open‑source, no lock‑in, optional “used by”)                                                |
| Outcomes        | Replace benefits list with outcome cards using existing CSS                                                             |
| Run simulations | Section id, two-step framing (Verify → Run from network), short intro                                                   |
| Simulation list | Fix Data Theft levels; optional category images; clearer CTA line                                                       |
| How it works    | Optional larger flow diagram; one line linking to “Run simulations”                                                     |
| Gate / loading  | Clearer loading copy; minor gate layout refinement                                                                      |
| Copy            | Remove CISO duplicate sentence; optional og:image                                                                       |


This plan stays within the project’s content rules (PBAC, problem-heavy narrative, professional tone, no hype) and STYLE.md (tokens, header/footer, two-column and card patterns), while aligning the page with the conversion and clarity patterns of the reference sites.