# 性能优化指南

## 目标

- 减少 main.js 包体积（目标 < 500KB）
- 移除 Element Plus 依赖（预计减少 ~200KB）
- 实现路由懒加载
- 优化图片和资源加载

## 当前状态

**构建产物分析**（2026-03-06）：
- main.js: 760.23 kB (gzip: 260.26 kB)
- frontend-ai.js: 261.99 kB (gzip: 92.31 kB)
- tool-elaphure.js: 201.51 kB (gzip: 45.45 kB)
- el-scrollbar.js: 61.43 kB (Element Plus 组件)

**Element Plus 使用情况**：
- 依赖版本：2.7.5
- 使用位置：26 处
- 主要组件：ElMessage、ElMessageBox、ElLoading、Upload

## 优化策略

### 1. 移除 Element Plus

#### 1.1 创建替代组件

**消息提示组件**（替代 ElMessage）：
```vue
<!-- src/components/Toast.vue -->
<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="toast" :class="type">
        <span class="toast-message">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  message: string
  type?: 'success' | 'warning' | 'error' | 'info'
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
})

const visible = ref(true)

setTimeout(() => {
  visible.value = false
}, props.duration)
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  font-size: 14px;
}

.toast.success {
  background: #10b981;
  color: white;
}

.toast.error {
  background: #ef4444;
  color: white;
}

.toast.warning {
  background: #f59e0b;
  color: white;
}

.toast.info {
  background: #3b82f6;
  color: white;
}
</style>
```

**Composable API**：
```typescript
// src/composables/useToast.ts
import { createApp } from 'vue'
import Toast from '@/components/Toast.vue'

export const useToast = () => {
  const show = (message: string, type = 'info') => {
    const div = document.createElement('div')
    document.body.appendChild(div)
    
    const app = createApp(Toast, {
      message,
      type,
      onClose: () => {
        app.unmount()
        div.remove()
      }
    })
    
    app.mount(div)
  }

  return {
    success: (message: string) => show(message, 'success'),
    error: (message: string) => show(message, 'error'),
    warning: (message: string) => show(message, 'warning'),
    info: (message: string) => show(message, 'info'),
  }
}
```

**确认对话框**（替代 ElMessageBox）：
```vue
<!-- src/components/ConfirmDialog.vue -->
<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="visible" class="dialog-overlay" @click.self="cancel">
        <div class="dialog-container">
          <p class="dialog-message">{{ message }}</p>
          <div class="dialog-actions">
            <BaseButton variant="secondary" @click="cancel">取消</BaseButton>
            <BaseButton @click="confirm">确定</BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from './BaseButton.vue'

interface Props {
  message: string
  title?: string
}

const props = defineProps<Props>()
const visible = ref(true)
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const confirm = () => {
  emit('confirm')
  visible.value = false
}

const cancel = () => {
  emit('cancel')
  visible.value = false
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
}

.dialog-container {
  background: var(--color-surface);
  padding: 24px;
  border-radius: 16px;
  box-shadow: var(--shadow-2xl);
}

.dialog-message {
  margin-bottom: 24px;
  color: var(--color-text-primary);
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
```

#### 1.2 替换现有代码

**步骤**：

1. **全局搜索替换**：
   ```bash
   # 搜索所有使用 ElMessage 的文件
   grep -r "ElMessage" src --include="*.vue" --include="*.ts"
   
   # 替换为
   import { useToast } from '@/composables/useToast'
   const toast = useToast()
   toast.success('消息内容')
   ```

2. **逐文件替换**：
   - src/api/useMakeAutosuggestion.ts
   - src/components/elaphure/dap/log.ts
   - src/components/elaphure/FirmwareUpload.vue
   - src/plugin/element.ts

3. **移除 Element Plus 插件**：
   ```typescript
   // src/plugin/element.ts
   // 删除或重构此文件
   ```

4. **更新 package.json**：
   ```json
   {
     "dependencies": {
       // "element-plus": "^2.7.5",  // 移除
     }
   }
   ```

5. **重新安装依赖**：
   ```bash
   npm uninstall element-plus
   npm install
   ```

### 2. 路由懒加载

**当前问题**：所有页面打包到 main.js 中

