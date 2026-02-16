import { ref, computed } from 'vue'
import { useNotification } from './useNotification.js'

const STORAGE_KEY = 'ich-read-state'

const updatedSymbols = ref([])
const hasUpdate = computed(() => updatedSymbols.value.length > 0)

// 记录上次通知对应的 lastUpdated，防止轮询重复通知
let lastNotifiedTimestamp = ''

/**
 * 从 localStorage 读取已读状态
 */
function getReadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * 保存已读状态到 localStorage
 */
function saveReadState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/**
 * 检查更新：对比 index 数据与 localStorage 中的 read-state
 */
function checkForUpdates(indexData) {
  if (!indexData?.symbols) return

  const readState = getReadState()
  const updated = []

  const currentSymbols = {}
  for (const [code, symbolData] of Object.entries(indexData.symbols)) {
    const latestDate = symbolData.posts?.[0]?.date || ''
    currentSymbols[code] = latestDate

    if (!readState) continue

    const savedDate = readState.symbols?.[code]
    if (!savedDate && latestDate) {
      // 新 symbol 且有帖子
      updated.push(code)
    } else if (latestDate && latestDate > savedDate) {
      // 有新的预测
      updated.push(code)
    }
  }

  updatedSymbols.value = updated

  // 有更新时发送浏览器通知（避免重复通知同一次更新）
  const currentTimestamp = indexData.lastUpdated || ''
  if (updated.length > 0 && currentTimestamp !== lastNotifiedTimestamp) {
    lastNotifiedTimestamp = currentTimestamp
    const { sendNotification } = useNotification()
    sendNotification(updated)
  }

  // 首次访问，初始化 read-state
  if (!readState) {
    saveReadState({
      lastChecked: new Date().toISOString(),
      symbols: currentSymbols,
    })
  }
}

/**
 * 标记所有更新为已读
 */
function markAllRead(indexData) {
  if (!indexData?.symbols) return

  const currentSymbols = {}
  for (const [code, symbolData] of Object.entries(indexData.symbols)) {
    currentSymbols[code] = symbolData.posts?.[0]?.date || ''
  }

  saveReadState({
    lastChecked: new Date().toISOString(),
    symbols: currentSymbols,
  })

  updatedSymbols.value = []
}

/**
 * 标记某个 symbol 为已读
 */
function markSymbolRead(code, latestDate) {
  const readState = getReadState() || { lastChecked: '', symbols: {} }
  readState.symbols[code] = latestDate
  readState.lastChecked = new Date().toISOString()
  saveReadState(readState)

  updatedSymbols.value = updatedSymbols.value.filter((s) => s !== code)
}

/**
 * 判断某个 symbol 是否有未读更新
 */
function isSymbolUpdated(code) {
  return updatedSymbols.value.includes(code)
}

export function useUpdateChecker() {
  return {
    updatedSymbols,
    hasUpdate,
    checkForUpdates,
    markAllRead,
    markSymbolRead,
    isSymbolUpdated,
  }
}
