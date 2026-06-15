#!/usr/bin/env node
'use strict'

const sharp = require('sharp')
const path  = require('path')
const fs    = require('fs')

const PUBLIC      = path.join(__dirname, '..', 'public')
const SPLASH_DIR  = path.join(PUBLIC, 'splashes')

if (!fs.existsSync(SPLASH_DIR)) fs.mkdirSync(SPLASH_DIR, { recursive: true })

// ─── Ícones PNG ───────────────────────────────────────────────────────────────
const ICONS = [
  { src: 'icon.svg',          out: 'apple-touch-icon.png',  size: 180 },
  { src: 'icon.svg',          out: 'icon-192.png',           size: 192 },
  { src: 'icon.svg',          out: 'icon-512.png',           size: 512 },
  { src: 'icon-maskable.svg', out: 'icon-maskable-512.png',  size: 512 },
]

async function makeIcons() {
  for (const { src, out, size } of ICONS) {
    await sharp(path.join(PUBLIC, src))
      .resize(size, size)
      .png({ compressionLevel: 9 })
      .toFile(path.join(PUBLIC, out))
    console.log(`  ✓ public/${out}`)
  }
}

// ─── Splash screens ───────────────────────────────────────────────────────────
const SPLASHES = [
  { w: 640,  h: 1136 },  // iPhone SE 1st gen
  { w: 750,  h: 1334 },  // iPhone 8
  { w: 1125, h: 2436 },  // iPhone X / XS / 11 Pro
  { w: 1170, h: 2532 },  // iPhone 12 / 13 / 14
  { w: 1179, h: 2556 },  // iPhone 14 Pro
  { w: 1284, h: 2778 },  // iPhone 14 Plus / 14 Pro Max
  { w: 1290, h: 2796 },  // iPhone 15 Pro Max
  { w: 1536, h: 2048 },  // iPad 9.7"
  { w: 1668, h: 2388 },  // iPad Pro 11"
  { w: 2048, h: 2732 },  // iPad Pro 12.9"
]

function splashSvg(w, h) {
  const rs       = Math.round(Math.min(w, h) * 0.20)  // icon size
  const iconX    = Math.round(w / 2 - rs / 2)
  const iconY    = Math.round(h * 0.39)
  const titleY   = iconY + rs + Math.round(rs * 0.18)
  const subY     = titleY + Math.round(rs * 0.26)
  const titleSz  = Math.round(rs * 0.22)
  const subSz    = Math.round(rs * 0.13)
  const decR     = Math.round(Math.max(w, h) * 0.28)

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="${w}" height="${h}" fill="#FAF7F5"/>
  <circle cx="${Math.round(w * -0.05)}" cy="${Math.round(h * 0.12)}" r="${decR}" fill="#D98E73" opacity="0.06"/>
  <circle cx="${Math.round(w * 1.05)}" cy="${Math.round(h * 0.88)}" r="${decR}" fill="#A8C3A0" opacity="0.06"/>
  <svg x="${iconX}" y="${iconY}" width="${rs}" height="${rs}" viewBox="0 0 512 512">
    <rect width="512" height="512" rx="96" fill="#D98E73"/>
    <rect width="512" height="256" rx="96" fill="#E8A88B" opacity="0.35"/>
    <path d="M256 394 C248 386,100 294,100 184 C100 134,140 94,188 94 C216 94,240 108,256 130 C272 108,296 94,324 94 C372 94,412 134,412 184 C412 294,264 386,256 394 Z" fill="white" opacity="0.95"/>
  </svg>
  <text x="${Math.round(w / 2)}" y="${titleY}" text-anchor="middle" font-size="${titleSz}" font-weight="700" fill="#3A3530" font-family="system-ui,-apple-system,sans-serif">Mem&#xF3;ria Viva</text>
  <text x="${Math.round(w / 2)}" y="${subY}"   text-anchor="middle" font-size="${subSz}"   fill="#8B8378"  font-family="system-ui,-apple-system,sans-serif">Bem-estar e mem&#xF3;rias</text>
</svg>`)
}

async function makeSplashes() {
  for (const { w, h } of SPLASHES) {
    const name = `splash-${w}x${h}.png`
    await sharp(splashSvg(w, h), { density: 72 })
      .png({ compressionLevel: 8 })
      .toFile(path.join(SPLASH_DIR, name))
    console.log(`  ✓ public/splashes/${name}`)
  }
}

;(async () => {
  console.log('\n📦  Gerando ícones PNG...')
  await makeIcons()
  console.log('\n🖼   Gerando splashes iOS...')
  await makeSplashes()
  console.log('\n✅  Concluído!\n')
})().catch((e) => { console.error(e); process.exit(1) })
