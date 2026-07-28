// One-off: rasterize public/favicon.svg into the PNG/ICO favicon set.
// Usage: node scripts/gen-icons.mjs   (requires devDeps: sharp, png-to-ico)
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const svg = await readFile(new URL('../public/favicon.svg', import.meta.url));
const out = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));

await sharp(svg, { density: 300 }).resize(180, 180).png().toFile(out('apple-touch-icon.png'));
await sharp(svg, { density: 300 }).resize(192, 192).png().toFile(out('icon-192.png'));
await sharp(svg, { density: 300 }).resize(512, 512).png().toFile(out('icon-512.png'));

const png32 = await sharp(svg, { density: 300 }).resize(32, 32).png().toBuffer();
await writeFile(out('favicon.ico'), await pngToIco([png32]));

console.log('icons written: apple-touch-icon.png, icon-192.png, icon-512.png, favicon.ico');
