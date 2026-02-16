import { reactive, ref } from 'vue'

const REPO_OWNER = 'KodaTao'
const REPO_NAME = 'ich-trading'
const BRANCH = 'main'
const GITHUB_RAW = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`

// 判断是否为本地开发环境
function getBaseUrl() {
  const host = window.location.hostname
  const isDev = host === 'localhost' || host === '127.0.0.1'
  if (isDev) {
    return ''
  }
  // 生产环境从 GitHub Pages 自身加载（index.json 和 predictions/ 已复制到 dist/）
  return import.meta.env.BASE_URL.replace(/\/$/, '')
}

const RAW_BASE = getBaseUrl()

// 全局状态（单例）
const state = reactive({
  index: null,
  loading: false,
  error: null,
})

const initialized = ref(false)

/**
 * 加载 index.json 索引数据
 */
async function loadIndex() {
  if (state.loading) return
  // 首次加载才显示全局 loading，后续轮询静默更新
  const isFirstLoad = !initialized.value
  if (isFirstLoad) {
    state.loading = true
    state.error = null
  }

  try {
    const url = `${RAW_BASE}/index.json?t=${Date.now()}`
    const res = await fetch(url, { cache: 'no-cache' })
    if (!res.ok) throw new Error(`加载索引失败: ${res.status}`)
    const newData = await res.json()
    // 数据有变化才更新，避免不必要的响应式触发
    if (JSON.stringify(newData) !== JSON.stringify(state.index)) {
      state.index = newData
    }
    initialized.value = true
  } catch (err) {
    if (isFirstLoad) {
      state.error = err.message
    }
  } finally {
    if (isFirstLoad) {
      state.loading = false
    }
  }
}

/**
 * 加载 Markdown 文件内容
 */
async function loadMarkdown(path) {
  const url = `${RAW_BASE}/${path}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`加载预测内容失败: ${res.status}`)
  return await res.text()
}

/**
 * 获取所有 symbols 列表
 */
function getSymbols() {
  if (!state.index) return []
  return Object.entries(state.index.symbols)
    .map(([code, data]) => ({
      code,
      ...data,
    }))
    .sort((a, b) => {
      const dateA = a.posts?.[0]?.date || ''
      const dateB = b.posts?.[0]?.date || ''
      return dateB.localeCompare(dateA)
    })
}

/**
 * 获取某个 symbol 的数据
 */
function getSymbol(code) {
  if (!state.index?.symbols?.[code]) return null
  return { code, ...state.index.symbols[code] }
}

/**
 * 获取全局最新 N 条预测
 */
function getLatestPosts(count = 5) {
  if (!state.index) return []
  const allPosts = []
  for (const [code, symbolData] of Object.entries(state.index.symbols)) {
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
  return allPosts.slice(0, count)
}

export function useGitHub() {
  return {
    state,
    initialized,
    loadIndex,
    loadMarkdown,
    getSymbols,
    getSymbol,
    getLatestPosts,
  }
}
