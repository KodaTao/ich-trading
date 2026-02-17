<script setup>
import { ref } from 'vue'

const showSOL = ref(true)
const showTRC20 = ref(false)
const showERC20 = ref(false)

const SOL_ADDRESS = '8drtJ7Z27dz2nyvn1F2VzBfJHfU8oUNXVLMtDNNYAxD4'
const TRC20_ADDRESS = 'TJU77myH6dr4Ggjo8NQ9YxhFRzaTFhGDZC'
const ERC20_ADDRESS = '0x0447de1b47349057d0d0da9e737782600344ca3d'

function copyAddress(addr) {
  navigator.clipboard?.writeText(addr)
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-6">
    <!-- 作者简介 -->
    <section class="mb-10">
      <h1 class="text-2xl font-display font-bold text-text-primary mb-6">
        关于作者
      </h1>

      <div class="bg-bg-card border border-border-subtle rounded-lg p-6">
        <div class="flex items-start gap-4 mb-4">
          <div class="text-4xl">🔮</div>
          <div>
            <h2 class="text-lg font-semibold text-text-primary">KodaTao</h2>
            <p class="text-accent-gold text-sm">易经 × 量化 × AI — 三修选手</p>
          </div>
        </div>

        <div class="bg-bg-primary/50 rounded-lg p-4 font-mono text-sm text-text-secondary mb-5 space-y-1">
          <p>职业状态：爆仓毕业，待业求捞 🍚</p>
          <p>当前在做：用周易预测股票和加密货币</p>
          <p>技术路线：AI 写代码，易经看方向，量化做执行</p>
          <p>人生感悟：止损比止盈重要</p>
        </div>

        <!-- 履历 -->
        <div class="mb-5">
          <h3 class="text-sm font-semibold text-text-primary mb-2">📜 履历</h3>
          <ul class="text-sm text-text-secondary space-y-1.5 list-none">
            <li>🎓 2019 年毕业，坐标北京，Golang 工程师</li>
            <li>🛒 做过电商、社交项目</li>
            <li>💬 最有价值的经历：基于 teamgram-server 二次开发 Telegram 私有化 IM 系统</li>
            <li>📉 后转向量化交易，然后……爆仓了</li>
          </ul>
        </div>

        <!-- 技能树 -->
        <div class="mb-5">
          <h3 class="text-sm font-semibold text-text-primary mb-2">🛠️ 技能树</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div class="bg-bg-primary/50 rounded px-3 py-2">
              <span class="text-accent-blue font-semibold">后端开发</span>
              <span class="text-text-secondary"> · Go（5年）、IM 系统</span>
            </div>
            <div class="bg-bg-primary/50 rounded px-3 py-2">
              <span class="text-accent-blue font-semibold">易经研究</span>
              <span class="text-text-secondary"> · 紫微斗数、六爻、梅花</span>
            </div>
            <div class="bg-bg-primary/50 rounded px-3 py-2">
              <span class="text-accent-blue font-semibold">量化交易</span>
              <span class="text-text-secondary"> · 策略、回测、实盘</span>
            </div>
            <div class="bg-bg-primary/50 rounded px-3 py-2">
              <span class="text-accent-blue font-semibold">AI 编程</span>
              <span class="text-text-secondary"> · Claude Code 重度用户</span>
            </div>
          </div>
        </div>

        <!-- 联系方式 -->
        <div class="flex flex-wrap gap-2">
          <a
            href="https://t.me/kodatao"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-accent-blue/10 text-accent-blue hover:bg-accent-blue/20 transition-colors"
          >
            💬 Telegram
          </a>
          <a
            href="https://github.com/KodaTao"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-text-secondary/10 text-text-secondary hover:bg-text-secondary/20 transition-colors"
          >
            <svg viewBox="0 0 16 16" class="w-4 h-4 fill-current"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>
            GitHub
          </a>
        </div>
      </div>
    </section>

    <!-- 金句 -->
    <section class="mb-10 text-center">
      <blockquote class="text-text-secondary text-sm italic border-l-3 border-accent-gold pl-4 text-left max-w-md mx-auto">
        <p>杠杆是一把双刃剑，我被两面都砍了。</p>
        <p class="mt-1">现在用易经预测市场，至少不会爆仓。</p>
      </blockquote>
    </section>

    <!-- 打赏区 -->
    <section class="mb-10">
      <h2 class="text-lg font-display font-semibold text-text-primary mb-2">
        支持作者
      </h2>
      <p class="text-text-secondary text-sm mb-5">
        如果预测对你有帮助，可以请作者喝杯咖啡 ☕
      </p>

      <div class="space-y-4">
        <!-- Solana -->
        <div class="bg-bg-card border border-border-subtle rounded-lg overflow-hidden">
          <button
            @click="showSOL = !showSOL"
            class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/5 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl">🟣</span>
              <div>
                <div class="text-sm font-semibold text-text-primary">USDT / SOL (Solana)</div>
                <div class="text-xs text-text-secondary">Solana 网络 · 极速到账 · 手续费极低 · 推荐</div>
              </div>
            </div>
            <span class="text-text-secondary text-sm transition-transform" :class="showSOL && 'rotate-180'">▼</span>
          </button>
          <div v-if="showSOL" class="px-5 pb-5 pt-1">
            <img src="/Solana.png" alt="Solana 收款二维码" class="w-48 h-48 mx-auto mb-3 rounded-lg" />
            <div class="flex items-center gap-2 bg-bg-primary/50 rounded-lg px-3 py-2">
              <code class="text-xs text-text-secondary break-all flex-1 font-mono">{{ SOL_ADDRESS }}</code>
              <button
                @click="copyAddress(SOL_ADDRESS)"
                class="shrink-0 text-xs text-accent-blue hover:text-accent-blue/80 transition-colors"
              >
                复制
              </button>
            </div>
          </div>
        </div>

        <!-- TRC20 -->
        <div class="bg-bg-card border border-border-subtle rounded-lg overflow-hidden">
          <button
            @click="showTRC20 = !showTRC20"
            class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/5 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl">🟢</span>
              <div>
                <div class="text-sm font-semibold text-text-primary">USDT (TRC20)</div>
                <div class="text-xs text-text-secondary">Tron 网络 · 手续费低</div>
              </div>
            </div>
            <span class="text-text-secondary text-sm transition-transform" :class="showTRC20 && 'rotate-180'">▼</span>
          </button>
          <div v-if="showTRC20" class="px-5 pb-5 pt-1">
            <img src="/TRC20.png" alt="TRC20 收款二维码" class="w-48 h-48 mx-auto mb-3 rounded-lg" />
            <div class="flex items-center gap-2 bg-bg-primary/50 rounded-lg px-3 py-2">
              <code class="text-xs text-text-secondary break-all flex-1 font-mono">{{ TRC20_ADDRESS }}</code>
              <button
                @click="copyAddress(TRC20_ADDRESS)"
                class="shrink-0 text-xs text-accent-blue hover:text-accent-blue/80 transition-colors"
              >
                复制
              </button>
            </div>
          </div>
        </div>

        <!-- ERC20 -->
        <div class="bg-bg-card border border-border-subtle rounded-lg overflow-hidden">
          <button
            @click="showERC20 = !showERC20"
            class="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/5 transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl">🔵</span>
              <div>
                <div class="text-sm font-semibold text-text-primary">USDT (ERC20)</div>
                <div class="text-xs text-text-secondary">Ethereum 网络</div>
              </div>
            </div>
            <span class="text-text-secondary text-sm transition-transform" :class="showERC20 && 'rotate-180'">▼</span>
          </button>
          <div v-if="showERC20" class="px-5 pb-5 pt-1">
            <img src="/ERC20.png" alt="ERC20 收款二维码" class="w-48 h-48 mx-auto mb-3 rounded-lg" />
            <div class="flex items-center gap-2 bg-bg-primary/50 rounded-lg px-3 py-2">
              <code class="text-xs text-text-secondary break-all flex-1 font-mono">{{ ERC20_ADDRESS }}</code>
              <button
                @click="copyAddress(ERC20_ADDRESS)"
                class="shrink-0 text-xs text-accent-blue hover:text-accent-blue/80 transition-colors"
              >
                复制
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 求职意向 -->
    <section class="mb-10">
      <h2 class="text-lg font-display font-semibold text-text-primary mb-3">
        求职意向
      </h2>
      <p class="text-text-secondary text-sm mb-4">
        如果你觉得「会易经 + 会量化 + 会 AI 编程」这个组合有点意思：
      </p>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
        <div class="bg-bg-card border border-border-subtle rounded-lg px-4 py-3">
          <span class="text-accent-gold">🔮</span> 易经 + 量化分析师 <span class="text-xs text-text-secondary">（最想做的）</span>
        </div>
        <div class="bg-bg-card border border-border-subtle rounded-lg px-4 py-3">
          <span class="text-accent-gold">📊</span> 交易分析师
        </div>
        <div class="bg-bg-card border border-border-subtle rounded-lg px-4 py-3">
          <span class="text-accent-gold">💻</span> 量化开发
        </div>
        <div class="bg-bg-card border border-border-subtle rounded-lg px-4 py-3">
          <span class="text-accent-gold">🤖</span> AI 应用开发
        </div>
      </div>
      <p class="text-text-secondary text-xs mt-3">
        📩 有意请联系
        <a href="https://t.me/kodatao" target="_blank" rel="noopener noreferrer" class="text-accent-blue hover:underline">
          Telegram @kodatao
        </a>
        ，好心老板赏口饭吧！
      </p>
    </section>
  </div>
</template>
