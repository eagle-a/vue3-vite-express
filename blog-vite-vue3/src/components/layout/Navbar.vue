<template>
  <nav
    ref="navbarRef"
    class="navbar"
    :class="{ scrolled, 'is-hidden': isHidden }"
    role="navigation"
    aria-label="主导航"
  >
    <div class="navbar-container">
      <!-- Logo 区域 -->
      <div class="navbar-brand">
        <router-link to="/" class="logo-link" aria-label="返回首页">
          <slot name="logo">
            <span class="logo-text">湛明博客</span>
          </slot>
        </router-link>
      </div>

      <!-- 导航链接 - 桌面端 -->
      <div class="navbar-menu" role="menubar">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: isActive(item.path) }"
          role="menuitem"
          :aria-current="isActive(item.path) ? 'page' : undefined"
        >
          {{ item.name }}
        </router-link>
      </div>

      <!-- 右侧操作区 -->
      <div class="navbar-actions">
        <!-- 搜索框 -->
        <div class="search-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            class="search-input"
            placeholder="搜索文章..."
            @keyup.enter="handleSearch"
          />
          <button
            class="search-btn"
            aria-label="搜索"
            @click="handleSearch"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </div>

        <!-- 主题切换 -->
        <button
          class="action-btn theme-toggle"
          :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
          @click="toggleTheme"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </button>

        <!-- 用户菜单 -->
        <div class="user-menu">
          <template v-if="isLoggedIn">
            <button
              class="action-btn user-btn"
              aria-label="用户菜单"
              @click="toggleUserMenu"
            >
              <span class="user-avatar">{{ userInitial }}</span>
            </button>
            <div v-if="showUserMenu" class="user-dropdown">
              <router-link to="/admin" class="dropdown-item">管理后台</router-link>
              <button class="dropdown-item" @click="handleLogout">退出登录</button>
            </div>
          </template>
          <template v-else>
            <BaseButton variant="text" size="sm" @click="handleLogin">
              登录
            </BaseButton>
          </template>
        </div>

        <!-- 移动端菜单按钮 -->
        <button
          class="mobile-menu-btn"
          :aria-expanded="isMobileMenuOpen"
          aria-label="切换菜单"
          @click="toggleMobileMenu"
        >
          <span class="hamburger" :class="{ open: isMobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </div>

    <!-- 移动端菜单 -->
    <transition name="slide-down">
      <div v-if="isMobileMenuOpen" class="mobile-menu" role="menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="mobile-nav-link"
          :class="{ active: isActive(item.path) }"
          role="menuitem"
          @click="closeMobileMenu"
        >
          {{ item.name }}
        </router-link>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '../base/BaseButton.vue'

interface MenuItem {
  name: string
  path: string
}

interface Props {
  menuItems?: MenuItem[]
  isLoggedIn?: boolean
  userName?: string
}

const props = withDefaults(defineProps<Props>(), {
  menuItems: () => [
    { name: '首页', path: '/' },
    { name: '关于', path: '/about' },
    { name: '工具', path: '/tools' },
    { name: 'Game', path: '/game' },
    { name: 'AI', path: '/ai' },
  ],
  isLoggedIn: false,
  userName: '',
})

const emit = defineEmits<{
  search: [query: string]
  login: []
  logout: []
  themeToggle: [isDark: boolean]
}>()

const route = useRoute()
const router = useRouter()

// 状态
const navbarRef = ref<HTMLElement>()
const scrolled = ref(false)
const isHidden = ref(false)
const lastScrollY = ref(0)
const isMobileMenuOpen = ref(false)
const showUserMenu = ref(false)
const searchQuery = ref('')
const isDark = ref(false)

// 计算属性
const isActive = (path: string) => route.path === path || route.path.startsWith(`${path}/`)

const userInitial = computed(() => {
  return props.userName ? props.userName.charAt(0).toUpperCase() : 'U'
})

// 方法
function handleScroll() {
  const currentScrollY = window.scrollY

  // 滚动超过 50px 添加 scrolled 类
  scrolled.value = currentScrollY > 50

  // 向下滚动超过 100px 隐藏导航栏
  if (currentScrollY > lastScrollY.value && currentScrollY > 100) {
    isHidden.value = true
  } else {
    isHidden.value = false
  }

  lastScrollY.value = currentScrollY
}

function handleSearch() {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
    router.push({ path: '/search', query: { q: searchQuery.value.trim() } })
    searchQuery.value = ''
  }
}

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  emit('themeToggle', isDark.value)
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function handleLogin() {
  emit('login')
}

function handleLogout() {
  emit('logout')
  showUserMenu.value = false
}

