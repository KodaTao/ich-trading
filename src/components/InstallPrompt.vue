<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showPrompt = ref(false)
let deferredPrompt = null

function handleBeforeInstall(e) {
  e.preventDefault()
  // 已经安装过或用户关闭过，不再提示
  if (localStorage.getItem('ich-install-dismissed')) return
  deferredPrompt = e
  showPrompt.value = true
}

async function install() {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const { outcome } = await deferredPrompt.userChoice
  if (outcome === 'accepted') {
    showPrompt.value = false
  }
  deferredPrompt = null
}

function dismiss() {
  showPrompt.value = false
  localStorage.setItem('ich-install-dismissed', '1')
  deferredPrompt = null
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstall)
  // 已安装时自动隐藏
  window.addEventListener('appinstalled', () => {
    showPrompt.value = false
    deferredPrompt = null
  })
})

onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
})
</script>

<template>
  <transition name="slide-up">
    <div
      v-if="showPrompt"
      class="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md bg-bg-secondary/95 backdrop-blur-md border border-accent-blue/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg shadow-accent-blue/10"
    >
      <div class="flex-1 min-w-0">
        <p class="text-sm text-text-primary font-medium">添加到主屏幕</p>
        <p class="text-xs text-text-secondary mt-0.5">获得更好的使用体验</p>
      </div>
      <button
        @click="install"
        class="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-accent-blue/20 text-accent-blue hover:bg-accent-blue/30 transition-colors"
      >
        安装
      </button>
      <button
        @click="dismiss"
        class="shrink-0 text-text-secondary hover:text-text-primary transition-colors text-lg leading-none"
      >
        &times;
      </button>
    </div>
  </transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
