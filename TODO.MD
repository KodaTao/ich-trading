# ICH Trading 开发计划

## 阶段一：项目初始化与基础配置

- [x] 1.1 初始化 Vue 3 + Vite 项目
- [x] 1.2 安装依赖：vue-router@4、markdown-it、highlight.js、mermaid、tailwindcss、postcss、autoprefixer、gray-matter
- [x] 1.3 配置 Tailwind CSS（tailwind.config.js、postcss.config.js），包含暗黑主题色彩系统
- [x] 1.4 配置 Vite（vite.config.js），设置 `base: '/ich-trading/'`
- [x] 1.5 配置 Google Fonts 引入科技感字体（Orbitron、JetBrains Mono）
- [x] 1.6 设置 index.html（SEO Meta、favicon 引用、字体链接）
- [x] 1.7 创建基础目录结构（views/、components/、composables/、utils/、styles/、assets/）

## 阶段二：核心工具模块

- [x] 2.1 编写 `utils/markdown.js` — markdown-it 初始化与配置（highlight.js 高亮、Mermaid 代码块特殊处理）
- [x] 2.2 编写 `utils/frontmatter.js` — frontmatter 解析工具函数
- [x] 2.3 编写 `composables/useGitHub.js` — GitHub raw 数据加载逻辑（index.json 加载、markdown 文件加载、缓存管理）
- [x] 2.4 编写 `composables/useUpdateChecker.js` — 更新检测逻辑（localStorage 读写、新旧对比、更新状态管理）

## 阶段三：路由与全局布局

- [x] 3.1 配置 Vue Router（hash 模式），定义三条路由：`/`、`/:symbol`、`/:symbol/:date`
- [x] 3.2 编写 `App.vue` — 全局布局骨架（NavBar + UpdateNotifier + router-view + 页面过渡动画）
- [x] 3.3 编写 `components/NavBar.vue` — 固定顶部导航栏（站名、返回首页按钮、毛玻璃效果）

## 阶段四：首页（HomeView）

- [x] 4.1 编写 `components/PostCard.vue` — 预测卡片组件（symbol、日期、标题、副标题、摘要、标签、hover 动画）
- [x] 4.2 编写 `components/LatestPosts.vue` — 最新预测区域（全局最新 5 条，按日期倒序）
- [x] 4.3 编写 `components/SymbolGrid.vue` — 分类浏览卡片网格（icon、代码、全称、最新日期、总数、未读标记）
- [x] 4.4 编写 `views/HomeView.vue` — 组合 LatestPosts + SymbolGrid

## 阶段五：Symbol 预测列表页（SymbolView）

- [x] 5.1 编写 `components/TagFilter.vue` — 标签筛选组件（多选、并集筛选）
- [x] 5.2 编写 `views/SymbolView.vue` — symbol 信息区 + TagFilter + PostCard 列表（日期倒序）

## 阶段六：预测详情页（PostView）

- [x] 6.1 编写 `components/MarkdownRenderer.vue` — Markdown 渲染组件（v-html + Mermaid nextTick 渲染 + 路由切换清理）
- [x] 6.2 编写 `styles/markdown-theme.css` — Markdown 暗黑主题样式（h1-h6、表格、代码块、引用、列表、链接等）
- [x] 6.3 编写 `views/PostView.vue` — meta 区域 + MarkdownRenderer + 上/下篇导航

## 阶段七：更新提示系统

- [x] 7.1 编写 `components/UpdateNotifier.vue` — 更新提示条（滑入动画、显示更新的 symbol、查看/关闭按钮）
- [x] 7.2 集成更新提示到 App.vue — 应用启动时检测更新、阅读后更新 read-state

## 阶段八：Service Worker

- [x] 8.1 编写 `public/sw.js` — 三组缓存策略（static-assets Cache First、api-cache Network First、content-cache Network First）
- [x] 8.2 在 `main.js` 中注册 Service Worker，监听 SW_UPDATED 消息
- [x] 8.3 离线体验处理（已缓存内容可用、未缓存内容友好提示）

## 阶段九：索引生成脚本

- [x] 9.1 编写 `scripts/generate-index.js` — 遍历 predictions/ 目录，解析 meta.json 和 frontmatter，生成 index.json
- [x] 9.2 添加容错处理（meta.json 缺失、frontmatter 字段缺失、非 md 文件忽略）
- [x] 9.3 配置 npm script：`generate-index`

## 阶段十：示例数据与测试

- [x] 10.1 创建示例 predictions 目录（BTC、ETH 各含 meta.json 和至少 2 篇示例 .md 文件）
- [x] 10.2 运行 `generate-index` 生成 index.json，验证输出格式 ✅
- [ ] 10.3 本地 `npm run dev` 完整流程测试（首页、列表页、详情页、标签筛选、更新提示） ⏳ 等待用户测试
- [x] 10.4 `npm run build` 构建验证 ✅

## 阶段十一：部署配置

- [x] 11.1 编写 `.github/workflows/deploy.yml` — GitHub Actions 自动部署（仅前端源码变更时触发）
- [ ] 11.2 配置 GitHub Pages（gh-pages 分支） ⏳ 需要 push 后配置
- [ ] 11.3 线上验证部署结果 ⏳ 需要部署后验证

## 阶段十二：浏览器通知（Browser Notification）

