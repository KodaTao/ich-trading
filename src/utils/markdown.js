import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const md = new MarkdownIt({
  html: false,
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

// 自定义 fence 渲染：mermaid 代码块输出为 div
const defaultFenceRenderer = md.renderer.rules.fence
md.renderer.rules.fence = (tokens, idx, options, env, self) => {
  const token = tokens[idx]
  if (token.info.trim() === 'mermaid') {
    return `<div class="mermaid">${md.utils.escapeHtml(token.content)}</div>`
  }
  return defaultFenceRenderer(tokens, idx, options, env, self)
}

export function renderMarkdown(content) {
  return md.render(content)
}
