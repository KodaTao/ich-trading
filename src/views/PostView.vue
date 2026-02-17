<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGitHub } from '../composables/useGitHub.js'
import { useUpdateChecker } from '../composables/useUpdateChecker.js'
import { parseFrontmatter } from '../utils/frontmatter.js'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import NoteList from '../components/NoteList.vue'
import TableOfContents from '../components/TableOfContents.vue'
import FullscreenViewer from '../components/FullscreenViewer.vue'
import GiscusComments from '../components/GiscusComments.vue'
import ReadingProgress from '../components/ReadingProgress.vue'
import AccuracyBadge from '../components/AccuracyBadge.vue'

const route = useRoute()
const router = useRouter()
const { getSymbol, loadMarkdown } = useGitHub()
const { markSymbolRead } = useUpdateChecker()

const symbolCode = computed(() => route.params.symbol)
const dateParam = computed(() => route.params.date)
const symbol = computed(() => getSymbol(symbolCode.value))

const loading = ref(true)
const error = ref(null)
const body = ref('')
const attributes = ref({})
const noteListRef = ref(null)
const pageTopRef = ref(null)
const contentRef = ref(null)
const tocRefreshSignal = ref(0)

// 复盘报告
const reviewBody = ref('')
const reviewLoading = ref(false)

async function loadReview() {
  if (!currentPost.value?.review) return
  reviewLoading.value = true
  try {
    const raw = await loadMarkdown(currentPost.value.review.path)
    const parsed = parseFrontmatter(raw)
    reviewBody.value = parsed.body
  } catch {
    reviewBody.value = ''
  } finally {
    reviewLoading.value = false
  }
}

// 全屏查看状态
const fullscreenVisible = ref(false)
const fullscreenTitle = ref('')
const fullscreenContent = ref('')

function openFullscreen(title, content) {
  fullscreenTitle.value = title
  fullscreenContent.value = content
  fullscreenVisible.value = true
}

function closeFullscreen() {
  fullscreenVisible.value = false
}

function openPostFullscreen() {
  openFullscreen(
    attributes.value.title || currentPost.value?.title || '正文',
    body.value
  )
}

function handleNoteFullscreen(note) {
  openFullscreen(
    note.title || note.time,
    note.body
  )
}

async function openReviewFullscreen() {
  if (!currentPost.value?.review) return
  if (!reviewBody.value) await loadReview()
  openFullscreen('复盘报告', reviewBody.value)
}

// 上一篇 / 下一篇导航
const currentIndex = computed(() => {
  if (!symbol.value?.posts) return -1
  return symbol.value.posts.findIndex((p) => p.folder === dateParam.value)
})

const prevPost = computed(() => {
  if (!symbol.value?.posts || currentIndex.value < 0) return null
  return symbol.value.posts[currentIndex.value + 1] || null
})

const nextPost = computed(() => {
  if (!symbol.value?.posts || currentIndex.value <= 0) return null
  return symbol.value.posts[currentIndex.value - 1] || null
})

const currentPost = computed(() => {
  if (!symbol.value?.posts) return null
  return symbol.value.posts[currentIndex.value] || null
})

// 当前帖子的笔记列表
const currentNotes = computed(() => {
  return currentPost.value?.notes || []
})

/**
 * 点击 header 标题：有笔记则跳到最新笔记，无笔记则回到顶部
 */
