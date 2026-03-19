const fs = require('fs')
const path = require('path')

function resolveSharp() {
  const candidates = [
    () => require('sharp'),
    () => require('../jijutuku-23/node_modules/sharp'),
    () => require('../jichengceping-25/node_modules/sharp'),
    () => require('../jinganceping-27/node_modules/sharp')
  ]

  for (const load of candidates) {
    try {
      return load()
    } catch (err) {}
  }

  throw new Error(
    'Cannot find sharp module. Install sharp or use a workspace project that already has it.'
  )
}

async function compressLogo() {
  const sharp = resolveSharp()
  const logoPath = path.join(__dirname, 'src', 'assets', 'images', 'logo.png')

  if (!fs.existsSync(logoPath)) {
    throw new Error(`logo file not found: ${logoPath}`)
  }

  const beforeSize = fs.statSync(logoPath).size

  const output = await sharp(logoPath)
    .resize(192, 192, { fit: 'cover', position: 'center' })
    .png({ quality: 90, compressionLevel: 9 })
    .toBuffer()

  fs.writeFileSync(logoPath, output)

  const afterSize = fs.statSync(logoPath).size
  console.log('logo compressed to 192x192')
  console.log(`before: ${(beforeSize / 1024).toFixed(2)} KB`)
  console.log(`after: ${(afterSize / 1024).toFixed(2)} KB`)
}

compressLogo().catch(err => {
  console.error('compress-logo failed:', err.message || err)
  process.exit(1)
})
