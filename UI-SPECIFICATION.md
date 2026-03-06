# 湛明博客 UI 设计规范文档 (2026 版)

## 融合 Microsoft Acrylic 与 Material 3 的混合设计系统

---

## 目录

1. [设计哲学与愿景](#1-设计哲学与愿景)
2. [核心设计原则](#2-核心设计原则)
3. [色彩系统](#3-色彩系统)
4. [排版与字体](#4-排版与字体)
5. [Acrylic 玻璃拟态系统](#5-acrylic-玻璃拟态系统)
6. [形状与圆角](#6-形状与圆角)
7. [阴影与深度系统](#7-阴影与深度系统)
8. [布局网格](#8-布局网格)
9. [组件设计规范](#9-组件设计规范)
10. [交互与动效](#10-交互与动效)
11. [深色模式适配](#11-深色模式适配)
12. [实现指南](#12-实现指南)
13. [检查清单](#13-检查清单)

---

## 1. 设计哲学与愿景

### 1.1 设计理念

在信息过载的 2026 年，个人技术博客不再仅仅是文字的堆砌，而是创作者数字人格的延伸。本设计规范旨在构建一种**"静谧的现代主义"**美学，融合 Microsoft Fluent Design 的 Acrylic 材质语言与 Google Material Design 3 的结构性原则。

### 1.2 双重气质目标

| 维度 | SaaS 产品特质 | 纸质书籍特质 |
|------|--------------|-------------|
| **视觉** | Acrylic 玻璃拟态的现代感 | Material 3 实色卡片的沉稳 |
| **体验** | 流畅的交互反馈 | 沉浸的阅读体验 |
| **情感** | 科技的灵动与通透 | 知识的厚重与温润 |

### 1.3 核心愿景：沉浸式阅读流

用户进入网站时，首先被现代、通透的界面质感所吸引（Acrylic 玻璃拟态），随即迅速沉入高可读性、如纸质书般舒适的文字海洋（Material 3）。

---

## 2. 核心设计原则

### 2.1 80/20 法则：虚实共生的空间逻辑

#### 80% 实体区域（内容核心区）

**定义**：用户停留时间最长的区域，包括文章列表、正文段落、侧边栏目录。

**策略**：
- 严格遵循 **Material Design 3** 规范
- 强调绝对的稳定性、高对比度的文字层级
- 使用柔和的纯色背景（Surface Color）
- **严禁**使用透明度、模糊或复杂纹理干扰视线

**心理暗示**：给用户一种"脚踏实地"的安全感，仿佛纸张平铺在桌面上。

#### 20% 虚体区域（装饰交互区）

**定义**：界面的框架与浮层，包括顶部导航栏、全局搜索框、模态弹窗、悬浮操作按钮。

**策略**：
- 采用 **Microsoft Acrylic** 玻璃拟态
- 利用背景模糊（Backdrop Filter）、半透明度和微妙的高光边框
- 营造通透感和空间深度
- 元素应当像悬浮在内容之上的玻璃板

**心理暗示**：给用户一种"轻盈、现代、科技"的呼吸感。

### 2.2 层级优先：光影代替线条

**拒绝分割线**：除了玻璃效果必要的边缘高光外，严禁使用实线边框分割内容块。

**阴影即边界**：通过精确控制的阴影深度（Elevation）和背景色明度差异界定区域。

| 层级 | 名称 | 视觉特征 |
|------|------|----------|
| Level 0 | 背景层 | 极淡的灰白色，作为画布 |
| Level 1 | 卡片层 | 稍深的柔和色块，轻微投影 |
| Level 2 | 悬浮层 | 导航栏和弹窗，强模糊和明显投影 |

### 2.3 克制用色：冷静中的亮点

**低饱和度基调**：主色调保持低饱和度（莫兰迪色系或 M3 调色板），营造专业、冷静、不刺眼的氛围。

**功能性高亮**：高亮色仅用于交互反馈。采用"平时隐形，用时显现"的策略。

---

## 3. 色彩系统

### 3.1 核心色板定义 - 黑白银极简配色

基于用户偏好的**黑、白、银**三色配色方案，构建极简、高级、永恒的视觉体验。

#### 主色 (Primary) - 银色

```css
/* 浅色模式 - 银色为主 */
--color-primary: #71717A;        /* 锌灰银 - 品牌灵魂 */
--color-primary-light: #A1A1AA;  /* 浅银 */
--color-primary-dark: #52525B;   /* 深银 */
--color-primary-container: #F4F4F5; /* 银白容器 */

/* 深色模式 */
--color-primary-darkmode: #A1A1AA;      /* 亮银 */
--color-primary-light-darkmode: #D4D4D8;
--color-primary-dark-darkmode: #71717A;
```

**角色**：品牌的灵魂。银色代表科技、精致、永恒。用于主要行动按钮（CTA）、超链接、选中状态的指示器。

**应用原则**：小面积使用，点到为止。银色在不同光线下呈现微妙变化，营造高级感。

#### 表面色 (Surface) - 纯白与浅灰

```css
/* 浅色模式 */
--color-surface: #FFFFFF;           /* 纯白 - 卡片背景 */
--color-surface-variant: #F5F5F5;   /* 极浅灰 - 变体 */
--color-surface-container: #FAFAFA; /* 近白容器 */
--color-surface-container-high: #F0F0F0; /* 高亮表面 */

/* 深色模式 */
--color-surface-darkmode: #18181B;           /* 深锌 */
--color-surface-variant-darkmode: #27272A;   /* 深灰 */
--color-surface-container-darkmode: #3F3F46; /* 容器 */
```

**角色**：内容卡片的载体。纯白背景提供最佳的阅读体验，浅灰用于区分层级。

**设计哲学**：
- 白色代表纯净、开放、无限可能
- 银色点缀增添科技感和精致度
- 避免使用彩色，保持永恒的黑白灰美学

#### 背景色 (Background) - 黑与白

```css
/* 浅色模式 */
--color-background: #FFFFFF;  /* 纯白背景 */

/* 深色模式 */
--color-background-darkmode: #000000;  /* 纯黑背景 */
```

**关键差异**：
- 浅色模式使用纯白，营造明亮、开放的氛围
- 深色模式使用纯黑，提供最佳的 OLED 显示效果和沉浸感
- 表面色与背景色保持微妙对比，通过阴影而非颜色区分层级

#### 文本色系 - 从黑到白的渐变

```css
/* 浅色模式 */
--color-text-primary: #18181B;     /* 深锌 - 正文 */
--color-text-secondary: #52525B;   /* 锌灰 - 摘要、副标题 */
--color-text-hint: #A1A1AA;        /* 浅银 - 日期、标签 */

/* 深色模式 */
--color-text-primary-darkmode: #FFFFFF;      /* 纯白 */
--color-text-secondary-darkmode: #E4E4E7;    /* 浅灰 */
--color-text-hint-darkmode: #A1A1AA;         /* 银色 */
```

**重要**：
- 浅色模式避免使用纯黑 (#000000)，使用深锌 (#18181B) 更柔和
- 深色模式使用纯白 (#FFFFFF) 确保可读性
- 银色作为中间色调，连接黑白两极

### 3.2 Acrylic 玻璃层色彩

```css
/* Acrylic 玻璃基础配方 */
--acrylic-base: rgba(255, 255, 255, 0.85);     /* 基础背景 */
--acrylic-tint: #F3EDF7;                        /* 色调叠加 */
--acrylic-highlight: rgba(255, 255, 255, 0.4);  /* 高光边框 */
--acrylic-shadow: rgba(0, 0, 0, 0.08);          /* 投影 */

/* 深色模式 Acrylic */
--acrylic-base-darkmode: rgba(26, 26, 26, 0.85);
--acrylic-tint-darkmode: #2B2930;
--acrylic-highlight-darkmode: rgba(168, 168, 168, 0.12);
--acrylic-shadow-darkmode: rgba(0, 0, 0, 0.4);
```

### 3.3 功能色

```css
--color-success: #4CAF50;   /* 成功 */
--color-warning: #FFC107;   /* 警告 */
--color-error: #F44336;     /* 错误 */
--color-info: #2196F3;      /* 信息 */
```

### 3.4 色彩使用模式

```
┌─────────────────────────────────────────────────────────────┐
│                    色彩层级示意图                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Background (#FDFBFF)                               │   │  Level 0
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  Surface (#F7F2FA)                          │   │   │  Level 1
│  │  │                                             │   │   │
│  │  │  ┌─────────────────────────────────────┐   │   │   │
│  │  │  │  Acrylic (rgba(255,255,255,0.85))   │   │   │   │  Level 2
│  │  │  │  + blur(16px)                       │   │   │   │
│  │  │  │  + tint overlay                     │   │   │   │
│  │  │  └─────────────────────────────────────┘   │   │   │
│  │  │                                             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 排版与字体

### 4.1 字体家族

```css
/* 主要字体 */
--font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif;

/* 等宽字体（代码） */
--font-family-mono: 'Consola', 'Monaco', 'Andale Mono', monospace;

/* 回退策略 */
font-family: var(--font-family-primary);
```

**首选理由**：Inter 具有极佳的几何感和开阔的字怀（Counter），在小字号下依然清晰可辨。

**禁则**：严禁使用衬线体（Serif）作为 UI 界面字体。

### 4.2 字号阶梯

| 层级 | 名称 | 字号 | 字重 | 行高 | 用途 |
|------|------|------|------|------|------|
| H1 | 大标题 | 32-40px | Bold (700) | 1.3 | 页面主标题、文章标题 |
| H2 | 卡片标题 | 20-24px | SemiBold (600) | 1.4 | 文章列表标题、模块标题 |
| H3 | 小标题 | 18-20px | Medium (500) | 1.4 | 子模块标题 |
| Body | 正文 | 16-18px | Regular (400) | 1.6-1.8 | 文章正文 |
| Caption | 辅助信息 | 12-14px | Medium (500) | 1.5 | 日期、作者、标签 |

### 4.3 字重策略

**少即是多**：
- 全站仅标题使用 Bold
- 正文坚持使用 Regular
- 避免满屏粗体造成的视觉噪音

**强调方式**：
- 优先通过颜色变化（主色）表达强调
- 次选斜体
- 避免盲目加粗

### 4.4 排版示例

```
┌────────────────────────────────────────────────────────────┐
│  文章标题 (H1, 36px, Bold)                                  │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  正文段落 (Body, 16px, Regular, line-height: 1.75)         │
│  这是文章的主要内容区域，使用宽松的行高提供充足的呼吸       │
│  空间，防止长文阅读时的串行和压抑感。                       │
│                                                            │
│  小标题 (H3, 18px, Medium)                                 │
│  ────────────────────────────────────────────────────────  │
│                                                            │
│  辅助信息 (Caption, 14px, Medium, --color-text-secondary)  │
│  2026-03-06 · 阅读 1234 次 · 56 条评论                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

## 5. Acrylic 玻璃拟态系统

### 5.1 Microsoft Acrylic 设计原则

Acrylic 是一种从 Microsoft Fluent Design System 引入的材质，具有以下特征：

1. **深度**：通过背景模糊创造层次感
2. **材质感**：模拟真实玻璃的半透明特性
3. **光线响应**：高光边框模拟光线折射
4. **环境融合**：与下层内容产生视觉关联

### 5.2 Acrylic 材质配方

#### 基础配方

```css
.acrylic-panel {
  /* 1. 背景模糊 - 核心效果 */
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  
  /* 2. 半透明背景 */
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.25) 0%,
    rgba(255, 255, 255, 0.15) 50%,
    rgba(255, 255, 255, 0.25) 100%
  );
  
  /* 3. 色调叠加 - 增加品牌感 */
  background-color: rgba(243, 237, 247, 0.6);
  
  /* 4. 高光边框 - 模拟光线折射 */
  border: 1px solid rgba(255, 255, 255, 0.4);
  
  /* 5. 顶部高光条 */
  &::before {
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
  
  /* 6. 底部投影 */
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}
```

#### 多层叠加效果

```
┌─────────────────────────────────────────────────────────────┐
│                    Acrylic 材质层次                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Layer 5: 高光边框 (Highlight Border)               │   │
│  │  rgba(255, 255, 255, 0.4)                           │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Layer 4: 顶部高光条 (Top Highlight)                │   │
│  │  linear-gradient(透明 → 白 → 透明)                  │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Layer 3: 色调叠加 (Tint Overlay)                   │   │
│  │  rgba(243, 237, 247, 0.6)                           │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Layer 2: 渐变背景 (Gradient Base)                  │   │
│  │  linear-gradient(135deg, rgba(255,255,255,0.25)...) │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Layer 1: 背景模糊 (Backdrop Blur)                  │   │
│  │  blur(16px) saturate(180%)                          │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Layer 0: 下层内容 (Content Behind)                 │   │
│  │  [透过玻璃隐约可见的内容]                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 5.3 Acrylic 应用场景

| 场景 | 模糊半径 | 透明度 | 特殊处理 |
|------|----------|--------|----------|
| 顶部导航栏 | 16px | 0.85 | 滚动时增加至 20px |
| 底部浮动条 | 20px | 0.9 | 更强的存在感 |
| 模态弹窗背景 | 24px | 0.7 | 遮罩层叠加 |
| 悬浮操作按钮 | 12px | 0.8 | 发光效果 |
| 侧边栏 | 16px | 0.85 | 固定定位 |

### 5.4 性能优化

```css
.acrylic-panel {
  /* 启用 GPU 加速 */
  transform: translateZ(0);
  will-change: backdrop-filter, background;
  
  /* 限制重绘区域 */
  contain: layout style paint;
}

/* 减少动画时的性能开销 */
@media (prefers-reduced-motion: reduce) {
  .acrylic-panel {
    backdrop-filter: none;
    background: var(--color-surface);
  }
}
```

---

## 6. 形状与圆角

### 6.1 圆角系统

```css
--radius-sm: 8px;      /* 小元素：图标背景、复选框 */
--radius-md: 12px;     /* 中元素：搜索框、输入框 */
--radius-lg: 16px;     /* 大元素：文章卡片、侧边栏 */
--radius-xl: 20px;     /* 超大：弹窗主体 */
--radius-full: 100px;  /* 全圆角：按钮、标签、头像 */
```

### 6.2 圆角应用规范

| 元素类型 | 圆角值 | 示例 |
|----------|--------|------|
| 文章卡片 | 16px (radius-lg) | 主要内容容器 |
| 侧边栏模块 | 16px (radius-lg) | 目录、标签云 |
| 搜索框 | 12px (radius-md) | 全局搜索 |
| 按钮 | 100px (radius-full) | 主要/次要按钮 |
| 标签 Chip | 100px (radius-full) | 文章标签 |
| 头像 | 100px (radius-full) | 用户头像 |
| 输入框 | 12px (radius-md) | 表单输入 |
| 弹窗 | 20px (radius-xl) | 模态框 |

### 6.3 统一性原则

**同层级统一**：同一层级的元素必须使用统一的圆角数值。

```
正确示例：
┌─────────────────────────────────────┐
│  卡片 (16px)                        │
│  ┌─────────────────────────────┐   │
│  │  内部图片 (16px 或 12px)     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

错误示例：
┌─────────────────────────────────────┐
│  卡片 (16px)                        │
│  ┌─────────────────────────────┐   │
│  │  内部图片 (0px - 直角!)      │   │  ❌
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 7. 阴影与深度系统

### 7.1 七级阴影系统

```css
/* 极轻微 - 几乎不可见 */
--shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);

/* 轻微 - 卡片静止状态 */
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);

/* 中等 - 卡片悬停状态 */
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);

/* 明显 - 悬浮元素 */
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.10);

/* 强烈 - 模态框 */
--shadow-xl: 0 12px 48px rgba(0, 0, 0, 0.12);

/* 极强 - 全屏覆盖 */
--shadow-2xl: 0 16px 64px rgba(0, 0, 0, 0.14);

/* 极致 - 特殊强调 */
--shadow-3xl: 0 24px 80px rgba(0, 0, 0, 0.16);
```

### 7.2 深度层级对应

```
┌─────────────────────────────────────────────────────────────┐
│                    深度层级示意图                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Level 0: Background                                │   │
│  │  阴影: none                                         │   │
│  │  z-index: 0                                         │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Level 1: Cards (静止)                              │   │
│  │  阴影: shadow-sm                                    │   │
│  │  z-index: 10                                        │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Level 2: Cards (悬停)                              │   │
│  │  阴影: shadow-md                                    │   │
│  │  transform: translateY(-4px)                        │   │
│  │  z-index: 20                                        │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Level 3: Navigation Bar                            │   │
│  │  阴影: shadow-lg                                    │   │
│  │  backdrop-filter: blur(16px)                        │   │
│  │  z-index: 100                                       │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Level 4: Dropdown / Popover                        │   │
│  │  阴影: shadow-xl                                    │   │
│  │  z-index: 200                                       │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Level 5: Modal Dialog                              │   │
│  │  阴影: shadow-2xl                                   │   │
│  │  z-index: 300                                       │   │
│  ├─────────────────────────────────────────────────────┤   │
│  │  Level 6: Toast / Notification                      │   │
│  │  阴影: shadow-3xl                                   │   │
│  │  z-index: 400                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.3 阴影使用原则

**无描边原则**：卡片本身不需要边框，完全靠背景色差和阴影区分边界。

**阴影即状态**：
- 静止：轻微阴影，仿佛纸张平铺在桌面
- 悬停：阴影扩大加深，同时卡片向上位移 2-4px
- 激活：阴影收缩，卡片下沉

---

## 8. 布局网格

### 8.1 容器限制

```css
/* 主内容容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 文章详情页 - 收窄以获得最佳阅读体验 */
.article-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 24px;
}
```

**核心理由**：人眼的最佳阅读行长约为 60-80 个字符（中文约 35-45 字）。

### 8.2 双栏结构

```
┌─────────────────────────────────────────────────────────────┐
│                        导航栏 (固定)                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────┬─────────────────────┐  │
│  │                                │                     │  │
│  │     主内容区 (70%-75%)         │   侧边栏 (25%-30%)  │  │
│  │                                │                     │  │
│  │  ┌──────────────────────────┐  │  ┌───────────────┐  │  │
│  │  │     文章卡片             │  │  │   作者简介    │  │  │
│  │  └──────────────────────────┘  │  └───────────────┘  │  │
│  │                                │                     │  │
│  │  ┌──────────────────────────┐  │  ┌───────────────┐  │  │
│  │  │     文章卡片             │  │  │   目录导航    │  │  │
│  │  └──────────────────────────┘  │  └───────────────┘  │  │
│  │                                │                     │  │
│  │  ┌──────────────────────────┐  │  ┌───────────────┐  │  │
│  │  │     文章卡片             │  │  │   标签云      │  │  │
│  │  └──────────────────────────┘  │  └───────────────┘  │  │
│  │                                │                     │  │
│  └────────────────────────────────┴─────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 8.3 间距系统

```css
/* 基础单位 */
--spacing-unit: 8px;

/* 间距阶梯 */
--spacing-xs: 8px;    /* 紧凑间距 */
--spacing-sm: 16px;   /* 元素内边距 */
--spacing-md: 24px;   /* 卡片内边距 */
--spacing-lg: 32px;   /* 模块间距 */
--spacing-xl: 40px;   /* 大模块间距 */
--spacing-2xl: 60px;  /* 章节间距 */
--spacing-3xl: 80px;  /* 页面章节 */
```

### 8.4 响应式断点

```css
/* 移动端优先 */
/* 小屏手机 */
@media (max-width: 480px) { }

/* 大屏手机 */
@media (min-width: 481px) and (max-width: 767px) { }

/* 平板 */
@media (min-width: 768px) and (max-width: 1023px) { }

/* 小桌面 */
@media (min-width: 1024px) and (max-width: 1279px) { }

/* 大桌面 */
@media (min-width: 1280px) { }
```

### 8.5 移动端适配

- 双栏自动堆叠为单栏
- 侧边栏内容沉底或折叠进汉堡菜单
- 导航栏保持固定顶部，简化元素
- 字体大小适当调整

---

## 9. 组件设计规范

### 9.1 导航栏 (Navbar)

#### 结构

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Logo          首页  文章  关于          搜索  主题  │   │
│  │  (左)          (中 - 导航链接)           (右 - 操作) │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  Acrylic 材质:                                              │
│  - backdrop-filter: blur(16px)                              │
│  - background: rgba(255, 255, 255, 0.85)                    │
│  - border-bottom: 1px solid rgba(255, 255, 255, 0.4)        │
│  - position: fixed                                          │
│  - z-index: 100                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 滚动行为

```css
.navbar {
  transition: all 0.3s ease;
}

.navbar.scrolled {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
```

### 9.2 文章卡片 (ArticleCard)

#### 结构

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │                                               │  │   │
│  │  │              封面图片 (16:9)                   │  │   │
│  │  │                                               │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │                                                     │   │
│  │  分类标签                              2026-03-06   │   │
│  │                                                     │   │
│  │  文章标题 (H2, 20px, SemiBold)                      │   │
│  │                                                     │   │
│  │  文章摘要，显示前两行内容...                         │   │
│  │                                                     │   │
│  │  👁 1234  💬 56  ❤️ 89                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  材质: Surface Color (#F7F2FA)                              │
│  圆角: 16px                                                 │
│  阴影: shadow-sm (静止) / shadow-md (悬停)                  │
│  内边距: 0 (图片) + 24px (内容区)                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

#### 悬停效果

```css
.article-card {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  background: var(--color-surface-container);
}
```

### 9.3 按钮 (Button)

#### 变体

| 变体 | 背景 | 文字 | 用途 |
|------|------|------|------|
| Primary | --color-primary | 白色 | 主要操作 |
| Secondary | transparent | --color-primary | 次要操作 |
| Text | transparent | --color-primary | 低优先级 |
| Icon | transparent | --color-text-primary | 图标按钮 |

#### 尺寸

| 尺寸 | 高度 | 内边距 | 字号 | 圆角 |
|------|------|--------|------|------|
| sm | 32px | 0 16px | 14px | 100px |
| md | 40px | 0 24px | 15px | 100px |
| lg | 48px | 0 32px | 16px | 100px |

#### 交互状态

```css
.btn {
  transition: all 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(103, 80, 164, 0.3);
}

.btn:active {
  transform: scale(0.96);
  transition: all 0.1s ease;
}
```

### 9.4 搜索框 (SearchBox)

#### 结构

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🔍  搜索文章...                           [搜索]   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  材质: Surface Color                                        │
│  圆角: 12px (radius-md)                                     │
│  高度: 48px                                                 │
│  聚焦: 2px 主色边框                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.5 模态弹窗 (Modal)

#### 结构

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐   │
│  │  遮罩层: rgba(0, 0, 0, 0.5)                          │   │
│  │  backdrop-filter: blur(4px)                          │   │
│  │                                                     │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │  弹窗内容                                    │   │   │
│  │  │                                             │   │   │
│  │  │  ┌─────────────────────────────────────┐   │   │   │
│  │  │  │  标题                    [关闭]     │   │   │   │
│  │  │  ├─────────────────────────────────────┤   │   │   │
│  │  │  │                                     │   │   │   │
│  │  │  │  内容区域                            │   │   │   │
│  │  │  │                                     │   │   │   │
│  │  │  ├─────────────────────────────────────┤   │   │   │
│  │  │  │  [取消]              [确认]         │   │   │   │
│  │  │  └─────────────────────────────────────┘   │   │   │
│  │  │                                             │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  │                                                     │   │
│  │  弹窗材质: Acrylic                                  │   │
│  │  - backdrop-filter: blur(24px)                      │   │
│  │  - background: rgba(255, 255, 255, 0.9)             │   │
│  │  - border-radius: 20px                              │   │
│  │  - box-shadow: var(--shadow-2xl)                    │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.6 侧边栏组件

#### 作者简介卡片

```
┌─────────────────────────────────────────────────────────────┐
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                     │   │
│  │              ┌─────────────┐                       │   │
│  │              │             │                       │   │
│  │              │    头像     │                       │   │
│  │              │   (圆形)    │                       │   │
│  │              │             │                       │   │
│  │              └─────────────┘                       │   │
│  │                                                     │   │
│  │                 作者名称                            │   │
│  │              前端开发者 · 技术博主                   │   │
│  │                                                     │   │
│  │  这里是作者简介，简短介绍自己的专业领域...            │   │
│  │                                                     │   │
│  │  [GitHub] [Twitter] [Email]                         │   │
│  │                                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  材质: Surface Color                                        │
│  圆角: 16px                                                 │
│  阴影: shadow-sm                                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. 交互与动效

### 10.1 动效原则

1. **有意义**：每个动画都应有明确的目的
2. **快速**：过渡时间控制在 150-300ms
3. **流畅**：使用 ease 或 cubic-bezier 缓动函数
4. **可禁用**：尊重用户的 `prefers-reduced-motion` 设置

### 10.2 微交互规范

#### 导航栏滚动态

```css
.navbar {
  transition: all 0.3s ease;
}

/* 滚动前 */
.navbar.initial {
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.8);
}

/* 滚动后 */
.navbar.scrolled {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}
```

#### 按钮点击反馈

```css
.btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn:active {
  transform: scale(0.96);
  transition: all 0.1s ease;
}
```

#### 卡片悬停效果

```css
.card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}
```

#### 链接悬停效果

```css
.link {
  transition: color 0.2s ease;
}

.link:hover {
  color: var(--color-primary);
  text-decoration: underline;
}
```

### 10.3 页面过渡

```css
/* 页面进入动画 */
.page-enter {
  opacity: 0;
  transform: translateY(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 页面离开动画 */
.page-leave {
  opacity: 1;
}

.page-leave-active {
  opacity: 0;
  transition: opacity 0.2s ease;
}
```

### 10.4 加载状态

**骨架屏 (Skeleton Screen)**：

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-surface-variant) 0%,
    var(--color-surface) 50%,
    var(--color-surface-variant) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

**禁止**：严禁使用旋转的 Loading 圆圈打断阅读流。

---

## 11. 深色模式适配

### 11.1 深色模式原则

深色模式不是简单的反色，而是重新构建光影关系。

### 11.2 色彩映射

```css
[data-theme="dark"] {
  /* 背景反转 */
  --color-background: #000000;
  --color-surface: #141218;
  --color-surface-variant: #2B2930;
  
  /* 文本提亮 */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #B0B0B0;
  --color-text-hint: #707070;
  
  /* 主色调整 */
  --color-primary: #D0BCFF;  /* 更明亮的薰衣草紫 */
  
  /* Acrylic 调整 */
  --acrylic-base: rgba(26, 26, 26, 0.85);
  --acrylic-highlight: rgba(168, 168, 168, 0.12);
}
```

### 11.3 Acrylic 深色模式调整

| 属性 | 浅色模式 | 深色模式 |
|------|----------|----------|
| 基础透明度 | 0.85 | 0.85 |
| 模糊半径 | 16px | 12px (降低噪点) |
| 高光边框 | rgba(255,255,255,0.4) | rgba(168,168,168,0.12) |
| 色调叠加 | 淡紫 | 深灰 |

### 11.4 实现方式

```typescript
// useTheme.ts
export function useTheme() {
  const isDark = ref(false);
  
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    document.documentElement.setAttribute(
      'data-theme', 
      isDark.value ? 'dark' : 'light'
    );
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  };
  
  // 初始化
  onMounted(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark.value = saved === 'dark' || (!saved && prefersDark);
    document.documentElement.setAttribute(
      'data-theme', 
      isDark.value ? 'dark' : 'light'
    );
  });
  
  return { isDark, toggleTheme };
}
```

---

## 12. 实现指南

### 12.1 CSS 变量定义

```css
/* design-tokens.css */
:root {
  /* 色彩系统 */
  --color-primary: #6750A4;
  --color-primary-light: #7F67BE;
  --color-primary-dark: #4F378B;
  
  --color-surface: #F7F2FA;
  --color-surface-variant: #E7E0EC;
  --color-background: #FDFBFF;
  
  --color-text-primary: #1D1B20;
  --color-text-secondary: #49454F;
  --color-text-hint: #79747E;
  
  /* Acrylic 玻璃 */
  --acrylic-bg: rgba(255, 255, 255, 0.85);
  --acrylic-border: rgba(255, 255, 255, 0.4);
  --acrylic-blur: 16px;
  
  /* 阴影系统 */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.10);
  --shadow-xl: 0 12px 48px rgba(0, 0, 0, 0.12);
  --shadow-2xl: 0 16px 64px rgba(0, 0, 0, 0.14);
  --shadow-3xl: 0 24px 80px rgba(0, 0, 0, 0.16);
  
  /* 圆角系统 */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 100px;
  
  /* 间距系统 */
  --spacing-unit: 8px;
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 40px;
  
  /* 字体系统 */
  --font-family-primary: 'Inter', system-ui, sans-serif;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 32px;
  --font-size-4xl: 40px;
  
  /* 过渡动画 */
  --transition-fast: 0.15s;
  --transition-base: 0.3s;
  --transition-slow: 0.5s;
  
  color-scheme: light;
}

[data-theme="dark"] {
  /* 深色模式覆盖 */
  --color-primary: #D0BCFF;
  --color-surface: #141218;
  --color-surface-variant: #2B2930;
  --color-background: #000000;
  
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #B0B0B0;
  --color-text-hint: #707070;
  
  --acrylic-bg: rgba(26, 26, 26, 0.85);
  --acrylic-border: rgba(168, 168, 168, 0.12);
  
  color-scheme: dark;
}
```

### 12.2 Vue 组件实现示例

#### GlassPanel.vue

```vue
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
import { computed } from 'vue'

interface Props {
  variant?: 'elevated' | 'flat' | 'frosted'
  interactive?: boolean
  blur?: number
  opacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  interactive: false,
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
  backdrop-filter: blur(var(--glass-blur, 16px)) saturate(180%);
  -webkit-backdrop-filter: blur(var(--glass-blur, 16px)) saturate(180%);
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, calc(var(--glass-opacity, 0.85) * 1.1)) 0%,
    rgba(255, 255, 255, var(--glass-opacity, 0.85)) 50%,
    rgba(255, 255, 255, calc(var(--glass-opacity, 0.85) * 1.1)) 100%
  );
  border: 1px solid var(--acrylic-border);
  border-radius: var(--radius-lg);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* 顶部高光条 */
.glass-panel::before {
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
  pointer-events: none;
}

.glass-panel.elevated {
  box-shadow: var(--shadow-lg);
}

.glass-panel.interactive:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

[data-theme="dark"] .glass-panel {
  background: linear-gradient(
    135deg,
    rgba(40, 40, 40, calc(var(--glass-opacity, 0.85) * 1.1)) 0%,
    rgba(30, 30, 30, var(--glass-opacity, 0.85)) 50%,
    rgba(40, 40, 40, calc(var(--glass-opacity, 0.85) * 1.1)) 100%
  );
  border-color: var(--acrylic-border);
}
</style>
```

### 12.3 图片处理规范

```css
/* 文章封面图 */
.article-thumbnail {
  border-radius: var(--radius-lg);
  object-fit: cover;
  aspect-ratio: 16 / 9;
}

/* 图片遮罩 - 统一色调 */
.article-thumbnail-wrapper {
  position: relative;
}

.article-thumbnail-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(103, 80, 164, 0.05) 100%
  );
  border-radius: var(--radius-lg);
  pointer-events: none;
}
```

### 12.4 图标规范

```css
/* 图标风格 */
.icon {
  width: 24px;
  height: 24px;
  stroke-width: 1.5;
}

/* 默认状态 - 线性图标 */
.icon-outlined {
  fill: none;
  stroke: currentColor;
}

/* 选中状态 - 填充图标 */
.icon-filled {
  fill: currentColor;
  stroke: none;
}
```

**推荐图标库**：
- Material Symbols
- Phosphor Icons
- Lucide Icons

---

## 13. 检查清单

### 13.1 设计审查清单

#### 视觉一致性

- [ ] 导航栏质感：是否有磨砂模糊效果？滚动时是否能隐约透出下层内容？
- [ ] 卡片纯净度：文章卡片是否是实色背景（非透明）？是否有多余的边框干扰？
- [ ] 圆角一致性：所有卡片圆角是否统一为 16px？按钮是否为完美的 Pill 形状？
- [ ] 阅读舒适度：正文字号是否 >= 16px？行高是否 >= 1.6？是否存在纯黑 (#000000) 文字？

#### 交互反馈

- [ ] 悬停效果：鼠标悬停卡片时，是否有上浮、阴影加深和背景微变的复合反馈？
- [ ] 点击反馈：点击按钮是否有缩放反馈？
- [ ] 链接状态：文字链接悬停时是否有颜色变化和下划线？

#### 色彩与材质

- [ ] 色彩柔和度：整体色调是否柔和？是否存在刺眼的高饱和色块？
- [ ] 主色使用：主色是否仅在关键交互点出现？
- [ ] 层级清晰度：能否仅通过阴影和背景色，清晰地分辨出 导航 > 卡片 > 背景 的三层关系？
- [ ] Acrylic 效果：玻璃元素是否有正确的高光边框和顶部高光条？

#### 深色模式

- [ ] 适配完整性：切换到深色模式后，所有组件是否正常显示？
- [ ] 玻璃质感：深色模式下玻璃效果是否依然通透且不脏？
- [ ] 对比度：文字对比度是否达到 WCAG AA 标准？

### 13.2 性能检查清单

- [ ] 图片优化：所有图片是否经过压缩？是否使用 WebP 格式？
- [ ] 字体加载：是否使用 font-display: swap？
- [ ] CSS 优化：是否使用 PurgeCSS 移除未使用的样式？
- [ ] 动画性能：动画是否仅使用 transform 和 opacity？
- [ ] Acrylic 性能：是否启用了 GPU 加速？是否设置了 will-change？

### 13.3 无障碍检查清单

- [ ] 键盘导航：所有交互元素是否可通过键盘访问？
- [ ] 焦点状态：焦点指示器是否清晰可见？
- [ ] 对比度：文字与背景对比度是否 >= 4.5:1？
- [ ] 语义化：是否正确使用 HTML 语义化标签？
- [ ] 屏幕阅读器：是否为图标和按钮提供 aria-label？

---

## 附录

### A. 设计令牌速查表

```
┌─────────────────────────────────────────────────────────────┐
│                    设计令牌速查表                            │
├─────────────────────────────────────────────────────────────┤
│  色彩                                                        │
│  ─────────────────────────────────────────────────────────  │
│  Primary:     #6750A4 (Light) / #D0BCFF (Dark)              │
│  Surface:     #F7F2FA (Light) / #141218 (Dark)              │
│  Background:  #FDFBFF (Light) / #000000 (Dark)              │
│  Text:        #1D1B20 (Light) / #FFFFFF (Dark)              │
│                                                             │
│  圆角                                                        │
│  ─────────────────────────────────────────────────────────  │
│  sm:   8px   (图标、复选框)                                  │
│  md:   12px  (搜索框、输入框)                                │
│  lg:   16px  (卡片、侧边栏)                                  │
│  xl:   20px  (弹窗)                                          │
│  full: 100px (按钮、标签、头像)                              │
│                                                             │
│  阴影                                                        │
│  ─────────────────────────────────────────────────────────  │
│  xs:  0 1px 2px   rgba(0,0,0,0.04)                          │
│  sm:  0 2px 8px   rgba(0,0,0,0.06)   ← 卡片静止              │
│  md:  0 4px 16px  rgba(0,0,0,0.08)   ← 卡片悬停              │
│  lg:  0 8px 32px  rgba(0,0,0,0.10)   ← 导航栏                │
│  xl:  0 12px 48px rgba(0,0,0,0.12)   ← 下拉菜单              │
│  2xl: 0 16px 64px rgba(0,0,0,0.14)   ← 模态框                │
│  3xl: 0 24px 80px rgba(0,0,0,0.16)   ← 通知                  │
│                                                             │
│  间距                                                        │
│  ─────────────────────────────────────────────────────────  │
│  xs:  8px   (紧凑)                                           │
│  sm:  16px  (元素内边距)                                     │
│  md:  24px  (卡片内边距)                                     │
│  lg:  32px  (模块间距)                                       │
│  xl:  40px  (大模块间距)                                     │
│  2xl: 60px  (章节间距)                                       │
│  3xl: 80px  (页面章节)                                       │
│                                                             │
│  字体                                                        │
│  ─────────────────────────────────────────────────────────  │
│  H1:    32-40px  Bold      1.3   页面标题                    │
│  H2:    20-24px  SemiBold  1.4   卡片标题                    │
│  H3:    18-20px  Medium    1.4   子标题                      │
│  Body:  16-18px  Regular   1.75  正文                        │
│  Cap:   12-14px  Medium    1.5   辅助信息                    │
│                                                             │
│  Acrylic 玻璃                                                │
│  ─────────────────────────────────────────────────────────  │
│  blur:     16px (Light) / 12px (Dark)                       │
│  opacity:  0.85                                             │
│  border:   rgba(255,255,255,0.4) / rgba(168,168,168,0.12)   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### B. 参考资源

- [Microsoft Fluent Design System](https://www.microsoft.com/design/fluent/)
- [Material Design 3](https://m3.material.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inter Font Family](https://rsms.me/inter/)

---

**文档版本**: 1.0  
**最后更新**: 2026-03-06  
**作者**: 湛明博客设计团队
