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
                <div class="article-section">
                    <EntityCard v-if="!isLoad" :loading="true" />

                    <template v-else-if="articleData">
                        <EntityCard :elevation="2" class="article-header-card">
                            <div class="article-header">
                                <router-link 
                                    :to="`/category/${articleData.category}`" 
                                    class="category-badge"
                                >
                                    {{ articleData.category_name }}
                                </router-link>
                                <h1 class="article-title">{{ articleData.title }}</h1>
                            </div>
                        </EntityCard>

                        <EntityCard :elevation="1" class="article-content-card">
                            <MarkdownRenderer :content="articleData.content || ''" />
                            <div class="article-html" v-html="addTarget(articleData.html)" />
                        </EntityCard>

                        <EntityCard :elevation="1">
                            <div class="article-actions">
                                <BaseButton variant="secondary" size="sm">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                    {{ articleData.visit || 0 }} 阅读
                                </BaseButton>
                                <BaseButton variant="secondary" size="sm">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    {{ articleData.comment_count || 0 }} 评论
                                </BaseButton>
                            </div>
                        </EntityCard>

                        <EntityCard :elevation="1">
                            <h3 class="comments-title">评论 ({{ comments?.length || 0 }})</h3>
                            <div class="comments-list">
                                <div v-for="comment in comments" :key="comment._id" class="comment-item">
                                    <div class="comment-author">{{ comment.author }}</div>
                                    <div class="comment-content">{{ comment.content }}</div>
                                    <div class="comment-date">{{ comment.create_at }}</div>
                                </div>
                                <div v-if="!comments?.length" class="no-comments">
                                    暂无评论，快来发表第一条评论吧！
                                </div>
                            </div>
                        </EntityCard>
                    </template>

                    <EntityCard v-else :elevation="1">
                        <div class="empty-state">
                            <p>该文章不存在，或者该文章已经被删除</p>
                        </div>
                    </EntityCard>
                </div>

                <Sidebar
                    :categories="transformCategories(category)"
                    :hot-articles="transformTrending(trending)"
                />
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
    BaseButton,
    BackToTop,
    MarkdownRenderer,
    Sidebar,
} from '@/components'
import type { Category, HotArticle } from '@/components'

defineOptions({
    name: 'FrontendArticle',
    asyncData(ctx) {
        const { store, route, api } = ctx
        const {
            fullPath: path,
            params: { id },
        } = route
        const globalCategoryStore = useGlobalCategoryStore(store)
        const frontendArticleStore = useFrontendArticleStore(store)
        const globalCommentStore = useGlobalCommentStore(store)
        return Promise.all([
            globalCategoryStore.getCategoryList({}, api),
            frontendArticleStore.getTrending(undefined, api),
            globalCommentStore.getCommentList({ id, path, page: 1, limit: 10 }, api),
            frontendArticleStore.getArticleItem({ id, path }, api),
        ])
    },
})

const globalCategoryStore = useGlobalCategoryStore()
const { lists: category } = $(storeToRefs(globalCategoryStore))

const frontendArticleStore = useFrontendArticleStore()
const { item, trending } = $(storeToRefs(frontendArticleStore))

const isLoad = $computed(() => item.isLoad)
const articleData = $computed(() => item.data)

const globalCommentStore = useGlobalCommentStore()
const { lists: comments } = $(storeToRefs(globalCommentStore))

useSaveScroll()

function addTarget(content: string) {
    if (!content) {
        return ''
    }
    return content.replace(/<a(.*?)href="http/g, '<a$1target="_blank" href="http')
}

const transformCategories = (cats: any[]): Category[] => {
    return cats.map(cat => ({
        name: cat.cate_name,
        count: cat.count || 0,
    }))
}

const transformTrending = (trendingList: any[]): HotArticle[] => {
    return trendingList.map(item => ({
        id: item._id,
        title: item.title,
        views: item.visit || 0,
    }))
}

const headTitle = computed(() => {
    let title = '湛明'
    title = articleData?.title ? `${articleData.title} - 湛明` : '湛明'
    return title
})

useHead({
    title: headTitle,
    meta: [
        {
            name: 'description',
            content: headTitle,
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

.article-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.article-header-card {
    padding: 32px;
}

.article-header {
    text-align: center;
}

.category-badge {
    display: inline-block;
    padding: 4px 16px;
    background: var(--color-primary);
    color: #000000;
    border-radius: 100px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 16px;
    text-decoration: none;
    transition: all 0.2s ease;
}

.category-badge:hover {
    background: var(--color-primary-light);
}

.article-title {
    font-size: 32px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0;
    line-height: 1.4;
}

.article-content-card {
    padding: 32px;
}

.article-html {
    margin-top: 24px;
}

.article-actions {
    display: flex;
    gap: 16px;
}

.comments-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0 0 16px 0;
}

.comments-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.comment-item {
    padding: 16px;
    background: var(--color-surface-variant);
    border-radius: 12px;
}

.comment-author {
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 8px;
}

.comment-content {
    color: var(--color-text-secondary);
    line-height: 1.6;
    margin-bottom: 8px;
}

.comment-date {
    font-size: 12px;
    color: var(--color-text-hint);
}

.no-comments {
    text-align: center;
    padding: 24px;
    color: var(--color-text-hint);
}

.empty-state {
    text-align: center;
    padding: 40px;
    color: var(--color-text-secondary);
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

    .article-title {
        font-size: 24px;
    }
}
</style>