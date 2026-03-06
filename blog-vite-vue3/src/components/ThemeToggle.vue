<template>
  <button
    class="theme-toggle"
    :class="size"
    :aria-label="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggleTheme"
  >
    <transition name="theme-icon" mode="out-in">
      <svg
        v-if="isDark"
        key="moon"
        class="theme-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
      <svg
        v-else
        key="sun"
        class="theme-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>
    </transition>
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

interface Props {
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
})

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-variant);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle:hover {
  background: var(--color-primary);
  color: #000000;
  box-shadow: var(--shadow-sm);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.theme-toggle.sm {
  width: 32px;
  height: 32px;
}

.theme-toggle.md {
  width: 40px;
  height: 40px;
}

.theme-toggle.lg {
  width: 48px;
  height: 48px;
}

.theme-icon {
  width: 20px;
  height: 20px;
}

.theme-toggle.lg .theme-icon {
  width: 24px;
  height: 24px;
}

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

[data-theme="dark"] .theme-toggle:hover {
  color: #000000;
}
</style>