- [x] 12.1 编写 `composables/useNotification.js` — 封装通知权限请求、发送通知、点击跳转逻辑
- [x] 12.2 修改 `useUpdateChecker.js` — 检测到更新时调用浏览器通知
- [x] 12.3 修改 `App.vue` — 启动时请求通知权限 + 启动 5 分钟定时轮询 index.json
- [x] 12.4 测试验证（权限请求、新内容通知、后台轮询、点击通知跳转） ✅

## 阶段十三：笔记（Notes）功能

- [x] 13.1 迁移现有 predictions 目录结构（扁平文件 → 目录形式） ✅
- [x] 13.2 修改 `generate-index.js` — 支持新目录结构 + 扫描 notes 子目录 + 向后兼容扁平文件 ✅
- [x] 13.3 新增 `components/NoteList.vue` — 笔记列表组件（时间轴 UI、Markdown 渲染） ✅
- [x] 13.4 修改 `PostView.vue` — 底部集成笔记列表，加载并渲染笔记 ✅
- [x] 13.5 创建示例笔记数据 + 测试验证 ✅

## 阶段十四：响应式与细节优化

- [x] 14.1 移动端适配检查（表格/代码块横滚触摸优化、标签/按钮触摸区域增大、移动端字体缩放） ✅
- [x] 14.2 页面过渡动画调优（已有 fadeInUp staggered 动画 + 页面 fade-slide 过渡，新增 prefers-reduced-motion 支持） ✅
- [x] 14.3 性能检查（动画仅用 transform/opacity、消除移动端点击高亮、prefers-reduced-motion 全局支持） ✅

## 阶段十五：笔记列表 UX 优化

- [x] 15.1 笔记列表倒序显示（最新在前），最新笔记标记蓝色 glow 节点 + "最新" badge ✅
- [x] 15.2 点击帖子标题跳转最新笔记（有笔记时）或回到顶部（无笔记时） ✅
- [x] 15.3 移动端笔记头部改为两行布局（时间在上、标题在下） ✅
- [x] 15.4 修复 scrollToLatest 滚动到笔记中间的 bug（block: center → start） ✅

## 阶段十六：兼容性与 Bug 修复

- [x] 16.1 修复 WebView 黑屏问题（useNotification.js 模块级 Notification 访问崩溃 + Google Fonts 异步加载） ✅
- [x] 16.2 修复页面刷新只显示标题不显示内容的 bug（loading 初始状态 + watch currentPost） ✅
- [x] 16.3 修复空 symbol 目录误触发更新通知（latestDate 存在性检查） ✅
- [x] 16.4 启用 markdown-it 的 HTML 标签支持（html: true） ✅

## 阶段十七：数据加载与部署优化

- [x] 17.1 Service Worker 缓存策略优化：HTML 改为 Network First，确保部署后用户刷新即加载最新版本 ✅
- [x] 17.2 缓存版本升级 v1 → v2，清理旧缓存 ✅
- [x] 17.3 数据加载迁移：生产环境从 GitHub Pages 自身加载 index.json 和 predictions/，替代 raw.githubusercontent.com ✅
- [x] 17.4 部署流程优化：CI 构建后自动复制 index.json + predictions/ 到 dist/，index.json 和 predictions/ 变更也触发部署 ✅
- [x] 17.5 帖子排序优化：post.md frontmatter 新增 date 字段用于排序，目录名（folder）用于显示和路由 ✅

## 阶段十八：TOC 目录导航

- [x] 18.1 markdown.js 自定义 heading_open 渲染规则，为 h1-h6 生成 slug ID（支持中文、同名去重） ✅
- [x] 18.2 新建 TableOfContents.vue：悬浮按钮 + 底部抽屉，两级分组目录（正文 ■ + 笔记 ● + 子标题 └） ✅
- [x] 18.3 IntersectionObserver 高亮当前可见标题，点击跳转并自动关闭抽屉 ✅
- [x] 18.4 PostView 集成 TOC，正文和笔记加载后自动刷新目录 ✅

## 阶段十九：体验优化与社区

- [x] 19.1 Symbols 列表按最新帖子日期倒序排列 ✅
- [x] 19.2 添加网站 favicon（ico + png），导航栏展示 logo ✅
- [x] 19.3 添加 Telegram 频道和作者链接（README + 首页底部） ✅
- [x] 19.4 修复轮询刷新页面闪烁：首次加载才显示 loading，后续静默更新；数据无变化不触发响应式 ✅
- [x] 19.5 index.json 缓存优化：fetch 加 timestamp + cache: no-cache，SW 直接透传不缓存 ✅
- [x] 19.6 轮询频率从 5 分钟缩短至 1 分钟 ✅

## 阶段二十：全屏查看

- [x] 20.1 新建 FullscreenViewer.vue：浏览器 Fullscreen API，顶部标题栏 + 关闭按钮，max-w-6xl 宽屏阅读 ✅
- [x] 20.2 PostView 正文全屏按钮（⛶ 全屏阅读） ✅
- [x] 20.3 NoteList 每条笔记全屏按钮，emit 事件由 PostView 处理 ✅

## 阶段二十一：Giscus 评论系统

- [x] 21.1 安装 @giscus/vue，新建 GiscusComments.vue 评论组件（mapping=specific，dark_dimmed 主题） ✅
- [x] 21.2 PostView 正文底部集成帖子评论区，term 格式：`symbolCode/dateParam` ✅
- [x] 21.3 NoteList 每条笔记底部集成独立评论区，term 格式：`symbolCode/dateParam/note/time` ✅
