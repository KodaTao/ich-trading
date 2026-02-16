<script setup>
import { useGitHub } from '../composables/useGitHub.js'
import LatestPosts from '../components/LatestPosts.vue'
import SymbolGrid from '../components/SymbolGrid.vue'

const { state } = useGitHub()
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <!-- 加载中 -->
    <div v-if="state.loading" class="flex items-center justify-center py-20">
      <div class="text-text-secondary text-sm">加载中...</div>
    </div>

    <!-- 加载错误 -->
    <div v-else-if="state.error" class="flex flex-col items-center justify-center py-20 gap-3">
      <div class="text-red-400 text-sm">{{ state.error }}</div>
      <p class="text-text-secondary text-xs">请检查网络连接后刷新页面</p>
    </div>

    <!-- 内容 -->
    <template v-else>
      <SymbolGrid />
      <LatestPosts />
    </template>
  </div>
</template>
