<template>
  <div class="frontend-index">
    <!-- 主内容区 -->
    <main class="main-content">
      <div class="container">
        <!-- 文章列表 -->
        <div class="content-area">
          <div class="articles-grid">
<ArticleCard
              v-for="article in articleList"
              :key="article._id"
              :id="article._id"
              :title="article.title"
              :summary="article.summary"
              :cover="article.cover"
              :category="article.category?.name"
              :date="article.creat_date"
              :view-count="article.visit"
              :comment-count="article.comment_count"
              :like-count="article.like"
            />
          </div>

          <!-- 加载更多 -->
          <div v-if="hasMore" class="load-more">
            <BaseButton
              variant="secondary"
              size="lg"
              :loading="isLoading"
              @click="loadMore"
            >
              {{ isLoading ? '加载中...' : '加载更多' }}
            </BaseButton>
          </div>

          <!-- 无更多数据 -->
          <div v-else-if="articleList.length > 0" class="no-more">
            <p>已经到底了 ~</p>
          </div>

          <!-- 空状态 -->
          <div v-else-if="!isLoading" class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <p>暂无文章</p>
          </div>
        </div>

        <!-- 侧边栏 -->
        <aside class="sidebar">
          <!-- 搜索 -->
          <EntityCard glass class="sidebar-card" :elevation="1">
            <h3 class="sidebar-title">搜索</h3>
            <div class="search-box">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索文章..."
                @keyup.enter="handleSearch(searchQuery)"
              />
              <button @click="handleSearch(searchQuery)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </button>
            </div>
          </EntityCard>

          <!-- 分类 -->
          <EntityCard v-if="categoryList.length > 0" class="sidebar-card" :elevation="1">
            <h3 class="sidebar-title">分类</h3>
            <div class="category-list">
              <button
                v-for="cat in categoryList"
                :key="cat._id"
                class="category-item"
                :class="{ active: currentCategory === cat._id }"
                @click="filterByCategory(cat._id)"
              >
                <span class="category-name">{{ cat.name }}</span>
                <span class="category-count">{{ cat.articleCount || 0 }}</span>
              </button>
            </div>
          </EntityCard>

          <!-- 热门文章 -->
          <EntityCard v-if="trendingList.length > 0" class="sidebar-card" :elevation="1">
            <h3 class="sidebar-title">热门文章</h3>
            <div class="trending-list">
              <router-link
                v-for="(article, index) in trendingList"
                :key="article._id"
                :to="`/article/${article._id}`"
                class="trending-item"
              >
                <span class="trending-rank" :class="{ top: index < 3 }">{{ index + 1 }}</span>
                <span class="trending-title">{{ article.title }}</span>
              </router-link>
            </div>
          </EntityCard>
        </aside>
      </div>
    </main>

    <!-- 返回顶部 -->
    <BackToTop />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import ArticleCard from '@/features/articles/ArticleCard.vue'
import EntityCard from '@/components/base/EntityCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BackToTop from '@/components/BackToTop.vue'
import useFrontendArticleStore from '@/app/store/use-frontend-article-store'
import useGlobalCategoryStore from '@/app/store/use-global-category-store'
import { useSaveScroll } from '@/composables'

// 类型定义
interface MenuItem {
  name: string
  path: string
}

// 导航菜单
const menuItems: MenuItem[] = [
  { name: '首页', path: '/' },
  { name: '关于', path: '/about' },
  { name: '工具', path: '/tools' },
  { name: 'Game', path: '/game' },
  { name: 'AI', path: '/ai' },
]

// Store
const articleStore = useFrontendArticleStore()
const categoryStore = useGlobalCategoryStore()
const { lists: articleData, trending: trendingData } = storeToRefs(articleStore)
const { lists: categoryList } = storeToRefs(categoryStore)

// Router
const router = useRouter()

// 保存滚动位置
useSaveScroll()

// 状态
const isLoading = ref(false)
const searchQuery = ref('')
const currentCategory = ref('')
const page = ref(1)

// 计算属性
const articleList = computed(() => articleData.value.data || [])
const trendingList = computed(() => trendingData.value || [])
const hasMore = computed(() => articleData.value.hasNext === 1)