function handleHeaderClick() {
  if (currentNotes.value.length > 0) {
    noteListRef.value?.scrollToLatest()
  } else {
    pageTopRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

async function loadContent() {
  if (!currentPost.value) return
  loading.value = true
  error.value = null

  try {
    const raw = await loadMarkdown(currentPost.value.path)
    const parsed = parseFrontmatter(raw)
    attributes.value = parsed.attributes
    body.value = parsed.body

    // 标记已读
    markSymbolRead(symbolCode.value, dateParam.value)

    // 加载复盘报告
    loadReview()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(loadContent)
watch(() => route.params, loadContent)
// 刷新页面时 index.json 异步加载，currentPost 从 null 变为有值时需重新加载内容
watch(currentPost, (newVal, oldVal) => {
  if (newVal && !oldVal) loadContent()
})

// 正文加载完成后刷新 TOC
watch(body, () => {
  nextTick(() => tocRefreshSignal.value++)
})

// 笔记加载完成后刷新 TOC
watch(
  () => noteListRef.value?.loading,
  (newLoading, oldLoading) => {
    if (oldLoading === true && newLoading === false) {
      nextTick(() => tocRefreshSignal.value++)
    }
  }
)
</script>

<template>
  <div>
  <ReadingProgress />
  <div ref="pageTopRef" class="max-w-3xl mx-auto px-4 py-6">
    <!-- 加载中 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="text-text-secondary text-sm">加载中...</div>
    </div>

    <!-- 错误 -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-400 text-sm">{{ error }}</p>
    </div>

    <!-- 内容 -->
    <template v-else>
      <div ref="contentRef">
      <!-- Meta 区域 — 点击标题跳转最新笔记或回顶 -->
      <header class="mb-8">
        <div class="flex items-center gap-2 mb-3">
          <router-link
            :to="`/${symbolCode}`"
            class="flex items-center gap-1.5 text-accent-blue hover:underline text-sm"
          >
            <span>{{ symbol?.icon }}</span>
            <span class="font-display font-semibold">{{ symbolCode }}</span>
          </router-link>
          <span class="text-text-secondary text-xs">·</span>
          <span class="text-text-secondary text-xs font-mono">{{ currentPost?.folder || dateParam }}</span>
        </div>

        <h1
          @click="handleHeaderClick"
          class="text-2xl font-bold text-text-primary mb-2 cursor-pointer hover:text-accent-blue transition-colors"
          :title="currentNotes.length > 0 ? '点击跳转最新笔记' : '点击回到顶部'"
        >
          {{ attributes.title || currentPost?.title }}
        </h1>

        <p v-if="attributes.subtitle || currentPost?.subtitle" class="text-accent-gold text-base mb-3">
          {{ attributes.subtitle || currentPost?.subtitle }}
        </p>

        <div v-if="(attributes.tags || currentPost?.tags)?.length" class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in attributes.tags || currentPost?.tags"
            :key="tag"
            class="text-xs px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue/80"
          >
            {{ tag }}
          </span>
        </div>

        <!-- 复盘报告入口 -->
        <button
          v-if="currentPost?.review"
          @click="openReviewFullscreen"
          class="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-gold/10 hover:bg-accent-gold/20 transition-colors text-sm"
        >
          <AccuracyBadge :accuracy="currentPost.review.accuracy" size="sm" />
          <span class="text-accent-gold">复盘报告</span>
          <span v-if="currentPost.review.verdict" class="text-xs text-text-secondary hidden sm:inline truncate max-w-[200px]">
            {{ currentPost.review.verdict }}
          </span>
        </button>
      </header>

      <!-- 正文工具栏 -->
      <div class="flex justify-end mb-3">
        <button
          @click="openPostFullscreen"
          class="text-xs text-text-secondary hover:text-accent-blue transition-colors flex items-center gap-1"
          title="全屏阅读"
        >
          <span>⛶</span> 全屏阅读
        </button>
      </div>

      <!-- Markdown 渲染 -->
      <MarkdownRenderer :content="body" :base-path="currentPost?.path" />

      <!-- 帖子评论区 -->
      <GiscusComments :term="`${symbolCode}/${dateParam}`" />

      <!-- 笔记列表 -->
      <NoteList
        ref="noteListRef"
        :notes="currentNotes"
        :symbol-code="symbolCode"
        :date-param="dateParam"
        @fullscreen="handleNoteFullscreen"
      />

      <!-- 上/下篇导航 -->
      <nav class="mt-10 pt-6 border-t border-border-subtle flex items-center justify-between gap-4">
        <router-link
          v-if="prevPost"
          :to="`/${symbolCode}/${prevPost.folder}`"
          class="text-sm text-text-secondary hover:text-accent-blue transition-colors"
        >
          ← {{ prevPost.folder }}
        </router-link>
        <span v-else />

        <router-link
          v-if="nextPost"
          :to="`/${symbolCode}/${nextPost.folder}`"
          class="text-sm text-text-secondary hover:text-accent-blue transition-colors"
        >
          {{ nextPost.folder }} →
        </router-link>
        <span v-else />
      </nav>
      </div>

      <!-- TOC 悬浮导航 -->
      <TableOfContents :content-ref="contentRef" :refresh-signal="tocRefreshSignal" />

      <!-- 全屏查看器 -->
      <FullscreenViewer
        :visible="fullscreenVisible"
        :title="fullscreenTitle"
        @close="closeFullscreen"
      >
        <MarkdownRenderer :content="fullscreenContent" />
      </FullscreenViewer>
    </template>
  </div>
  </div>
</template>
