<template>
  <button
    class="base-button"
    :class="[variant, size, { disabled, loading }]"
    :disabled="disabled || loading"
    :type="type"
  >
    <svg
      v-if="loading"
      class="button-loader"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        stroke-dasharray="31.4 31.4"
        stroke-linecap="round"
      />
    </svg>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
export interface BaseButtonProps {
  variant?: 'primary' | 'secondary' | 'text' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<BaseButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})
</script>

<style scoped>
.base-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  outline: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  white-space: nowrap;
}

.base-button:active:not(.disabled):not(.loading) {
  transform: scale(0.96);
}

.base-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.base-button.primary {
  background: var(--color-primary);
  color: #000000;
}

.base-button.primary:hover:not(.disabled):not(.loading) {
  background: var(--color-primary-light);
  box-shadow: var(--shadow-md);
}

.base-button.secondary {
  background: var(--color-surface-variant);
  color: var(--color-text-primary);
}

.base-button.secondary:hover:not(.disabled):not(.loading) {
  background: #e5e5e5;
}

.base-button.text {
  background: transparent;
  color: var(--color-primary);
}

.base-button.text:hover:not(.disabled):not(.loading) {
  background: var(--color-surface-variant);
}

.base-button.icon {
  width: 40px;
  height: 40px;
  padding: 0;
  background: var(--color-surface-variant);
  color: var(--color-text-secondary);
  border-radius: 50%;
}

.base-button.icon:hover:not(.disabled):not(.loading) {
  background: var(--color-primary);
  color: #000000;
  box-shadow: var(--shadow-sm);
}

.base-button.sm {
  height: 32px;
  padding: 0 16px;
  font-size: var(--font-size-sm, 14px);
}

.base-button.md {
  height: 40px;
  padding: 0 24px;
  font-size: var(--font-size-base, 15px);
}

.base-button.lg {
  height: 48px;
  padding: 0 32px;
  font-size: var(--font-size-lg, 16px);
}

.base-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button.loading {
  cursor: wait;
  color: transparent;
}

.button-loader {
  position: absolute;
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
}

.button-loader circle {
  stroke: currentColor;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

[data-theme='dark'] .base-button.primary:hover:not(.disabled):not(.loading) {
  box-shadow: var(--shadow-md);
}

[data-theme='dark'] .base-button.secondary:hover:not(.disabled):not(.loading) {
  background: #3a3a3a;
}

[data-theme='dark'] .base-button.icon:hover:not(.disabled):not(.loading) {
  box-shadow: var(--shadow-sm);
}
</style>