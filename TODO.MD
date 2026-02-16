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

- [ ] 12.1 编写 `composables/useNotification.js` — 封装通知权限请求、发送通知、点击跳转逻辑
- [ ] 12.2 修改 `useUpdateChecker.js` — 检测到更新时调用浏览器通知
- [ ] 12.3 修改 `App.vue` — 启动时请求通知权限 + 启动 5 分钟定时轮询 index.json
- [ ] 12.4 测试验证（权限请求、新内容通知、后台轮询、点击通知跳转）

## 阶段十三：响应式与细节优化

- [ ] 12.1 移动端适配检查（卡片网格、表格横滚、代码块横滚、触摸区域 44×44px）
- [ ] 12.2 页面过渡动画调优（淡入 + translateY、卡片 staggered 动画）
- [ ] 12.3 性能检查（动画仅用 transform/opacity、图片懒加载等）