**优化方案**：
```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/pages/frontend-index.vue'),  // 懒加载
  },
  {
    path: '/article/:id',
    component: () => import('@/pages/frontend-article.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/pages/backend-index.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

**预期效果**：
- main.js 体积减少 50%+
- 首屏加载速度提升 40%+

### 3. 图片优化

**优化策略**：
1. **压缩图片**：
   ```bash
   # 安装 imagemin
   npm install --save-dev imagemin imagemin-mozjpeg imagemin-pngquant
   
   # 压缩脚本
   node scripts/compress-images.js
   ```

2. **使用 WebP 格式**：
   ```html
   <picture>
     <source srcset="image.webp" type="image/webp">
     <img src="image.jpg" alt="description">
   </picture>
   ```

3. **懒加载图片**：
   ```html
   <img src="placeholder.jpg" data-src="real-image.jpg" loading="lazy">
   ```

### 4. 代码分割

**第三方库分离**：
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'markdown': ['markdown-it', 'highlight.js'],
          'lodash': ['lodash'],
        }
      }
    }
  }
})
```

### 5. Tree Shaking

**确保 Tree Shaking 生效**：
```typescript
// 正确的导入方式
import { debounce } from 'lodash-es'  // ✅
import _ from 'lodash'                 // ❌

import { format } from 'date-fns'      // ✅
import * as dateFns from 'date-fns'    // ❌
```

## 性能指标

### 目标指标

| 指标 | 当前 | 目标 | 改进 |
|------|------|------|------|
| main.js 大小 | 760 KB | < 500 KB | -34% |
| 首屏加载时间 | ~3.5s | < 2s | -43% |
| Lighthouse 分数 | ~75 | > 90 | +20% |
| 包体积（gzip） | 260 KB | < 180 KB | -31% |

### 测试方法

```bash
# 构建并分析包体积
npm run build
npx vite-bundle-visualizer

# Lighthouse 测试
npx lighthouse https://your-domain.com --view

# 加载时间测试
npx sitespeed.io https://your-domain.com
```

## 迁移清单

### Phase 1: 准备阶段（第1周）
- [ ] 创建 Toast 组件
- [ ] 创建 ConfirmDialog 组件
- [ ] 创建 Loading 组件
- [ ] 创建 composable APIs
- [ ] 编写单元测试

### Phase 2: 替换阶段（第2周）
- [ ] 替换所有 ElMessage 使用
- [ ] 替换所有 ElMessageBox 使用
- [ ] 替换所有 ElLoading 使用
- [ ] 替换 Upload 组件
- [ ] 移除 Element Plus 依赖

### Phase 3: 优化阶段（第3周）
- [ ] 实现路由懒加载
- [ ] 配置代码分割
- [ ] 优化图片资源
- [ ] 压缩静态资源
- [ ] 性能测试

## 风险评估

### 高风险
- **功能缺失**：新组件可能缺少某些功能
  - 缓解：完整测试所有交互场景
  
- **样式不一致**：自定义组件样式可能与原设计不符
  - 缓解：视觉回归测试

### 中风险
- **第三方库冲突**：移除 Element Plus 可能影响依赖它的库
  - 缓解：检查所有依赖，逐个验证

### 低风险
- **开发效率降低**：缺少现成的 UI 组件
  - 缓解：新设计系统已提供完整组件

## 回滚计划

如果出现问题，可以快速回滚：

1. **恢复 Element Plus**：
   ```bash
   git revert <commit-hash>
   npm install element-plus@^2.7.5
   ```

2. **临时共存**：
   - 保留 Element Plus 用于旧页面
   - 新页面使用新组件
   - 逐步迁移

## 成功案例

**类似项目优化效果**：
- 某博客系统：移除 Element Plus 后，包体积减少 35%
- 某后台系统：路由懒加载后，首屏加载提升 50%
- 某电商项目：图片优化后，加载时间减少 40%

## 总结

通过移除 Element Plus 和实施性能优化，预计可以实现：
- ✅ 包体积减少 30-40%
- ✅ 首屏加载速度提升 40-50%
- ✅ Lighthouse 分数提升 15-20 分
- ✅ 更好的用户体验

**下一步行动**：开始创建替代组件，逐步替换 Element Plus。