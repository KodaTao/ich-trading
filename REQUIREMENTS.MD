# ICH Trading — 易经交易预测平台

## 项目需求与技术实现文档

> 一个基于 GitHub Pages 的纯前端项目，定期发布股票/加密货币的易经预测报告，用户可在线浏览预测内容并接收更新提示。

---

## 一、项目概述

### 1.1 项目定位

ICH Trading 是一个个人易经预测发布平台。作者（KodaTao）会定期对股票和加密货币进行易经分析，将预测报告以 Markdown 格式存放在 GitHub 仓库中。前端应用部署在 GitHub Pages 上，**只需部署一次**，后续所有预测内容通过 `raw.githubusercontent.com` 动态加载，无需重新构建前端。

### 1.2 核心特性

- 按 symbol（股票代码/加密货币代码）分类浏览预测报告
- Markdown 渲染，支持表格、代码块、Mermaid 图表
- 新内容更新提示（精确到具体哪些 symbol 有更新）
- 移动端优先的响应式设计
- 暗黑科技感主题
- Service Worker 离线缓存
- SEO 基础 Meta 信息

### 1.3 目标用户

以移动端用户为主，中文用户群体。

### 1.4 项目地址

- 仓库：`https://github.com/KodaTao/ich-trading`
- 访问地址：`https://kodatao.github.io/ich-trading/`

---

## 二、仓库目录结构

