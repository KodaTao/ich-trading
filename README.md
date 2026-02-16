<div align="center">

# ☰ ICH Trading

**易经交易预测平台**

以古老智慧洞察现代市场

[![Deploy](https://github.com/KodaTao/ich-trading/actions/workflows/deploy.yml/badge.svg)](https://github.com/KodaTao/ich-trading/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-00d4ff?style=flat&logo=github)](https://kodatao.github.io/ich-trading/)
[![License: MIT](https://img.shields.io/badge/License-MIT-c9a84c?style=flat)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

</div>

---

## 概述

ICH Trading 是一个基于 GitHub Pages 的纯前端预测发布平台。通过周易卦象分析股票与加密货币的走势趋势，将预测报告以 Markdown 格式存储在 GitHub 仓库中，前端动态加载渲染——**部署一次，内容持续更新**。

> **ICH** = I Ching（易经）

### 为什么选择这个方案？

- 🏗️ **零服务器成本** — 纯静态部署在 GitHub Pages，无需后端
- 📝 **Git 驱动内容** — 预测报告即 Markdown 文件，用 Git 管理版本
- ⚡ **免构建更新** — 推送新预测后用户刷新即可看到，无需重新构建前端
- 🔔 **实时通知** — 浏览器原生通知 + 应用内更新提示

---

## 功能特性

| 特性 | 说明 |
|------|------|
| 📊 **分类浏览** | 按 Symbol（BTC、ETH 等）分类，卡片网格展示 |
| 🔮 **卦象预测** | Markdown 格式预测报告，支持表格、代码高亮、Mermaid 图表 |
| 📝 **笔记系统** | 每篇预测下可附加多条追踪笔记，时间轴 UI 展示 |
| 🔔 **更新通知** | 浏览器推送通知 + 应用内提示条，精确到具体 Symbol |
| 🏷️ **标签筛选** | 按卦象、趋势等标签筛选预测 |
| 📱 **移动优先** | 响应式设计，触摸友好，移动端体验优先 |
| 🌙 **暗黑主题** | 科技感暗黑 UI，青蓝 + 金色双强调色 |
| 📶 **离线可用** | Service Worker 缓存，已访问内容离线可读 |

---

## 技术栈

```
Vue 3 (Composition API)  ·  Vite  ·  Tailwind CSS 3  ·  Vue Router 4
markdown-it  ·  highlight.js  ·  Mermaid  ·  Service Worker
```

---

## 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

### 构建部署

```bash
npm run build
```

---

## 发布预测

### 1. 创建新 Symbol

```bash
mkdir -p predictions/TSLA
echo '{"name":"Tesla","description":"特斯拉易经预测","icon":"⚡"}' > predictions/TSLA/meta.json
```

### 2. 编写预测报告

创建 `predictions/TSLA/2026-02-16/post.md`：

```markdown
---
title: "特斯拉周易预测"
subtitle: "乾卦九五，飞龙在天"
summary: "本周走势强劲，卦象显示上行动力充足。"
tags: ["看涨", "乾卦"]
---

## 卦象分析

正文内容...
```

### 3. 添加笔记（可选）

在 `predictions/TSLA/2026-02-16/notes/` 目录下创建笔记文件，文件名为时间戳：

```
notes/2026-02-16T14-30.md
notes/2026-02-17T09-00.md
```

### 4. 生成索引并推送

```bash
npm run generate-index
git add .
git commit -m "prediction: TSLA 2026-02-16"
git push
```

用户刷新页面即可看到新内容，无需重新构建前端。

---

## 目录结构

```
ich-trading/
├── src/                    # Vue 前端源码
│   ├── views/              # 页面组件（首页、列表页、详情页）
│   ├── components/         # UI 组件（卡片、导航栏、笔记列表等）
│   ├── composables/        # 组合式函数（数据加载、更新检测、通知）
│   ├── utils/              # 工具函数（Markdown 配置、frontmatter 解析）
│   └── styles/             # 全局样式与 Markdown 主题
├── predictions/            # 预测内容（Markdown 文件）
│   ├── BTC/
│   │   ├── meta.json       # Symbol 元信息
│   │   └── 2026-02-16/
│   │       ├── post.md     # 预测正文
│   │       └── notes/      # 追踪笔记
│   └── ETH/
├── scripts/
│   └── generate-index.js   # 索引生成脚本
├── public/
│   └── sw.js               # Service Worker
└── index.json              # 自动生成的索引（勿手动编辑）
```

---

## 部署

项目通过 GitHub Actions 自动部署到 GitHub Pages。仅前端源码变更时触发构建，预测内容更新不触发。

首次部署需在仓库 Settings → Pages 中将 Source 设为 `gh-pages` 分支。

---

## 许可证

本项目基于 [MIT License](LICENSE) 开源。

