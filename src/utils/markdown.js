import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(str, lang) {
    // Mermaid 代码块特殊处理，不走 highlight.js
    if (lang === 'mermaid') {
      return ''
    }
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value
      } catch {
        // 忽略高亮失败
      }
    }
    return ''
  },
})

/**
 * 生成标题 slug（中文保留，特殊字符替换为连字符）
 */
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fff]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * 自定义 heading 渲染：为 h1-h6 添加 id 属性，支持同名去重
 */
const headingIdMap = new Map()

function resetHeadingIds() {
  headingIdMap.clear()
}

md.renderer.rules.heading_open = (tokens, idx) => {
  const token = tokens[idx]
  const tag = token.tag
  // 从下一个 inline token 提取标题文本
  const inlineToken = tokens[idx + 1]
  const text = inlineToken?.children
    ?.filter((t) => t.type === 'text' || t.type === 'code_inline')
    .map((t) => t.content)
    .join('') || ''

  let slug = slugify(text) || tag
  // 同名去重
  const count = headingIdMap.get(slug) || 0
  headingIdMap.set(slug, count + 1)
  if (count > 0) {
    slug = `${slug}-${count + 1}`
  }

  return `<${tag} id="${slug}">`
}

// 自定义 fence 渲染：mermaid 代码块输出为 div
const defaultFenceRenderer = md.renderer.rules.fence
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  if (token.info.trim() === 'mermaid') {
    return `<div class="mermaid">${md.utils.escapeHtml(token.content)}</div>`
  }
  return defaultFenceRenderer(tokens, idx, options, env, self)
}

/**
 * 渲染 Markdown
 * @param {string} content - Markdown 内容
 * @param {string} [basePath] - 帖子文件路径（如 predictions/BTC/2026-02-16/post.md），用于解析图片相对路径
 */
export function renderMarkdown(content, basePath) {
  resetHeadingIds()
  const html = md.render(content)

  // 如果提供了 basePath，将图片相对路径转为绝对路径
  if (basePath) {
    const baseDir = basePath.substring(0, basePath.lastIndexOf('/') + 1)
    const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

    return html.replace(
      /(<img\s[^>]*src=")(?!https?:\/\/|\/|data:)([^"]+)(")/g,
      (match, prefix, src, suffix) => {
        return `${prefix}${baseUrl}/${baseDir}${src}${suffix}`
      }
    )
  }

  return html
}
