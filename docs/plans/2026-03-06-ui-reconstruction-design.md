# 湛明博客 UI 重建设计文档

> 创建日期：2026-03-06  
> 状态：设计阶段  
> 基于规范：ui.md - 湛明博客 UI 设计指南

---

## 一、项目背景

### 当前状态
- **项目类型**：Vue3 + Vite + Express 全栈博客系统
- **UI框架**：Element Plus（计划移除）
- **样式方案**：SCSS + UnoCSS
- **现有组件**：51个Vue组件，11个SCSS文件

### 重建目标
基于 `ui.md` 设计指南，实现符合 Material Design 3 规范的现代化博客界面：
- **视觉现代化**：玻璃拟态 + 实体卡片双层系统
- **主题完整化**：亮色/深色模式完整支持
- **性能优化**：移除Element Plus，使用UnoCSS原子化CSS
- **交互精细化**：微动效和过渡动画

---

## 二、用户需求与决策

### 2.1 重建策略
**决策：混合方式**
- 核心组件完全重建
- 其他组件渐进优化
- 保留现有功能

### 2.2 核心组件范围
**第一批重建组件（全部选中）：**
1. **全局布局组件**：全局导航、登录/注册弹窗、返回顶部按钮
2. **内容展示组件**：文章卡片、列表项、分类卡片、侧边栏
3. **表单/交互组件**：搜索框、输入框、按钮、下拉选择
4. **Markdown渲染**：详情页文章内容、评论区样式

### 2.3 深色模式
**决策：完整支持**
- 自动检测系统主题
- 手动切换按钮
- 持久化用户选择

### 2.4 技术栈选择
| 技术项 | 决策 | 理由 |
|--------|------|------|
| CSS方案 | UnoCSS + CSS变量 | 性能优，主题切换灵活 |
| Element Plus | 完全移除 | 自定义组件，包体积优化 |
| 动效方案 | Animate.css + UnoCSS | 利用现有依赖，轻量简洁 |
| 实施阶段 | 三阶段渐进 | 降低风险，每阶段测试 |

### 2.5 设计风格调整
**决策：黑白银配色系统**
- **日间模式**：白色背景 + 黑色文字 + 银色强调
- **夜间模式**：黑色背景 + 白色文字 + 银色强调
- **主色调**：银色系（#C0C0C0, #A8A8A8, #D4D4D4）
- **设计理念**：极简主义，类似Apple设计语言

**组件设计决策**：
- **圆角系统**：增大圆角（12px/16px/20px/100px）
- **阴影层级**：从5级增加到7级
- **按钮圆角**：16px大圆角（更现代）
- **卡片交互**：悬停上浮 + 弹性动画 + 高光边框 + 阴影变化
- **组件命名**：语义化命名（BaseButton, EntityCard, GlassPanel）

**质量要求**：
- **验收标准**：详细验收标准
- **成功指标**：首屏<2s, 包体积<800KB, Lighthouse>90
- **响应式断点**：5断点（更细粒度）
- **无障碍支持**：完整WCAG 2.1支持

---

## 三、设计方案对比

### 方案A：现代化设计系统 ⭐️ 推荐
**核心技术**：UnoCSS + CSS变量 + 设计token

**优势**：
- ✅ 符合Material Design 3规范
- ✅ 主题切换灵活，深色模式完整支持
- ✅ 性能优，按需生成原子化CSS
- ✅ 设计token可维护性强

**劣势**：
- ⚠️ 需要重建大量自定义组件
- ⚠️ 团队学习曲线（UnoCSS）

**适用场景**：追求最佳视觉效果和性能

---

### 方案B：SCSS变量系统
**核心技术**：传统SCSS变量 + Mixin

**优势**：
- ✅ 兼容性好，团队熟悉
- ✅ 易于维护和调试
- ✅ 现有SCSS可复用

**劣势**：
- ❌ 包体积较大
- ❌ 深色模式实现复杂
- ❌ 灵活性不如UnoCSS

