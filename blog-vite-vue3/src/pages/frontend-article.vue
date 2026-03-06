<template>
  <div class="frontend-article">
    <!-- 主内容区 -->
    <main class="main-content">
      <div class="container">
        <!-- 文章内容 -->
        <article class="article-content">
          <!-- 加载状态 -->
          <div v-if="!isLoad" class="loading-state">
            <EntityCard :elevation="1" :loading="true" />
          </div>

          <!-- 文章不存在 -->
          <div v-else-if="!articleData" class="not-found">
            <EntityCard :elevation="1">
              <div class="not-found-content">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <h2>文章不存在</h2>
                <p>该文章不存在，或者该文章已经被删除</p>
                <BaseButton variant="primary" @click="$router.push('/')">
                  返回首页
                </BaseButton>
              </div>
            </EntityCard>
          </div>

          <!-- 正常内容 -->
          <template v-else>
            <!-- 文章头部 -->
            <header class="article-header">
              <div class="article-meta">
                <router-link
                  v-if="articleData.category"
                  :to="`/category/${articleData.category._id}`"
                  class="category-link"
                >
                  {{ articleData.category.name }}
                </router-link>
                <span class="publish-date">{{ formatDate(articleData.createTime) }}</span>
              </div>

              <h1 class="article-title">{{ articleData.title }}</h1>

              <div class="article-stats">
                <span class="stat-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {{ articleData.visitCount || 0 }} 阅读
                </span>
                <span class="stat-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  {{ articleData.commentCount || 0 }} 评论
                </span>
                <button
                  class="stat-item like-btn"
                  :class="{ liked: isLiked }"
                  @click="handleLike"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  {{ articleData.likeCount || 0 }} 点赞
                </button>
              </div>
            </header>

            <!-- 文章正文 -->
            <EntityCard :elevation="1" class="article-body">
              <MarkdownRenderer :content="articleData.content" />
            </EntityCard>

            <!-- 文章标签 -->
            <div v-if="articleData.tags && articleData.tags.length > 0" class="article-tags">
              <span class="tags-label">标签：</span>
              <router-link
                v-for="tag in articleData.tags"
                :key="tag"
                :to="`/tag/${tag}`"
                class="tag-link"
              >
                {{ tag }}
              </router-link>
            </div>

            <!-- 评论区 -->
            <section class="comments-section">
              <h2 class="comments-title">
                评论 ({{ commentsList.pagination?.total || 0 }})
              </h2>
              <!-- 评论列表组件 -->
              <CommentList :comments="commentsList.data" />
            </section>
          </template>
        </article>

        <!-- 侧边栏 -->
        <aside class="sidebar">
          <!-- 作者信息 -->
          <EntityCard :elevation="1" class="sidebar-card">
            <div class="author-info">
              <div class="author-avatar">
                <span>{{ authorInitial }}</span>
              </div>
              <h3 class="author-name">{{ articleData?.author || '湛明' }}</h3>
              <p class="author-bio">前端开发者 · 技术博主</p>
              <div class="author-links">
                <a href="#" class="social-link" title="GitHub">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a href="#" class="social-link" title="Twitter">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
                <a href="#" class="social-link" title="Email">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </a>
              </div>
            </div>
          </EntityCard>

          <!-- 目录导航 -->
          <EntityCard v-if="toc.length > 0" :elevation="1" class="sidebar-card toc-card">
            <h3 class="sidebar-title">目录</h3>
            <nav class="toc-nav">
              <a
                v-for="item in toc"
                :key="item.id"
                :href="`#${item.id}`"
                class="toc-link"
                :class="{ active: activeToc === item.id }"
                :style="{ paddingLeft: `${(item.level - 1) * 16 + 12}px` }"
                @click.prevent="scrollToHeading(item.id)"
              >
                {{ item.text }}
              </a>
            </nav>
          </EntityCard>

          <!-- 热门文章 -->
          <EntityCard v-if="trendingList.length > 0" :elevation="1" class="sidebar-card">
            <h3 class="sidebar-title">热门文章</h3>
            <div class="trending-list">
              <router-link
                v-for="(article, index) in trendingList.slice(0, 5)"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import EntityCard from '@/components/base/EntityCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import MarkdownRenderer from '@/features/articles/MarkdownRenderer.vue'
import BackToTop from '@/components/BackToTop.vue'
import useFrontendArticleStore from '@/app/store/use-frontend-article-store'
import useGlobalCategoryStore from '@/app/store/use-global-category-store'
import useGlobalCommentStore from '@/app/store/use-global-comment-store'
import { useSaveScroll } from '@/composables'

// 类型定义
interface MenuItem {
  name: string
  path: string
}

interface TocItem {
  id: string
  text: string
  level: number
}

// 导航菜单
const menuItems: MenuItem[] = [
  { name: '首页', path: '/' },
  { name: '关于', path: '/about' },
]

// Store
const articleStore = useFrontendArticleStore()
const categoryStore = useGlobalCategoryStore()
const commentStore = useGlobalCommentStore()
const { item: articleItem, trending: trendingData } = storeToRefs(articleStore)
const { lists: commentsData } = storeToRefs(commentStore)

// Router
const route = useRoute()
const router = useRouter()

// 保存滚动位置
useSaveScroll()

