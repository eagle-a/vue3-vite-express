<template>
  <EntityCard
    :elevation="elevation"
    :interactive="interactive"
    :loading="loading"
    class="article-card"
  >
    <article v-if="!loading" class="article-content">
      <div v-if="article.thumbnail" class="article-thumbnail">
        <img :src="article.thumbnail" :alt="article.title" loading="lazy" />
      </div>

      <div class="article-body">
        <header class="article-header">
          <h3 class="article-title">{{ article.title }}</h3>
          <div v-if="article.category" class="article-category">
            {{ article.category }}
          </div>
        </header>

        <p class="article-excerpt">{{ article.excerpt }}</p>

        <footer class="article-footer">
          <div class="article-meta">
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {{ article.date }}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {{ article.views }}
            </span>
            <span class="meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                />
              </svg>
              {{ article.comments }}
            </span>
          </div>

          <div v-if="article.tags" class="article-tags">
            <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </footer>
      </div>
    </article>
  </EntityCard>
</template>

<script setup lang="ts">
import EntityCard from './EntityCard.vue'

export interface Article {
  id: string | number
  title: string
  excerpt: string
  thumbnail?: string
  category?: string
  date: string
  views: number
  comments: number
  tags?: string[]
}

interface Props {
  article: Article
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  interactive?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  elevation: 1,
  interactive: true,
  loading: false,
})
</script>

<style scoped>
.article-card {
  overflow: hidden;
}

.article-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-surface-variant);
}

.article-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-thumbnail img {
  transform: scale(1.05);
}

.article-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.article-title {
  flex: 1;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
  margin: 0;
}

.article-category {
  flex-shrink: 0;
  padding: 4px 12px;
  background: var(--color-primary);
  color: #000000;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.article-excerpt {
  font-size: 15px;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px solid var(--color-surface-variant);
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-text-hint);
}

.meta-item svg {
  width: 14px;
  height: 14px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 2px 8px;
  background: var(--color-surface-variant);
  color: var(--color-text-secondary);
  border-radius: 6px;
  font-size: 12px;
}

@media (max-width: 640px) {
  .article-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .article-category {
    order: -1;
  }
}
</style>