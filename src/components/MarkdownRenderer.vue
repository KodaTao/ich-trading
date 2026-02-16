<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { renderMarkdown } from '../utils/markdown.js'
import 'highlight.js/styles/atom-one-dark.css'
import '../styles/markdown-theme.css'

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
})

const htmlContent = ref('')
const containerRef = ref(null)

async function renderMermaid() {
  if (!containerRef.value) return
  const mermaidElements = containerRef.value.querySelectorAll('.mermaid')
  if (mermaidElements.length === 0) return

  try {
    const mermaid = (await import('mermaid')).default
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        primaryColor: '#1a1a2e',
        primaryTextColor: '#e0e0e0',
        primaryBorderColor: '#00d4ff',
        lineColor: '#00d4ff',
        secondaryColor: '#12121a',
        tertiaryColor: '#0a0a0f',
      },
    })
    await mermaid.run({ nodes: mermaidElements })
  } catch {
    // mermaid 渲染失败，静默处理
  }
}

watch(
  () => props.content,
  async (newContent) => {
    if (!newContent) {
      htmlContent.value = ''
      return
    }
    htmlContent.value = renderMarkdown(newContent)
    await nextTick()
    renderMermaid()
  },
  { immediate: true }
)
</script>

<template>
  <div
    ref="containerRef"
    class="markdown-body"
    v-html="htmlContent"
  />
</template>
