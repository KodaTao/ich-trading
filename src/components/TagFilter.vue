<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:selected'])

const selectedTags = ref([])

function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(idx, 1)
  }
  emit('update:selected', [...selectedTags.value])
}

function isSelected(tag) {
  return selectedTags.value.includes(tag)
}

function clearAll() {
  selectedTags.value = []
  emit('update:selected', [])
}
</script>

<template>
  <div v-if="tags.length" class="flex flex-wrap items-center gap-2 mb-4">
    <button
      @click="clearAll"
      class="text-xs px-3 py-1 rounded-full transition-colors"
      :class="
        selectedTags.length === 0
          ? 'bg-accent-blue/20 text-accent-blue'
          : 'bg-bg-card text-text-secondary hover:text-text-primary border border-border-subtle'
      "
    >
      全部
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      @click="toggleTag(tag)"
      class="text-xs px-3 py-1 rounded-full transition-colors"
      :class="
        isSelected(tag)
          ? 'bg-accent-blue/20 text-accent-blue'
          : 'bg-bg-card text-text-secondary hover:text-text-primary border border-border-subtle'
      "
    >
      {{ tag }}
    </button>
  </div>
</template>
