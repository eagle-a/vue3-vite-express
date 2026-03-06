<template>
<EntityCard
    class="article-card"
    :elevation="1"
    :interactive="!loading"
    :loading="loading"
    glass
    @click="handleClick"
  >
    <template v-if="!loading">
      <!-- 封面图片 -->
      <div v-if="cover" class="article-cover">
        <img :src="cover" :alt="title" loading="lazy" />
        <div class="cover-overlay"></div>
      </div>

      <!-- 内容区域 -->
      <div class="article-content">
        <!-- 元信息 -->
        <div class="article-meta">
          <span v-if="category" class="category-tag">{{ category }}</span>
          <span class="publish-date">{{ formattedDate }}</span>
        </div>

        <!-- 标题 -->
        <h3 class="article-title">{{ title }}</h3>

        <!-- 摘要 -->
        <p v-if="summary" class="article-summary">{{ summary }}</p>

        <!-- 底部统计 -->
        <div class="article-stats">
          <span class="stat-item" title="阅读量">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {{ actualViewCount }}
          </span>
          <span class="stat-item" title="评论数">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            {{ actualCommentCount }}
          </span>
          <span class="stat-item" title="点赞数">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {{ actualLikeCount }}
          </span>
        </div>
      </div>
    </template>
  </EntityCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EntityCard from '@/components/base/EntityCard.vue'

interface Props {
  id?: string
  title: string
  summary?: string
  cover?: string
  category?: string
  date: string | Date
  viewCount?: number
  commentCount?: number
  likeCount?: number
  // 兼容API返回的字段名
  visit?: number
  like?: number
  comment_count?: number
  creat_date?: string
  createTime?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: '',
  summary: '',
  cover: '',
  category: '',
  viewCount: 0,
  commentCount: 0,
  likeCount: 0,
  visit: 0,
  like: 0,
  comment_count: 0,
  creat_date: '',
  createTime: '',
  loading: false,
})

const router = useRouter()

// 格式化日期
const formattedDate = computed(() => {
  // 优先使用date，然后是creat_date，最后是createTime
  const dateValue = props.date || props.creat_date || props.createTime
  const date = new Date(dateValue)

  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '未知时间'
  }

  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    const hours = Math.floor(diff / (1000 * 60 * 60))
    if (hours === 0) {
      const minutes = Math.floor(diff / (1000 * 60))
      return minutes === 0 ? '刚刚' : `${minutes}分钟前`
    }
    return `${hours}小时前`
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else if (days < 30) {
    return `${Math.floor(days / 7)}周前`
  } else if (days < 365) {
    return `${Math.floor(days / 30)}个月前`
  } else {
    return `${Math.floor(days / 365)}年前`
  }
})

// 获取实际的统计数据
const actualViewCount = computed(() => props.viewCount || props.visit || 0)
const actualCommentCount = computed(() => props.commentCount || props.comment_count || 0)
const actualLikeCount = computed(() => props.likeCount || props.like || 0)

// 点击处理
function handleClick() {
  if (props.id && !props.loading) {
    router.push(`/article/${props.id}`)
  }
}
</script>

<style scoped>
.article-card {
  cursor: pointer;
}

/* 封面图片 */
.article-cover {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-md);
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-slow) var(--ease-out);
}

.article-card:hover .article-cover img {
  transform: scale(1.05);
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(103, 80, 164, 0.05) 100%
  );
  pointer-events: none;
}

/* 内容区域 */
.article-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

/* 元信息 */
.article-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
}

.category-tag {
  display: inline-flex;
  align-items: center;
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary-container);
  color: var(--color-primary);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-full);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.publish-date {
  font-size: var(--font-size-sm);
  color: var(--color-text-hint);
}

/* 标题 */
.article-title {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color var(--transition-fast);
}

.article-card:hover .article-title {
  color: var(--color-primary);
}

/* 摘要 */
.article-summary {
  margin: 0;
  font-size: var(--font-size-base);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 统计信息 */
.article-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-outline-variant);
}

.stat-item {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-hint);
  transition: color var(--transition-fast);
}

.stat-item:hover {
  color: var(--color-primary);
}

.stat-item svg {
  width: 16px;
  height: 16px;
}

/* 深色模式适配 */
[data-theme="dark"] .category-tag {
  background: var(--color-primary-container);
  color: var(--color-primary);
}

[data-theme="dark"] .article-stats {
  border-color: var(--color-outline-variant);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-title {
    font-size: var(--font-size-lg);
  }

  .article-summary {
    font-size: var(--font-size-sm);
    -webkit-line-clamp: 2;
  }

  .article-stats {
    gap: var(--spacing-md);
  }
}

/* 减少动画偏好 */
@media (prefers-reduced-motion: reduce) {
  .article-cover img {
    transition: none;
  }

  .article-card:hover .article-cover img {
    transform: none;
  }
}
</style>
