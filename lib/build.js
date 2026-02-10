/**
 * Build: resolve {{> header }} and {{> footer }} in src/pages/,
 * write results to dist/, and copy static assets + CSS.
 *
 * Partials: src/partials/
 * Pages:    src/pages/
 * CSS:      src/css/
 * Assets:   public/   (icons/, images/)
 * Output:   dist/
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const PAGES_DIR = path.join(ROOT, 'src', 'pages');
const PARTIALS_DIR = path.join(ROOT, 'src', 'partials');
const CSS_DIR = path.join(ROOT, 'src', 'css');
const PUBLIC_DIR = path.join(ROOT, 'public');
const DIST_DIR = path.join(ROOT, 'dist');

const PARTIAL_NAMES = ['header', 'footer'];

function findFiles(dir, ext, base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...findFiles(full, ext, base));
    } else if (e.isFile() && full.endsWith(ext)) {
      files.push(path.relative(base, full));
    }
  }
  return files;
}

function loadPartials() {
  const partials = {};
  for (const name of PARTIAL_NAMES) {
    const filePath = path.join(PARTIALS_DIR, `${name}.html`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Partial not found: ${filePath}`);
    }
    partials[name] = fs.readFileSync(filePath, 'utf8').trimEnd();
  }
  return partials;
}

function buildPage(relPath, partials) {
  const srcPath = path.join(PAGES_DIR, relPath);
  let content = fs.readFileSync(srcPath, 'utf8');
  for (const name of PARTIAL_NAMES) {
    const placeholder = `{{> ${name} }}`;
    content = content.replaceAll(placeholder, partials[name]);
  }
  return content;
}

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const srcPath = path.join(src, e.name);
    const destPath = path.join(dest, e.name);
    if (e.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

function main() {
  if (!fs.existsSync(PAGES_DIR)) {
    console.error('Pages directory not found:', PAGES_DIR);
    process.exit(1);
  }

  cleanDist();

  // 1. Build HTML pages (resolve partials)
  const partials = loadPartials();
  const pages = findFiles(PAGES_DIR, '.html');
  for (const rel of pages) {
    const outPath = path.join(DIST_DIR, rel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, buildPage(rel, partials), 'utf8');
    console.log('Built:', rel);
  }

  // 2. Copy CSS
  copyDirSync(CSS_DIR, path.join(DIST_DIR, 'css'));
  console.log('Copied: css/');

  // 3. Copy static assets from public/
  const publicEntries = fs.readdirSync(PUBLIC_DIR, { withFileTypes: true });
  for (const e of publicEntries) {
    const src = path.join(PUBLIC_DIR, e.name);
    const dest = path.join(DIST_DIR, e.name);
    if (e.isDirectory()) {
      copyDirSync(src, dest);
      console.log(`Copied: ${e.name}/`);
    } else {
      fs.copyFileSync(src, dest);
      console.log(`Copied: ${e.name}`);
    }
  }

  console.log(`\nDone. Built ${pages.length} page(s) → dist/`);
}

main();