**适用场景**：保守方案，降低风险

---

### 方案C：混合UnoCSS+SCSS
**核心技术**：UnoCSS原子化 + SCSS全局样式

**优势**：
- ✅ 兼顾灵活性和兼容性
- ✅ 平滑过渡

**劣势**：
- ❌ 两套系统维护成本高
- ❌ 可能产生样式冲突
- ❌ 增加复杂度

**适用场景**：过渡期方案

---

## 四、详细设计方案（方案A）

### 4.1 设计系统基础

#### 4.1.1 色彩Token系统

**设计理念**：极简黑白银配色，类似Apple设计语言

**UnoCSS配置**：
```typescript
// uno.config.ts
export default defineConfig({
  theme: {
    colors: {
      primary: {
        DEFAULT: '#A8A8A8',  // 主色-银色
        light: '#D4D4D4',     // 浅银色
        dark: '#787878',      // 深银色
      },
      surface: {
        DEFAULT: '#FAFAFA',   // 表面-极淡灰（日间）
        dark: '#1A1A1A',      // 表面-深灰（夜间）
      },
      background: {
        DEFAULT: '#FFFFFF',   // 背景-纯白（日间）
        dark: '#000000',      // 背景-纯黑（夜间）
      },
      text: {
        primary: '#000000',   // 主文本-纯黑（日间）
        secondary: '#4A4A4A', // 次要文本-深灰
        hint: '#8A8A8A',      // 提示文本-中灰
        dark: '#FFFFFF',      // 主文本-纯白（夜间）
        secondaryDark: '#B0B0B0', // 次要文本-浅灰（夜间）
        hintDark: '#707070',  // 提示文本-深灰（夜间）
      },
      silver: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#E5E5E5',
        300: '#D4D4D4',
        400: '#A8A8A8',
        500: '#8B8B8B',
        600: '#787878',
        700: '#5C5C5C',
        800: '#3C3C3C',
        900: '#1A1A1A',
      }
    }
  }
})
```

**CSS变量定义**：
```css
/* assets/css/design-tokens.css */
:root {
  /* 主色系 - 银色 */
  --color-primary: #A8A8A8;
  --color-primary-light: #D4D4D4;
  --color-primary-dark: #787878;
  
  /* 表面色 */
  --color-surface: #FAFAFA;
  --color-surface-variant: #F0F0F0;
  
  /* 背景色 */
  --color-background: #FFFFFF;
  
  /* 文本色 */
  --color-text-primary: #000000;
  --color-text-secondary: #4A4A4A;
  --color-text-hint: #8A8A8A;
  
  /* 玻璃拟态 */
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(168, 168, 168, 0.3);
  --glass-blur: 16px;
  
  /* 阴影层级 - 7级系统 */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.10);
  --shadow-xl: 0 12px 48px rgba(0, 0, 0, 0.12);
  --shadow-2xl: 0 16px 64px rgba(0, 0, 0, 0.14);
  --shadow-3xl: 0 24px 80px rgba(0, 0, 0, 0.16);
  
  /* 圆角系统 - 增大 */
  --radius-sm: 12px;
  --radius-md: 16px;
  --radius-lg: 20px;
  --radius-full: 100px;
  
  /* 间距系统 */
  --spacing-unit: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 40px;
}

/* 深色模式 */
[data-theme="dark"] {
  --color-primary: #A8A8A8;
  --color-primary-light: #D4D4D4;
  --color-primary-dark: #787878;
  
  --color-surface: #1A1A1A;
  --color-surface-variant: #2A2A2A;
  
  --color-background: #000000;
  
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #B0B0B0;
  --color-text-hint: #707070;
  
  --glass-bg: rgba(26, 26, 26, 0.85);
  --glass-border: rgba(168, 168, 168, 0.2);
  
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.5);
  --shadow-xl: 0 12px 48px rgba(0, 0, 0, 0.6);
  --shadow-2xl: 0 16px 64px rgba(0, 0, 0, 0.7);
  --shadow-3xl: 0 24px 80px rgba(0, 0, 0, 0.8);
}
```

