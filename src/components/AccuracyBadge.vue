<script setup>
import { computed } from 'vue'

const props = defineProps({
  accuracy: { type: Number, required: true },
  size: { type: String, default: 'sm' }, // 'sm' | 'md'
})

const colorClass = computed(() => {
  if (props.accuracy >= 80) return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  if (props.accuracy >= 50) return 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  return 'bg-red-500/15 text-red-400 border-red-500/30'
})

const sizeClass = computed(() => {
  return props.size === 'md' ? 'text-sm px-2.5 py-1' : 'text-xs px-2 py-0.5'
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full border font-mono font-medium"
    :class="[colorClass, sizeClass]"
  >
    {{ accuracy }}%
  </span>
</template>
