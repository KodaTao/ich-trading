<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

const props = defineProps({
  /** 内容容器的 ref，用于查询标题元素 */
  contentRef: {
    type: Object,
    default: null,
  },
  /** 触发 TOC 刷新的信号（内容或笔记加载完成时变化） */
  refreshSignal: {
    type: Number,
    default: 0,
  },
})

const isOpen = ref(false)
const activeId = ref('')
const tocGroups = ref([]) // [{ label, collapsed, items: [{ id, text, level, prefix }] }]

let observer = null

/**
 * 从容器中扫描标题，构建分组目录
 */
function buildToc() {
  if (!props.contentRef) {
    tocGroups.value = []
    return
  }

  const container = props.contentRef
  const groups = []

  // 正文区域：第一个 .markdown-body
  const postBody = container.querySelector('.markdown-body')
  if (postBody) {
    const headings = postBody.querySelectorAll('h1[id], h2[id], h3[id]')
    if (headings.length > 0) {
      const items = Array.from(headings).map((el) => ({
        id: el.id,
        text: el.textContent.trim(),
        level: parseInt(el.tagName.charAt(1)),
      }))
      groups.push({ label: '正文', collapsed: false, items })
    }
  }

  // 笔记区域：NoteList 内的每个 article
  const noteSection = container.querySelector('section') // NoteList 的 <section>
  if (noteSection) {
    const articles = noteSection.querySelectorAll('article')
    const noteItems = []

    articles.forEach((article) => {
      // 笔记标题（从 header 中的 h3 或时间提取）
      const noteTitle = article.querySelector('h3')
      const noteTime = article.querySelector('.font-mono')
      const label = noteTitle?.textContent?.trim() || noteTime?.textContent?.trim() || '笔记'

      // 使用 article 自身作为锚点
      if (!article.id) {
        article.id = `note-${noteItems.length}`
      }

      noteItems.push({
        id: article.id,
        text: label,
        level: 2,
        isNoteTitle: true,
      })

      // 笔记内标题
      const noteBody = article.querySelector('.markdown-body')
      if (noteBody) {
        const headings = noteBody.querySelectorAll('h1[id], h2[id], h3[id]')
        headings.forEach((el) => {
          noteItems.push({
            id: el.id,
            text: el.textContent.trim(),
            level: 3,
          })
        })
      }
    })

    if (noteItems.length > 0) {
      groups.push({ label: '📝 笔记', collapsed: false, items: noteItems })
    }
  }

  tocGroups.value = groups
  setupObserver()
}

/**
 * IntersectionObserver 跟踪当前可见标题
 */
function setupObserver() {
  if (observer) {
    observer.disconnect()
  }

  const allIds = tocGroups.value.flatMap((g) => g.items.map((i) => i.id))
  if (allIds.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
          break
        }
      }
    },
    { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
  )

  allIds.forEach((id) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
}

function toggleGroup(index) {
  tocGroups.value[index].collapsed = !tocGroups.value[index].collapsed
}

function scrollToHeading(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  isOpen.value = false
}

function toggleDrawer() {
  isOpen.value = !isOpen.value
}

function closeDrawer() {
  isOpen.value = false
}

// 内容变化时重新构建 TOC
watch(
  () => props.refreshSignal,
  () => {
    nextTick(buildToc)
  }
)

watch(
  () => props.contentRef,
  () => {
    nextTick(buildToc)
  }
)

onMounted(() => {
  nextTick(buildToc)
})

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})

const hasHeadings = ref(false)
watch(tocGroups, (groups) => {
  hasHeadings.value = groups.some((g) => g.items.length > 0)
})
</script>

<template>
  <!-- 悬浮按钮 -->
  <button
    v-if="hasHeadings"
    @click="toggleDrawer"
    class="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-bg-secondary border border-border-subtle flex items-center justify-center text-lg shadow-lg hover:border-accent-blue/30 hover:shadow-[0_0_16px_rgba(0,212,255,0.1)] transition-all duration-300 active:scale-95"
    :class="isOpen ? 'border-accent-blue/40 shadow-[0_0_16px_rgba(0,212,255,0.15)]' : ''"
    title="目录导航"
  >
    📑
  </button>

  <!-- 遮罩层 -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      @click="closeDrawer"
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
    />
  </Transition>

  <!-- 底部抽屉 -->
  <Transition name="slide-up">
    <div
      v-if="isOpen"
      class="fixed bottom-0 left-0 right-0 z-50 max-h-[60vh] bg-bg-secondary/95 backdrop-blur-md border-t border-border-subtle rounded-t-2xl overflow-hidden flex flex-col"
    >
      <!-- 抽屉头部 -->
      <div class="flex items-center justify-between px-5 py-3 border-b border-border-subtle shrink-0">
        <h3 class="text-text-primary font-semibold text-sm">📑 目录导航</h3>
        <button
          @click="closeDrawer"
          class="text-text-secondary hover:text-text-primary text-lg w-8 h-8 flex items-center justify-center"
        >
          ✕
        </button>
      </div>

      <!-- 目录内容 -->
      <div class="overflow-y-auto overscroll-contain px-5 py-3 flex-1">
        <div v-for="(group, gi) in tocGroups" :key="gi" class="mb-4 last:mb-0">
          <!-- 分组标题 -->
          <button
            @click="toggleGroup(gi)"
            class="flex items-center gap-1.5 text-text-secondary text-xs font-semibold uppercase tracking-wider mb-2 hover:text-text-primary transition-colors w-full text-left"
          >
            <span class="transition-transform duration-200" :class="group.collapsed ? '-rotate-90' : ''">▾</span>
            {{ group.label }}
          </button>

          <!-- 标题列表 -->
          <div v-show="!group.collapsed" class="flex flex-col gap-0.5">
            <button
              v-for="item in group.items"
              :key="item.id"
              @click="scrollToHeading(item.id)"
              class="text-left py-1.5 px-2 rounded text-sm transition-colors duration-200 truncate flex items-center"
              :class="[
                activeId === item.id
                  ? 'text-accent-blue bg-accent-blue/10'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5',
                item.isNoteTitle ? 'font-medium' : '',
              ]"
            >
              <!-- 层级指示 -->
              <span v-if="item.isNoteTitle" class="text-accent-gold mr-1.5 shrink-0">●</span>
              <template v-else-if="item.level === 2">
                <span class="text-accent-blue/50 mr-1.5 shrink-0 text-xs">■</span>
              </template>
              <template v-else-if="item.level >= 3">
                <span class="text-accent-gold/60 mr-1.5 shrink-0 text-xs ml-3">└</span>
              </template>
              <span class="truncate">{{ item.text }}</span>
            </button>
          </div>
        </div>

        <div v-if="tocGroups.length === 0" class="text-text-secondary text-sm text-center py-4">
          暂无标题
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 遮罩淡入 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 抽屉滑入 */
.slide-up-enter-active {
  transition: transform 0.3s cubic-bezier(0.33, 1, 0.68, 1);
}
.slide-up-leave-active {
  transition: transform 0.2s cubic-bezier(0.32, 0, 0.67, 0);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}
</style>