#### 4.1.2 深色模式实现

**主题管理Composable**：
```typescript
// composables/useTheme.ts
import { ref, computed, watchEffect } from 'vue'
import type { Ref } from 'vue'

type ThemeMode = 'light' | 'dark' | 'auto'

export const useTheme = () => {
  const theme: Ref<ThemeMode> = ref('auto')
  
  const actualTheme = computed(() => {
    if (theme.value === 'auto') {
      if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light'
      }
      return 'light'
    }
    return theme.value
  })
  
  // 持久化用户选择
  const loadTheme = () => {
    const saved = localStorage.getItem('theme') as ThemeMode
    if (saved) {
      theme.value = saved
    }
  }
  
  const saveTheme = () => {
    localStorage.setItem('theme', theme.value)
  }
  
  // 应用主题到DOM
  watchEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', actualTheme.value)
    }
  })
  
  // 监听系统主题变化
  const listenSystemTheme = () => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      media.addEventListener('change', () => {
        if (theme.value === 'auto') {
          document.documentElement.setAttribute(
            'data-theme', 
            media.matches ? 'dark' : 'light'
          )
        }
      })
    }
  }
  
  return {
    theme,
    actualTheme,
    loadTheme,
    saveTheme,
    listenSystemTheme,
  }
}
```

#### 4.1.3 玻璃拟态组件

**GlassPanel组件**：
```vue
<!-- components/GlassPanel.vue -->
<template>
  <div 
    class="glass-panel" 
    :class="[variant, { interactive }]"
    :style="customStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'elevated' | 'flat' | 'outlined'
  interactive?: boolean
  blur?: number
  opacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  interactive: false,
  blur: 12,
  opacity: 0.75,
})

const customStyle = computed(() => ({
  '--glass-blur': `${props.blur}px`,
  '--glass-opacity': props.opacity,
}))
</script>

<style scoped>
.glass-panel {
  backdrop-filter: blur(var(--glass-blur, 16px));
  background: rgba(255, 255, 255, var(--glass-opacity, 0.85));
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.glass-panel.elevated {
  box-shadow: var(--shadow-lg);
}

.glass-panel.flat {
  box-shadow: none;
}

.glass-panel.outlined {
  border-width: 2px;
  border-color: rgba(168, 168, 168, 0.3);
  box-shadow: none;
}

.glass-panel.interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  border-color: rgba(168, 168, 168, 0.4);
}

[data-theme="dark"] .glass-panel {
  background: rgba(26, 26, 26, var(--glass-opacity, 0.85));
  border-color: rgba(168, 168, 168, 0.2);
}

[data-theme="dark"] .glass-panel.interactive:hover {
  border-color: rgba(168, 168, 168, 0.3);
}
</style>
```

#### 4.1.4 实体卡片组件

**EntityCard组件**：
```vue
<!-- components/EntityCard.vue -->
<template>
  <div 
    class="entity-card"
    :class="[{ interactive, loading }, elevationClass]"
  >
    <slot v-if="!loading" />
    <div v-else class="card-skeleton">
      <div class="skeleton-line w-3/4" />
      <div class="skeleton-line w-1/2" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  interactive?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  elevation: 1,
  interactive: false,
  loading: false,
})

const elevationClass = computed(() => `elevation-${props.elevation}`)
</script>

<style scoped>
.entity-card {
  background: var(--color-surface);
  border-radius: 20px;
  padding: 24px;
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

/* 阴影层级 - 7级 */
.elevation-0 { box-shadow: none; }
.elevation-1 { box-shadow: var(--shadow-xs); }
.elevation-2 { box-shadow: var(--shadow-sm); }
.elevation-3 { box-shadow: var(--shadow-md); }
.elevation-4 { box-shadow: var(--shadow-lg); }
.elevation-5 { box-shadow: var(--shadow-xl); }
.elevation-6 { box-shadow: var(--shadow-2xl); }

.entity-card.interactive:hover.elevation-1 { box-shadow: var(--shadow-md); }
.entity-card.interactive:hover.elevation-2 { box-shadow: var(--shadow-lg); }
.entity-card.interactive:hover.elevation-3 { box-shadow: var(--shadow-xl); }
.entity-card.interactive:hover.elevation-4 { box-shadow: var(--shadow-2xl); }
.entity-card.interactive:hover.elevation-5 { box-shadow: var(--shadow-3xl); }

/* 骨架屏 */
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
    #E5E5E5 50%,
    var(--color-surface-variant) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 8px;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

[data-theme="dark"] .skeleton-line {
  background: linear-gradient(
    90deg,
    #2A2A2A 25%,
    #3A3A3A 50%,
    #2A2A2A 75%
  );
  background-size: 200% 100%;
}

[data-theme="dark"] .entity-card.interactive:hover::before {
  border-color: rgba(168, 168, 168, 0.2);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
}
</style>
```

