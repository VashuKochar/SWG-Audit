# SWG Audit

Open-source initiative to help buyers validate the real-world effectiveness of their perimeter security solutions against web-based threats.

## What is SWG Audit?

SWG Audit provides safe simulations (no real attacks) to test how many layers of defence your perimeter has:

- **Phishing**: L1 URL filters, L2 spoofing detection, L3 form submission block.
- **Malware (EICAR only)**: L1 known in all formats/archives, L2 fragmented delivery / WASM / image reconstruction.
- **Data theft**: L1 file upload types, L2 credit card numbers and fake Aadhar images, L3 DNS tunneling.
- **Cyberslacking**: YouTube only (category links).

Before running any simulation, users verify via **captcha** and **business email**.

## Verification

Users must pass Google reCAPTCHA and submit a business email before accessing any simulation. Access is then granted via a signed session cookie for a limited time (e.g. 24 hours).

## How to run locally

- **Prerequisites:** Node.js 18+
- **Setup:**  
  `git clone <repo>`  
  `npm install`  
  Copy `.env.example` to `.env` (the server loads `.env` via dotenv) and set:
  - `RECAPTCHA_SITE_KEY` – reCAPTCHA site key (client)
  - `RECAPTCHA_SECRET_KEY` – reCAPTCHA secret (server)
  - `SESSION_SECRET` – at least 32 characters for signing the session cookie
- **Local dev without solving captcha:** Set `SKIP_VERIFY=1` in `.env`.
- **Start:** `npm start` (default port **3000**; override with `PORT`).
- **Build HTML:** After editing pages in `src/` or partials in `public/partials/`, run `npm run build:html` to write updated HTML into `public/`.
- **Production:** Run behind **nginx or Caddy with HTTPS**. Hosting choice is left for later.

## Style and layout

Design tokens, header/footer patterns, breadcrumbs, and simulation banner usage are documented in [STYLE.md](STYLE.md).

## Project structure

- `server.js` – Express app: verification gate, static files, simulation endpoints (phishing submit, malware EICAR, data-theft upload/exfil).
- `src/` – Source HTML for all pages. Edit files here; they use `{{> header }}` and `{{> footer }}` placeholders resolved at build time.
- `public/` – Built static site (HTML, CSS, assets). Run `npm run build:html` after changing `src/` or `public/partials/`.
- `public/partials/` – Reusable header and footer; single source of truth for nav and footer text.
- `lib/` – `build-html.js` (resolves partials), `verify.js` (reCAPTCHA), `eicar.js` (EICAR string).
- `.vscode/html.code-snippets` – Workspace snippets: `swg-doc`, `swg-head`, `swg-header`, `swg-footer`, `swg-banner`, `swg-main` for consistent markup.
- `.env.example` – Example environment variables including `SKIP_VERIFY=1` for local use.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Fork, branch, test, and open a pull request.

## License

Apache-2.0.

## Links

- **Live site:** [https://www.swgaudit.com](https://www.swgaudit.com)
- **Upstream repo:** [https://github.com/swgauditor/swgaudit](https://github.com/swgauditor/swgaudit)
