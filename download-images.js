/**
 * Run this once to download the park images:
 *   node download-images.js
 *
 * Place your own images in public/images/ with these exact names:
 *   akagera.jpg          — Zebras in Akagera savanna
 *   nyungwe-canopy.jpg   — Nyungwe canopy walkway
 *   volcanoes-gorillas.jpg — Mountain gorillas
 *   gishwati-monkey.jpg  — Golden monkey on bamboo
 */

import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, 'public', 'images')

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

const images = [
  {
    name: 'akagera.jpg',
    // Zebras in Akagera National Park Rwanda - Wikimedia Commons
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Akagera_National_Park_zebras.jpg/1280px-Akagera_National_Park_zebras.jpg',
  },
  {
    name: 'nyungwe-canopy.jpg',
    // Nyungwe canopy walkway - Wikimedia Commons
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Nyungwe_canopy_walk.jpg/1280px-Nyungwe_canopy_walk.jpg',
  },
  {
    name: 'volcanoes-gorillas.jpg',
    // Mountain gorillas Rwanda - Wikimedia Commons
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Gorillas_in_the_Mist.jpg/1280px-Gorillas_in_the_Mist.jpg',
  },
  {
    name: 'gishwati-monkey.jpg',
    // Golden monkey Rwanda - Wikimedia Commons
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Golden_monkey_Rwanda.jpg/800px-Golden_monkey_Rwanda.jpg',
  },
]

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const protocol = url.startsWith('https') ? https : http
    protocol.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        fs.unlinkSync(dest)
        return download(res.headers.location, dest).then(resolve).catch(reject)
      }
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', (err) => {
      fs.unlinkSync(dest)
      reject(err)
    })
  })
}

console.log('📥 Downloading park images...\n')
for (const img of images) {
  const dest = path.join(outDir, img.name)
  try {
    await download(img.url, dest)
    console.log(`✅ ${img.name}`)
  } catch (e) {
    console.log(`❌ ${img.name} — ${e.message}`)
    console.log(`   → Manually place your image at: public/images/${img.name}`)
  }
}
console.log('\n✨ Done! Restart the dev server to see the images.')
