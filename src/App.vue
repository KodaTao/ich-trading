<script setup>
import { onMounted, watch } from 'vue'
import NavBar from './components/NavBar.vue'
import UpdateNotifier from './components/UpdateNotifier.vue'
import { useGitHub } from './composables/useGitHub.js'
import { useUpdateChecker } from './composables/useUpdateChecker.js'

const { state, loadIndex } = useGitHub()
const { checkForUpdates } = useUpdateChecker()

onMounted(() => {
  loadIndex()
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
