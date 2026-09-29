// Builds the images for app-launch.html. Email clients do not render SVG, so
// every image here is a PNG made from a source file, never redrawn by hand.
//
//   cd "$(mktemp -d)" && npm i qrcode@1.5.4 @resvg/resvg-js@2.6.2 jsqr@1.4.0 pngjs@7
//   NODE_PATH="$PWD/node_modules" node /var/www/html/WeSwapCards/email-assets/app-launch/build-assets.mjs
//
// The QR is made the same way as the website ones: qrcode's default settings
// reproduce front/src/images/qr/app-qr-{homepage,menu}.svg byte for byte, and
// the script checks that before it writes anything.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(path.join(process.env.NODE_PATH ?? '.', 'x.js'));
const QRCode = require('qrcode');
const { Resvg } = require('@resvg/resvg-js');
const jsQR = require('jsqr');
const { PNG } = require('pngjs');

const OUT = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(OUT, '../..');
const MOBILE_SCREENSHOTS = '/var/www/html/WeSwapCards-native/mobile/store-assets/apple-screenshots/6.5-inch';
const QR_BASE = 'https://weswapcards.com/app/index.html?from=';

const render = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
const write = (name, buf) => {
  fs.writeFileSync(path.join(OUT, name), buf);
  console.log(`${name}  ${buf.length} bytes`);
};

// --- QR ---------------------------------------------------------------------
for (const placement of ['homepage', 'menu']) {
  const site = fs.readFileSync(path.join(REPO, `front/src/images/qr/app-qr-${placement}.svg`), 'utf8');
  if ((await QRCode.toString(QR_BASE + placement, { type: 'svg' })) !== site) {
    throw new Error(`qrcode no longer reproduces app-qr-${placement}.svg; settings changed`);
  }
}
const qrUrl = `${QR_BASE}email`;
const qrSvg = await QRCode.toString(qrUrl, { type: 'svg' });
fs.writeFileSync(path.join(OUT, 'app-qr-email.svg'), qrSvg);
// 41 modules x 8 px: whole pixels per module, so edges stay sharp.
const qrPng = render(qrSvg, 41 * 8);
const decoded = (() => {
  const p = PNG.sync.read(qrPng);
  return jsQR(new Uint8ClampedArray(p.data), p.width, p.height)?.data;
})();
if (decoded !== qrUrl) throw new Error(`QR decodes to ${decoded}, expected ${qrUrl}`);
write('app-qr-email.png', qrPng);

// --- Store badges (the website's official artwork) ---------------------------
// 3x of the 40px display height.
write('app-store-badge.png', render(fs.readFileSync(path.join(REPO, 'front/src/images/badges/app-store-badge.svg')), 359));

// Google's PNG carries transparent clear space on every side; email has no
// negative margins to cancel it, so trim to the artwork to match Apple's height.
{
  const src = PNG.sync.read(fs.readFileSync(path.join(REPO, 'front/src/images/badges/google-play-badge.png')));
  let [x0, y0, x1, y1] = [src.width, src.height, -1, -1];
  for (let y = 0; y < src.height; y += 1) {
    for (let x = 0; x < src.width; x += 1) {
      if (src.data[(y * src.width + x) * 4 + 3] > 0) {
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
    }
  }
  const out = new PNG({ width: x1 - x0 + 1, height: y1 - y0 + 1 });
  PNG.bitblt(src, out, x0, y0, out.width, out.height, 0, 0);
  write('google-play-badge.png', PNG.sync.write(out));
}

// --- Phone ------------------------------------------------------------------
// The store screenshot inside a plain phone frame, tilted as in the mockup, on
// a transparent canvas so it sits on the purple gradient. Laid out in CSS px
// (shown at 150 wide), built at 2x. The tilt is baked in: email clients do not
// reliably support CSS transforms.
{
  const shot = fs.readFileSync(path.join(MOBILE_SCREENSHOTS, '02-chapters.png')).toString('base64');
  const [W, H, TILT] = [180, 318, 7];
  const [pw, ph, bezel] = [142, 293, 6];
  const [px, py] = [(W - pw) / 2, (H - ph) / 2 - 3];
  const [sx, sy, sw, sh] = [px + bezel, py + bezel, pw - 2 * bezel, ph - 2 * bezel];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="0" dy="5" stdDeviation="4" flood-color="#2a0f4f" flood-opacity=".45"/>
    </filter>
    <clipPath id="screen"><rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="17"/></clipPath>
  </defs>
  <g transform="rotate(${TILT} ${W / 2} ${H / 2})">
  <rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="23" fill="#1c1c21" filter="url(#shadow)"/>
  <rect x="${px + 1}" y="${py + 1}" width="${pw - 2}" height="${ph - 2}" rx="22" fill="none" stroke="#4a4a52" stroke-width="1"/>
  <image x="${sx}" y="${sy}" width="${sw}" height="${sh}" preserveAspectRatio="xMidYMid slice" clip-path="url(#screen)" xlink:href="data:image/png;base64,${shot}"/>
  <rect x="${W / 2 - 20}" y="${sy + 5}" width="40" height="11" rx="5.5" fill="#000"/>
  </g>
</svg>`;
  write('phone-chapters.png', render(svg, W * 2));
}

// --- Arrow ------------------------------------------------------------------
// Hand-drawn style arrow from the phone down to the QR. Decorative only; shown
// at 56 wide, built at 2x.
{
  const [W, H] = [56, 56];
  const [x0, y0, c1x, c1y, c2x, c2y, x1, y1] = [8, 8, 34, 6, 46, 26, 34, 48];
  // Arrowhead along the curve's end tangent, two 9px barbs at +/-32 degrees.
  const angle = Math.atan2(y1 - c2y, x1 - c2x);
  const barb = (delta) => {
    const a = angle + Math.PI - delta;
    return `M${x1} ${y1}l${(9 * Math.cos(a)).toFixed(2)} ${(9 * Math.sin(a)).toFixed(2)}`;
  };
  const rad = (32 * Math.PI) / 180;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <path d="M${x0} ${y0}C${c1x} ${c1y} ${c2x} ${c2y} ${x1} ${y1}${barb(rad)}${barb(-rad)}"
    fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>
</svg>`;
  write('arrow.png', render(svg, W * 2));
}
