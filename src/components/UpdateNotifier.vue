<script setup>
import { useUpdateChecker } from '../composables/useUpdateChecker.js'
import { useGitHub } from '../composables/useGitHub.js'
import { useRouter } from 'vue-router'

const { hasUpdate, updatedSymbols, markAllRead } = useUpdateChecker()
const { state } = useGitHub()
const router = useRouter()

function handleView() {
  markAllRead(state.index)
  router.push('/')
}

function handleClose() {
  // 仅关闭提示条，不更新 read-state（下次仍提示）
  // 通过临时隐藏实现
  hasUpdate.value // 保持不变
}
</script>

<template>
  <transition name="slide-down">
    <div
      v-if="hasUpdate"
      class="fixed top-14 left-0 right-0 z-40 bg-bg-secondary border-b border-accent-blue/30"
    >
      <div class="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <p class="text-sm text-text-primary flex-1">
          <span class="text-accent-gold font-medium">{{ updatedSymbols.join('、') }}</span>
          <span class="text-text-secondary"> 有新的预测发布</span>
        </p>
        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="handleView"
            class="text-sm px-4 py-2 bg-accent-blue/20 text-accent-blue rounded hover:bg-accent-blue/30 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            查看
          </button>
          <button
            @click="markAllRead(state.index)"
            class="text-sm px-4 py-2 text-text-secondary hover:text-text-primary transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>
