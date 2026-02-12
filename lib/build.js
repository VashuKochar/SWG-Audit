/**
 * Build script for SWG Audit.
 *
 * Three page types built from templates + content JSON:
 *   1. Home       → src/templates/home.html       + src/content/home.json
 *   2. Overviews  → src/templates/overview.html    + src/content/{category}/overview.json
 *   3. Simulations→ src/templates/simulation.html  + src/content/{category}/level*.json + .sim.html + .script.js
 *
 * Static pages (about, contribute, privacy, terms) built from src/pages/ with partial replacement.
 *
 * Partials: src/partials/ (header.html, footer.html)
 * CSS:      src/css/
 * Assets:   public/ (icons/, images/)
 * Output:   dist/
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const TEMPLATES_DIR = path.join(ROOT, 'src', 'templates');
const CONTENT_DIR = path.join(ROOT, 'src', 'content');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const PARTIALS_DIR = path.join(ROOT, 'src', 'partials');
const CSS_DIR = path.join(ROOT, 'src', 'css');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST_DIR = path.join(ROOT, 'dist');

const PARTIAL_NAMES = ['header', 'footer'];

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJSON(filePath) {
  return JSON.parse(readFile(filePath));
}

function writeOutput(relPath, content) {
  const outPath = path.join(DIST_DIR, relPath);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');
  console.log('Built:', relPath);
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

function cleanDist() {
  if (fs.existsSync(DIST_DIR)) fs.rmSync(DIST_DIR, { recursive: true, force: true });
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// Partial + variable replacement
// ---------------------------------------------------------------------------

function loadPartials() {
  const partials = {};
  for (const name of PARTIAL_NAMES) {
    const filePath = path.join(PARTIALS_DIR, `${name}.html`);
    if (!fs.existsSync(filePath)) throw new Error(`Partial not found: ${filePath}`);
    partials[name] = readFile(filePath).trimEnd();
  }
  return partials;
}

function resolvePartials(html, partials) {
  for (const name of PARTIAL_NAMES) {
    html = html.replaceAll(`{{> ${name} }}`, partials[name]);
  }
  return html;
}

function resolveVars(html, vars) {
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, String(value));
  }
  return html;
}

function injectAnalytics(html) {
  const gaMeasurementId = process.env.GA_MEASUREMENT_ID;
  if (gaMeasurementId) {
    const snippet = `<script async src="https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaMeasurementId}');
  </script>`;
    return html.replace('<!-- GA_ANALYTICS_SNIPPET -->', snippet);
  }
  return html.replace('<!-- GA_ANALYTICS_SNIPPET -->', '');
}

// ---------------------------------------------------------------------------
// Card HTML generators
// ---------------------------------------------------------------------------

function renderCards(items) {
  return items.map(item => {
    let badge = '';
    if (item.difficulty) {
      const tooltipTexts = {
        'beginner': 'Basic security controls — blocklists, reputation filters, simple pattern matching. Most SWGs should pass.',
        'intermediate': 'Requires deeper inspection — heuristic analysis, content fingerprinting, or stateful inspection.',
        'advanced': 'Requires sophisticated detection — behavioral analysis, machine learning, or multi-request correlation.'
      };
      const tooltipText = tooltipTexts[item.difficulty] || '';
      badge = `<span class="level-badge level-badge-${item.difficulty}" title="${tooltipText}">${item.difficulty}</span>`;
    }
    let duration = '';
    if (item.duration) {
      duration = `<span class="level-duration">${item.duration}</span>`;
    }
    let metadata = '';
    if (badge || duration) {
      metadata = `\n          <div class="landing-hero-card-meta">${badge}${duration}</div>`;
    }
    
    // Generate descriptive alt text from title (e.g., "Phishing" → "Phishing simulation icon")
    const altText = `${item.title} simulation icon`;
    
    return (
      `        <a href="${item.href}" class="landing-hero-card">\n` +
      `          <img src="${item.image}" alt="${altText}" class="landing-hero-card-img" width="64" height="64">\n` +
      `          <span class="landing-hero-card-title">${item.title}</span>${metadata}\n` +
      `        </a>`
    );
  }).join('\n');
}

// ---------------------------------------------------------------------------
// Build: Home
// ---------------------------------------------------------------------------

function buildHome(partials) {
  const template = readFile(path.join(TEMPLATES_DIR, 'home.html'));
  const data = readJSON(path.join(CONTENT_DIR, 'home.json'));

  const categoryCards = renderCards(data.categories);

  let html = resolveVars(template, {
    title: data.title,
    description: data.description,
    keywords: data.keywords,
    headline: data.headline,
    subline: data.subline,
    instructions: data.instructions,
    categoryCards,
  });
  html = resolvePartials(html, partials);
  html = injectAnalytics(html);
  writeOutput('index.html', html);
}

// ---------------------------------------------------------------------------
// Build: Overviews
// ---------------------------------------------------------------------------

function buildOverviews(partials) {
  const template = readFile(path.join(TEMPLATES_DIR, 'overview.html'));
  const categories = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  for (const cat of categories) {
    const overviewPath = path.join(CONTENT_DIR, cat, 'overview.json');
    if (!fs.existsSync(overviewPath)) continue;

    const data = readJSON(overviewPath);
    const slug = data.slug || cat;
    const image = data.image;

    const levelCards = renderCards(data.levels.map(l => ({
      href: `/${slug}/${l.path}/`,
      image,
      title: l.title,
      difficulty: l.difficulty,
      duration: l.duration,
    })));

    const instructionsBlock = data.instructions
      ? `      <p class="landing-hero-instructions">${data.instructions}</p>`
      : '';

    let html = resolveVars(template, {
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      headline: data.headline,
      subline: data.subline,
      category: data.category,
      instructionsBlock,
      levelCards,
    });
    html = resolvePartials(html, partials);
    html = injectAnalytics(html);
    writeOutput(`${slug}/index.html`, html);
  }
}

// ---------------------------------------------------------------------------
// Build: Simulations
// ---------------------------------------------------------------------------

function buildSimulations(partials) {
  const template = readFile(path.join(TEMPLATES_DIR, 'simulation.html'));
  const categories = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => e.name);

  for (const cat of categories) {
    const overviewPath = path.join(CONTENT_DIR, cat, 'overview.json');
    if (!fs.existsSync(overviewPath)) continue;

    const overview = readJSON(overviewPath);
    const slug = overview.slug || cat;
    const image = overview.image;
    const allLevels = overview.levels;

    // Find all level*.json files
    const levelFiles = fs.readdirSync(path.join(CONTENT_DIR, cat))
      .filter(f => /^level\d+\.json$/.test(f))
      .sort();

    for (const levelFile of levelFiles) {
      const levelNum = levelFile.match(/^level(\d+)\.json$/)[1];
      const levelPath = `level${levelNum}`;
      const data = readJSON(path.join(CONTENT_DIR, cat, levelFile));
      const returnUrl = `/${slug}/${levelPath}/`;

      // Load sim content HTML
      const simHtmlPath = path.join(CONTENT_DIR, cat, `level${levelNum}.sim.html`);
      const simContent = fs.existsSync(simHtmlPath) ? readFile(simHtmlPath).trim() : '';

      // Load optional best practices HTML
      const bestPracticesPath = path.join(CONTENT_DIR, cat, `level${levelNum}.best-practices.html`);
      const bestPractices = fs.existsSync(bestPracticesPath) ? readFile(bestPracticesPath).trim() : '';

      // Load optional per-simulation script
      const simScriptPath = path.join(CONTENT_DIR, cat, `level${levelNum}.script.js`);
      const simScript = fs.existsSync(simScriptPath)
        ? `\n  <script>\n${readFile(simScriptPath).trim()}\n  </script>`
        : '';

      // Sibling levels (all levels except current)
      const siblings = allLevels
        .filter(l => l.path !== levelPath)
        .map(l => ({
          href: `/${slug}/${l.path}/`,
          image,
          title: l.title,
          difficulty: l.difficulty,
          duration: l.duration,
        }));
      const siblingCards = renderCards(siblings);

      // Previous and next levels for navigation
      const currentIndex = allLevels.findIndex(l => l.path === levelPath);
      const prevLevel = currentIndex > 0 ? allLevels[currentIndex - 1] : null;
      const nextLevel = currentIndex < allLevels.length - 1 ? allLevels[currentIndex + 1] : null;
      
      const levelNavigation = `
        <nav class="level-navigation" aria-label="Level navigation">
          ${prevLevel ? `<a href="/${slug}/${prevLevel.path}/" class="level-nav-link level-nav-link-prev">Previous: ${prevLevel.title}</a>` : '<span></span>'}
          <div class="level-nav-center">
            <a href="/${slug}/" class="level-nav-center-link">Return to ${overview.category} Overview</a>
          </div>
          ${nextLevel ? `<a href="/${slug}/${nextLevel.path}/" class="level-nav-link level-nav-link-next">Next: ${nextLevel.title}</a>` : '<span></span>'}
        </nav>
      `.trim();

      // Find current level metadata
      const currentLevel = allLevels.find(l => l.path === levelPath);
      
      // Generate level badge with tooltip
      let levelBadge = '';
      if (currentLevel && currentLevel.difficulty) {
        const tooltipTexts = {
          'beginner': 'Basic security controls — blocklists, reputation filters, simple pattern matching. Most SWGs should pass.',
          'intermediate': 'Requires deeper inspection — heuristic analysis, content fingerprinting, or stateful inspection.',
          'advanced': 'Requires sophisticated detection — behavioral analysis, machine learning, or multi-request correlation.'
        };
        const tooltipText = tooltipTexts[currentLevel.difficulty] || '';
        levelBadge = `<span class="level-badge level-badge-${currentLevel.difficulty}" title="${tooltipText}">${currentLevel.difficulty}</span>`;
      }
      
      // Generate duration badge
      const durationBadge = currentLevel && currentLevel.duration
        ? `<span class="duration-badge" title="Estimated time to complete this test">⏱️ ${currentLevel.duration}</span>`
        : '';
      
      // Generate instruction steps HTML
      const instructionSteps = data.steps
        ? data.steps.map((step, idx) => `
        <div class="instruction-step" data-step="${idx + 1}">
          <div class="instruction-step-title">${step.title}</div>
          <p class="instruction-step-description">${step.description}</p>
        </div>
      `).join('')
        : '';

      let html = resolveVars(template, {
        title: data.title,
        description: data.description,
        keywords: data.keywords,
        headline: data.headline,
        testObjective: data.testObjective || '',
        attackVector: data.attackVector || '',
        instructionSteps,
        returnUrl,
        category: overview.category,
        levelBadge,
        durationBadge,
        simContent,
        bestPractices,
        simScript,
        siblingCards,
        levelNavigation,
      });
      html = resolvePartials(html, partials);
      html = injectAnalytics(html);
      writeOutput(`${slug}/${levelPath}/index.html`, html);
    }
  }
}

// ---------------------------------------------------------------------------
// Build: Static pages (src/pages/ — partial replacement only)
// ---------------------------------------------------------------------------

function findHtmlFiles(dir, base = dir) {
  const files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...findHtmlFiles(full, base));
    else if (e.isFile() && e.name.endsWith('.html')) files.push(path.relative(base, full));
  }
  return files;
}

function buildStaticPages(partials) {
  if (!fs.existsSync(PAGES_DIR)) return;
  const files = findHtmlFiles(PAGES_DIR);
  for (const rel of files) {
    let content = readFile(path.join(PAGES_DIR, rel));
    content = resolvePartials(content, partials);
    content = injectAnalytics(content);
    writeOutput(rel, content);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  cleanDist();
  const partials = loadPartials();

  // Template-driven pages
  buildHome(partials);
  buildOverviews(partials);
  buildSimulations(partials);

  // Static pages (about, contribute, privacy, terms)
  buildStaticPages(partials);

  // Copy CSS
  copyDirSync(CSS_DIR, path.join(DIST_DIR, 'css'));
  console.log('Copied: css/');

  // Copy shared JS helpers
  const sharedJsDir = path.join(CONTENT_DIR, '_shared');
  if (fs.existsSync(sharedJsDir)) {
    copyDirSync(sharedJsDir, path.join(DIST_DIR, 'js', 'shared'));
    console.log('Copied: js/shared/');
  }

  // Copy static assets from public/
  for (const e of fs.readdirSync(PUBLIC_DIR, { withFileTypes: true })) {
    const src = path.join(PUBLIC_DIR, e.name);
    const dest = path.join(DIST_DIR, e.name);
    if (e.isDirectory()) { copyDirSync(src, dest); console.log(`Copied: ${e.name}/`); }
    else { fs.copyFileSync(src, dest); console.log(`Copied: ${e.name}`); }
  }

  console.log('\nDone.');
}

main();
