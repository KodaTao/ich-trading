<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const isHome = computed(() => route.path === '/')
</script>

<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 md:px-6 bg-bg-primary/80 backdrop-blur-md border-b border-border-subtle"
  >
    <router-link to="/" class="flex items-center gap-2 no-underline">
      <img src="/favicon.png" alt="ICH Trading" class="w-7 h-7" />
      <span class="font-display text-xl font-bold text-accent-blue tracking-wider">
        ICH Trading
      </span>
    </router-link>

    <button
      v-if="!isHome"
      @click="router.push('/')"
      class="text-sm text-text-secondary hover:text-accent-blue transition-colors duration-200"
    >
      ← 返回首页
    </button>
  </nav>
</template>
