<template>
  <button
    class="base-button"
    :class="[
      variant,
      size,
      { 
        loading, 
        disabled: disabled || loading,
        block,
        pill: !square,
        square
      }
    ]"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <!-- 加载状态 -->
    <span v-if="loading" class="loading-spinner">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round" />
      </svg>
    </span>
    
    <!-- 图标 - 左侧 -->
    <span v-if="icon && iconPosition === 'left'" class="icon icon-left">
      <slot name="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <component :is="icon" />
        </svg>
      </slot>
    </span>
    
    <!-- 内容 -->
    <span class="button-content" :class="{ 'opacity-0': loading }">
      <slot />
    </span>
    
    <!-- 图标 - 右侧 -->
    <span v-if="icon && iconPosition === 'right'" class="icon icon-right">
      <slot name="icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <component :is="icon" />
        </svg>
      </slot>
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  square?: boolean
  icon?: any
  iconPosition?: 'left' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  square: false,
  iconPosition: 'left',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

function handleClick(event: MouseEvent) {
  if (!props.loading && !props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* ==================== 基础样式 ==================== */
.base-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-medium);
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast) var(--ease-out);
  transform: translateZ(0);
  will-change: transform, box-shadow;
  white-space: nowrap;
  user-select: none;
  overflow: hidden;
}

/* 圆角 */
.base-button.pill {
  border-radius: var(--radius-full);
}

.base-button.square {
  border-radius: var(--radius-md);
}

/* ==================== 尺寸变体 ==================== */
.base-button.sm {
  height: 32px;
  padding: 0 var(--spacing-md);
  font-size: var(--font-size-sm);
}

.base-button.sm.square {
  width: 32px;
  padding: 0;
}

.base-button.md {
  height: 40px;
  padding: 0 var(--spacing-lg);
  font-size: var(--font-size-base);
}

.base-button.md.square {
  width: 40px;
  padding: 0;
}

.base-button.lg {
  height: 48px;
  padding: 0 var(--spacing-xl);
  font-size: var(--font-size-lg);
}

.base-button.lg.square {
  width: 48px;
  padding: 0;
}

/* ==================== 颜色变体 ==================== */

/* Primary - 主按钮 */
.base-button.primary {
  background: var(--color-primary);
  color: white;
  box-shadow: var(--shadow-sm);
}

.base-button.primary:hover:not(:disabled) {
  background: var(--color-primary-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.base-button.primary:active:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(0) scale(0.98);
  box-shadow: var(--shadow-xs);
}

/* Secondary - 次要按钮 */
.base-button.secondary {
  background: var(--color-primary-container);
  color: var(--color-primary);
}

.base-button.secondary:hover:not(:disabled) {
  background: var(--color-surface-container-high);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.base-button.secondary:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

/* Tertiary - 第三按钮 */
.base-button.tertiary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-outline);
}

.base-button.tertiary:hover:not(:disabled) {
  background: var(--color-surface-container);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.base-button.tertiary:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

/* Text - 文本按钮 */
.base-button.text {
  background: transparent;
  color: var(--color-primary);
  padding-left: var(--spacing-sm);
  padding-right: var(--spacing-sm);
}

.base-button.text:hover:not(:disabled) {
  background: var(--color-surface-container);
}

.base-button.text:active:not(:disabled) {
  background: var(--color-surface-variant);
}

/* Danger - 危险按钮 */
.base-button.danger {
  background: var(--color-error);
  color: white;
  box-shadow: var(--shadow-sm);
}

.base-button.danger:hover:not(:disabled) {
  background: #d32f2f;
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.base-button.danger:active:not(:disabled) {
  background: #b71c1c;
  transform: translateY(0) scale(0.98);
  box-shadow: var(--shadow-xs);
}

/* ==================== 禁用状态 ==================== */
.base-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* ==================== 加载状态 ==================== */
.base-button.loading {
  cursor: wait;
}

.loading-spinner {
  position: absolute;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

.loading-spinner svg {
  width: 100%;
  height: 100%;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.opacity-0 {
  opacity: 0;
}

/* ==================== 图标样式 ==================== */
.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.icon svg {
  width: 100%;
  height: 100%;
}

/* ==================== Block 样式 ==================== */
.base-button.block {
  width: 100%;
}

/* ==================== 按钮内容 ==================== */
.button-content {
  display: inline-flex;
  align-items: center;
  transition: opacity var(--transition-fast);
}

/* ==================== 深色模式适配 ==================== */
[data-theme="dark"] .base-button.primary {
  background: var(--color-primary);
  color: var(--color-background);
}

[data-theme="dark"] .base-button.primary:hover:not(:disabled) {
  background: var(--color-primary-light);
}

[data-theme="dark"] .base-button.secondary {
  background: var(--color-primary-container);
  color: var(--color-primary);
}

[data-theme="dark"] .base-button.tertiary {
  border-color: var(--color-outline);
  color: var(--color-primary);
}

[data-theme="dark"] .base-button.tertiary:hover:not(:disabled) {
  border-color: var(--color-primary);
  background: var(--color-surface-container);
}

[data-theme="dark"] .base-button.text {
  color: var(--color-primary);
}

[data-theme="dark"] .base-button.text:hover:not(:disabled) {
  background: var(--color-surface-container);
}

/* ==================== 减少动画偏好 ==================== */
@media (prefers-reduced-motion: reduce) {
  .base-button {
    transition: none;
  }
  
  .base-button:hover:not(:disabled) {
    transform: none;
  }
  
  .base-button:active:not(:disabled) {
    transform: none;
  }
  
  .loading-spinner {
    animation: none;
  }
}
</style>
