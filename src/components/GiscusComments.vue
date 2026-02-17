<script setup>
import { computed } from 'vue'
import Giscus from '@giscus/vue'
import { useTheme } from '../composables/useTheme.js'

defineProps({
  term: { type: String, required: true },
})

const { theme } = useTheme()
const giscusTheme = computed(() => theme.value === 'light' ? 'light' : 'dark_dimmed')
</script>

<template>
  <div class="giscus-container mt-6 pt-6 border-t border-border-subtle">
    <Giscus
      repo="KodaTao/ich-trading"
      repo-id="R_kgDORRNs7A"
      category="General"
      category-id="DIC_kwDORRNs7M4C2jIE"
      mapping="specific"
      :term="term"
      strict="1"
      reactions-enabled="1"
      emit-metadata="0"
      input-position="bottom"
      :theme="giscusTheme"
      lang="zh-CN"
      loading="lazy"
    />
  </div>
</template>
