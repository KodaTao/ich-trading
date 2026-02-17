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

      <!-- 社区链接 -->
      <div class="mt-10 pt-6 border-t border-border-subtle text-center">
        <p class="text-text-secondary text-sm mb-3">欢迎加入 Telegram 频道，获取最新预测推送</p>
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="https://t.me/IChingTrading"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors"
          >
            📢 ICH Trading 频道
          </a>
          <a
            href="https://t.me/kodatao"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-accent-gold/10 text-accent-gold hover:bg-accent-gold/20 transition-colors"
          >
            💬 联系作者
          </a>
          <a
            href="/ich-trading/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors"
          >
            📡 RSS 订阅
          </a>
          <router-link
            to="/support"
            class="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          >
            ☕ 支持作者
          </router-link>
        </div>
      </div>
    </template>
  </div>
</template>
