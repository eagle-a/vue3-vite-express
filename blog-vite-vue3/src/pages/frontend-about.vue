<template>
    <div class="main-container">
        <Navbar>
            <template #brand>
                <span class="brand-logo">湛明博客</span>
            </template>
            <template #menu>
                <router-link to="/" class="nav-link">首页</router-link>
                <router-link to="/about" class="nav-link">关于</router-link>
            </template>
            <template #actions>
                <ThemeToggle />
            </template>
        </Navbar>

        <main class="main-content">
            <div class="content-wrapper">
                <div class="about-section">
                    <EntityCard :elevation="2" class="about-header-card">
                        <div class="about-header">
                            <h1 class="about-title">关于湛明博客</h1>
                            <p class="about-subtitle">分享技术，记录生活</p>
                        </div>
                    </EntityCard>

                    <EntityCard :elevation="1">
                        <MarkdownRenderer :content="aboutContent" />
                        <div class="about-content" v-html="aboutHtml" />
                    </EntityCard>

                    <EntityCard :elevation="1">
                        <h2 class="section-title">技术栈</h2>
                        <div class="tech-stack">
                            <div class="tech-item">
                                <span class="tech-name">前端</span>
                                <span class="tech-desc">Vue 3 + TypeScript + UnoCSS</span>
                            </div>
                            <div class="tech-item">
                                <span class="tech-name">后端</span>
                                <span class="tech-desc">Node.js + Express + MongoDB</span>
                            </div>
                            <div class="tech-item">
                                <span class="tech-name">设计</span>
                                <span class="tech-desc">黑白银配色 + 玻璃拟态</span>
                            </div>
                        </div>
                    </EntityCard>

                    <EntityCard :elevation="1">
                        <h2 class="section-title">联系方式</h2>
                        <div class="contact-info">
                            <div class="contact-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <span>contact@zhanming.com</span>
                            </div>
                            <div class="contact-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                                <span>github.com/zhanming</span>
                            </div>
                        </div>
                    </EntityCard>
                </div>

                <Sidebar :categories="transformCategories(category)" />
            </div>
        </main>

        <BackToTop :visibility-height="100" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
    Navbar,
    ThemeToggle,
    EntityCard,
    BackToTop,
    MarkdownRenderer,
    Sidebar,
} from '@/components'
import type { Category } from '@/components'

defineOptions({
    name: 'FrontendAbout',
    asyncData(ctx) {
        const { store, api } = ctx
        const globalCategoryStore = useGlobalCategoryStore(store)
        return Promise.all([
            globalCategoryStore.getCategoryList({}, api),
        ])
    },
})

const globalCategoryStore = useGlobalCategoryStore()
const { lists: category } = $(storeToRefs(globalCategoryStore))

const aboutContent = `
# 关于湛明博客

欢迎来到湛明博客！这是一个基于 **Vue 3** 和 **黑白银设计系统** 构建的技术博客。

## 博客特色

- 🎨 **极简设计**：黑白银配色，类似Apple设计语言
- 🔮 **现代视觉**：玻璃拟态效果，层次分明
- ⚡ **极致性能**：UnoCSS原子化CSS，按需生成
- 🌓 **深色模式**：完整的亮色/暗色主题支持

## 内容方向

主要分享前端开发、设计系统、性能优化等技术内容，以及一些生活感悟。

> 写代码，做设计，享受创造的乐趣。
`

const aboutHtml = ''

const transformCategories = (cats: any[]): Category[] => {
    return cats.map(cat => ({
        name: cat.cate_name,
        count: cat.count || 0,
    }))
}

useHead({
    title: '关于 - 湛明',
    meta: [
        {
            name: 'description',
            content: '关于湛明博客',
        },
    ],
})
</script>

<style scoped>
.main-container {
    min-height: 100vh;
    background: var(--color-background);
}

.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 80px 24px 40px;
}

.content-wrapper {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
    align-items: start;
}

.about-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.about-header-card {
    padding: 48px;
    text-align: center;
}

.about-title {
    font-size: 36px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0 0 12px 0;
}

.about-subtitle {
    font-size: 18px;
    color: var(--color-text-secondary);
    margin: 0;
}

.about-content {
    margin-top: 24px;
}

.section-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 16px 0;
}

.tech-stack {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.tech-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--color-surface-variant);
    border-radius: 12px;
}

.tech-name {
    font-weight: 600;
    color: var(--color-text-primary);
}

.tech-desc {
    color: var(--color-text-secondary);
    font-size: 14px;
}

.contact-info {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--color-surface-variant);
    border-radius: 12px;
    color: var(--color-text-secondary);
}

.contact-item svg {
    width: 20px;
    height: 20px;
    color: var(--color-primary);
}

@media (max-width: 1024px) {
    .content-wrapper {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .main-content {
        padding: 70px 16px 24px;
    }

    .about-title {
        font-size: 28px;
    }
}
</style>