<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useGitHub } from '../composables/useGitHub.js'
import { useUpdateChecker } from '../composables/useUpdateChecker.js'
import PostCard from '../components/PostCard.vue'
import TagFilter from '../components/TagFilter.vue'

const route = useRoute()
const { getSymbol, state } = useGitHub()
const { markSymbolRead } = useUpdateChecker()

const symbolCode = computed(() => route.params.symbol)
const symbol = computed(() => getSymbol(symbolCode.value))

const selectedTags = ref([])

// 收集所有标签
const allTags = computed(() => {
  if (!symbol.value?.posts) return []
  const tagSet = new Set()
  for (const post of symbol.value.posts) {
    if (post.tags) {
      post.tags.forEach((t) => tagSet.add(t))
    }
  }
  return [...tagSet]
})

// 按标签筛选（并集）
const filteredPosts = computed(() => {
  if (!symbol.value?.posts) return []
  if (selectedTags.value.length === 0) return symbol.value.posts
  return symbol.value.posts.filter(
    (post) => post.tags && post.tags.some((t) => selectedTags.value.includes(t))
  )
})

// 进入页面时标记已读
if (symbol.value?.posts?.[0]?.date) {
  markSymbolRead(symbolCode.value, symbol.value.posts[0].date)
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <!-- 未找到 -->
    <div v-if="!state.loading && !symbol" class="text-center py-20">
      <p class="text-text-secondary">未找到 Symbol: {{ symbolCode }}</p>
    </div>

    <template v-else-if="symbol">
      <!-- Symbol 信息区 -->
      <div class="mb-6">
        <div class="flex items-center gap-3 mb-2">
          <span class="text-4xl">{{ symbol.icon || '📊' }}</span>
          <div>
            <h1 class="font-display text-xl font-bold text-accent-blue">
              {{ symbol.code }}
            </h1>
            <p class="text-text-secondary text-sm">{{ symbol.name }}</p>
          </div>
        </div>
        <p v-if="symbol.description" class="text-text-secondary text-sm mt-1">
          {{ symbol.description }}
        </p>
        <p class="text-text-secondary text-xs mt-2">
          共 {{ symbol.posts?.length || 0 }} 篇预测
        </p>
      </div>

      <!-- 标签筛选 -->
      <TagFilter :tags="allTags" @update:selected="selectedTags = $event" />

      <!-- 预测列表 -->
      <div class="flex flex-col gap-3">
        <PostCard
          v-for="(post, index) in filteredPosts"
          :key="post.folder"
          :symbol-code="symbol.code"
          :symbol-name="symbol.name"
          :symbol-icon="symbol.icon"
          :date="post.date"
          :folder="post.folder"
          :title="post.title"
          :subtitle="post.subtitle"
          :summary="post.summary"
          :tags="post.tags"
          :show-symbol="false"
          :style="{ animationDelay: `${index * 60}ms` }"
          class="animate-fade-in"
        />
      </div>

      <div v-if="filteredPosts.length === 0" class="text-center py-10">
        <p class="text-text-secondary text-sm">没有匹配的预测</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeInUp 0.4s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
