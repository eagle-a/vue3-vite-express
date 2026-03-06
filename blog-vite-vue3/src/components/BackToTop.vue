<template>
    <Transition name="back-to-top">
        <button
            v-show="isVisible"
            class="back-to-top"
            :class="size"
            aria-label="返回顶部"
            @click="scrollToTop"
        >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="18,15 12,9 6,15" />
            </svg>
        </button>
    </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
    visibilityHeight?: number
    size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
    visibilityHeight: 300,
    size: 'md',
})

const isVisible = ref(false)

function handleScroll() {
    isVisible.value = window.scrollY > props.visibilityHeight
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    })
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    handleScroll()
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: #000000;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-to-top:hover {
  background: var(--color-primary-light);
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.back-to-top:active {
  transform: translateY(-2px) scale(0.95);
}

.back-to-top:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.back-to-top svg {
  width: 20px;
  height: 20px;
}

.back-to-top.sm {
  width: 40px;
  height: 40px;
}

.back-to-top.md {
  width: 48px;
  height: 48px;
}

.back-to-top.lg {
  width: 56px;
  height: 56px;
}

.back-to-top.lg svg {
  width: 24px;
  height: 24px;
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

[data-theme='dark'] .back-to-top:hover {
  box-shadow: var(--shadow-xl);
}
</style>
