import { readFile, writeFile, stat, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import sharp from 'sharp'

async function ensureDir(path) {
  try {
    await mkdir(path, { recursive: true })
  } catch {}
}

async function needsBuild(srcPath, outPath) {
  try {
    const [srcStat, outStat] = await Promise.all([stat(srcPath), stat(outPath)])
    return srcStat.mtimeMs > outStat.mtimeMs
  } catch {
    return true
  }
}

async function buildWebpVariants() {
  const src = join(process.cwd(), 'src/assets/id.jpg')
  const outDir = join(process.cwd(), 'src/assets')
  await ensureDir(outDir)

  const targets = [
    { name: 'id-480.webp', width: 480 },
    { name: 'id-768.webp', width: 768 },
    { name: 'id-1024.webp', width: 1024 },
    { name: 'id.webp', width: 1280 },
  ]

  for (const t of targets) {
    const out = join(outDir, t.name)
    if (await needsBuild(src, out)) {
      await sharp(src).resize({ width: t.width }).webp({ quality: 75 }).toFile(out)
      // eslint-disable-next-line no-console
      console.log(`wrote ${t.name}`)
    }
  }
}

buildWebpVariants().catch((err) => {
  console.error(err)
  process.exitCode = 1
})