```
ich-trading/
├── src/                          # Vue 前端源码
│   ├── App.vue
│   ├── main.js
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   ├── HomeView.vue          # 首页
│   │   ├── SymbolView.vue        # 某个 symbol 的预测列表
│   │   └── PostView.vue          # 具体某篇预测详情
│   ├── components/
│   │   ├── LatestPosts.vue       # 首页顶部"最新预测"区域
│   │   ├── SymbolGrid.vue        # 首页 symbol 卡片网格
│   │   ├── PostCard.vue          # 预测卡片组件
│   │   ├── UpdateNotifier.vue    # 更新提示条组件
│   │   ├── MarkdownRenderer.vue  # Markdown 渲染组件
│   │   ├── TagFilter.vue         # 标签筛选组件
│   │   ├── NavBar.vue            # 顶部导航栏
│   │   └── ThemeToggle.vue       # 主题切换（预留，暂不实现）
│   ├── composables/
│   │   ├── useGitHub.js          # GitHub 数据加载逻辑
│   │   ├── useUpdateChecker.js   # 更新检测逻辑
│   │   └── useTheme.js           # 主题管理（预留）
│   ├── utils/
│   │   ├── markdown.js           # markdown-it 配置与初始化
│   │   └── frontmatter.js        # frontmatter 解析工具
│   ├── styles/
│   │   └── markdown-theme.css    # Markdown 渲染的暗黑主题样式
│   └── assets/
├── public/
│   ├── favicon.ico               # 用户自行提供
│   └── sw.js                     # Service Worker
├── predictions/                  # 预测文件目录（核心内容）
│   ├── BTC/
│   │   ├── meta.json             # symbol 元信息
│   │   ├── 2026-02-16.md
│   │   └── 2026-02-10.md
│   ├── ETH/
│   │   ├── meta.json
│   │   └── 2026-02-15.md
│   ├── AAPL/
│   │   ├── meta.json
│   │   └── 2026-02-14.md
│   └── ...
├── scripts/
│   └── generate-index.js         # 生成 index.json 的 Node.js 脚本
├── .github/
│   └── workflows/
│       └── deploy.yml            # GitHub Actions 工作流
├── index.json                    # 自动生成的索引文件（根目录，勿手动编辑）
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 三、数据结构设计

### 3.1 index.json（自动生成，勿手动编辑）

```json
{
  "lastUpdated": "2026-02-16T10:00:00Z",
  "symbols": {
    "BTC": {
      "name": "Bitcoin",
      "description": "比特币易经预测",
      "icon": "₿",
      "posts": [
        {
          "date": "2026-02-16",
          "title": "比特币周易预测",
          "subtitle": "乾卦九五，飞龙在天",
          "summary": "本周比特币走势强劲，卦象显示上行动力充足...",
          "format": "md",
          "path": "predictions/BTC/2026-02-16.md",
          "tags": ["看涨", "乾卦"]
        }
      ]
    }
  }
}
```

**字段说明：**

| 字段 | 来源 | 说明 |
|------|------|------|
| `lastUpdated` | 脚本生成时的 ISO 时间戳 | 前端判断是否有更新 |
| `symbols` | 遍历 `predictions/` 子目录 | 以 symbol 代码为 key |
| `symbols[x].name` | `meta.json` 的 `name` | symbol 全称 |
| `symbols[x].description` | `meta.json` 的 `description` | symbol 描述 |
| `symbols[x].icon` | `meta.json` 的 `icon` | 展示用 emoji/符号 |
| `posts[].date` | 文件名推断（`2026-02-16.md` → `2026-02-16`） | 预测日期 |
| `posts[].title` | frontmatter `title` | 正标题 |
| `posts[].subtitle` | frontmatter `subtitle` | 副标题（可选） |
| `posts[].summary` | frontmatter `summary` | 简介摘要（可选） |
| `posts[].format` | 文件扩展名 | 固定为 `"md"` |
| `posts[].path` | 相对仓库根目录路径 | 用于拼接 raw 链接 |
| `posts[].tags` | frontmatter `tags` | 标签数组（可选） |

### 3.2 meta.json（每个 symbol 目录下，手动维护）

```json
{
  "name": "Bitcoin",
  "description": "比特币易经预测",
  "icon": "₿"
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | 是 | symbol 全称 |
| `description` | 否 | symbol 描述，用于卡片展示 |
| `icon` | 否 | emoji 或符号字符，用于 UI 展示 |

### 3.3 Markdown frontmatter 格式

```markdown
---
title: "比特币周易预测"
subtitle: "乾卦九五，飞龙在天"
summary: "本周比特币走势强劲，卦象显示上行动力充足，但需注意变爻警示。"
tags: ["看涨", "乾卦", "变爻"]
---

## 卦象分析

正文内容...
```

| 字段 | 必填 | 类型 | 说明 |
|------|------|------|------|
| `title` | 是 | string | 正标题 |
| `subtitle` | 否 | string | 副标题，通常为卦象名 |
| `summary` | 否 | string | 摘要，用于列表页卡片展示 |
| `tags` | 否 | string[] | 标签数组，用于筛选 |

`date` 和 `symbol` 从目录结构和文件名自动推断，**不需要**在 frontmatter 中声明。

---

## 四、前端技术方案

### 4.1 技术栈

| 类别 | 选型 | 说明 |
|------|------|------|
| 框架 | Vue 3 (Composition API) | `<script setup>` 语法 |
| 构建工具 | Vite | Vue 3 官方推荐 |
| 路由 | Vue Router 4（hash 模式） | 避免 GitHub Pages 刷新 404 |
| CSS | Tailwind CSS 3 | 工具类优先，暗黑主题管理方便 |
| Markdown 渲染 | markdown-it | 插件生态丰富，扩展性强 |
| 代码高亮 | highlight.js | 配合 markdown-it，暗色主题 |
| 图表 | mermaid | 流程图、时序图等 |
| frontmatter 解析 | gray-matter（脚本端） | 生成 index.json 时使用 |

### 4.2 路由设计

| 路由 | 页面组件 | 说明 |
|------|----------|------|
| `/#/` | HomeView | 首页：最新 5 条 + symbol 卡片网格 |
| `/#/:symbol` | SymbolView | 某 symbol 的全部预测（时间倒序） |
| `/#/:symbol/:date` | PostView | 具体预测详情页 |

### 4.3 数据加载策略

**核心原则：全部通过 `raw.githubusercontent.com` 拉取，不依赖 GitHub REST API，无速率限制。**

```
Base URL: https://raw.githubusercontent.com/KodaTao/ich-trading/main/
```

加载流程：

1. **应用启动**：fetch `{baseURL}/index.json`（带时间戳参数绕过 CDN 缓存），获取全部索引，缓存到 Vue reactive state
2. **进入 symbol 页面**：索引中已有 posts 列表，无需额外请求
3. **进入预测详情页**：根据 `posts[].path` 拼接 raw URL，fetch `.md` 文件内容，前端解析并渲染
4. **meta.json 数据**：在生成 `index.json` 时已被脚本合并，前端无需单独请求

`raw.githubusercontent.com` 有约 5 分钟的 CDN 缓存，新 push 的内容可能有短暂延迟。对于 `index.json`，通过追加 `?t={timestamp}` 参数绕过缓存；对于 markdown 文件（发布后不再修改），利用 CDN 缓存提升加载速度。

### 4.4 Markdown 渲染方案

使用 `markdown-it` 作为核心渲染引擎：

```javascript
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

const md = new MarkdownIt({
  html: false,        // 禁用原生 HTML（安全考虑）
  linkify: true,      // 自动识别链接
  typographer: true,  // 智能标点
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(str, { language: lang }).value
    }
    return ''
  }
})
```

**Mermaid 支持：**

- markdown-it 渲染时，检测语言标记为 `mermaid` 的代码块
- 输出为 `<div class="mermaid">...</div>` 而非 `<pre><code>`
- 渲染完成后（Vue nextTick），调用 `mermaid.run()` 渲染图表
- mermaid 配置暗黑主题（`theme: 'dark'`）

**Markdown 渲染样式要求：**

- 所有内容包裹在 `.markdown-body` 容器中
- 覆盖以下元素的暗黑主题样式：h1-h6、段落、有序/无序列表、表格、代码块（行内/块级）、引用块、分割线、链接、图片、mermaid 容器
- 表格响应式：移动端 `overflow-x: auto` 横向滚动
- 代码块高亮使用 highlight.js 暗色主题（推荐 `atom-one-dark`）

### 4.5 Frontmatter 前端处理

前端拉取的 markdown 包含 frontmatter，渲染前需剥离：

```javascript
function parseFrontmatter(rawContent) {
  const match = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) return { attributes: {}, body: rawContent }
  return {
    attributes: parseYaml(match[1]),
    body: match[2]
  }
}
```

frontmatter 数据用于详情页 meta 区域（标题、副标题等）。虽然 `index.json` 中已有这些信息，但从源文件解析可确保数据一致性。

---

## 五、更新提示系统

### 5.1 应用层检测（精确提示）

```
流程：
1. 用户首次访问
   → fetch index.json
   → 将每个 symbol 的最新 post date 存入 localStorage
   key: "ich-read-state"
   value: {
     "lastChecked": "2026-02-16T10:00:00Z",
     "symbols": {
       "BTC": "2026-02-16",
       "ETH": "2026-02-15"
     }
   }

2. 后续访问
   → fetch 最新 index.json
   → 对比 localStorage 中的 read-state
   → 某 symbol 有新 post（date 比记录的更新） → 标记"有更新"
   → 出现全新 symbol（localStorage 中不存在） → 标记"新 symbol"

3. 有更新时
   → 顶部弹出 UpdateNotifier
   → 具体标出哪些 symbol 更新，如 "BTC、ETH 有新的预测发布"
   → 点击"查看" → 跳转首页最新预测区域，更新 read-state
   → 点击"关闭" → 仅关闭提示条，不更新 read-state（下次仍提示）

4. 用户阅读某篇预测后
   → 更新该 symbol 在 localStorage 中的 read-state
```

### 5.2 Service Worker 层（离线 + 静态资源）

```
缓存分组与策略：
┌─────────────────┬───────────────┬──────────────────────────────────────┐
│ 缓存组           │ 策略          │ 内容                                  │
├─────────────────┼───────────────┼──────────────────────────────────────┤
│ static-assets   │ Cache First   │ HTML、JS、CSS、字体                    │
│ api-cache       │ Network First │ index.json                           │
│ content-cache   │ Network First │ markdown 文件                         │
└─────────────────┴───────────────┴──────────────────────────────────────┘

更新机制：
- SW 文件变化时，浏览器自动安装新版本
- 新 SW 安装完成后，通过 postMessage 发送 'SW_UPDATED' 通知前端
- 前端收到通知后提示用户刷新页面
- 仅前端代码变更（重新部署）时触发 SW 更新
- 预测内容更新通过应用层 index.json 对比处理，不依赖 SW

离线体验：
- 已访问的页面和预测内容会被缓存
- 离线时可浏览缓存内容
- 访问未缓存内容时显示友好离线提示
```

---

## 六、UI / 交互设计

### 6.1 设计风格：暗黑科技感

**整体基调：**

- 深色背景：`#0a0a0f`（主背景）、`#12121a`（次级背景）
- 主强调色：科技蓝/青色（`#00d4ff`），用于链接、按钮、高亮
- 辅助强调色：淡金色（`#c9a84c`），呼应易经/传统文化元素
- 文字：高对比浅灰 `#e0e0e0`（主文字）+ `#888`（次级文字）
- 卡片/区块：半透明深色背景 + 微妙边框（`rgba(255,255,255,0.06)`）
- 适度 glow 效果（box-shadow 带主强调色）
- 毛玻璃效果（backdrop-blur）用于导航栏

**字体方案：**

- 中文正文：系统字体栈 `"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`
- 英文/数字标题：科技感字体如 `"Orbitron"` 或 `"Rajdhani"`（通过 Google Fonts 引入）
- 代码：`"JetBrains Mono"` 或 `"Fira Code"`

**Tailwind 配置：**

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#12121a',
        'bg-card': 'rgba(255,255,255,0.03)',
        'accent-blue': '#00d4ff',
        'accent-gold': '#c9a84c',
        'text-primary': '#e0e0e0',
        'text-secondary': '#888888',
        'border-subtle': 'rgba(255,255,255,0.06)',
      },
      fontFamily: {
        display: ['"Orbitron"', '"Rajdhani"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        body: ['"PingFang SC"', '"Hiragino Sans GB"', '"Microsoft YaHei"', 'sans-serif'],
      }
    }
  }
}
```

### 6.2 页面结构

#### 6.2.1 全局导航栏（NavBar）

- 固定顶部（sticky）
- 左侧：站名 "ICH Trading"（使用 display 字体）
- 右侧：返回首页按钮（非首页时显示）
- 半透明背景 + `backdrop-blur` 毛玻璃效果
- 移动端高度约 56px

#### 6.2.2 更新提示条（UpdateNotifier）

- 位于导航栏下方
- 显示具体更新的 symbol，如 "BTC、ETH 有新的预测发布"
- "查看"按钮 + "关闭"按钮
- 主强调色边框/背景，视觉醒目
- 从顶部滑入动画

#### 6.2.3 首页（HomeView）

**区域一：最新预测（LatestPosts）**

- 标题："最新预测"
- 展示全局最新 **5 条**预测，按日期倒序
- 每条为 PostCard 卡片：symbol 代码 + 全称、日期、title、subtitle、summary（截断显示）、tags
- 点击跳转 `/#/{symbol}/{date}`