// 状态
const isLiked = ref(false)
const activeToc = ref('')
const toc = ref<TocItem[]>([])

// 计算属性
const isLoad = computed(() => articleItem.value.isLoad)
const articleData = computed(() => articleItem.value.data)
const trendingList = computed(() => trendingData.value || [])
const commentsList = computed(() => commentsData.value || { data: [], pagination: { total: 0 } })
const authorInitial = computed(() => {
  return articleData.value?.author?.charAt(0).toUpperCase() || '湛'
})

// 方法
function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function handleLike() {
  if (!isLiked.value && articleData.value) {
    isLiked.value = true
    articleData.value.likeCount = (articleData.value.likeCount || 0) + 1
    // TODO: 调用 API 保存点赞
  }
}

function generateToc() {
  if (!articleData.value?.content) return

  const parser = new DOMParser()
  const doc = parser.parseFromString(articleData.value.content, 'text/html')
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')

  toc.value = Array.from(headings).map((heading, index) => {
    const id = `heading-${index}`
    heading.id = id
    return {
      id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1)),
    }
  })
}

function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
    activeToc.value = id
  }
}

function updateActiveToc() {
  const headings = toc.value.map(item => document.getElementById(item.id)).filter(Boolean)
  const scrollPosition = window.scrollY + 100

  for (let i = headings.length - 1; i >= 0; i--) {
    const heading = headings[i]
    if (heading && heading.offsetTop <= scrollPosition) {
      activeToc.value = toc.value[i].id
      return
    }
  }
  activeToc.value = ''
}

// 监听文章数据变化
watch(() => articleData.value, () => {
  if (articleData.value?.content) {
    generateToc()
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  window.addEventListener('scroll', updateActiveToc, { passive: true })
})

// 组件选项
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
</script>

<style scoped>
.frontend-article {
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
  grid-template-columns: 1fr 320px;
  gap: var(--spacing-xl);
}

/* 文章内容 */
.article-content {
  min-width: 0;
}

/* 加载状态 */
.loading-state {
  margin-bottom: var(--spacing-lg);
}

/* 文章不存在 */
.not-found {
  margin-bottom: var(--spacing-lg);
}

.not-found-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-5xl) var(--spacing-xl);
  text-align: center;
}

.not-found-content svg {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-lg);
  color: var(--color-text-hint);
}

.not-found-content h2 {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-2xl);
  color: var(--color-text-primary);
}

.not-found-content p {
  margin: 0 0 var(--spacing-xl) 0;
  color: var(--color-text-secondary);
}

/* 文章头部 */
.article-header {
  margin-bottom: var(--spacing-xl);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.category-link {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-primary-container);
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.category-link:hover {
  background: var(--color-primary);
  color: white;
}

.publish-date {
  font-size: var(--font-size-sm);
  color: var(--color-text-hint);
}

.article-title {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

.article-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-hint);
}

.stat-item svg {
  width: 16px;
  height: 16px;
}

.like-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.like-btn:hover {
  background: var(--color-surface-container);
  color: var(--color-primary);
}

.like-btn.liked {
  color: var(--color-error);
}

.like-btn.liked svg {
  fill: currentColor;
}

/* 文章正文 */
.article-body {
  margin-bottom: var(--spacing-xl);
}

/* 文章标签 */
.article-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-md) 0;
  border-top: 1px solid var(--color-outline-variant);
  border-bottom: 1px solid var(--color-outline-variant);
}

.tags-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.tag-link {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-surface-container);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  text-decoration: none;
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.tag-link:hover {
  background: var(--color-primary-container);
  color: var(--color-primary);
}

/* 评论区 */
.comments-section {
  margin-top: var(--spacing-2xl);
}

.comments-title {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
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

/* 作者信息 */
.author-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.author-avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
}

.author-avatar span {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: white;
}

.author-name {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.author-bio {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.author-links {
  display: flex;
  gap: var(--spacing-md);
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-surface-container);
  color: var(--color-text-secondary);
  border-radius: var(--radius-full);
  transition: all var(--transition-fast);
}

.social-link:hover {
  background: var(--color-primary);
  color: white;
}

.social-link svg {
  width: 18px;
  height: 18px;
}

/* 目录导航 */
.toc-card {
  max-height: 400px;
  overflow-y: auto;
}

.toc-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.toc-link {
  display: block;
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  line-height: var(--line-height-snug);
}

.toc-link:hover {
  background: var(--color-surface-container);
  color: var(--color-text-primary);
}

.toc-link.active {
  background: var(--color-primary-container);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
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

  .toc-card {
    display: none;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-lg) 0;
  }

  .container {
    padding: 0 var(--spacing-md);
  }

  .article-title {
    font-size: var(--font-size-2xl);
  }

  .sidebar {
    grid-template-columns: 1fr;
  }
}

/* 深色模式适配 */
[data-theme="dark"] .category-link {
  background: var(--color-primary-container);
  color: var(--color-primary);
}

[data-theme="dark"] .tag-link {
  background: var(--color-surface-container);
  color: var(--color-text-secondary);
}

[data-theme="dark"] .trending-rank {
  background: var(--color-surface-variant);
}

[data-theme="dark"] .social-link {
  background: var(--color-surface-container);
}
</style>
