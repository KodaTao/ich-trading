import { ref } from 'vue'

const supported = ref(typeof window !== 'undefined' && 'Notification' in window)
const permission = ref(supported.value ? Notification.permission : 'default')

/**
 * 请求通知权限
 */
async function requestPermission() {
  if (!supported.value) return 'denied'
  if (permission.value === 'granted') return 'granted'
  if (permission.value === 'denied') return 'denied'

  const result = await Notification.requestPermission()
  permission.value = result
  return result
}

/**
 * 发送浏览器通知
 * @param {string[]} postSymbols - 有新帖子的 symbol 列表
 * @param {string[]} [noteSymbols] - 有新笔记的 symbol 列表
 */
function sendNotification(postSymbols = [], noteSymbols = []) {
  if (!supported.value || permission.value !== 'granted') return

  const parts = []
  if (postSymbols.length > 0) {
    parts.push(`${postSymbols.join('、')} 有新的预测发布`)
  }
  if (noteSymbols.length > 0) {
    parts.push(`${noteSymbols.join('、')} 有新的笔记更新`)
  }
  if (parts.length === 0) return

  const body = parts.join('；')
  const title = noteSymbols.length > 0 && postSymbols.length === 0
    ? 'ICH Trading — 笔记更新'
    : 'ICH Trading — 新预测发布'

  const notification = new Notification(title, {
    body,
    icon: '/ich-trading/favicon.ico',
    tag: 'ich-trading-update', // 相同 tag 合并通知，避免重复
  })

  notification.onclick = () => {
    window.focus()
    notification.close()
  }
}

export function useNotification() {
  return {
    supported,
    permission,
    requestPermission,
    sendNotification,
  }
}
