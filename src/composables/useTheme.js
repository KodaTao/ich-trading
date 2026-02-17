import { ref, watch } from 'vue'

const STORAGE_KEY = 'ich-theme'

function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  // 跟随系统
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'light'
  return 'dark'
}

const theme = ref(getInitialTheme())

function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t)
}

// 初始化应用
applyTheme(theme.value)

watch(theme, (newTheme) => {
  applyTheme(newTheme)
  localStorage.setItem(STORAGE_KEY, newTheme)
})

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

export function useTheme() {
  return { theme, toggleTheme }
}
