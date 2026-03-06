<template>
  <div
    v-if="!loading"
    class="entity-card"
    :class="[elevationClass, { interactive }]"
  >
    <slot />
  </div>
  <div v-else class="entity-card skeleton-wrapper">
    <div class="card-skeleton">
      <div class="skeleton-line" style="width: 60%"></div>
      <div class="skeleton-line" style="width: 100%"></div>
      <div class="skeleton-line" style="width: 80%"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface EntityCardProps {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  interactive?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<EntityCardProps>(), {
  elevation: 1,
  interactive: false,
  loading: false,
})

const elevationClass = computed(() => `elevation-${props.elevation}`)
</script>

<style scoped>
.entity-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg, 20px);
  padding: var(--spacing-md, 24px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.entity-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  border: 1px solid transparent;
  transition: border-color 0.3s ease;
  pointer-events: none;
}

.entity-card.interactive {
  cursor: pointer;
}

.entity-card.interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.entity-card.interactive:hover::before {
  border-color: rgba(168, 168, 168, 0.3);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.entity-card.interactive:active {
  transform: translateY(-2px) scale(0.99);
  transition: all 0.1s ease;
}

.elevation-0 {
  box-shadow: none;
}
.elevation-1 {
  box-shadow: var(--shadow-xs, 0 1px 2px rgba(0, 0, 0, 0.04));
}
.elevation-2 {
  box-shadow: var(--shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.06));
}
.elevation-3 {
  box-shadow: var(--shadow-md, 0 4px 16px rgba(0, 0, 0, 0.08));
}
.elevation-4 {
  box-shadow: var(--shadow-lg, 0 8px 32px rgba(0, 0, 0, 0.1));
}
.elevation-5 {
  box-shadow: var(--shadow-xl, 0 12px 48px rgba(0, 0, 0, 0.12));
}
.elevation-6 {
  box-shadow: var(--shadow-2xl, 0 16px 64px rgba(0, 0, 0, 0.14));
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
.entity-card.interactive:hover.elevation-4 {
  box-shadow: var(--shadow-2xl);
}
.entity-card.interactive:hover.elevation-5 {
  box-shadow: var(--shadow-3xl);
}

.card-skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  height: 16px;
  background: linear-gradient(
    90deg,
    var(--color-surface-variant) 25%,
    #e5e5e5 50%,
    var(--color-surface-variant) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

[data-theme='dark'] .entity-card {
  background: var(--color-surface);
}

[data-theme='dark'] .entity-card.interactive:hover::before {
  border-color: rgba(168, 168, 168, 0.2);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}

[data-theme='dark'] .skeleton-line {
  background: linear-gradient(
    90deg,
    #2a2a2a 25%,
    #3a3a3a 50%,
    #2a2a2a 75%
  );
  background-size: 200% 100%;
}
</style>