**区域二：分类浏览（SymbolGrid）**

- 标题："分类浏览"
- 卡片网格展示所有 symbol
- 每张卡片：icon、symbol 代码、全称、最新预测日期、预测总数
- 有未读更新时卡片右上角显示高亮小圆点
- 点击跳转 `/#/{symbol}`
- 移动端每行 2 张；桌面端每行 3-4 张

#### 6.2.4 Symbol 预测列表页（SymbolView）

- 顶部：symbol 信息区（icon、代码、全称、描述、预测总数）
- 标签筛选栏（TagFilter）：点击标签筛选预测，多选逻辑（交集或并集均可，建议并集）
- 主体：该 symbol 全部预测，按日期倒序，PostCard 卡片列表
- 移动端单列；桌面端可单列或双列

#### 6.2.5 预测详情页（PostView）

- 顶部 meta 区：symbol、日期、title、subtitle、tags
- 主体：Markdown 渲染区域（`.markdown-body` 容器）
- 底部：上一篇 / 下一篇导航（同一 symbol 内按日期）
- 移动端全宽，适当 padding
- 桌面端内容区最大宽度 768px，居中

### 6.3 响应式设计

- **移动优先**：先设计移动端，再扩展桌面端
- 断点：`sm: 640px`、`md: 768px`、`lg: 1024px`
- 触摸友好：可点击区域最小 44×44px
- 表格：小屏 `overflow-x: auto` 横向滚动
- 代码块：小屏横向滚动，不强制换行
- 正文字体：移动端至少 16px

