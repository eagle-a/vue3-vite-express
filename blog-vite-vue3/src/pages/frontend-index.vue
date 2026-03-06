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
                <div class="articles-section">
                    <div v-if="!topics.path" class="loading-container">
                        <EntityCard :loading="true" />
                        <EntityCard :loading="true" />
                        <EntityCard :loading="true" />
                    </div>

                    <template v-else-if="topics.data.length > 0">
                        <ArticleCard
                            v-for="item in topics.data"
                            :key="item._id"
                            :article="transformArticle(item)"
                            :elevation="2"
                            interactive
                        />
                        <div class="load-more-container">
                            <BaseButton
                                v-if="topics.hasNext"
                                :loading="loading"
                                @click="loadMore()"
                            >
                                {{ loading ? '加载中' : '加载更多' }}
                            </BaseButton>
                        </div>
                    </template>

                    <EntityCard v-else :elevation="1">
                        <div class="empty-state">
                            <p>当前分类还没有文章...</p>
                        </div>
                    </EntityCard>
                </div>

                <Sidebar
                    :categories="transformCategories(category)"
                    :hot-articles="transformTrending(trending)"
                >
                    <template #top>
                        <SearchBox
                            v-model="searchKey"
                            placeholder="搜索文章..."
                            @search="handleSearch"
                        />
                    </template>
                </Sidebar>
            </div>
        </main>

        <BackToTop :visibility-height="100" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
    Navbar,
    ThemeToggle,
    GlassPanel,
    EntityCard,
    BaseButton,
    BackToTop,
    ArticleCard,
    Sidebar,
    SearchBox,
} from '@/components'
import type { Article, Category, HotArticle } from '@/components'

defineOptions({
    name: 'FrontendIndex',
    asyncData(ctx) {
        const { store, route, api } = ctx
        const {
            params: { id, key, by },
            fullPath: path,
        } = route
        const globalCategoryStore = useGlobalCategoryStore(store)
        const frontendArticleStore = useFrontendArticleStore(store)
        return Promise.all([
            globalCategoryStore.getCategoryList({}, api),
            frontendArticleStore.getTrending(undefined, api),
            frontendArticleStore.getArticleList({ page: 1, limit: 10, id, path, key, by }, api),
        ])
    },
})

const route = useRoute()
const router = useRouter()

const globalCategoryStore = useGlobalCategoryStore()
const { lists: category } = $(storeToRefs(globalCategoryStore))

const frontendArticleStore = useFrontendArticleStore()
const { lists: topics, trending } = $(storeToRefs(frontendArticleStore))

useSaveScroll()

const {
    params: { id, key, by },
    path,
} = route

const [loading, toggleLoading] = useToggle(false)
const searchKey = ref(key || '')

async function loadMore(page = topics.page) {
    if (loading.value) {
        return
    }
    toggleLoading(true)
    await frontendArticleStore.getArticleList({ page, limit: 10, id, path, key, by })
    toggleLoading(false)
}

onActivated(() => {
    console.log(`frontend-index onActivated:${route.path}`)
    if (topics.path !== route.path) {
        loadMore(1)
    }
})

const handleSearch = (query: string) => {
    if (query.trim()) {
        router.push(`/search/${query}`)
    }
}

const transformArticle = (item: any): Article => {
    return {
        id: item._id,
        title: item.title,
        excerpt: item.content || '',
        thumbnail: item.img_url,
        category: item.category?.cate_name,
        date: item.create_at?.slice(0, 10) || '',
        views: item.visit || 0,
        comments: item.comment_count || 0,
        tags: item.tags,
    }
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
    const { id, key, by } = route.params
    if (id) {
        const obj = category.find(item => item._id === id)
        if (obj) {
            title = `${obj.cate_name} - ${title}`
        }
    }
    else if (key) {
        title = `搜索: ${key} - ${title}`
    }
    else if (by) {
        title = `热门 - ${title}`
    }
    return title
})

useHead({
    title: headTitle,
    meta: [
        {
            name: 'description',
            content: '湛明博客 - 分享技术和生活',
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

.articles-section {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.loading-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.load-more-container {
    display: flex;
    justify-content: center;
    padding: 20px 0;
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
}
</style>