<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useGitHub } from '../composables/useGitHub.js'

const router = useRouter()
const { state } = useGitHub()

const expanded = ref(false)
const query = ref('')
const inputRef = ref(null)
const containerRef = ref(null)
const selectedIndex = ref(-1)

const results = computed(() => {
  if (!query.value.trim() || !state.index?.symbols) return []
  const q = query.value.trim().toLowerCase()
  const matched = []

  for (const [code, symbolData] of Object.entries(state.index.symbols)) {
    // 匹配 symbol 代码或名称
    const symbolMatch = code.toLowerCase().includes(q) || symbolData.name?.toLowerCase().includes(q)

    for (const post of symbolData.posts) {
      const titleMatch = post.title?.toLowerCase().includes(q)
      const summaryMatch = post.summary?.toLowerCase().includes(q)
      const tagsMatch = post.tags?.some(t => t.toLowerCase().includes(q))

      if (symbolMatch || titleMatch || summaryMatch || tagsMatch) {
        matched.push({
          symbolCode: code,
          symbolIcon: symbolData.icon,
          symbolName: symbolData.name,
          folder: post.folder,
          title: post.title,
          summary: post.summary,
          date: post.date,
          tags: post.tags,
        })
      }
    }
  }

  matched.sort((a, b) => b.date.localeCompare(a.date))
  return matched.slice(0, 10)
})

function highlight(text, q) {
  if (!text || !q.trim()) return text || ''
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark class="bg-accent-blue/30 text-accent-blue rounded px-0.5">$1</mark>')
}

function toggleSearch() {
  expanded.value = !expanded.value
  if (expanded.value) {
    nextTick(() => inputRef.value?.focus())
  } else {
    close()
  }
}

function close() {
  expanded.value = false
  query.value = ''
  selectedIndex.value = -1
}

function goToResult(result) {
  router.push(`/${result.symbolCode}/${result.folder}`)
  close()
}

function handleKeydown(e) {
  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, -1)
  } else if (e.key === 'Enter' && selectedIndex.value >= 0) {
    e.preventDefault()
    goToResult(results.value[selectedIndex.value])
  }
}

// 点击外部关闭
function handleClickOutside(e) {
  if (containerRef.value && !containerRef.value.contains(e.target)) {
    close()
  }
}

watch(query, () => {
  selectedIndex.value = -1
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="containerRef" class="relative">
    <!-- 搜索按钮 -->
    <button
      @click="toggleSearch"
      class="text-text-secondary hover:text-accent-blue transition-colors p-1"
      title="搜索"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    </button>

    <!-- 搜索输入框 -->
    <transition name="search-expand">
      <div
        v-if="expanded"
        class="fixed top-16 left-1/2 -translate-x-1/2 z-[60] w-[calc(100vw-2rem)] max-w-md bg-bg-secondary/95 backdrop-blur-md border border-border-subtle rounded-xl shadow-xl shadow-black/30 overflow-hidden"
      >
        <div class="flex items-center gap-2 px-3 py-2.5 border-b border-border-subtle">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            @keydown="handleKeydown"
            type="text"
            placeholder="搜索预测报告..."
            class="flex-1 bg-transparent text-sm text-text-primary placeholder-text-secondary outline-none"
          />
          <button @click="close" class="text-text-secondary hover:text-text-primary text-lg leading-none">&times;</button>
        </div>

        <!-- 搜索结果 -->
        <div v-if="query.trim() && results.length > 0" class="max-h-80 overflow-y-auto">
          <button
            v-for="(result, i) in results"
            :key="`${result.symbolCode}-${result.folder}`"
            @click="goToResult(result)"
            class="w-full text-left px-3 py-2.5 hover:bg-white/5 transition-colors border-b border-border-subtle last:border-b-0"
            :class="{ 'bg-white/5': i === selectedIndex }"
          >
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-xs">{{ result.symbolIcon }}</span>
              <span class="text-xs font-display text-accent-blue">{{ result.symbolCode }}</span>
              <span class="text-xs text-text-secondary font-mono">{{ result.date }}</span>
            </div>
            <p class="text-sm text-text-primary truncate" v-html="highlight(result.title, query)" />
            <p v-if="result.summary" class="text-xs text-text-secondary truncate mt-0.5" v-html="highlight(result.summary, query)" />
          </button>
        </div>

        <!-- 无结果 -->
        <div v-else-if="query.trim() && results.length === 0" class="px-3 py-6 text-center text-xs text-text-secondary">
          没有找到相关内容
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.search-expand-enter-active,
.search-expand-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.search-expand-enter-from,
.search-expand-leave-to {
  opacity: 0;
  transform: translate(-50%, -4px);
}
</style>