### 6.4 动画与过渡

- 页面切换：Vue Router transition，淡入 + 轻微 `translateY`
- 卡片列表：依次淡入（staggered animation delay）
- 卡片 hover（桌面端）：轻微上移 + glow 边框
- UpdateNotifier：从顶部滑入
- Markdown 内容：渲染完成后淡入
- 性能要求：所有动画仅使用 `transform` 和 `opacity`

---

## 七、脚本设计

### 7.1 generate-index.js

语言：Node.js

依赖：`gray-matter`

```
输入：predictions/ 目录
输出：根目录 index.json

执行方式：npm run generate-index（push 前手动运行）
```

**核心逻辑：**

```
1. 读取 predictions/ 下所有子目录 → symbol 列表
2. 对每个 symbol 目录：
   a. 读取 meta.json → name, description, icon
   b. 扫描目录下所有 .md 文件
   c. 对每个 .md 文件：
      - gray-matter 解析 frontmatter → title, subtitle, summary, tags
      - 文件名提取 date（如 2026-02-16.md → 2026-02-16）
      - 记录 path（相对仓库根目录）
      - format 固定为 "md"
   d. posts 按 date 倒序排列
3. lastUpdated = 当前 ISO 时间戳
4. 写入 index.json（2 空格缩进，UTF-8）
```

