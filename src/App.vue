<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import NavBar from './components/NavBar.vue'
import UpdateNotifier from './components/UpdateNotifier.vue'
import { useGitHub } from './composables/useGitHub.js'
import { useUpdateChecker } from './composables/useUpdateChecker.js'
import { useNotification } from './composables/useNotification.js'

const { state, loadIndex } = useGitHub()
const { checkForUpdates } = useUpdateChecker()
const { requestPermission } = useNotification()

const POLL_INTERVAL = 5 * 60 * 1000 // 5 分钟
let pollTimer = null

onMounted(async () => {
  loadIndex()

  // 自动请求通知权限
  await requestPermission()

  // 启动定时轮询
  pollTimer = setInterval(async () => {
    await loadIndex()
  }, POLL_INTERVAL)
})

onUnmounted(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
})

// 索引加载完成后检测更新
watch(
  () => state.index,
  (newIndex) => {
    if (newIndex) {
      checkForUpdates(newIndex)
    }
  }
)
</script>

<template>
  <div class="min-h-screen bg-bg-primary">
    <NavBar />
    <UpdateNotifier />
    <main class="pt-14">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>