---

### 4.2 核心组件重建

#### 4.2.1 全局导航栏

**设计要点**：
- 玻璃拟态背景
- 固定定位，滚动时增加模糊度
- 响应式布局（移动端汉堡菜单）
- 深色模式切换按钮

**实现要点**：
```vue
<!-- components/global-navigation.vue -->
<template>
  <nav class="global-nav" :class="{ scrolled }">
    <GlassPanel variant="flat" class="nav-container">
      <div class="nav-brand">
        <router-link to="/">湛明博客</router-link>
      </div>
      
      <div class="nav-menu" :class="{ open: mobileMenuOpen }">
        <router-link to="/">首页</router-link>
        <router-link to="/tools">工具</router-link>
        <router-link to="/about">关于</router-link>
      </div>
      
      <div class="nav-actions">
        <ThemeToggle />
        <SearchButton />
        <UserMenu />
        <HamburgerButton 
          v-if="isMobile" 
          :open="mobileMenuOpen"
          @click="mobileMenuOpen = !mobileMenuOpen"
        />
      </div>
    </GlassPanel>
  </nav>
</template>

<script setup lang="ts">
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const isMobile = ref(false)

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

function checkMobile() {
  isMobile.value = window.innerWidth < 768
}
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
}

.global-nav.scrolled .nav-container {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-sm);
}

[data-theme="dark"] .global-nav.scrolled .nav-container {
  background: rgba(26, 26, 26, 0.9);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 0 24px;
}

.nav-brand {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.nav-menu {
  flex: 1;
  display: flex;
  gap: 32px;
}

.nav-menu a {
  font-size: 16px;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
  position: relative;
}

.nav-menu a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.nav-menu a:hover {
  color: var(--color-text-primary);
}

.nav-menu a:hover::after {
  transform: scaleX(1);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

@media (max-width: 768px) {
  .nav-menu {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--color-surface);
    flex-direction: column;
    padding: 24px;
    gap: 16px;
    display: none;
  }
  
  .nav-menu.open {
    display: flex;
  }
}
</style>
```

#### 4.2.2 文章卡片

**设计要点**：
- 实体卡片样式
- 缩略图区域（圆角）
- 标题、摘要、元信息
- 悬停交互：上浮+阴影加深

