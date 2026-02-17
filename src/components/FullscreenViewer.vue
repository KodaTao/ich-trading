<script setup>
import { watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
})

const emit = defineEmits(['close'])

// 锁定/恢复背景滚动
watch(
  () => props.visible,
  (val) => {
    document.body.style.overflow = val ? 'hidden' : ''
  }
)

function handleClose() {
  emit('close')
}

// ESC 关闭
function onKeydown(e) {
  if (e.key === 'Escape' && props.visible) {
    handleClose()
  }
}

document.addEventListener('keydown', onKeydown)

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <transition name="viewer-fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex flex-col"
        style="background: rgb(var(--bg-primary)); color: rgb(var(--text-primary))"
      >
        <!-- 顶部栏 -->
        <div
          class="shrink-0 flex items-center justify-between px-4 md:px-6 py-3 border-b border-border-subtle backdrop-blur-md"
          style="background: rgb(var(--bg-primary) / 0.9)"
        >
          <h2 class="text-base font-semibold text-text-primary truncate mr-4">
            {{ title }}
          </h2>
          <button
            @click="handleClose"
            class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors text-lg"
            title="关闭 (Esc)"
          >
            ✕
          </button>
        </div>

        <!-- 内容区域 -->
        <div class="flex-1 overflow-y-auto">
          <div class="max-w-4xl mx-auto px-4 md:px-8 py-6">
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.25s ease;
}

.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}
</style>