**容错处理：**

- meta.json 不存在时：name 默认为目录名，description 和 icon 为空
- frontmatter 缺少 title 时：尝试从正文第一个 `# ` 标题提取，仍无则用文件名
- frontmatter 缺少 subtitle / summary / tags 时：对应字段为 null 或空数组
- 非 .md 文件和 meta.json 应被忽略

### 7.2 npm scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "generate-index": "node scripts/generate-index.js"
  }
}
```

---

## 八、GitHub Actions 部署方案

### 8.1 触发策略

只有前端源码变更时才触发构建部署。仅预测内容变更时不触发（前端从 main 分支 raw 链接动态加载）。

### 8.2 deploy.yml

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'src/**'
      - 'public/**'
      - 'index.html'
      - 'vite.config.js'
      - 'tailwind.config.js'
      - 'postcss.config.js'
      - 'package.json'
      - 'package-lock.json'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy to gh-pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 8.3 GitHub Pages 配置

- Settings → Pages → Source 设为 `gh-pages` 分支根目录
- Vite 构建输出到 `dist/`，Actions 推送到 `gh-pages`

---

## 九、Vite 构建配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/ich-trading/',   // GitHub Pages 子路径，必须设置
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
```

---

## 十、Service Worker 设计

### 10.1 缓存策略

```
Cache Name: ich-trading-v1

static-assets  → Cache First    → HTML、JS、CSS、字体
api-cache      → Network First  → index.json
content-cache  → Network First  → markdown 文件
```

### 10.2 更新与离线

- SW 文件变化时浏览器自动安装新版本
- 新版本就绪后 postMessage 通知前端，提示刷新
- 已访问内容离线可用
- 未缓存内容离线时显示友好提示

---

## 十一、关键实现细节汇总

### 11.1 Raw URL 拼接

```javascript
const REPO_OWNER = 'KodaTao'
const REPO_NAME = 'ich-trading'
const BRANCH = 'main'
const RAW_BASE = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BRANCH}`

// 索引（绕过 CDN 缓存）
const indexURL = `${RAW_BASE}/index.json?t=${Date.now()}`

