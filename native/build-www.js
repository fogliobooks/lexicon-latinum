// Copies the built web app into native/www for Capacitor. Run before `npx cap sync`.
// Source: ../pages if it exists (development checkout), otherwise the repository root (../), which is the published site.
const fs = require('fs'), path = require('path');
const here = __dirname; const parent = path.join(here, '..');
const src = fs.existsSync(path.join(parent, 'pages', 'index.html')) ? path.join(parent, 'pages') : parent;
const out = path.join(here, 'www');
const SKIP = new Set(['native', '.git', '.github', 'node_modules', 'README.md', 'build', 'web', 'content', 'dist', 'sources', 'tmp']);
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
let n = 0, bytes = 0;
const copy = (s, d) => { for (const f of fs.readdirSync(s)) { if (s === src && SKIP.has(f)) continue; const sp = path.join(s, f), dp = path.join(d, f); const st = fs.statSync(sp); if (st.isDirectory()) { fs.mkdirSync(dp, { recursive: true }); copy(sp, dp); } else { fs.copyFileSync(sp, dp); n++; bytes += st.size; } } };
copy(src, out);
if (!fs.existsSync(path.join(out, 'index.html'))) throw new Error('index.html not found in ' + src);
console.log(`www: ${n} files, ${(bytes / 1048576).toFixed(1)} MB from ${src}`);