// 方法
async function loadArticles(reset = false) {
  if (isLoading.value) return

  isLoading.value = true
  try {
    if (reset) {
      page.value = 1
    }

    await articleStore.getArticleList({
      page: page.value,
      limit: 10,
      category: currentCategory.value,
    })
  } finally {
    isLoading.value = false
  }
}

async function loadMore() {
  if (!hasMore.value || isLoading.value) return
  page.value++
  await loadArticles()
}

function handleSearch(query: string) {
  if (query.trim()) {
    router.push({ path: '/search', query: { q: query.trim() } })
  }
}

function filterByCategory(categoryId: string) {
  if (currentCategory.value === categoryId) {
    currentCategory.value = ''
  } else {
    currentCategory.value = categoryId
  }
  loadArticles(true)
}

// 生命周期
onMounted(() => {
  // 数据已在 asyncData 中预取
})

// 组件选项
defineOptions({
  name: 'FrontendIndex',
  asyncData(ctx) {
    const { store, api } = ctx
    const articleStore = useFrontendArticleStore(store)
    const categoryStore = useGlobalCategoryStore(store)

    return Promise.all([
      articleStore.getArticleList({ page: 1, limit: 10 }, api),
      articleStore.getTrending(undefined, api),
      categoryStore.getCategoryList({}, api),
    ])
  },
})
</script>

<style scoped>
.frontend-index {
  min-height: 100vh;
  background: var(--color-background);
  padding-top: var(--navbar-height);
}

/* 主内容区 */
.main-content {
  padding: var(--spacing-xl) 0;
}

.container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  display: grid;
  grid-template-columns: 1fr var(--sidebar-width);
  gap: var(--spacing-xl);
}

/* 文章列表 */
.content-area {
  min-width: 0;
}

.articles-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

/* 加载更多 */
.load-more {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-xl);
}

.no-more {
  text-align: center;
  padding: var(--spacing-xl) 0;
  color: var(--color-text-hint);
}

.no-more p {
  margin: 0;
  font-size: var(--font-size-sm);
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-5xl) 0;
  color: var(--color-text-hint);
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: var(--font-size-lg);
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  position: sticky;
  top: calc(var(--navbar-height) + var(--spacing-xl));
  height: fit-content;
}

.sidebar-card {
  padding: var(--spacing-lg);
}

.sidebar-title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

/* 搜索框 */
.search-box {
  display: flex;
  gap: var(--spacing-sm);
}

.search-box input {
  flex: 1;
  height: 40px;
  padding: 0 var(--spacing-md);
  background: var(--color-surface-container);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-container);
}

.search-box input::placeholder {
  color: var(--color-text-hint);
}

.search-box button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-box button:hover {
  background: var(--color-primary-light);
}

.search-box button svg {
  width: 18px;
  height: 18px;
}

/* 分类列表 */
.category-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;
}

.category-item:hover {
  background: var(--color-surface-container);
}

.category-item.active {
  background: var(--color-primary-container);
}

.category-name {
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
}

.category-item.active .category-name {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.category-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-hint);
  background: var(--color-surface-container);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  min-width: 24px;
  text-align: center;
}

.category-item.active .category-count {
  background: var(--color-primary);
  color: white;
}

/* 热门文章 */
.trending-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.trending-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.trending-item:hover {
  background: var(--color-surface-container);
}

.trending-rank {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--color-surface-variant);
  color: var(--color-text-hint);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.trending-rank.top {
  background: var(--color-primary);
  color: white;
}

.trending-title {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.trending-item:hover .trending-title {
  color: var(--color-primary);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-lg) 0;
  }

  .container {
    padding: 0 var(--spacing-md);
  }

  .articles-grid {
    gap: var(--spacing-md);
  }

  .sidebar {
    grid-template-columns: 1fr;
  }
}

/* 深色模式适配 */
[data-theme="dark"] .search-box input {
  background: var(--color-surface-container);
  border-color: var(--color-outline-variant);
  color: var(--color-text-primary);
}

[data-theme="dark"] .category-count {
  background: var(--color-surface-container);
}

[data-theme="dark"] .trending-rank {
  background: var(--color-surface-variant);
}
</style>
