<template>
  <div
    class="glass-panel"
    :class="[variant, { elevated, interactive }]"
    :style="customStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface GlassPanelProps {
  variant?: 'default' | 'outlined' | 'filled'
  interactive?: boolean
  elevated?: boolean
  blur?: number
  opacity?: number
}

const props = withDefaults(defineProps<GlassPanelProps>(), {
  variant: 'default',
  interactive: false,
  elevated: true,
  blur: 16,
  opacity: 0.85,
})

const customStyle = computed(() => ({
  '--glass-blur': `${props.blur}px`,
  '--glass-opacity': props.opacity,
}))
</script>

<style scoped>
.glass-panel {
  position: relative;
  backdrop-filter: blur(var(--glass-blur, 16px));
  -webkit-backdrop-filter: blur(var(--glass-blur, 16px));
  background: rgba(255, 255, 255, var(--glass-opacity, 0.85));
  border: 1px solid var(--glass-border, rgba(168, 168, 168, 0.3));
  border-radius: var(--radius-lg, 20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-panel.elevated {
  box-shadow: var(--shadow-lg, 0 8px 32px rgba(0, 0, 0, 0.1));
}

.glass-panel.outlined {
  border-width: 2px;
  border-color: rgba(168, 168, 168, 0.3);
  background: rgba(255, 255, 255, calc(var(--glass-opacity, 0.85) * 0.5));
}

.glass-panel.filled {
  background: rgba(255, 255, 255, calc(var(--glass-opacity, 0.85) * 0.9));
}

.glass-panel.interactive {
  cursor: pointer;
}

.glass-panel.interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl, 0 12px 48px rgba(0, 0, 0, 0.12));
  border-color: rgba(168, 168, 168, 0.4);
}

.glass-panel.interactive:active {
  transform: translateY(-2px);
  transition: all 0.1s ease;
}

[data-theme="dark"] .glass-panel {
  background: rgba(26, 26, 26, var(--glass-opacity, 0.85));
  border-color: rgba(168, 168, 168, 0.2);
}

[data-theme="dark"] .glass-panel.filled {
  background: rgba(26, 26, 26, calc(var(--glass-opacity, 0.85) * 0.9));
}

[data-theme="dark"] .glass-panel.interactive:hover {
  box-shadow: var(--shadow-xl, 0 12px 48px rgba(0, 0, 0, 0.6));
  border-color: rgba(168, 168, 168, 0.3);
}
</style>