<template>
  <div
    class="glass-panel"
    :class="[
      variant,
      { interactive, gradient, glow, 'no-blur': noBlur }
    ]"
    :style="customStyle"
  >
    <div v-if="gradient" class="glass-gradient"></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'elevated' | 'flat' | 'outlined' | 'frosted'
  interactive?: boolean
  blur?: number
  opacity?: number
  gradient?: boolean
  glow?: boolean
  glowColor?: string
  noBlur?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  interactive: false,
  blur: 16,
  opacity: 0.85,
  gradient: false,
  glow: false,
  glowColor: '#6750A4',
  noBlur: false,
})

const customStyle = computed(() => ({
  '--glass-blur': `${props.blur}px`,
  '--glass-opacity': props.opacity,
  '--glow-color': props.glowColor,
}))
</script>

<style scoped>
/* ==================== Acrylic 玻璃基础样式 ==================== */
.glass-panel {
  position: relative;
  border-radius: var(--radius-lg);
  transition: all var(--transition-base) var(--ease-in-out);
  overflow: hidden;
  transform: translateZ(0);
  will-change: backdrop-filter, transform, box-shadow;
  contain: layout style paint;
}

/* 非 noBlur 模式下应用 Acrylic 效果 */
.glass-panel:not(.no-blur) {
  backdrop-filter: blur(var(--glass-blur, 16px)) saturate(var(--acrylic-saturate, 180%));
  -webkit-backdrop-filter: blur(var(--glass-blur, 16px)) saturate(var(--acrylic-saturate, 180%));
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, calc(var(--glass-opacity, 0.85) * 1.1)) 0%,
    rgba(255, 255, 255, var(--glass-opacity, 0.85)) 50%,
    rgba(255, 255, 255, calc(var(--glass-opacity, 0.85) * 1.1)) 100%
  );
  border: 1px solid var(--acrylic-highlight);
}

/* noBlur 模式下使用实色背景 */
.glass-panel.no-blur {
  background: var(--color-surface);
  border: 1px solid var(--color-outline-variant);
}

/* ==================== 顶部高光条 - Acrylic 特征 ==================== */
.glass-panel:not(.no-blur)::before {
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
  pointer-events: none;
  z-index: 1;
}

/* ==================== 顶部径向高光 ==================== */
.glass-panel:not(.no-blur)::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 2px;
  background: radial-gradient(
    ellipse at center,
    rgba(255, 255, 255, 0.4) 0%,
    transparent 70%
  );
  pointer-events: none;
  z-index: 1;
}

/* ==================== 变体样式 ==================== */

/* Elevated - 悬浮效果 */
.glass-panel.elevated {
  box-shadow: var(--shadow-lg);
}

.glass-panel.elevated:not(.no-blur) {
  box-shadow:
    var(--shadow-lg),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Flat - 扁平效果 */
.glass-panel.flat {
  box-shadow: none;
}

/* Outlined - 描边效果 */
.glass-panel.outlined:not(.no-blur) {
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: none;
}

.glass-panel.outlined.no-blur {
  border-width: 1px;
  border-color: var(--color-outline);
  box-shadow: none;
}

/* Frosted - 毛玻璃效果 */
.glass-panel.frosted:not(.no-blur) {
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.4) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.4) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.5);
}

/* ==================== 渐变效果 ==================== */
.glass-panel.gradient:not(.no-blur) {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, calc(var(--glass-opacity, 0.85) * 1.3)),
    rgba(255, 255, 255, calc(var(--glass-opacity, 0.85) * 0.9)),
    rgba(255, 255, 255, calc(var(--glass-opacity, 0.85) * 1.3))
  );
}

/* ==================== 发光效果 ==================== */
.glass-panel.glow {
  box-shadow:
    0 8px 32px rgba(103, 80, 164, 0.15),
    0 0 20px rgba(103, 80, 164, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

/* ==================== 交互效果 ==================== */
.glass-panel.interactive {
  cursor: pointer;
}

.glass-panel.interactive:hover {
  transform: translateY(-4px) translateZ(0);
}

.glass-panel.interactive:hover:not(.no-blur) {
  backdrop-filter: blur(20px) saturate(200%);
  -webkit-backdrop-filter: blur(20px) saturate(200%);
  box-shadow:
    var(--shadow-xl),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.5);
}

.glass-panel.interactive:hover.no-blur {
  box-shadow: var(--shadow-xl);
  border-color: var(--color-outline);
}

.glass-panel.interactive:active {
  transform: translateY(-2px) scale(0.99) translateZ(0);
  transition: all var(--transition-fast) var(--ease-out);
}

/* ==================== 渐变覆盖层 ==================== */
.glass-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  pointer-events: none;
  z-index: 2;
}

/* ==================== 深色模式适配 ==================== */
[data-theme="dark"] .glass-panel:not(.no-blur) {
  background: linear-gradient(
    135deg,
    rgba(40, 40, 40, calc(var(--glass-opacity, 0.85) * 1.1)) 0%,
    rgba(30, 30, 30, var(--glass-opacity, 0.85)) 50%,
    rgba(40, 40, 40, calc(var(--glass-opacity, 0.85) * 1.1)) 100%
  );
  border-color: var(--acrylic-highlight);
}

[data-theme="dark"] .glass-panel:not(.no-blur)::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(168, 168, 168, 0.2) 50%,
    transparent 100%
  );
}

[data-theme="dark"] .glass-panel:not(.no-blur)::after {
  background: radial-gradient(
    ellipse at center,
    rgba(168, 168, 168, 0.1) 0%,
    transparent 70%
  );
}

[data-theme="dark"] .glass-panel.no-blur {
  background: var(--color-surface);
  border-color: var(--color-outline-variant);
}

[data-theme="dark"] .glass-panel.elevated:not(.no-blur) {
  box-shadow:
    var(--shadow-lg),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .glass-panel.gradient:not(.no-blur) {
  background: linear-gradient(
    135deg,
    rgba(50, 50, 50, calc(var(--glass-opacity, 0.85) * 1.3)),
    rgba(40, 40, 40, calc(var(--glass-opacity, 0.85) * 0.9)),
    rgba(50, 50, 50, calc(var(--glass-opacity, 0.85) * 1.3))
  );
}

[data-theme="dark"] .glass-panel.glow {
  box-shadow:
    0 8px 32px rgba(208, 188, 255, 0.1),
    0 0 20px rgba(208, 188, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

[data-theme="dark"] .glass-panel.interactive:hover:not(.no-blur) {
  border-color: rgba(168, 168, 168, 0.2);
  box-shadow:
    var(--shadow-xl),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

[data-theme="dark"] .glass-gradient {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(168, 168, 168, 0.2),
    transparent
  );
}

/* ==================== 减少动画偏好 ==================== */
@media (prefers-reduced-motion: reduce) {
  .glass-panel {
    transition: none;
  }

  .glass-panel.interactive:hover,
  .glass-panel.interactive:active {
    transform: none;
  }
}

/* ==================== 性能优化 ==================== */
@supports not (backdrop-filter: blur(1px)) {
  .glass-panel:not(.no-blur) {
    background: var(--color-surface-container);
    backdrop-filter: none;
  }
}
</style>
