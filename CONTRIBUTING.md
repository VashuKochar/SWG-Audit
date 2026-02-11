# Contributing to SWG Audit

Thank you for considering contributing to SWG Audit. We welcome contributions from the community.

## How You Can Contribute

### Reporting Issues

If you find bugs or have suggestions, please open an issue. Include:

- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, browser, Node version)
- Screenshots or error logs (if applicable)

### Submitting Changes

1. **Fork** the repository on GitHub
2. **Create a branch** (e.g., `fix-phishing-l2` or `add-malware-l3`)
3. **Make your changes** (see sections below)
4. **Test** that the app builds and runs (`npm run build && npm start`)
5. **Open a pull request** with a clear description

## Project Structure

```
src/
  templates/           # Base HTML templates (home, overview, simulation)
  content/             # JSON metadata + simulation HTML/JS
    home.json
    {category}/
      overview.json      # Category metadata
      level*.json        # Simulation metadata
      level*.sim.html    # Simulation-specific HTML
      level*.script.js   # Optional client-side JS
  partials/            # Reusable HTML fragments (header, footer)
  pages/               # Static pages (about, contribute, privacy, terms)
  css/                 # Stylesheets
public/                # Static assets (icons, images, robots.txt, sitemap.xml)
lib/
  build.js             # Build script (compiles src → dist)
server.js              # Express server
```

**Important:**

- Edit files in `src/`, not `dist/`
- Run `npm run build` to compile changes
- Static assets go in `public/` (copied to `dist/` at build time)

## Adding a New Simulation Level

### 1. Update Category Overview

Edit `src/content/{category}/overview.json`:

```json
{
  "levels": [
    {
      "title": "Level 4 – Advanced Detection Bypass",
      "path": "level4"
    }
  ]
}
```

### 2. Create Level Metadata

Create `src/content/{category}/level4.json`:

```json
{
  "title": "Category Name – L4 Advanced Detection Bypass",
  "description": "Test if the perimeter can detect obfuscated payloads.",
  "keywords": "category, level4, obfuscation, detection",
  "headline": "Level 4 – Advanced Detection Bypass",
  "subline": "Category Name",
  "instructions": "Click the button to download an obfuscated payload. If your SWG blocks it, you'll see a block page.",
  "feedbackFail": "The file was downloaded. Your perimeter did not block the obfuscated payload.",
  "feedbackPass": "The download was blocked. Your perimeter successfully detected the obfuscated payload."
}
```

### 3. Create Simulation HTML

Create `src/content/{category}/level4.sim.html`:

```html
<div class="sim-section">
  <h3>Simulation</h3>
  <button id="download-obfuscated" class="button">Download Obfuscated File</button>
  <p id="result"></p>
</div>
```

### 4. Add Client-Side Logic (Optional)

Create `src/content/{category}/level4.script.js`:

```javascript
document.getElementById('download-obfuscated').addEventListener('click', () => {
  fetch('/category/obfuscated.bin')
    .then(response => {
      if (response.ok) {
        document.getElementById('result').textContent = 'Download succeeded (FAIL)';
      } else {
        document.getElementById('result').textContent = 'Download blocked (PASS)';
      }
    })
    .catch(() => {
      document.getElementById('result').textContent = 'Network error or blocked by perimeter (PASS)';
    });
});
```

### 5. Add Server Route (if needed)

If the simulation requires a server endpoint, edit `server.js`:

```javascript
app.get('/category/obfuscated.bin', (req, res) => {
  const obfuscatedPayload = generateObfuscated(); // Your logic
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', 'attachment; filename="payload.bin"');
  res.send(obfuscatedPayload);
});
```

### 6. Build and Test

```bash
npm run build
npm start
```

Navigate to `http://localhost:3000/{category}/level4/` and test the simulation.

## Editing Partials (Header/Footer)

Edit `src/partials/header.html` or `src/partials/footer.html`, then rebuild:

```bash
npm run build
```

## Editing Static Pages

Static pages in `src/pages/` use partial replacement only:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>About | SWG Audit</title>
  <link rel="stylesheet" href="/css/style.css">
</head>
<body>
  {{> header }}
  
  <main>
    <h1>About SWG Audit</h1>
    <p>Content here...</p>
  </main>
  
  {{> footer }}
</body>
</html>
```

## Style Guidelines

- Follow existing code style (2-space indentation)
- Keep HTML semantic and accessible
- Use CSS classes from `src/css/style.css`
- Avoid inline styles
- Test on Firefox, Chrome, and Safari

See [STYLE.md](STYLE.md) for design tokens and layout patterns.

## Testing Checklist

Before submitting a PR:

- [ ] Code builds without errors (`npm run build`)
- [ ] Server starts without errors (`npm start`)
- [ ] Simulation works as expected
- [ ] No console errors (browser DevTools)
- [ ] Responsive layout (test mobile/desktop)
- [ ] Accessibility (keyboard navigation, screen reader friendly)
- [ ] No hardcoded secrets or credentials

## Documentation

Improvements to README, DEPLOYMENT.md, or inline comments are always welcome.

## Feature Requests

Open an issue to discuss new features before implementing. Include:

- Use case
- Proposed solution
- Potential impact on existing simulations

## Code of Conduct

- Be respectful and constructive
- Provide helpful feedback
- Welcome newcomers
- Focus on the problem, not the person

## Questions

Open an issue or contact the maintainers. We appreciate your contributions!
