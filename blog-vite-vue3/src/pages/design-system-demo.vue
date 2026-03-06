<template>
  <div class="demo-page">
    <Navbar>
      <template #brand>
        <span class="brand-logo">湛明博客</span>
      </template>
      <template #menu>
        <a href="#hero" class="nav-link">首页</a>
        <a href="#articles" class="nav-link">文章</a>
        <a href="#features" class="nav-link">特性</a>
        <a href="#about" class="nav-link">关于</a>
      </template>
      <template #actions>
        <BaseButton size="sm" @click="showAuthModal = true">登录</BaseButton>
        <ThemeToggle />
      </template>
    </Navbar>

    <main class="main-content">
      <section id="hero" class="hero-section">
        <GlassPanel class="hero-card" :blur="20" :opacity="0.9">
          <h1 class="hero-title">全新设计系统</h1>
          <p class="hero-subtitle">黑白银配色 · 极简美学 · 现代体验</p>
          <div class="hero-actions">
            <BaseButton size="lg">开始探索</BaseButton>
            <BaseButton variant="secondary" size="lg">了解更多</BaseButton>
          </div>
        </GlassPanel>
      </section>

      <section id="articles" class="articles-section">
        <h2 class="section-title">最新文章</h2>
        <div class="articles-grid">
          <ArticleCard
            v-for="article in mockArticles"
            :key="article.id"
            :article="article"
            :elevation="2"
          />
        </div>
      </section>

      <section id="features" class="features-section">
        <h2 class="section-title">核心特性</h2>
        <div class="features-grid">
          <EntityCard
            v-for="feature in features"
            :key="feature.title"
            :elevation="2"
            interactive
            class="feature-card"
          >
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
          </EntityCard>
        </div>
      </section>

      <section id="components" class="components-section">
        <h2 class="section-title">组件展示</h2>

        <EntityCard :elevation="2" class="demo-group">
          <h3 class="demo-title">按钮组件</h3>
          <div class="button-demo">
            <BaseButton variant="primary" size="sm">主要按钮</BaseButton>
            <BaseButton variant="primary" size="md">主要按钮</BaseButton>
            <BaseButton variant="primary" size="lg">主要按钮</BaseButton>
            <BaseButton variant="secondary">次要按钮</BaseButton>
            <BaseButton variant="text">文本按钮</BaseButton>
            <BaseButton variant="icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </BaseButton>
          </div>
        </EntityCard>

        <EntityCard :elevation="2" class="demo-group">
          <h3 class="demo-title">搜索框组件</h3>
          <SearchBox
            v-model="searchQuery"
            placeholder="搜索文章..."
            show-button
            @search="handleSearch"
          />
        </EntityCard>

        <EntityCard :elevation="2" class="demo-group">
          <h3 class="demo-title">玻璃拟态面板</h3>
          <div class="glass-demo">
            <GlassPanel variant="default" class="glass-item">
              <p>默认玻璃效果</p>
            </GlassPanel>
            <GlassPanel variant="outlined" class="glass-item">
              <p>描边玻璃效果</p>
            </GlassPanel>
            <GlassPanel variant="filled" class="glass-item">
              <p>填充玻璃效果</p>
            </GlassPanel>
          </div>
        </EntityCard>

        <EntityCard :elevation="2" class="demo-group">
          <h3 class="demo-title">Markdown渲染器</h3>
          <MarkdownRenderer :content="markdownContent" />
        </EntityCard>
      </section>
    </main>

    <AuthModal v-model="showAuthModal" />

    <BackToTop :visibility-height="100" />

    <footer class="page-footer">
      <GlassPanel class="footer-content" :blur="16">
        <p>© 2026 湛明博客 · 黑白银设计系统</p>
        <p>使用 Vue 3 + TypeScript + UnoCSS 构建</p>
      </GlassPanel>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Navbar,
  ThemeToggle,
  GlassPanel,
  EntityCard,
  BaseButton,
  AuthModal,
  BackToTop,
  ArticleCard,
  SearchBox,
  MarkdownRenderer,
} from '@/components'
import type { Article } from '@/components'

