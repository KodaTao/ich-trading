import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const PREDICTIONS_DIR = path.resolve('predictions')
const OUTPUT_FILE = path.resolve('index.json')
const FEED_FILE = path.resolve('feed.xml')
const SITE_URL = 'https://kodatao.github.io/ich-trading'

/**
 * 解析单个 .md 文件的 frontmatter
 */
function parseMdFile(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  let data = {}
  let content = rawContent
  try {
    const parsed = matter(rawContent)
    data = parsed.data
    content = parsed.content
  } catch {
    console.warn(`警告: ${filePath} frontmatter 解析失败`)
  }
  return { data, content }
}

/**
 * 扫描 notes 目录，返回笔记列表
 */
function scanNotes(notesDir, symbolCode, date) {
  if (!fs.existsSync(notesDir)) return []

  const noteFiles = fs
    .readdirSync(notesDir)
    .filter((f) => f.endsWith('.md'))
    .sort() // 按文件名（时间戳）正序

  const notes = []
  for (const noteFile of noteFiles) {
    const filePath = path.join(notesDir, noteFile)
    const { data } = parseMdFile(filePath)

    // 从文件名提取时间：2026-02-16T14-30.md → 2026-02-16T14:30
    const time = noteFile.replace(/\.md$/, '').replace(/-(\d{2})$/, ':$1')

    notes.push({
      time,
      title: data.title || '',
      path: `predictions/${symbolCode}/${date}/notes/${noteFile}`,
    })
  }

  return notes
}

function generateIndex() {
  const symbols = {}

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
      } catch {
        console.warn(`警告: ${metaPath} 解析失败，使用默认值`)
      }
    }

    const posts = []
    const entries = fs.readdirSync(symbolDir, { withFileTypes: true })

    for (const entry of entries) {
      // 跳过 meta.json
      if (entry.name === 'meta.json') continue

      let date, postPath, data, content, notes

      let review = null

      if (entry.isDirectory()) {
        // 目录形式：2026-02-16/post.md
        date = entry.name
        const postFile = path.join(symbolDir, entry.name, 'post.md')
        if (!fs.existsSync(postFile)) continue

        const parsed = parseMdFile(postFile)
        data = parsed.data
        content = parsed.content
        postPath = `predictions/${symbolCode}/${date}/post.md`

        // 扫描 review.md
        const reviewFile = path.join(symbolDir, entry.name, 'review.md')
        if (fs.existsSync(reviewFile)) {
          const reviewParsed = parseMdFile(reviewFile)
          if (reviewParsed.data.type === 'review' && reviewParsed.data.accuracy != null) {
            review = {
              accuracy: reviewParsed.data.accuracy,
              verdict: reviewParsed.data.verdict || '',
              path: `predictions/${symbolCode}/${date}/review.md`,
            }
          }
        }

        // 扫描 notes
        const notesDir = path.join(symbolDir, entry.name, 'notes')
        notes = scanNotes(notesDir, symbolCode, date)
      } else if (entry.name.endsWith('.md')) {
        // 扁平文件形式（向后兼容）：2026-02-16.md
        date = entry.name.replace(/\.md$/, '')
        const filePath = path.join(symbolDir, entry.name)

        const parsed = parseMdFile(filePath)
        data = parsed.data
        content = parsed.content
        postPath = `predictions/${symbolCode}/${entry.name}`
        notes = []
      } else {
        continue
      }

      // 提取 title
      let title = data.title
      if (!title) {
        const h1Match = content.match(/^#\s+(.+)$/m)
        title = h1Match ? h1Match[1] : date
      }

      // 优先使用 frontmatter 中的 date 字段，否则用目录名
      const postDate = data.date || date

      const postEntry = {
        date: postDate,
        folder: date,
        title,
        subtitle: data.subtitle || null,
        summary: data.summary || null,
        format: 'md',
        path: postPath,
        tags: data.tags || [],
        notes,
      }
      if (review) postEntry.review = review
      posts.push(postEntry)
    }

    // 按 date 字段倒序排列
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

  // 统计
  let totalNotes = 0
  for (const sym of Object.values(symbols)) {
    for (const post of sym.posts) {
      totalNotes += post.notes.length
    }
  }
  console.log(`✅ index.json 已生成，包含 ${Object.keys(symbols).length} 个 symbol，${totalNotes} 条笔记`)

  // 生成 RSS Feed
  generateFeed(symbols)
}

/**
 * 生成 Atom Feed (feed.xml)
 */
function generateFeed(symbols) {
  // 收集所有帖子并按日期倒序
  const allPosts = []
  for (const [code, symbolData] of Object.entries(symbols)) {
    for (const post of symbolData.posts) {
      allPosts.push({
        ...post,
        symbolCode: code,
        symbolName: symbolData.name,
        symbolIcon: symbolData.icon,
      })
    }
  }
  allPosts.sort((a, b) => b.date.localeCompare(a.date))
  const feedPosts = allPosts.slice(0, 20)

  const updated = new Date().toISOString()
  const escXml = (s) => (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

  const entries = feedPosts.map((post) => {
    const postUrl = `${SITE_URL}/#/${encodeURIComponent(post.symbolCode)}/${encodeURIComponent(post.folder)}`
    const summary = post.summary || post.title
    return `  <entry>
    <title>${escXml(`[${post.symbolCode}] ${post.title}`)}</title>
    <link href="${escXml(postUrl)}" />
    <id>${escXml(postUrl)}</id>
    <updated>${post.date}T00:00:00Z</updated>
    <summary>${escXml(summary)}</summary>
    <author><name>KodaTao</name></author>
  </entry>`
  }).join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>ICH Trading — 易经交易预测</title>
  <subtitle>基于易经的股票与加密货币交易预测平台</subtitle>
  <link href="${SITE_URL}/" />
  <link href="${SITE_URL}/feed.xml" rel="self" />
  <id>${SITE_URL}/</id>
  <updated>${updated}</updated>
  <author><name>KodaTao</name></author>
${entries}
</feed>
`

  fs.writeFileSync(FEED_FILE, feed, 'utf-8')
  console.log(`✅ feed.xml 已生成，包含 ${feedPosts.length} 条最新预测`)
}

generateIndex()
