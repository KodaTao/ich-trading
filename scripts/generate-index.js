import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const PREDICTIONS_DIR = path.resolve('predictions')
const OUTPUT_FILE = path.resolve('index.json')

function generateIndex() {
  const symbols = {}

  // 读取 predictions/ 下所有子目录
  if (!fs.existsSync(PREDICTIONS_DIR)) {
    console.error('predictions/ 目录不存在')
    process.exit(1)
  }

  const dirs = fs
    .readdirSync(PREDICTIONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

  for (const symbolCode of dirs) {
    const symbolDir = path.join(PREDICTIONS_DIR, symbolCode)

    // 读取 meta.json
    let meta = { name: symbolCode, description: '', icon: '' }
    const metaPath = path.join(symbolDir, 'meta.json')
    if (fs.existsSync(metaPath)) {
      try {
        meta = { ...meta, ...JSON.parse(fs.readFileSync(metaPath, 'utf-8')) }
      } catch (err) {
        console.warn(`警告: ${metaPath} 解析失败，使用默认值`)
      }
    }

    // 扫描 .md 文件
    const mdFiles = fs
      .readdirSync(symbolDir)
      .filter((f) => f.endsWith('.md'))

    const posts = []

    for (const mdFile of mdFiles) {
      const filePath = path.join(symbolDir, mdFile)
      const rawContent = fs.readFileSync(filePath, 'utf-8')

      // 解析 frontmatter
      let data = {}
      let content = rawContent
      try {
        const parsed = matter(rawContent)
        data = parsed.data
        content = parsed.content
      } catch {
        console.warn(`警告: ${filePath} frontmatter 解析失败`)
      }

      // 从文件名提取日期
      const date = mdFile.replace(/\.md$/, '')

      // 提取 title
      let title = data.title
      if (!title) {
        const h1Match = content.match(/^#\s+(.+)$/m)
        title = h1Match ? h1Match[1] : date
      }

      posts.push({
        date,
        title,
        subtitle: data.subtitle || null,
        summary: data.summary || null,
        format: 'md',
        path: `predictions/${symbolCode}/${mdFile}`,
        tags: data.tags || [],
      })
    }

    // 按日期倒序
    posts.sort((a, b) => b.date.localeCompare(a.date))

    symbols[symbolCode] = {
      name: meta.name,
      description: meta.description,
      icon: meta.icon,
      posts,
    }
  }

  const indexData = {
    lastUpdated: new Date().toISOString(),
    symbols,
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(indexData, null, 2), 'utf-8')
  console.log(`✅ index.json 已生成，包含 ${Object.keys(symbols).length} 个 symbol`)
}

generateIndex()
