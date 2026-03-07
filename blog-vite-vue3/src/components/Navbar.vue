<template>
  <nav class="global-nav" :class="{ scrolled: isScrolled }">
    <GlassPanel class="nav-container" :elevated="isScrolled" :blur="isScrolled ? 20 : 16">
      <div class="nav-brand">
        <router-link to="/" class="logo-link">
          <span class="brand-logo">湛明博客</span>
        </router-link>
      </div>

      <div class="nav-menu">
        <router-link to="/" class="nav-link" exact-active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
          <span>首页</span>
        </router-link>
        <router-link to="/about" class="nav-link" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>关于</span>
        </router-link>
        <router-link to="/tools" class="nav-link" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
          <span>工具</span>
        </router-link>
        <router-link to="/game" class="nav-link" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <line x1="6" y1="12" x2="6" y2="12" />
            <line x1="18" y1="12" x2="18" y2="12" />
            <line x1="12" y1="10" x2="12" y2="14" />
          </svg>
          <span>Game</span>
        </router-link>
        <router-link to="/ai" class="nav-link" active-class="active">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2M7.5 13A2.5 2.5 0 0 0 5 15.5A2.5 2.5 0 0 0 7.5 18a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 7.5 13m9 0a2.5 2.5 0 0 0-2.5 2.5a2.5 2.5 0 0 0 2.5 2.5a2.5 2.5 0 0 0 2.5-2.5a2.5 2.5 0 0 0-2.5-2.5z" />
          </svg>
          <span>AI</span>
        </router-link>
      </div>

      <div class="nav-actions">
        <SearchBox
          v-model="searchQuery"
          placeholder="搜索文章..."
          size="sm"
          @search="handleSearch"
        />
        <router-link v-if="isLogin" to="/user/account" class="user-avatar">
          <img :src="useAvatar(cookies.useremail, 100)" alt="用户头像" />
        </router-link>
        <BaseButton v-else size="sm" @click="handleLogin">登录</BaseButton>
        <ThemeToggle />
      </div>
    </GlassPanel>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import GlassPanel from './GlassPanel.vue'
import BaseButton from './BaseButton.vue'
import ThemeToggle from './ThemeToggle.vue'
import SearchBox from './SearchBox.vue'

const router = useRouter()
const isScrolled = ref(false)
const searchQuery = ref('')

const globalStore = useGlobalStore()
const { cookies } = $(toRefs(globalStore))

const isLogin = computed(() => !!cookies.user)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleSearch = (query: string) => {
  if (query.trim()) {
    router.push(`/search/${query.trim()}`)
  }
}

const handleLogin = () => {
  globalStore.setLoginModal(true)
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
  transition: all 0.3s ease;
  background: transparent !important;
  padding: 0;
}

.global-nav.scrolled .nav-container {
  box-shadow: var(--shadow-md);
}

.global-nav .nav-container {
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(24px);
  border-radius: 0 !important;
  border: none !important;
  width: 100%;
}

[data-theme='dark'] .global-nav .nav-container {
  background: rgba(26, 26, 26, 0.85) !important;
}

.global-nav.scrolled .nav-container {
  backdrop-filter: blur(30px);
  background: rgba(255, 255, 255, 0.92) !important;
  box-shadow: var(--shadow-sm);
}

[data-theme='dark'] .global-nav.scrolled .nav-container {
  background: rgba(26, 26, 26, 0.92) !important;
}

.nav-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 48px;
  padding: 0 24px;
  box-sizing: border-box;
  max-width: 100%;
}

@media (max-width: 1200px) {
  .nav-container {
    padding: 0 24px;
  }
}

.nav-brand {
  flex-shrink: 0;
}

.brand-logo {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  text-decoration: none;
}

.logo-link {
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 32px;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: rgba(0, 0, 0, 0.65);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  padding: 4px 0;
}

[data-theme='dark'] .nav-link {
  color: rgba(255, 255, 255, 0.7);
}

.nav-link svg {
  width: 18px;
  height: 18px;
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
  color: rgba(0, 0, 0, 0.85);
}

[data-theme='dark'] .nav-link:hover {
  color: rgba(255, 255, 255, 0.95);
}

.nav-link:hover::after {
  transform: scaleX(1);
}

.nav-link.active {
  color: rgba(0, 0, 0, 0.95);
  font-weight: 500;
}

[data-theme='dark'] .nav-link.active {
  color: rgba(255, 255, 255, 0.95);
}

.nav-link.active::after {
  transform: scaleX(1);
}

.nav-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-primary);
  transition: all 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 1024px) {
  .nav-menu span {
    display: none;
  }
  
  .nav-menu {
    gap: 16px;
  }
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