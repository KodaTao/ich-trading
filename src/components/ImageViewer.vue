<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
const imgSrc = ref('')
const imgAlt = ref('')

function open(src, alt) {
  imgSrc.value = src
  imgAlt.value = alt || ''
  visible.value = true
}

function close() {
  visible.value = false
}

function handleKeydown(e) {
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

defineExpose({ open })
</script>

<template>
  <teleport to="body">
    <transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        @click.self="close"
      >
        <button
          @click="close"
          class="absolute top-4 right-4 text-white/70 hover:text-white text-2xl z-10 w-10 h-10 flex items-center justify-center"
        >
          &times;
        </button>
        <img
          :src="imgSrc"
          :alt="imgAlt"
          class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
        />
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
