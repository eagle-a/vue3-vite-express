<template>
  <nav class="global-nav" :class="{ scrolled: isScrolled }">
    <GlassPanel class="nav-container" :elevated="isScrolled" :blur="isScrolled ? 20 : 16">
      <div class="nav-brand">
        <slot name="brand">
          <span class="brand-text">湛明博客</span>
        </slot>
      </div>

      <div class="nav-menu">
        <slot name="menu">
          <a href="/" class="nav-link">首页</a>
          <a href="/articles" class="nav-link">文章</a>
          <a href="/categories" class="nav-link">分类</a>
          <a href="/about" class="nav-link">关于</a>
        </slot>
      </div>

      <div class="nav-actions">
        <slot name="actions">
          <ThemeToggle />
        </slot>
      </div>
    </GlassPanel>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import GlassPanel from './GlassPanel.vue'
import ThemeToggle from './ThemeToggle.vue'

const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
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
.global-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 60px;
  padding: 0 24px;
  transition: all 0.3s ease;
  background: transparent !important;
}

.global-nav.scrolled .nav-container {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.9) !important;
  box-shadow: var(--shadow-sm);
}

[data-theme='dark'] .global-nav.scrolled .nav-container {
  background: rgba(26, 26, 26, 0.9) !important;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
  background: transparent !important;
}

.nav-brand {
  flex-shrink: 0;
}

.brand-text {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.nav-menu {
  flex: 1;
  display: flex;
  gap: 32px;
  justify-content: center;
}

.nav-link {
  font-size: 16px;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  padding: 4px 0;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.nav-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 16px;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .nav-container {
    justify-content: space-between;
  }
}
</style>