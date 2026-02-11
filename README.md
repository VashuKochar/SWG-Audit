# SWG Audit

Open‑source initiative to help buyers validate the real‑world effectiveness of perimeter security solutions against web‑based threats.

## What is SWG Audit?

SWG Audit provides safe simulations (no real attacks) to test how many layers of defence a perimeter has:

- **Phishing**: L1 URL filters, L2 spoofing detection, L3 form submission block.
- **Malware (EICAR only)**: L1 known in all formats/archives, L2 fragmented delivery.
- **Data theft**: L1 file upload types, L2 DLP signatures, L3 DNS tunnelling.
- **Cyberslacking**: YouTube category links.

Before running any simulation, users verify via **reCAPTCHA** and **business email**.

## Features

### Production-Ready
- **Security headers** (helmet.js) — CSP, X-Frame-Options, HSTS
- **Compression** — gzip/brotli for faster page loads
- **Structured logging** (Winston) — error + combined logs, console in dev
- **Request logging** (Morgan) — all HTTP requests logged
- **Email validation** — blocks free email providers (Gmail, Yahoo, etc.)
- **Health check endpoint** (`/health`) — uptime monitoring ready
- **Custom error pages** — branded 404/500 pages

### SEO Optimized
- **Meta tags** — description, keywords, Open Graph, Twitter Cards
- **robots.txt** — search engine directives
- **sitemap.xml** — all pages indexed
- **Favicon + touch icons** — multi-size support

### Analytics Ready
- **Google Analytics** integration (add `GA_MEASUREMENT_ID` to enable)
- Track simulation completions, verification rates, user flow

### Developer Experience
- **Watch mode** — auto-rebuild on file changes (`npm run watch`)
- **Clear documentation** — deployment guide, contributing guide
- **Accessible codebase** — semantic HTML, clean structure

## How to run locally

**Prerequisites:** Node.js 18+

```bash
git clone <repo>
npm install
cp .env.example .env    # then edit .env
npm run build            # compile templates → dist/
npm start                # serve on port 3000
```

### Environment variables (`.env`)

| Variable | Purpose |
|---|---|
| `RECAPTCHA_SITE_KEY` | reCAPTCHA site key (client) |
| `RECAPTCHA_SECRET_KEY` | reCAPTCHA secret (server) |
| `SESSION_SECRET` | ≥ 32 characters for signing the session cookie |
| `SKIP_VERIFY` | Set `1` to bypass captcha in local dev |
| `PORT` | Server port (default `3000`) |
| `NODE_ENV` | `development` or `production` |
| `LOG_LEVEL` | Winston log level: `error`, `warn`, `info`, `debug` (default: `info`) |
| `GA_MEASUREMENT_ID` | Google Analytics measurement ID (optional, e.g., `G-XXXXXXXXXX`) |

### Scripts

| Command | Action |
|---|---|
| `npm run build` | Compile templates + copy assets → `dist/` |
| `npm start` | Start Express (serves `dist/`) |
| `npm run dev` | Build then start |
| `npm run watch` | Rebuild on file changes (requires `chokidar-cli`) |

## Project structure

```
src/
  templates/           HTML layout templates (3)
    home.html            Homepage
    overview.html        Category overview (phishing, malware, …)
    simulation.html      Simulation page — gate, two‑column, feedback
  content/             Page content (JSON metadata + HTML snippets)
    home.json            Homepage content
    {category}/
      overview.json      Category title, description, level list
      level*.json        Simulation metadata (title, instructions, feedback)
      level*.sim.html    Unique simulation content (inside #sim-content)
      level*.script.js   Per‑simulation script (optional)
  pages/               Static pages (partial replacement only)
    about/index.html
    contribute/index.html
    privacy/index.html
    terms/index.html
  partials/            Reusable HTML fragments
    header.html
    footer.html
  css/
    style.css
public/                Static assets (copied to dist/ at build)
  icons/
  images/
dist/                  Build output (gitignored) — served by Express
lib/
  build.js             Build script: templates + content → dist/
  eicar.js             EICAR test string
  verify.js            reCAPTCHA verification
server.js              Express server: verification gate, static files, simulation endpoints
```

### How templates work

The build script (`lib/build.js`) renders three template types:

1. **Homepage** — `src/templates/home.html` + `src/content/home.json`
2. **Overviews** — `src/templates/overview.html` + `src/content/{category}/overview.json`
3. **Simulations** — `src/templates/simulation.html` + `src/content/{category}/level*.json` + `.sim.html` + optional `.script.js`

Static pages in `src/pages/` use `{{> header }}` / `{{> footer }}` partial replacement (no template).

### Adding a new simulation level

1. Add the level entry to `src/content/{category}/overview.json` → `levels` array.
2. Create `level{N}.json` with title, description, instructions, feedback text.
3. Create `level{N}.sim.html` with the unique simulation content.
4. Optionally create `level{N}.script.js` for client‑side logic.
5. Run `npm run build`.

No template copying required. The build script derives the URL, return path, and sibling navigation automatically from the overview.

## Verification

Users must pass Google reCAPTCHA and submit a business email before accessing any simulation. A signed session cookie grants access for 24 hours.

## Style and layout

Design tokens, header/footer patterns, and simulation banner usage are documented in [STYLE.md](STYLE.md). CSS source: `src/css/style.css`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Fork, branch, test, and open a pull request.

## License

Apache‑2.0.

## Links

- **Live site:** [https://www.swgaudit.com](https://www.swgaudit.com)
- **Upstream repo:** [https://github.com/swgauditor/swgaudit](https://github.com/swgauditor/swgaudit)
