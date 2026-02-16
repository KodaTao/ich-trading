<script setup>
import { computed } from 'vue'
import { useGitHub } from '../composables/useGitHub.js'
import PostCard from './PostCard.vue'

const { getLatestPosts, initialized } = useGitHub()

const posts = computed(() => getLatestPosts(5))
</script>

<template>
  <section v-if="initialized" class="mb-10">
    <h2 class="text-lg font-display font-semibold text-text-primary mb-4 tracking-wide">
      最新预测
    </h2>
    <div class="flex flex-col gap-3">
      <PostCard
        v-for="(post, index) in posts"
        :key="`${post.symbolCode}-${post.folder}`"
        :symbol-code="post.symbolCode"
        :symbol-name="post.symbolName"
        :symbol-icon="post.symbolIcon"
        :date="post.date"
        :folder="post.folder"
        :title="post.title"
        :subtitle="post.subtitle"
        :summary="post.summary"
        :tags="post.tags"
        :style="{ animationDelay: `${index * 60}ms` }"
        class="animate-fade-in"
      />
    </div>
  </section>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeInUp 0.4s ease-out both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in {
    animation: none !important;
    opacity: 1;
  }
}
</style>
