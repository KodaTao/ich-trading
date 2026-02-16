import { ref } from 'vue'

const permission = ref(Notification?.permission || 'default')
const supported = ref('Notification' in window)

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
 * @param {string[]} symbols - 有更新的 symbol 列表
 */
function sendNotification(symbols) {
  if (!supported.value || permission.value !== 'granted') return
  if (!symbols || symbols.length === 0) return

  const body = `${symbols.join('、')} 有新的预测发布`

  const notification = new Notification('ICH Trading — 新预测发布', {
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
