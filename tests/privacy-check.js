import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const source = await readFile(new URL('../src/main.js', import.meta.url), 'utf8')
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8')
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

assert.deepEqual(Object.keys(packageJson.dependencies), ['qrcode'])
assert.match(html, /connect-src 'none'/)
assert.doesNotMatch(html, /https?:\/\//)
assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|document\.cookie|gtag|analytics|telemetry/)
assert.match(source, /QRCode\.toDataURL\(qrText/)
assert.match(source, /const qrText = \[/)

console.log('Privacy checks passed')
