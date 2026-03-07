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
                            <frontend-comment :comments="comments" />
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
    Sidebar,
} from '@/components'
import FrontendComment from '@/components/frontend-comment.vue'
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
        count: cat.cate_num || 0,
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

.article-html :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 12px;
    margin: 16px 0;
    display: block;
}

.article-html :deep(a) {
    color: var(--color-primary);
    text-decoration: none;
}

.article-html :deep(a:hover) {
    text-decoration: underline;
}

/* 代码块样式 */
.article-html :deep(pre) {
    margin: 24px 0;
    padding: 20px;
    background: var(--color-surface-variant);
    border-radius: var(--radius-md);
    overflow-x: auto;
    border: 1px solid var(--color-surface-variant);
}

.article-html :deep(code) {
    padding: 2px 6px;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 0.9em;
    background: var(--color-surface-variant);
    color: var(--color-text-primary);
    border-radius: var(--radius-sm);
}

.article-html :deep(pre code) {
    padding: 0;
    background: transparent;
    color: var(--color-text-primary);
}

.article-html :deep(p code) {
    display: inline;
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

/* 评论区样式 - 使用 CSS 变量 */
.card {
    background: var(--color-surface);
    border-radius: var(--radius-md);
}

.comments {
    padding-top: 20px;
    padding-right: 25px;
    margin-left: 25px;
    border-top: 1px solid var(--color-surface-variant);
}

.comments .comment-item {
    display: flex;
    padding: 18px 0;
}

.comments .comment-content-wrap {
    flex: 1 1 auto;
    margin-left: 15px;
}

.comments .comment-author-wrap {
    display: block;
    margin-top: 1px;
    line-height: 1;
    color: var(--color-text-hint);
}

.comments .comment-content {
    margin-top: 5px;
    color: var(--color-text-secondary);
    line-height: 1.6;
}

.comments .comment-footer {
    margin-top: 6px;
    font-size: 14px;
    line-height: 1;
    color: var(--color-text-hint);
}

.comments .comment-time {
    padding-right: 5px;
}

.comments .comment-action-item {
    color: var(--color-text-hint);
}

.comments .comment-action-item:hover {
    color: var(--color-text-secondary);
}

/* 评论输入框 */
.comments .comment-post-wrap {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 20px;
}

.comments .comment-post-input-wrap {
    flex: 1 1 auto;
    margin-left: 15px;
}

.comments .comment-post-input-wrap textarea {
    border-radius: var(--radius-sm);
    display: block;
    width: 100%;
    height: 88px;
    padding: 10px 14px;
    resize: none;
    background-color: var(--color-surface-variant);
    color: var(--color-text-primary);
    border: 1px solid var(--color-surface-variant);
    font-size: 15px;
    font-family: inherit;
}

.comments .comment-post-input-wrap textarea:focus {
    outline: none;
    border-color: var(--color-primary);
}

.comments .comment-post-actions {
    flex: none;
    width: 100%;
    padding-top: 10px;
    text-align: right;
}

.comments .avatar-img {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 20px;
}

.comments .load-more-wrap {
    padding: 0 0 10px;
    margin-top: 10px;
}

.comments .comments-load-more {
    display: block;
    line-height: 40px;
    color: var(--color-text-secondary);
    text-align: center;
    background: var(--color-surface-variant);
    border-radius: var(--radius-sm);
}

.comments .comments-load-more:hover {
    background: var(--color-primary);
    color: #000000;
}

/* 按钮样式 */
.btn {
    height: 40px;
    padding: 0 15px;
    font-size: 15px;
    line-height: 40px;
    text-align: center;
    border-radius: var(--radius-sm);
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    border: none;
}

.btn + .btn {
    margin-left: 5px;
}

.btn-blue {
    display: inline-block;
    color: #000000;
    background: var(--color-primary);
}

.btn-blue:hover {
    background: var(--color-primary-light);
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