// 预测文件（利用 CDN 缓存）
const postURL = `${RAW_BASE}/${post.path}`
```

### 11.2 Mermaid 渲染时机

```
1. markdown-it 渲染 markdown → HTML 字符串
2. v-html 插入 DOM
3. Vue nextTick 后查找所有 .mermaid 元素
4. 调用 mermaid.run({ nodes }) 渲染
5. 路由切换时清理旧 mermaid 实例
```

### 11.3 localStorage 结构

```javascript
// key: "ich-read-state"
{
  "lastChecked": "2026-02-16T10:00:00Z",
  "symbols": {
    "BTC": "2026-02-16",
    "ETH": "2026-02-15"
  }
}
```

### 11.4 SEO Meta（index.html）

```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>ICH Trading — 易经交易预测</title>
<meta name="description" content="基于易经的股票与加密货币交易预测平台" />
<meta name="keywords" content="易经,周易,股票预测,加密货币,Bitcoin,交易" />
<meta name="author" content="KodaTao" />
<meta property="og:title" content="ICH Trading — 易经交易预测" />
<meta property="og:description" content="基于易经的股票与加密货币交易预测平台" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://kodatao.github.io/ich-trading/" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="ICH Trading — 易经交易预测" />
<meta name="twitter:description" content="基于易经的股票与加密货币交易预测平台" />
<meta name="language" content="zh-CN" />
```

---

## 十二、发布流程

### 12.1 首次部署

```bash
# 创建仓库并初始化项目
npm create vite@latest ich-trading -- --template vue
cd ich-trading

# 安装依赖
npm install vue-router@4 markdown-it highlight.js mermaid
npm install -D tailwindcss postcss autoprefixer gray-matter
npx tailwindcss init -p

# 开发完成后
npm run build
git push   # GitHub Actions 自动部署到 gh-pages
```

### 12.2 日常发布预测

```bash
# 1. 新 symbol 需先创建目录和 meta.json
mkdir -p predictions/TSLA
echo '{"name":"Tesla","description":"特斯拉易经预测","icon":"⚡"}' > predictions/TSLA/meta.json

# 2. 编写预测（含 frontmatter）
# predictions/TSLA/2026-02-16.md

# 3. 生成索引
npm run generate-index

# 4. 提交推送（不触发前端重新构建）
git add .
git commit -m "prediction: TSLA 2026-02-16"
git push
```

用户刷新页面即可看到新内容，UpdateNotifier 会提示有更新。

---

## 十三、浏览器通知（Browser Notification）

### 13.1 功能概述

利用浏览器原生 Notification API，当有新预测发布时，即使页面在后台也能推送通知给用户。

### 13.2 触发时机

1. **页面打开/刷新时**：检测到新预测发布，弹出浏览器通知
2. **后台定时轮询**：页面打开后，每 5 分钟轮询 index.json，检测到新内容时弹出通知（即使页面在后台标签页）

### 13.3 权限请求

- 页面加载后**自动请求**通知权限（`Notification.requestPermission()`）
- 用户授权后才能发送通知
- 用户拒绝后不再重复请求

### 13.4 通知内容

- **标题**：`ICH Trading — 新预测发布`
- **正文**：具体更新的 symbol，如 `BTC、ETH 有新的预测发布`
- **点击通知**：聚焦/打开页面，跳转首页

### 13.5 技术实现

- 新增 `composables/useNotification.js` — 封装通知权限请求、发送通知逻辑
- 修改 `useUpdateChecker.js` — 检测到更新时调用通知
- 修改 `App.vue` — 启动时请求通知权限 + 启动定时轮询
- 轮询间隔：5 分钟（300000ms），使用 `setInterval`
- 轮询时对比 index.json 的 `lastUpdated` 字段，变化时才进行详细对比

---

## 十四、后续扩展（暂不实现，架构预留）

- **多主题切换**：已预留 `ThemeToggle` 组件和 `useTheme` composable（古风水墨、简洁明亮等）
- **搜索功能**：前端内存中对 index.json 的 title / summary / tags 全文搜索
- **RSS Feed**：脚本生成 `feed.xml`
- **评论系统**：集成 Giscus（基于 GitHub Discussions）
- **预测准确率追踪**：frontmatter 增加 `result` 字段
- **多语言**：易经术语英文对照