**实现要点**：
```vue
<!-- components/ArticleCard.vue -->
<template>
  <EntityCard interactive :elevation="2">
    <article class="article-card" @click="handleClick">
      <div v-if="article.thumbnail" class="card-thumbnail">
        <img :src="article.thumbnail" :alt="article.title" />
      </div>
      
      <div class="card-content">
        <h3 class="card-title">{{ article.title }}</h3>
        <p class="card-excerpt">{{ article.excerpt }}</p>
        
        <div class="card-meta">
          <span class="meta-item">
            <i class="icon-calendar" />
            {{ formatDate(article.createAt) }}
          </span>
          <span class="meta-item">
            <i class="icon-eye" />
            {{ article.views }}
          </span>
          <span class="meta-item">
            <i class="icon-comment" />
            {{ article.commentCount }}
          </span>
        </div>
      </div>
    </article>
  </EntityCard>
</template>

<script setup lang="ts">
interface Article {
  id: string
  title: string
  excerpt: string
  thumbnail?: string
  createAt: string
  views: number
  commentCount: number
}

const props = defineProps<{
  article: Article
}>()

const router = useRouter()

function handleClick() {
  router.push(`/article/${props.article.id}`)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.article-card {
  display: flex;
  gap: 24px;
  cursor: pointer;
}

.card-thumbnail {
  flex-shrink: 0;
  width: 200px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
}

.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .card-thumbnail img {
  transform: scale(1.05);
}

.card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.card-excerpt {
  font-size: 15px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 16px;
  margin-top: auto;
  font-size: 13px;
  color: var(--color-text-hint);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 640px) {
  .article-card {
    flex-direction: column;
  }
  
  .card-thumbnail {
    width: 100%;
    height: 200px;
  }
}
</style>
```

---

### 4.3 表单/交互组件

#### 4.3.1 按钮系统

**按钮变体**：
- Primary：主要操作
- Secondary：次要操作
- Text：文本按钮
- Icon：图标按钮

**实现要点**：
```vue
<!-- components/BaseButton.vue -->
<template>
  <button 
    class="base-button"
    :class="[variant, size, { loading, disabled }]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="button-loader" />
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'text' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
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
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
}

.base-button:active:not(.disabled):not(.loading) {
  transform: scale(0.96);
}

/* 变体样式 */
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
  background: #E5E5E5;
  box-shadow: var(--shadow-sm);
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
}

.base-button.icon:hover:not(.disabled):not(.loading) {
  background: var(--color-primary);
  color: #000000;
  box-shadow: var(--shadow-sm);
}

/* 尺寸 */
.base-button.sm {
  height: 32px;
  padding: 0 16px;
  font-size: 14px;
}

.base-button.md {
  height: 40px;
  padding: 0 24px;
  font-size: 15px;
}

.base-button.lg {
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
}

/* 状态 */
.base-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button.loading {
  cursor: wait;
}

.button-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

[data-theme="dark"] .base-button.secondary:hover:not(.disabled):not(.loading) {
  background: #4A4550;
}
</style>
```

#### 4.3.2 输入框系统

**实现要点**：
```vue
<!-- components/BaseInput.vue -->
<template>
  <div class="input-wrapper" :class="{ focused, error, disabled }">
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>
    
    <div class="input-container">
      <span v-if="$slots.prefix" class="input-prefix">
        <slot name="prefix" />
      </span>
      
      <input
        v-model="inputValue"
        class="base-input"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      
      <span v-if="$slots.suffix || clearable" class="input-suffix">
        <button 
          v-if="clearable && inputValue" 
          class="clear-button"
          @click="handleClear"
        >
          <i class="icon-close" />
        </button>
        <slot name="suffix" />
      </span>
    </div>
    
    <div v-if="error || hint" class="input-hint">
      <span class="hint-text">{{ error || hint }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string | number
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'url'
  placeholder?: string
  hint?: string
  error?: string
  required?: boolean
  disabled?: boolean
  readonly?: boolean
  clearable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  required: false,
  disabled: false,
  readonly: false,
  clearable: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const focused = ref(false)

function handleFocus() {
  focused.value = true
}

function handleBlur() {
  focused.value = false
}

function handleClear() {
  emit('update:modelValue', '')
}
</script>

<style scoped>
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.required-mark {
  color: #F44336;
  margin-left: 4px;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-surface-variant);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.input-wrapper.focused .input-container {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(168, 168, 168, 0.15);
}

.input-wrapper.error .input-container {
  border-color: #DC3545;
}

.input-wrapper.disabled .input-container {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-input {
  flex: 1;
  height: 48px;
  padding: 0 16px;
  font-size: 16px;
  color: var(--color-text-primary);
  background: transparent;
  border: none;
  outline: none;
}

.base-input::placeholder {
  color: var(--color-text-hint);
}

.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: var(--color-text-hint);
}

.clear-button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface-variant);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text-hint);
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: var(--color-primary);
  color: #000000;
}

.input-hint {
  font-size: 12px;
  color: var(--color-text-hint);
}

.input-wrapper.error .hint-text {
  color: #DC3545;
}
</style>
```

