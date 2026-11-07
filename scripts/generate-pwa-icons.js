import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import zlib from 'zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// ── 1. Create Branded SVG Icons ──────────────────────────────────────────────
const createSvg = (size, isMaskable = false) => {
  const padding = isMaskable ? Math.round(size * 0.15) : Math.round(size * 0.08);
  const innerSize = size - padding * 2;
  const radius = isMaskable ? 0 : Math.round(size * 0.22);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#8F1028"/>
      <stop offset="100%" stop-color="#690D20"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFD566"/>
      <stop offset="100%" stop-color="#FFC83D"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="${Math.round(size * 0.02)}" stdDeviation="${Math.round(size * 0.03)}" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${radius}" fill="url(#bg)"/>

  <!-- Gold Accent Inner Border -->
  <rect x="${Math.round(size * 0.03)}" y="${Math.round(size * 0.03)}" width="${size - Math.round(size * 0.06)}" height="${size - Math.round(size * 0.06)}" rx="${Math.max(0, radius - 4)}" fill="none" stroke="#FFC83D" stroke-width="${Math.round(size * 0.015)}" stroke-opacity="0.4"/>

  <!-- Shopping Bag Icon & Retail Motif -->
  <g transform="translate(${padding}, ${padding})" filter="url(#shadow)">
    <!-- Bag Body -->
    <path d="M ${innerSize * 0.2} ${innerSize * 0.35} 
             L ${innerSize * 0.8} ${innerSize * 0.35} 
             L ${innerSize * 0.86} ${innerSize * 0.86} 
             Q ${innerSize * 0.86} ${innerSize * 0.92} ${innerSize * 0.8} ${innerSize * 0.92}
             L ${innerSize * 0.2} ${innerSize * 0.92} 
             Q ${innerSize * 0.14} ${innerSize * 0.92} ${innerSize * 0.14} ${innerSize * 0.86}
             Z" fill="url(#gold)"/>

    <!-- Bag Handles -->
    <path d="M ${innerSize * 0.35} ${innerSize * 0.35} 
             C ${innerSize * 0.35} ${innerSize * 0.12}, ${innerSize * 0.65} ${innerSize * 0.12}, ${innerSize * 0.65} ${innerSize * 0.35}" 
          fill="none" stroke="#FFFFFF" stroke-width="${innerSize * 0.07}" stroke-linecap="round"/>

    <!-- Bag Inner Cutout Detail -->
    <path d="M ${innerSize * 0.4} ${innerSize * 0.35} 
             C ${innerSize * 0.4} ${innerSize * 0.2}, ${innerSize * 0.6} ${innerSize * 0.2}, ${innerSize * 0.6} ${innerSize * 0.35}" 
          fill="none" stroke="#690D20" stroke-width="${innerSize * 0.04}" stroke-linecap="round"/>

    <!-- Shree Seva "SS" Monogram in Center of Bag -->
    <text x="${innerSize * 0.5}" y="${innerSize * 0.68}" 
          font-family="system-ui, -apple-system, sans-serif" 
          font-size="${innerSize * 0.24}" 
          font-weight="900" 
          fill="#8F1028" 
          text-anchor="middle" 
          letter-spacing="${innerSize * 0.02}">SS</text>
  </g>
</svg>`;
};

// Write SVG icons
fs.writeFileSync(path.join(iconsDir, 'icon-192x192.svg'), createSvg(192, false));
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.svg'), createSvg(512, false));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192x192.svg'), createSvg(192, true));
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.svg'), createSvg(512, true));
fs.writeFileSync(path.join(iconsDir, 'icon.svg'), createSvg(512, false));

// ── 2. Create Minimal Valid PNGs for Compatibility ───────────────────────────
// Minimal valid PNG generator (pure Node.js, uncompressed IDAT with Deflate)
function createSolidPng(width, height, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8-bit depth
  ihdrData[9] = 2; // Truecolor (RGB)
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // No interlace

  const ihdr = makeChunk('IHDR', ihdrData);

  // Raw image data: height rows, each starts with filter byte 0, then width * 3 bytes (RGB)
  const rawRow = Buffer.alloc(1 + width * 3);
  rawRow[0] = 0; // Filter: None
  for (let x = 0; x < width; x++) {
    // Fill with maroon color #8F1028 (143, 16, 40)
    // Draw golden center square for visual indicator
    const inCenter = x > width * 0.25 && x < width * 0.75;
    rawRow[1 + x * 3] = inCenter ? 255 : r; // R
    rawRow[1 + x * 3 + 1] = inCenter ? 200 : g; // G
    rawRow[1 + x * 3 + 2] = inCenter ? 61 : b; // B
  }

  const rawData = Buffer.alloc((1 + width * 3) * height);
  for (let y = 0; y < height; y++) {
    const isCenterY = y > height * 0.25 && y < height * 0.75;
    if (isCenterY) {
      rawRow.copy(rawData, y * rawRow.length);
    } else {
      const edgeRow = Buffer.alloc(1 + width * 3);
      edgeRow[0] = 0;
      for (let x = 0; x < width; x++) {
        edgeRow[1 + x * 3] = r;
        edgeRow[1 + x * 3 + 1] = g;
        edgeRow[1 + x * 3 + 2] = b;
      }
      edgeRow.copy(rawData, y * rawRow.length);
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressedData);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdr, idat, iend]);
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(12 + len);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const crc = crc32(buf.subarray(4, 8 + len));
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Write PNG icons (Maroon #8F1028: 143, 16, 40)
const png192 = createSolidPng(192, 192, 143, 16, 40);
const png512 = createSolidPng(512, 512, 143, 16, 40);

fs.writeFileSync(path.join(iconsDir, 'icon-192x192.png'), png192);
fs.writeFileSync(path.join(iconsDir, 'icon-512x512.png'), png512);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-192x192.png'), png192);
fs.writeFileSync(path.join(iconsDir, 'icon-maskable-512x512.png'), png512);
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), png192);

console.log('✅ PWA Icons successfully generated in public/icons/');

