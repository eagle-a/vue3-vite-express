<template>
  <div
    class="entity-card"
    :class="[
      `elevation-${elevation}`,
      { 
        interactive, 
        loading,
        'no-shadow': noShadow,
        'glass-effect': glass 
      }
    ]"
    :style="customStyle"
  >
    <!-- 加载状态骨架屏 -->
    <template v-if="loading">
      <div class="skeleton-container">
        <div class="skeleton-header">
          <div class="skeleton-title"></div>
          <div class="skeleton-meta"></div>
        </div>
        <div class="skeleton-content">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    </template>
    
    <!-- 正常内容 -->
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  interactive?: boolean
  loading?: boolean
  noShadow?: boolean
  padding?: string
  glass?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  elevation: 1,
  interactive: false,
  loading: false,
  noShadow: false,
  padding: '24px',
  glass: false,
})

const customStyle = computed(() => ({
  '--card-padding': props.padding,
}))
</script>

<style scoped>
/* ==================== 基础样式 - Material 3 实体卡片 ==================== */
.entity-card {
  position: relative;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--card-padding, 24px);
  transition: all var(--transition-base) var(--ease-in-out);
  transform: translateZ(0);
  will-change: transform, box-shadow;
  contain: layout style paint;
}

/* ==================== 阴影层级系统 ==================== */
.entity-card.elevation-0 {
  box-shadow: none;
}

.entity-card.elevation-1 {
  box-shadow: var(--shadow-sm);
}

.entity-card.elevation-2 {
  box-shadow: var(--shadow-md);
}

.entity-card.elevation-3 {
  box-shadow: var(--shadow-lg);
}

.entity-card.elevation-4 {
  box-shadow: var(--shadow-xl);
}

.entity-card.elevation-5 {
  box-shadow: var(--shadow-2xl);
}

.entity-card.elevation-6 {
  box-shadow: var(--shadow-3xl);
}

.entity-card.no-shadow {
  box-shadow: none !important;
}

/* ==================== 毛玻璃效果 ==================== */
.entity-card.glass-effect {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.85) 50%,
    rgba(255, 255, 255, 0.95) 100%
  );
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.entity-card.glass-effect::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.entity-card.glass-effect.interactive:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.95) 50%,
    rgba(255, 255, 255, 1) 100%
  );
}

/* ==================== 交互效果 ==================== */
.entity-card.interactive {
  cursor: pointer;
}

.entity-card.interactive:hover {
  transform: translateY(-4px) translateZ(0);
  background: var(--color-surface-container);
}

.entity-card.interactive:hover.elevation-1 {
  box-shadow: var(--shadow-md);
}

.entity-card.interactive:hover.elevation-2 {
  box-shadow: var(--shadow-lg);
}

.entity-card.interactive:hover.elevation-3 {
  box-shadow: var(--shadow-xl);
}

.entity-card.interactive:active {
  transform: translateY(-2px) scale(0.99) translateZ(0);
  transition: all var(--transition-fast) var(--ease-out);
}

/* ==================== 骨架屏样式 ==================== */
.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.skeleton-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-title {
  height: 24px;
  width: 60%;
  background: var(--color-surface-variant);
  border-radius: var(--radius-sm);
  animation: shimmer 1.5s infinite;
}

.skeleton-meta {
  height: 16px;
  width: 40%;
  background: var(--color-surface-variant);
  border-radius: var(--radius-sm);
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.skeleton-line {
  height: 16px;
  background: var(--color-surface-variant);
  border-radius: var(--radius-sm);
  animation: shimmer 1.5s infinite;
}

.skeleton-line.short {
  width: 70%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton-title,
.skeleton-meta,
.skeleton-line {
  background: linear-gradient(
    90deg,
    var(--color-surface-variant) 0%,
    var(--color-surface-container) 50%,
    var(--color-surface-variant) 100%
  );
  background-size: 200% 100%;
}

[data-theme="dark"] .entity-card {
  background: var(--color-surface);
}

[data-theme="dark"] .entity-card.interactive:hover {
  background: var(--color-surface-container);
}

[data-theme="dark"] .entity-card.glass-effect {
  background: linear-gradient(
    135deg,
    rgba(24, 24, 27, 0.9) 0%,
    rgba(24, 24, 27, 0.8) 50%,
    rgba(24, 24, 27, 0.9) 100%
  );
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .entity-card.glass-effect::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.15) 50%,
    transparent 100%
  );
}

[data-theme="dark"] .entity-card.glass-effect.interactive:hover {
  background: linear-gradient(
    135deg,
    rgba(39, 39, 42, 0.95) 0%,
    rgba(39, 39, 42, 0.9) 50%,
    rgba(39, 39, 42, 0.95) 100%
  );
}

/* ==================== 减少动画偏好 ==================== */
@media (prefers-reduced-motion: reduce) {
  .entity-card {
    transition: none;
  }
  
  .entity-card.interactive:hover,
  .entity-card.interactive:active {
    transform: none;
  }
  
  .skeleton-title,
  .skeleton-meta,
  .skeleton-line {
    animation: none;
  }
}
</style>