---

### 4.4 Markdown渲染样式

**设计要点**：
- 符合GitHub风格
- 代码高亮（Prism.js）
- 图片懒加载
- 响应式布局

**实现要点**：
```vue
<!-- components/MarkdownRenderer.vue -->
<template>
  <article class="markdown-body" v-html="renderedContent" />
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import Prism from 'prismjs'

const props = defineProps<{
  content: string
}>()

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (code, lang) => {
    if (Prism.languages[lang]) {
      return Prism.highlight(code, Prism.languages[lang], lang)
    }
    return code
  },
})

const renderedContent = computed(() => {
  return md.render(props.content)
})
</script>

<style scoped>
.markdown-body {
  font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-text-primary);
  word-wrap: break-word;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 32px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text-primary);
}

.markdown-body h1 { font-size: 32px; }
.markdown-body h2 { font-size: 24px; }
.markdown-body h3 { font-size: 20px; }
.markdown-body h4 { font-size: 18px; }
.markdown-body h5 { font-size: 16px; }
.markdown-body h6 { font-size: 14px; }

.markdown-body p {
  margin-bottom: 16px;
}

.markdown-body a {
  color: var(--color-primary);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;
}

.markdown-body a:hover {
  border-bottom-color: var(--color-primary);
  color: var(--color-primary-dark);
}

.markdown-body img {
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  margin: 24px 0;
  box-shadow: var(--shadow-md);
}

.markdown-body code {
  padding: 2px 8px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.9em;
  background: var(--color-surface-variant);
  color: var(--color-text-primary);
  border-radius: 6px;
}

.markdown-body pre {
  margin: 24px 0;
  padding: 20px;
  background: #1A1A1A;
  border-radius: 16px;
  overflow-x: auto;
  box-shadow: var(--shadow-lg);
}

.markdown-body pre code {
  padding: 0;
  background: transparent;
  color: #D4D4D4;
}

.markdown-body blockquote {
  margin: 24px 0;
  padding: 16px 24px;
  background: var(--color-surface-variant);
  border-left: 3px solid var(--color-primary);
  border-radius: 0 12px 12px 0;
  color: var(--color-text-secondary);
}

.markdown-body ul,
.markdown-body ol {
  margin-bottom: 16px;
  padding-left: 32px;
}

.markdown-body li {
  margin-bottom: 8px;
}

.markdown-body table {
  width: 100%;
  margin: 24px 0;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.markdown-body th,
.markdown-body td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--color-surface-variant);
}

.markdown-body th {
  background: var(--color-surface-variant);
  font-weight: 600;
  color: var(--color-text-primary);
}

.markdown-body hr {
  margin: 32px 0;
  border: none;
  border-top: 1px solid var(--color-surface-variant);
}

@media (max-width: 768px) {
  .markdown-body {
    font-size: 15px;
  }
  
  .markdown-body h1 { font-size: 28px; }
  .markdown-body h2 { font-size: 22px; }
  .markdown-body h3 { font-size: 18px; }
}
</style>
```

---

## 五、实施计划（三阶段）

### 阶段一：设计系统基础（第1-2周）

**目标**：建立设计系统基础设施

**任务清单**：
1. **UnoCSS配置**
   - [ ] 创建 `uno.config.ts` 配置设计token
   - [ ] 定义色彩系统、间距系统、圆角系统
   - [ ] 配置响应式断点
   - [ ] 添加动画预设类

