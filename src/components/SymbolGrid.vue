<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGitHub } from '../composables/useGitHub.js'
import { useUpdateChecker } from '../composables/useUpdateChecker.js'

const router = useRouter()
const { getSymbols, initialized } = useGitHub()
const { isSymbolUpdated } = useUpdateChecker()

const symbols = computed(() => getSymbols())

function navigateToSymbol(code) {
  router.push(`/${code}`)
}
</script>

<template>
  <section v-if="initialized">
    <h2 class="text-lg font-display font-semibold text-text-primary mb-4 tracking-wide">
      分类浏览
    </h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      <div
        v-for="(symbol, index) in symbols"
        :key="symbol.code"
        @click="navigateToSymbol(symbol.code)"
        class="relative group cursor-pointer bg-bg-card border border-border-subtle rounded-lg p-4 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-blue/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.06)] animate-fade-in"
        :style="{ animationDelay: `${index * 80}ms` }"
      >
        <!-- 未读标记 -->
        <div
          v-if="isSymbolUpdated(symbol.code)"
          class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(0,212,255,0.6)]"
        />

        <!-- Icon -->
        <div class="text-3xl mb-2">{{ symbol.icon || '📊' }}</div>

        <!-- Symbol 代码 -->
        <div class="font-display text-accent-blue font-semibold text-sm mb-0.5">
          {{ symbol.code }}
        </div>

        <!-- 全称 -->
        <div class="text-text-secondary text-xs mb-2">{{ symbol.name }}</div>

        <!-- 统计 -->
        <div class="text-text-secondary text-xs flex items-center justify-center gap-2">
          <span v-if="symbol.posts?.length">{{ symbol.posts.length }} 篇预测</span>
          <span v-if="symbol.posts?.[0]?.date" class="font-mono">
            {{ symbol.posts[0].date }}
          </span>
        </div>
      </div>
    </div>
  </section>
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