const showAuthModal = ref(false)
const searchQuery = ref('')

const mockArticles: Article[] = [
  {
    id: 1,
    title: 'Vue 3 Composition API 完全指南',
    excerpt: '深入理解 Vue 3 的 Composition API，掌握响应式编程的核心概念和最佳实践...',
    thumbnail: 'https://picsum.photos/800/400?random=1',
    category: 'Vue.js',
    date: '2026-03-06',
    views: 1234,
    comments: 56,
    tags: ['Vue 3', 'Composition API', '前端'],
  },
  {
    id: 2,
    title: 'TypeScript 高级类型体操实战',
    excerpt: '探索 TypeScript 的高级类型系统，学习条件类型、映射类型、模板字面量类型...',
    thumbnail: 'https://picsum.photos/800/400?random=2',
    category: 'TypeScript',
    date: '2026-03-05',
    views: 987,
    comments: 34,
    tags: ['TypeScript', '类型系统'],
  },
  {
    id: 3,
    title: 'UnoCSS 原子化 CSS 最佳实践',
    excerpt: '使用 UnoCSS 构建高性能、可维护的样式系统，实现按需生成和极致优化...',
    thumbnail: 'https://picsum.photos/800/400?random=3',
    category: 'CSS',
    date: '2026-03-04',
    views: 756,
    comments: 28,
    tags: ['UnoCSS', 'CSS', '性能优化'],
  },
]

const features = [
  {
    icon: '🎨',
    title: '黑白银配色',
    description: '极简主义设计，类似 Apple 设计语言，白天白色，夜晚黑色',
  },
  {
    icon: '🔮',
    title: '玻璃拟态',
    description: '现代玻璃效果，背景模糊，半透明设计，层次分明',
  },
  {
    icon: '⚡',
    title: '极致性能',
    description: 'UnoCSS 原子化 CSS，按需生成，零冗余，极速加载',
  },
  {
    icon: '🌓',
    title: '深色模式',
    description: '完整的亮色/暗色主题支持，自动跟随系统偏好',
  },
  {
    icon: '🎭',
    title: '丰富组件',
    description: '按钮、卡片、表单、弹窗等完整组件库，开箱即用',
  },
  {
    icon: '📱',
    title: '响应式设计',
    description: '完美适配桌面、平板、手机，流畅的用户体验',
  },
]

const markdownContent = `
# 欢迎使用黑白银设计系统

这是一个基于 **Vue 3** 和 **UnoCSS** 构建的现代化设计系统。

## 核心特性

- 🎨 **极简美学**：黑白银配色，类似 Apple 设计语言
- 🔮 **玻璃拟态**：现代玻璃效果，层次分明
- ⚡ **极致性能**：UnoCSS 原子化 CSS，按需生成
- 🌓 **深色模式**：完整的亮色/暗色主题支持

## 代码示例

\`\`\`typescript
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
\`\`\`

> 设计不仅仅是外观和感觉，设计是它如何工作的。—— Steve Jobs
`

const handleSearch = (query: string) => {
  console.log('搜索:', query)
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  padding-top: 60px;
  background: var(--color-background);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
}

.hero-section {
  margin-bottom: 80px;
}

.hero-card {
  padding: 80px 40px;
  text-align: center;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 16px;
}

.hero-subtitle {
  font-size: 20px;
  color: var(--color-text-secondary);
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.section-title {
  font-size: 32px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-align: center;
  margin-bottom: 40px;
}

.articles-section {
  margin-bottom: 80px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.features-section {
  margin-bottom: 80px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  text-align: center;
  padding: 32px;
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}

.feature-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.components-section {
  margin-bottom: 80px;
}

.demo-group {
  margin-bottom: 32px;
}

.demo-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 24px;
}

.button-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.glass-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.glass-item {
  padding: 24px;
  text-align: center;
}

.glass-item p {
  margin: 0;
  color: var(--color-text-primary);
}

.page-footer {
  padding: 40px 24px;
  text-align: center;
}

.footer-content {
  padding: 24px;
}

.footer-content p {
  margin: 8px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 24px;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>