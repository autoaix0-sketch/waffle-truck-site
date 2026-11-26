// Build the live site: only Demo 2 (Golden Crunch), served at the root "/".
// 1. vite build -> dist/
// 2. dist/02-golden-crunch/index.html -> dist-live/index.html, plus dist/assets/ and dist/img/
// 3. check that every /assets/... and /img/... path in dist-live/index.html exists
import { execSync } from 'node:child_process'
import { cpSync, existsSync, readFileSync, rmSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Hide the live site from Google until the owner says OK.
// Set to false (then build + deploy) when the site should show on Google.
const NOINDEX = true

const root = resolve(import.meta.dirname, '..')
const dist = resolve(root, 'dist')
const live = resolve(root, 'dist-live')

execSync('npx vite build', { cwd: root, stdio: 'inherit' })

rmSync(live, { recursive: true, force: true })
mkdirSync(live)
cpSync(resolve(dist, '02-golden-crunch/index.html'), resolve(live, 'index.html'))
// Copy only the assets Demo 2 really loads (its own JS/CSS + the shared chunks it imports),
// not the chunks of the unused demos 01 and 03 (26 Nov 2026: they carry price data and must not be published).
mkdirSync(resolve(live, 'assets'))
const todo = [...readFileSync(resolve(live, 'index.html'), 'utf8').matchAll(/\/assets\/([^"'\s)?#,]+)/g)].map((m) => m[1])
const seen = new Set()
while (todo.length) {
  const f = todo.pop()
  if (seen.has(f)) continue
  seen.add(f)
  cpSync(resolve(dist, 'assets', f), resolve(live, 'assets', f))
  if (f.endsWith('.js')) {
    for (const m of readFileSync(resolve(dist, 'assets', f), 'utf8').matchAll(/(?:from|import)\s*\(?\s*["']\.\/([^"']+\.(?:js|css))["']/g)) todo.push(m[1])
  }
}
cpSync(resolve(dist, 'img'), resolve(live, 'img'), { recursive: true })

let html = readFileSync(resolve(live, 'index.html'), 'utf8')
if (NOINDEX && !html.includes('name="robots"')) {
  html = html.replace('<meta name="viewport"', '<meta name="robots" content="noindex">\n  <meta name="viewport"')
  if (!html.includes('name="robots"')) throw new Error('build:live: could not add the noindex tag')
  writeFileSync(resolve(live, 'index.html'), html)
}
const paths = [...new Set(html.match(/\/(?:assets|img)\/[^"'\s)?#,]+/g) ?? [])]
const missing = paths.filter((p) => !existsSync(resolve(live, '.' + p)))

if (missing.length) {
  console.error(`\nbuild:live FAILED, ${missing.length} missing file(s):`)
  for (const p of missing) console.error('  ' + p)
  process.exit(1)
}
console.log(`\nbuild:live OK: dist-live/ ready, ${paths.length} /assets and /img paths checked, noindex ${NOINDEX ? 'ON' : 'OFF'}.`)