// 生命周期
onMounted(() => {
  // 初始化主题
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDark.value = savedTheme === 'dark' || (!savedTheme && prefersDark)
  document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')

  // 监听滚动
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ==================== Acrylic 玻璃导航栏 ==================== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-fixed);
  height: var(--navbar-height);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.8) 0%,
    rgba(255, 255, 255, 0.7) 50%,
    rgba(255, 255, 255, 0.8) 100%
  );
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  transition: all var(--transition-base) var(--ease-out);
  transform: translateZ(0);
}

/* 顶部高光条 */
.navbar::before {
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
}

/* 滚动后的样式 */
.navbar.scrolled {
  backdrop-filter: blur(20px) saturate(200%);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(255, 255, 255, 0.9) 50%,
    rgba(255, 255, 255, 0.95) 100%
  );
  box-shadow: var(--shadow-lg);
}

/* 隐藏状态 */
.navbar.is-hidden {
  transform: translateY(-100%) translateZ(0);
}

/* ==================== 容器布局 ==================== */
.navbar-container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--container-padding);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

/* ==================== Logo ==================== */
.navbar-brand {
  flex-shrink: 0;
}

.logo-link {
  text-decoration: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  transition: color var(--transition-fast);
}

.logo-link:hover {
  color: var(--color-primary);
}

.logo-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ==================== 导航菜单 ==================== */
.navbar-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex: 1;
  justify-content: center;
}

.nav-link {
  position: relative;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text-primary);
  background: var(--color-surface-container);
}

.nav-link.active {
  color: var(--color-primary);
  background: var(--color-primary-container);
}

/* ==================== 右侧操作区 ==================== */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

/* 搜索框 */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 200px;
  height: 36px;
  padding: 0 var(--spacing-md) 0 var(--spacing-xl);
  background: var(--color-surface-container);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-container);
  width: 240px;
}

.search-input::placeholder {
  color: var(--color-text-hint);
}

.search-btn {
  position: absolute;
  left: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  color: var(--color-text-hint);
  cursor: pointer;
  transition: color var(--transition-fast);
}

.search-btn:hover {
  color: var(--color-primary);
}

.search-btn svg {
  width: 100%;
  height: 100%;
}

/* 操作按钮 */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--color-surface-container);
  border: 1px solid var(--color-outline-variant);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.action-btn:hover {
  background: var(--color-surface-container-high);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

/* 用户菜单 */
.user-menu {
  position: relative;
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.user-dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  right: 0;
  min-width: 160px;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--color-outline-variant);
  overflow: hidden;
  z-index: var(--z-dropdown);
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.dropdown-item:hover {
  background: var(--color-surface-container);
}

/* ==================== 移动端菜单按钮 ==================== */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 24px;
}

.hamburger span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 2px;
  transition: all var(--transition-fast);
}

.hamburger.open span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* ==================== 移动端菜单 ==================== */
.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-top: 1px solid var(--color-outline-variant);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-md);
}

.mobile-nav-link {
  display: block;
  padding: var(--spacing-md);
  color: var(--color-text-primary);
  text-decoration: none;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  background: var(--color-primary-container);
  color: var(--color-primary);
}

/* 滑动动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--transition-base) var(--ease-out);
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ==================== 响应式设计 ==================== */
@media (max-width: 768px) {
  .navbar-menu {
    display: none;
  }

  .search-wrapper {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 0 var(--spacing-md);
  }

  .logo-text {
    font-size: var(--font-size-lg);
  }
}

/* ==================== 深色模式适配 ==================== */
[data-theme="dark"] .navbar {
  background: linear-gradient(
    135deg,
    rgba(26, 26, 26, 0.85) 0%,
    rgba(20, 20, 20, 0.8) 50%,
    rgba(26, 26, 26, 0.85) 100%
  );
  border-bottom-color: rgba(168, 168, 168, 0.12);
}

[data-theme="dark"] .navbar::before {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(168, 168, 168, 0.2) 50%,
    transparent 100%
  );
}

[data-theme="dark"] .navbar.scrolled {
  background: linear-gradient(
    135deg,
    rgba(30, 30, 30, 0.98) 0%,
    rgba(20, 20, 20, 0.95) 50%,
    rgba(30, 30, 30, 0.98) 100%
  );
}

[data-theme="dark"] .search-input {
  background: var(--color-surface-container);
  border-color: var(--color-outline-variant);
  color: var(--color-text-primary);
}

[data-theme="dark"] .action-btn {
  background: var(--color-surface-container);
  border-color: var(--color-outline-variant);
}

[data-theme="dark"] .mobile-menu {
  background: var(--color-surface);
  border-color: var(--color-outline-variant);
}

/* ==================== 减少动画偏好 ==================== */
@media (prefers-reduced-motion: reduce) {
  .navbar {
    transition: none;
  }

  .navbar.is-hidden {
    transform: none;
  }

  .slide-down-enter-active,
  .slide-down-leave-active {
    transition: none;
  }
}
</style>
