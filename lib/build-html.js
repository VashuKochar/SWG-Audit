/**
 * Build HTML: resolve {{> header }} and {{> footer }} in src/ HTML files
 * and write results to public/, preserving path structure.
 * Partials live in public/partials/ (header.html, footer.html).
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT, 'src');
const PUBLIC_DIR = path.join(ROOT, 'public');
const PARTIALS_DIR = path.join(PUBLIC_DIR, 'partials');

const PARTIAL_PLACEHOLDERS = [
  { name: 'header', file: 'header.html' },
  { name: 'footer', file: 'footer.html' },
];

function findHtmlFiles(dir, base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...findHtmlFiles(full, base));
    } else if (e.isFile() && e.name.endsWith('.html')) {
      files.push(path.relative(base, full));
    }
  }
  return files;
}

function loadPartials() {
  const partials = {};
  for (const { name, file } of PARTIAL_PLACEHOLDERS) {
    const filePath = path.join(PARTIALS_DIR, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Partial not found: ${filePath}`);
    }
    partials[name] = fs.readFileSync(filePath, 'utf8').trimEnd();
  }
  return partials;
}

function buildFile(relPath, partials) {
  const srcPath = path.join(SRC_DIR, relPath);
  let content = fs.readFileSync(srcPath, 'utf8');
  for (const { name } of PARTIAL_PLACEHOLDERS) {
    const placeholder = `{{> ${name} }}`;
    if (content.includes(placeholder)) {
      content = content.replace(placeholder, partials[name]);
    }
  }
  return content;
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('Source directory not found:', SRC_DIR);
    process.exit(1);
  }
  const partials = loadPartials();
  const files = findHtmlFiles(SRC_DIR);
  for (const rel of files) {
    const outPath = path.join(PUBLIC_DIR, rel);
    const outDir = path.dirname(outPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const content = buildFile(rel, partials);
    fs.writeFileSync(outPath, content, 'utf8');
    console.log('Built:', rel);
  }
  console.log('Done. Built', files.length, 'file(s).');
}

main();
