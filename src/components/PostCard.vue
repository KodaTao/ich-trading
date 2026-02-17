<script setup>
import { useRouter } from 'vue-router'
import AccuracyBadge from './AccuracyBadge.vue'

const props = defineProps({
  symbolCode: String,
  symbolName: String,
  symbolIcon: String,
  date: String,
  folder: String,
  title: String,
  subtitle: String,
  summary: String,
  tags: {
    type: Array,
    default: () => [],
  },
  review: {
    type: Object,
    default: null,
  },
  showSymbol: {
    type: Boolean,
    default: true,
  },
})

const router = useRouter()

function navigateToPost() {
  router.push(`/${props.symbolCode}/${props.folder}`)
}
</script>

<template>
  <article
    @click="navigateToPost"
    class="group cursor-pointer bg-bg-card border border-border-subtle rounded-lg p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-blue/20 hover:shadow-[0_0_20px_rgba(0,212,255,0.06)]"
  >
    <!-- 顶部：Symbol + 日期 -->
    <div class="flex items-center justify-between mb-2">
      <div v-if="showSymbol" class="flex items-center gap-2">
        <span v-if="symbolIcon" class="text-lg">{{ symbolIcon }}</span>
        <span class="text-accent-blue font-display text-sm font-semibold">{{ symbolCode }}</span>
        <span v-if="symbolName" class="text-text-secondary text-xs">{{ symbolName }}</span>
      </div>
      <span class="text-text-secondary text-xs font-mono">{{ folder }}</span>
    </div>

    <!-- 标题 -->
    <div class="flex items-start gap-2 mb-1">
      <h3 class="text-text-primary font-medium text-base group-hover:text-accent-blue transition-colors flex-1">
        {{ title }}
      </h3>
      <AccuracyBadge v-if="review" :accuracy="review.accuracy" class="shrink-0 mt-0.5" />
    </div>

    <!-- 副标题 -->
    <p v-if="subtitle" class="text-accent-gold text-sm mb-2">
      {{ subtitle }}
    </p>

    <!-- 摘要 -->
    <p v-if="summary" class="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-3">
      {{ summary }}
    </p>

    <!-- 标签 -->
    <div v-if="tags && tags.length" class="flex flex-wrap gap-1.5">
      <span
        v-for="tag in tags"
        :key="tag"
        class="text-xs px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue/80"
      >
        {{ tag }}
      </span>
    </div>
  </article>
</template>
