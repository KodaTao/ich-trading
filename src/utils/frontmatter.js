/**
 * 解析 Markdown frontmatter
 * 返回 { attributes, body }
 */
export function parseFrontmatter(rawContent) {
  const match = rawContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    return { attributes: {}, body: rawContent }
  }

  const yamlStr = match[1]
  const body = match[2]
  const attributes = {}

  for (const line of yamlStr.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue

    const key = trimmed.slice(0, colonIdx).trim()
    let value = trimmed.slice(colonIdx + 1).trim()

    // 去除引号
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }

    // 解析数组（简单格式："["a", "b"]"）
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        attributes[key] = JSON.parse(value)
      } catch {
        attributes[key] = value
      }
    } else {
      attributes[key] = value
    }
  }

  return { attributes, body }
}