2. **CSS变量系统**
   - [ ] 创建 `assets/css/design-tokens.css`
   - [ ] 定义亮色/深色模式变量
   - [ ] 定义玻璃拟态变量
   - [ ] 定义阴影层级变量

3. **主题切换系统**
   - [ ] 创建 `composables/useTheme.ts`
   - [ ] 实现主题持久化
   - [ ] 实现系统主题监听
   - [ ] 创建主题切换组件

4. **基础组件库**
   - [ ] 创建 `GlassPanel` 组件
   - [ ] 创建 `EntityCard` 组件
   - [ ] 创建 `BaseButton` 组件
   - [ ] 创建 `BaseInput` 组件

**验收标准**：
- ✅ UnoCSS按需生成CSS
- ✅ 深色/亮色模式切换正常
- ✅ 设计token可通过CSS变量访问
- ✅ 基础组件独立可复用

---

### 阶段二：核心组件重建（第3-5周）

**目标**：重建核心UI组件

**任务清单**：

**第3周：全局布局组件**
1. **全局导航栏**
   - [ ] 玻璃拟态效果
   - [ ] 响应式布局
   - [ ] 滚动动效
   - [ ] 深色模式切换按钮

2. **登录/注册弹窗**
   - [ ] 玻璃拟态背景
   - [ ] 表单验证
   - [ ] 动画过渡

3. **返回顶部按钮**
   - [ ] 滚动显示/隐藏
   - [ ] 平滑滚动动画

**第4周：内容展示组件**
1. **文章卡片**
   - [ ] 实体卡片样式
   - [ ] 缩略图展示
   - [ ] 悬停交互
   - [ ] 骨架屏加载

2. **侧边栏组件**
   - [ ] 分类卡片
   - [ ] 热门文章
   - [ ] 用户信息卡片

**第5周：表单/交互组件 + Markdown渲染**
1. **表单组件**
   - [ ] 搜索框
   - [ ] 下拉选择
   - [ ] 表单验证

2. **Markdown渲染器**
   - [ ] GitHub风格样式
   - [ ] 代码高亮
   - [ ] 图片懒加载

**验收标准**：
- ✅ 所有核心组件符合设计规范
- ✅ 组件支持深色模式
- ✅ 交互动效流畅
- ✅ 响应式布局正常

---

### 阶段三：页面集成与优化（第6-7周）

**目标**：页面集成与性能优化

**任务清单**：

**第6周：页面集成**
1. **前端页面集成**
   - [ ] 首页重构
   - [ ] 文章详情页
   - [ ] 工具页面
   - [ ] 用户中心
   - [ ] 关于页面

2. **后台页面集成**
   - [ ] 后台布局
   - [ ] 文章管理
   - [ ] 用户管理
   - [ ] 分类管理

**第7周：优化与测试**
1. **性能优化**
   - [ ] 移除Element Plus依赖
   - [ ] 优化包体积
   - [ ] 图片懒加载
   - [ ] 路由懒加载

2. **测试与修复**
   - [ ] 跨浏览器测试
   - [ ] 响应式测试
   - [ ] 深色模式测试
   - [ ] 性能测试

**验收标准**：
- ✅ 所有页面正常渲染
- ✅ 无UI组件依赖Element Plus
- ✅ 包体积减少30%以上
- ✅ 首屏加载时间 < 2s

---

## 六、技术决策记录

### 6.1 为什么选择UnoCSS + CSS变量？

**优势对比**：

| 方案 | 性能 | 主题切换 | 维护性 | 学习曲线 |
|------|------|----------|--------|----------|
| UnoCSS + CSS变量 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| SCSS变量系统 | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 混合方案 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

**选择理由**：
1. **性能最优**：UnoCSS按需生成CSS，零运行时开销
2. **主题切换**：CSS变量天然支持动态主题切换
3. **设计token**：UnoCSS + CSS变量完美实现设计token系统
4. **深色模式**：通过CSS变量切换，实现简单高效

---

### 6.2 为什么完全移除Element Plus？

