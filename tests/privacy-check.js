import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../src/main.js', import.meta.url), 'utf8')
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

assert.deepEqual(Object.keys(packageJson.dependencies), ['qrcode'])
assert.match(html, /connect-src 'none'/)
assert.match(html, /Commissioner:wght@400;500;600;700;800/)
const styles = await readFile(new URL('../src/style.css', import.meta.url), 'utf8')
assert.match(styles, /font-family:'Commissioner'/)
assert.match(styles, /#app p\{font-size:15px\}/)
assert.match(styles, /#app h1\{font-size:60px\}/)
assert.match(styles, /#app h2\{font-size:35px\}/)
assert.match(styles, /#app h3\{font-size:18px\}/)
assert.doesNotMatch(`${styles}${source}`, /Arial|Manrope|DM Sans|sans-serif|serif|monospace/)
assert.match(html, /fonts\.googleapis\.com/)
assert.match(html, /fonts\.gstatic\.com/)
assert.doesNotMatch(html, /https?:\/\/(?!fonts\.googleapis\.com|fonts\.gstatic\.com)/)
assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|gtag|analytics|telemetry/)
assert.match(source, /QRCode\.toDataURL\(qrUrl/)
assert.match(source, /const qrUrl = .*#urgence=/)
assert.match(source, /function renderEmergencyPage\(data\)/)
assert.match(source, /href="\$\{escapeHtml\(phoneHref\(contact\.p\)\)\}"/)

console.log('Privacy checks passed')
