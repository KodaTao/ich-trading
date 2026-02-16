<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
})

const emit = defineEmits(['close'])

const containerRef = ref(null)

watch(
  () => props.visible,
  async (val) => {
    if (val) {
      await enterFullscreen()
    } else {
      exitFullscreen()
    }
  }
)

async function enterFullscreen() {
  const el = containerRef.value
  if (!el) return
  try {
    await el.requestFullscreen()
  } catch (err) {
    console.warn('Fullscreen API 不可用:', err)
  }
}

function exitFullscreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen()
  }
}

function handleClose() {
  emit('close')
}

// 监听用户按 Esc 退出全屏
function onFullscreenChange() {
  if (!document.fullscreenElement && props.visible) {
    emit('close')
  }
}

// 挂载/卸载事件监听
if (typeof document !== 'undefined') {
  document.addEventListener('fullscreenchange', onFullscreenChange)
}

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  if (document.fullscreenElement === containerRef.value) {
    document.exitFullscreen()
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="fullscreen-viewer"
    :class="{ 'fullscreen-viewer--active': visible }"
  >
    <!-- 全屏内容 -->
    <template v-if="visible">
      <!-- 顶部栏 -->
      <div
        class="sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-bg-primary/90 backdrop-blur-md border-b border-border-subtle"
      >
        <h2 class="text-base font-semibold text-text-primary truncate mr-4">
          {{ title }}
        </h2>
        <button
          @click="handleClose"
          class="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors text-lg"
          title="退出全屏 (Esc)"
        >
          ✕
        </button>
      </div>

      <!-- 内容区域 -->
      <div class="max-w-6xl mx-auto px-8 py-6 overflow-y-auto">
        <slot />
      </div>
    </template>
  </div>
</template>

<style scoped>
.fullscreen-viewer {
  display: none;
}

.fullscreen-viewer:fullscreen {
  display: block;
  background: var(--bg-primary, #0a0a1a);
  overflow-y: auto;
  height: 100vh;
}
</style>
