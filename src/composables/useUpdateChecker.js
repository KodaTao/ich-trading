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
 * 获取某个 symbol 所有帖子中最新的笔记时间戳
 */
function getLatestNoteTime(symbolData) {
  let latest = ''
  for (const post of symbolData.posts || []) {
    for (const note of post.notes || []) {
      if (note.time && note.time > latest) {
        latest = note.time
      }
    }
  }
  return latest
}

/**
 * 检查更新：对比 index 数据与 localStorage 中的 read-state
 * 同时检测帖子更新和笔记更新
 */
function checkForUpdates(indexData) {
  if (!indexData?.symbols) return

  const readState = getReadState()
  const updatedPosts = []
  const updatedNotes = []

  const currentSymbols = {}
  for (const [code, symbolData] of Object.entries(indexData.symbols)) {
    const latestDate = symbolData.posts?.[0]?.date || ''
    const latestNoteTime = getLatestNoteTime(symbolData)
    currentSymbols[code] = { date: latestDate, noteTime: latestNoteTime }

    if (!readState) continue

    const saved = readState.symbols?.[code]
    // 兼容旧格式：saved 可能是字符串（仅 date）或对象（{ date, noteTime }）
    const savedDate = typeof saved === 'string' ? saved : saved?.date
    const savedNoteTime = typeof saved === 'string' ? '' : (saved?.noteTime || '')

    if (!savedDate && latestDate) {
      // 新 symbol 且有帖子
      updatedPosts.push(code)
    } else if (latestDate && latestDate > savedDate) {
      // 有新的预测帖子
      updatedPosts.push(code)
    } else if (latestNoteTime && latestNoteTime > savedNoteTime) {
      // 帖子没变，但有新笔记
      updatedNotes.push(code)
    }
  }

  const allUpdated = [...new Set([...updatedPosts, ...updatedNotes])]
  updatedSymbols.value = allUpdated

  // 有更新时发送浏览器通知（避免重复通知同一次更新）
  const currentTimestamp = indexData.lastUpdated || ''
  if (allUpdated.length > 0 && currentTimestamp !== lastNotifiedTimestamp) {
    lastNotifiedTimestamp = currentTimestamp
    const { sendNotification } = useNotification()
    sendNotification(updatedPosts, updatedNotes)
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
    currentSymbols[code] = {
      date: symbolData.posts?.[0]?.date || '',
      noteTime: getLatestNoteTime(symbolData),
    }
  }

  saveReadState({
    lastChecked: new Date().toISOString(),
    symbols: currentSymbols,
  })

  updatedSymbols.value = []
}

/**
 * 标记某个 symbol 为已读
 * @param {string} code - symbol 代码
 * @param {string} latestDate - 最新帖子日期
 * @param {string} [latestNoteTime] - 最新笔记时间戳
 */
function markSymbolRead(code, latestDate, latestNoteTime = '') {
  const readState = getReadState() || { lastChecked: '', symbols: {} }
  readState.symbols[code] = { date: latestDate, noteTime: latestNoteTime }
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
