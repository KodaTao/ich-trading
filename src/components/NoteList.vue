<script setup>
import { ref, onMounted, watch } from 'vue'
import { useGitHub } from '../composables/useGitHub.js'
import { parseFrontmatter } from '../utils/frontmatter.js'
import MarkdownRenderer from './MarkdownRenderer.vue'

const props = defineProps({
  notes: {
    type: Array,
    default: () => [],
  },
})

const { loadMarkdown } = useGitHub()

const loadedNotes = ref([])
const loading = ref(false)

/**
 * 格式化时间：2026-02-16T14:30 → 2026-02-16 14:30
 */
function formatTime(time) {
  return time.replace('T', ' ')
}

async function loadAllNotes() {
  if (props.notes.length === 0) return
  loading.value = true

  const results = []
  for (const note of props.notes) {
    try {
      const raw = await loadMarkdown(note.path)
      const parsed = parseFrontmatter(raw)
      results.push({
        time: note.time,
        title: note.title || parsed.attributes.title || '',
        body: parsed.body,
      })
    } catch {
      results.push({
        time: note.time,
        title: note.title || '',
        body: '加载失败',
      })
    }
  }

  loadedNotes.value = results
  loading.value = false
}

onMounted(loadAllNotes)
watch(() => props.notes, loadAllNotes)
</script>

<template>
  <section v-if="notes.length > 0" class="mt-10 pt-6 border-t border-border-subtle">
    <h2 class="text-lg font-display font-semibold text-text-primary mb-4 tracking-wide flex items-center gap-2">
      <span class="text-accent-gold">📝</span>
      笔记
      <span class="text-text-secondary text-sm font-normal">({{ notes.length }})</span>
    </h2>

    <div v-if="loading" class="text-text-secondary text-sm py-4">加载笔记中...</div>

    <!-- 时间轴样式笔记列表 -->
    <div v-else class="relative pl-6 border-l-2 border-accent-gold/30 flex flex-col gap-6">
      <article
        v-for="(note, index) in loadedNotes"
        :key="index"
        class="relative bg-bg-card border border-border-subtle rounded-lg p-5 shadow-sm"
      >
        <!-- 时间轴节点 -->
        <div class="absolute -left-[calc(1.5rem+5px)] top-5 w-2.5 h-2.5 rounded-full bg-accent-gold border-2 border-bg-primary" />

        <!-- 笔记头部 -->
        <div class="flex items-center gap-2 mb-3 pb-3 border-b border-border-subtle">
          <span class="text-accent-gold text-xs">●</span>
          <span class="text-text-secondary text-xs font-mono">
            {{ formatTime(note.time) }}
          </span>
          <span v-if="note.title" class="text-text-secondary text-xs">·</span>
          <h3 v-if="note.title" class="text-text-primary font-semibold text-sm flex-1">
            {{ note.title }}
          </h3>
        </div>

        <!-- 笔记内容 -->
        <div class="text-sm">
          <MarkdownRenderer :content="note.body" />
        </div>
      </article>
    </div>
  </section>
</template>
