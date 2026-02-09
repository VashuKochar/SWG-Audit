/**
 * One-time migration: read HTML from public/ (excluding partials),
 * replace literal header and footer with {{> header }} / {{> footer }},
 * write to src/. Run once; after that edit src/ and use build-html.js.
 */
const path = require('path');
const fs = require('fs');

const ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SRC_DIR = path.join(ROOT, 'src');
const PARTIALS_DIR = path.join(PUBLIC_DIR, 'partials');

function findHtmlFiles(dir, base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...findHtmlFiles(full, base));
    } else if (e.isFile() && e.name.endsWith('.html')) {
      const rel = path.relative(base, full);
      if (!rel.startsWith('partials' + path.sep) && rel !== 'partials') {
        files.push(rel);
      }
    }
  }
  return files;
}

function migrateFile(relPath) {
  const srcPath = path.join(PUBLIC_DIR, relPath);
  let content = fs.readFileSync(srcPath, 'utf8');
  // Replace header block (indented 2 spaces; may contain newlines)
  content = content.replace(/  <header>\r?\n[\s\S]*?\r?\n  <\/header>/, '  {{> header }}\n');
  // Replace footer block
  content = content.replace(/  <footer>\r?\n[\s\S]*?\r?\n  <\/footer>/, '  {{> footer }}\n');
  const outPath = path.join(SRC_DIR, relPath);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  fs.writeFileSync(outPath, content, 'utf8');
}

function main() {
  const files = findHtmlFiles(PUBLIC_DIR);
  for (const rel of files) {
    migrateFile(rel);
    console.log('Migrated:', rel);
  }
  console.log('Done. Migrated', files.length, 'file(s) to src/.');
}

main();
