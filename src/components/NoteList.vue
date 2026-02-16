<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useGitHub } from '../composables/useGitHub.js'
import { parseFrontmatter } from '../utils/frontmatter.js'
import MarkdownRenderer from './MarkdownRenderer.vue'
import GiscusComments from './GiscusComments.vue'

const props = defineProps({
  notes: {
    type: Array,
    default: () => [],
  },
  symbolCode: {
    type: String,
    default: '',
  },
  dateParam: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['fullscreen'])

const { loadMarkdown } = useGitHub()

const loadedNotes = ref([])
const loading = ref(false)
const latestNoteEl = ref(null)

/**
 * 倒序排列的笔记（最新在前）
 */
const reversedNotes = computed(() => [...loadedNotes.value].reverse())

/**
 * 格式化时间：2026-02-16T14:30 → 2026-02-16 14:30
 */
function formatTime(time) {
  return time.replace('T', ' ')
}

/**
 * 滚动到最新笔记，供父组件调用
 */
function scrollToLatest() {
  latestNoteEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function loadAllNotes() {
  if (props.notes.length === 0) {
    loadedNotes.value = []
    return
  }
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

defineExpose({ scrollToLatest, loading })
</script>

<template>
  <section v-if="notes.length > 0" class="mt-10 pt-6 border-t border-border-subtle">
    <h2 class="text-lg font-display font-semibold text-text-primary mb-4 tracking-wide flex items-center gap-2">
      <span class="text-accent-gold">📝</span>
      笔记
      <span class="text-text-secondary text-sm font-normal">({{ notes.length }})</span>
    </h2>

    <div v-if="loading" class="text-text-secondary text-sm py-4">加载笔记中...</div>

    <!-- 时间轴样式笔记列表（倒序：最新在上） -->
    <div v-else class="relative pl-6 border-l-2 border-accent-gold/30 flex flex-col gap-6">
      <article
        v-for="(note, index) in reversedNotes"
        :key="index"
        :ref="index === 0 ? (el) => (latestNoteEl = el) : undefined"
        class="relative bg-bg-card border border-border-subtle rounded-lg p-5 shadow-sm"
      >
        <!-- 时间轴节点 -->
        <div class="absolute -left-[calc(1.5rem+5px)] top-5 w-2.5 h-2.5 rounded-full border-2 border-bg-primary"
          :class="index === 0 ? 'bg-accent-blue shadow-[0_0_6px_rgba(0,212,255,0.5)]' : 'bg-accent-gold'"
        />

        <!-- 最新标记 -->
        <span
          v-if="index === 0"
          class="absolute -top-2.5 right-3 text-[10px] px-1.5 py-0.5 rounded bg-accent-blue/20 text-accent-blue font-mono"
        >
          最新
        </span>

        <!-- 笔记头部 -->
        <div class="mb-3 pb-3 border-b border-border-subtle">
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-1.5 text-text-secondary text-xs mb-1">
                <span class="text-accent-gold">●</span>
                <span class="font-mono">{{ formatTime(note.time) }}</span>
              </div>
              <h3 v-if="note.title" class="text-text-primary font-semibold text-sm leading-snug">
                {{ note.title }}
              </h3>
            </div>
            <button
              @click="emit('fullscreen', note)"
              class="shrink-0 text-xs text-text-secondary hover:text-accent-blue transition-colors ml-2"
              title="全屏查看"
            >
              ⛶
            </button>
          </div>
        </div>

        <!-- 笔记内容 -->
        <div class="text-sm">
          <MarkdownRenderer :content="note.body" />
        </div>

        <!-- 笔记评论区 -->
        <GiscusComments
          v-if="symbolCode && dateParam"
          :term="`${symbolCode}/${dateParam}/note/${note.time}`"
        />
      </article>
    </div>
  </section>
</template>
