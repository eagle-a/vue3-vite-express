<template>
  <aside class="sidebar">
    <slot name="top" />

    <div v-if="user" class="sidebar-section user-card">
      <EntityCard :elevation="2">
        <div class="user-info">
          <div class="user-avatar">
            <img :src="user.avatar" :alt="user.name" />
          </div>
          <h3 class="user-name">{{ user.name }}</h3>
          <p class="user-bio">{{ user.bio }}</p>
          <div class="user-stats">
            <div class="stat-item">
              <span class="stat-value">{{ user.articles }}</span>
              <span class="stat-label">文章</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ user.followers }}</span>
              <span class="stat-label">关注者</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ user.likes }}</span>
              <span class="stat-label">获赞</span>
            </div>
          </div>
        </div>
      </EntityCard>
    </div>

    <div v-if="categories.length" class="sidebar-section">
      <h3 class="section-title">分类</h3>
      <EntityCard :elevation="1" interactive>
        <div class="category-list">
          <div
            v-for="category in categories"
            :key="category.name"
            class="category-item"
          >
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.count }}</span>
          </div>
        </div>
      </EntityCard>
    </div>

    <div v-if="hotArticles.length" class="sidebar-section">
      <h3 class="section-title">热门文章</h3>
      <div class="article-list">
        <EntityCard
          v-for="(article, index) in hotArticles"
          :key="article.id"
          :elevation="1"
          interactive
          class="article-item"
        >
          <div class="article-rank">{{ index + 1 }}</div>
          <div class="article-info">
            <h4 class="article-title">{{ article.title }}</h4>
            <div class="article-meta">
              <span>{{ article.views }} 阅读</span>
            </div>
          </div>
        </EntityCard>
      </div>
    </div>

    <div v-if="tags.length" class="sidebar-section">
      <h3 class="section-title">标签云</h3>
      <EntityCard :elevation="1">
        <div class="tag-cloud">
          <span
            v-for="tag in tags"
            :key="tag"
            class="tag-item"
          >
            {{ tag }}
          </span>
        </div>
      </EntityCard>
    </div>

    <slot name="bottom" />
  </aside>
</template>

<script setup lang="ts">
import EntityCard from './EntityCard.vue'

export interface User {
  name: string
  avatar: string
  bio: string
  articles: number
  followers: number
  likes: number
}

export interface Category {
  name: string
  count: number
}

export interface HotArticle {
  id: string | number
  title: string
  views: number
}

interface Props {
  user?: User
  categories?: Category[]
  hotArticles?: HotArticle[]
  tags?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  categories: () => [],
  hotArticles: () => [],
  tags: () => [],
})
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  padding-left: 4px;
}

.user-card .user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--color-primary);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.user-bio {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.user-stats {
  display: flex;
  gap: 32px;
  padding-top: 12px;
  border-top: 1px solid var(--color-surface-variant);
  width: 100%;
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.stat-label {
  font-size: 12px;
  color: var(--color-text-hint);
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-surface-variant);
  transition: all 0.2s ease;
}

.category-item:last-child {
  border-bottom: none;
}

.category-item:hover {
  padding-left: 8px;
}

.category-name {
  font-size: 14px;
  color: var(--color-text-primary);
}

.category-count {
  font-size: 12px;
  padding: 2px 8px;
  background: var(--color-surface-variant);
  color: var(--color-text-secondary);
  border-radius: 12px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-item {
  display: flex;
  gap: 12px;
}

.article-rank {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: #000000;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.article-info {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-meta {
  font-size: 12px;
  color: var(--color-text-hint);
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 4px 12px;
  background: var(--color-surface-variant);
  color: var(--color-text-secondary);
  border-radius: 12px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-item:hover {
  background: var(--color-primary);
  color: #000000;
}

[data-theme='dark'] .category-item:hover {
  padding-left: 8px;
}
</style>