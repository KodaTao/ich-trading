<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGitHub } from '../composables/useGitHub.js'
import { useUpdateChecker } from '../composables/useUpdateChecker.js'
import { parseFrontmatter } from '../utils/frontmatter.js'
import MarkdownRenderer from '../components/MarkdownRenderer.vue'
import NoteList from '../components/NoteList.vue'

const route = useRoute()
const router = useRouter()
const { getSymbol, loadMarkdown } = useGitHub()
const { markSymbolRead } = useUpdateChecker()

const symbolCode = computed(() => route.params.symbol)
const dateParam = computed(() => route.params.date)
const symbol = computed(() => getSymbol(symbolCode.value))

const loading = ref(false)
const error = ref(null)
const body = ref('')
const attributes = ref({})
const noteListRef = ref(null)
const pageTopRef = ref(null)

// 上一篇 / 下一篇导航
const currentIndex = computed(() => {
  if (!symbol.value?.posts) return -1
  return symbol.value.posts.findIndex((p) => p.date === dateParam.value)
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
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(loadContent)
watch(() => route.params, loadContent)
</script>

<template>
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
          <span class="text-text-secondary text-xs font-mono">{{ dateParam }}</span>
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
      </header>

      <!-- Markdown 渲染 -->
      <MarkdownRenderer :content="body" />

      <!-- 笔记列表 -->
      <NoteList ref="noteListRef" :notes="currentNotes" />

      <!-- 上/下篇导航 -->
      <nav class="mt-10 pt-6 border-t border-border-subtle flex items-center justify-between gap-4">
        <router-link
          v-if="prevPost"
          :to="`/${symbolCode}/${prevPost.date}`"
          class="text-sm text-text-secondary hover:text-accent-blue transition-colors"
        >
          ← {{ prevPost.date }}
        </router-link>
        <span v-else />

        <router-link
          v-if="nextPost"
          :to="`/${symbolCode}/${nextPost.date}`"
          class="text-sm text-text-secondary hover:text-accent-blue transition-colors"
        >
          {{ nextPost.date }} →
        </router-link>
        <span v-else />
      </nav>
    </template>
  </div>
</template>
