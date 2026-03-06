# UI组件集成指南

## 概述

本指南介绍如何在现有项目中使用新的黑白银设计系统组件。

## 设计系统特性

- 🎨 **黑白银配色**：极简主义设计，类似Apple设计语言
- 🔮 **玻璃拟态**：现代玻璃效果，层次分明
- ⚡ **极致性能**：UnoCSS原子化CSS，按需生成
- 🌓 **深色模式**：完整的亮色/暗色主题支持
- 🎭 **丰富组件**：按钮、卡片、表单、弹窗等完整组件库

## 快速开始

### 1. 导入组件

```typescript
// 方式一：按需导入
import { BaseButton, EntityCard, GlassPanel } from '@/components'

// 方式二：单独导入
import BaseButton from '@/components/BaseButton.vue'
```

### 2. 使用主题切换

```vue
<template>
  <div>
    <!-- 主题切换按钮 -->
    <ThemeToggle />
    
    <!-- 或使用composable -->
    <button @click="toggleTheme">
      {{ isDark ? '切换到亮色' : '切换到暗色' }}
    </button>
  </div>
</template>

<script setup>
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>
```

## 组件使用示例

### 按钮组件

```vue
<BaseButton variant="primary" size="lg">主要按钮</BaseButton>
<BaseButton variant="secondary" size="md">次要按钮</BaseButton>
<BaseButton variant="text" size="sm">文本按钮</BaseButton>
<BaseButton variant="icon" :loading="isLoading">
  <svg><!-- icon --></svg>
</BaseButton>
```

**Props**：
- `variant`: 'primary' | 'secondary' | 'text' | 'icon'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean

### 卡片组件

```vue
<EntityCard :elevation="2" interactive>
  <h3>标题</h3>
  <p>内容</p>
</EntityCard>

<!-- 骨架屏加载状态 -->
<EntityCard :loading="true" />
```

**Props**：
- `elevation`: 0 | 1 | 2 | 3 | 4 | 5 | 6
- `interactive`: boolean
- `loading`: boolean

### 文章卡片

```vue
<ArticleCard :article="articleData" :elevation="2" interactive />

<script setup>
const articleData = {
  id: 1,
  title: '文章标题',
  excerpt: '文章摘要...',
  thumbnail: 'https://example.com/image.jpg',
  category: 'Vue.js',
  date: '2026-03-06',
  views: 1234,
  comments: 56,
  tags: ['Vue', '前端']
}
</script>
```

### 玻璃拟态面板

```vue
<GlassPanel variant="default" :blur="16" :opacity="0.85">
  玻璃效果内容
</GlassPanel>

<!-- 交互式玻璃面板 -->
<GlassPanel interactive @click="handleClick">
  可点击的玻璃卡片
</GlassPanel>
```

**Props**：
- `variant`: 'default' | 'outlined' | 'filled'
- `blur`: number (默认16)
- `opacity`: number (默认0.85)
- `interactive`: boolean
- `elevated`: boolean

### 搜索框

```vue
<SearchBox
  v-model="searchQuery"
  placeholder="搜索文章..."
  show-clear
  show-button
  @search="handleSearch"
  @clear="handleClear"
/>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const handleSearch = (query) => {
  console.log('搜索:', query)
}

const handleClear = () => {
  console.log('清除搜索')
}
</script>
```

**Props**：
- `modelValue`: string (v-model)
- `placeholder`: string
- `size`: 'sm' | 'md' | 'lg'
- `showClear`: boolean
- `showButton`: boolean
- `loading`: boolean

**Events**：
- `@search`: 搜索事件
- `@clear`: 清除事件

### 导航栏

```vue
<Navbar>
  <template #brand>
    <span class="brand-logo">湛明博客</span>
  </template>
  
  <template #menu>
    <a href="/">首页</a>
    <a href="/articles">文章</a>
  </template>
  
  <template #actions>
    <ThemeToggle />
  </template>
</Navbar>
```

### Markdown渲染器

```vue
<MarkdownRenderer :content="markdownContent" />

<script setup>
const markdownContent = `
# 标题

正文内容...

\`\`\`javascript
console.log('Hello')
\`\`\`
`
</script>
```

### 登录/注册弹窗

```vue
<AuthModal v-model="showAuthModal" />

<script setup>
import { ref } from 'vue'

const showAuthModal = ref(false)
</script>
```

### 返回顶部按钮

```vue
<BackToTop :visibility-height="300" size="md" />
```

**Props**：
- `visibilityHeight`: number (滚动多少像素后显示)
- `size`: 'sm' | 'md' | 'lg'

### 侧边栏

```vue
<Sidebar
  :user="userData"
  :categories="categoriesData"
  :hot-articles="hotArticlesData"
  :tags="tagsData"
>
  <template #top>
    <!-- 顶部自定义内容 -->
  </template>
  
  <template #bottom>
    <!-- 底部自定义内容 -->
  </template>
</Sidebar>

<script setup>
const userData = {
  name: '用户名',
  avatar: 'https://example.com/avatar.jpg',
  bio: '个人简介',
  articles: 42,
  followers: 128,
  likes: 256
}

const categoriesData = [
  { name: 'Vue.js', count: 20 },
  { name: 'React', count: 15 }
]

const hotArticlesData = [
  { id: 1, title: '热门文章', views: 1234 }
]

const tagsData = ['Vue', 'React', 'TypeScript']
</script>
```

## 主题系统

### CSS变量

```css
/* 在任何地方使用CSS变量 */
.custom-element {
  background: var(--color-primary);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-md);
  border-radius: var(--radius-lg);
}
```

**可用变量**：
- **颜色**：`--color-primary`, `--color-surface`, `--color-background`, `--color-text-*`
- **阴影**：`--shadow-xs` ~ `--shadow-3xl`
- **圆角**：`--radius-sm` ~ `--radius-full`
- **间距**：`--spacing-sm` ~ `--spacing-xl`
- **过渡**：`--transition-fast`, `--transition-base`, `--transition-slow`

### 深色模式

```css
/* 自动跟随系统偏好 */
:root {
  /* 亮色主题变量 */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* 暗色主题变量 */
  }
}

/* 手动切换主题 */
[data-theme="dark"] {
  /* 暗色主题变量 */
}
```

## 迁移策略

### 阶段一：并行运行

1. 保留现有组件和样式
2. 新页面使用新组件
3. 逐步替换旧组件

### 阶段二：逐步替换

1. 从简单页面开始（关于页面、工具页面）
2. 替换核心组件（导航栏、文章卡片）
3. 移除Element Plus依赖

### 阶段三：清理优化

1. 移除旧的样式文件
2. 优化包体积
3. 性能测试

## 示例页面

查看 `src/pages/design-system-demo.vue` 获取完整的示例代码。

## 注意事项

1. **兼容性**：新组件完全兼容Vue 3 + TypeScript
2. **性能**：UnoCSS按需生成CSS，无需担心包体积
3. **深色模式**：所有组件已完整支持深色模式
4. **响应式**：所有组件已适配移动端

## 问题反馈

如遇到问题或有改进建议，请提交Issue或联系开发团队。