**移除理由**：
1. **设计冲突**：Element Plus样式与Material Design 3规范不匹配
2. **包体积**：Element Plus完整包体积较大（~600KB gzip）
3. **定制成本**：深度定制Element Plus主题成本高于自定义组件
4. **学习价值**：自定义组件更符合项目长期维护需求

**保留的依赖**：
- `@vueuse/core`：Vue Composition API工具库
- `animate.css`：动画库（已存在）
- `axios`：HTTP请求库

---

### 6.3 深色模式实现策略

**技术方案**：
```typescript
// 主题状态管理
const theme = ref<'light' | 'dark' | 'auto'>('auto')

// 自动检测系统主题
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')

// 应用主题到DOM
document.documentElement.setAttribute('data-theme', 'dark')

// CSS变量切换
[data-theme="dark"] {
  --color-primary: #9A82DB;
  --color-background: #141218;
}
```

**优势**：
- ✅ 无需JavaScript频繁操作DOM
- ✅ CSS变量切换性能高
- ✅ 易于维护和扩展
- ✅ 支持系统主题自动检测

---

## 七、风险评估与应对

### 7.1 技术风险

| 风险项 | 影响 | 概率 | 应对措施 |
|--------|------|------|----------|
| UnoCSS配置复杂 | 中 | 中 | 参考官方文档，渐进式配置 |
| 深色模式兼容性 | 低 | 低 | 使用CSS变量，兼容性良好 |
| 自定义组件质量 | 高 | 中 | 代码审查，单元测试 |
| 包体积增加 | 中 | 低 | UnoCSS按需生成，Tree-shaking |

### 7.2 进度风险

| 风险项 | 影响 | 概率 | 应对措施 |
|--------|------|------|----------|
| 组件开发延期 | 高 | 中 | 预留缓冲时间，优先核心组件 |
| 设计返工 | 中 | 低 | 设计阶段充分评审 |
| 测试不充分 | 高 | 中 | 每阶段验收，自动化测试 |

---

## 八、成功指标

### 8.1 性能指标

| 指标 | 当前值 | 目标值 | 改进 |
|------|--------|--------|------|
| 首屏加载时间 | ~3.5s | < 2s | ⬇️ 43% |
| 包体积（gzip） | ~1.2MB | < 800KB | ⬇️ 33% |
| CSS体积（gzip） | ~200KB | < 100KB | ⬇️ 50% |
| Lighthouse分数 | ~75 | > 90 | ⬆️ 20% |

### 8.2 用户体验指标

| 指标 | 目标 |
|------|------|
| 视觉一致性 | 符合Material Design 3规范 |
| 深色模式支持 | 完整支持，无缝切换 |
| 响应式布局 | 支持320px - 2560px |
| 动效流畅度 | 60fps，无卡顿 |
| 可访问性 | WCAG 2.1 AA级 |

---

## 九、后续优化方向

### 9.1 短期优化（1-3个月）
- [ ] 添加页面过渡动画
- [ ] 优化图片加载策略
- [ ] 完善骨架屏体验
- [ ] 添加PWA支持

### 9.2 长期规划（3-6个月）
- [ ] 实现主题编辑器
- [ ] 添加国际化支持
- [ ] 性能监控与优化
- [ ] 组件库文档化

---

## 十、参考资料

### 10.1 设计规范
- [Material Design 3](https://m3.material.io/)
- [Material Design Color System](https://m3.material.io/styles/color/overview)
- [Glassmorphism Design](https://uxdesign.cc/glassmorphism-in-user-interfaces-1f39bb1308c9)

### 10.2 技术文档
- [UnoCSS Documentation](https://unocss.dev/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

### 10.3 工具资源
- [CSS Gradient Generator](https://cssgradient.io/)
- [Box Shadow Generator](https://cssgenerator.org/box-shadow-css-generator.html)
- [Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

**文档版本**：v1.0  
**最后更新**：2026-03-06  
**维护者**：开发团队