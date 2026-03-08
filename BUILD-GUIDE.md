# 项目构建总结

## 一、AI 聊天功能修复

### 1. 后端 API 配置 (blog-api-ts)

#### 安装依赖
```bash
pnpm add dotenv
```

#### 创建 .env 文件
```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/mmfblog_v2

# DeepSeek AI API
DS_API_KEY=sk-sp-14e207d3d0724c868b4ec7ed724f35e2
DS_TARGET_API_URL=https://coding.dashscope.aliyuncs.com/v1/chat/completions

# JWT
JWT_SECRET=your-jwt-secret
```

#### 修改 src/app.ts
- 添加 `import 'dotenv/config'` 加载环境变量
- 端口改为 `3000` (与前端 proxy 配置一致)
- 添加全局错误处理中间件

#### 修改 src/mongoose.ts
```typescript
import process from 'node:process'
import mongoose from 'mongoose'

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mmfblog_v2'
mongoose.connect(mongoUri, {})
```

#### 修改 src/app/chat-helper.ts
关键改进：
1. 流式请求先设置 SSE headers，再调用 `res.flushHeaders()`
2. 使用 `res.write(chunk)` 而非 `pipe()`
3. 添加 `Accept: text/event-stream` header
4. 完善错误处理，流式请求时用 SSE 格式返回错误

### 2. 前端配置 (blog-vite-vue3)

#### 安装依赖
```bash
pnpm add dompurify
```

#### 修改 vite.config.ts
添加 server proxy 和 `~` 别名：
```typescript
resolve: {
  alias: {
    '@': path.join(__dirname, './src'),
    '~': path.join(__dirname, './src'),
  },
},
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
},
```

#### 修改 src/api/useMakeAutosuggestion.ts
关键改进：
1. 添加 `AbortController` 支持请求取消
2. 使用 `DOMPurify` 防止 XSS
3. 改进 SSE 解析（buffer 处理 `\n\n` 分割）
4. 支持 `reasoning_content`（思考标签）
5. 添加 `Accept: text/event-stream` header

---

## 二、Elaphure DAP 工具页面修复

### 文件结构
```
src/components/elaphure/
├── DeviceConnect.vue     # 设备连接
├── FirmwareUpload.vue    # 固件上传
├── FlashConfig.vue       # 烧录配置
├── i18n.ts              # 国际化
└── dap/
    ├── config.ts        # 配置类型
    ├── download.ts      # 烧录核心
    ├── log.ts           # 日志系统
    ├── preprocess.ts    # 固件预处理
    └── verify/
        └── crc.bin      # CRC 校验数据
```

### 修复步骤

#### 1. 添加类型声明 (src/shims.d.ts)
```typescript
declare module '*?uint8array' {
    const value: Uint8Array
    export default value
}
```

#### 2. 修复 download.ts
确保 `onDownload` 函数在文件末尾正确导出，不在其他函数内部。

#### 3. 修复 preprocess.ts
```typescript
import { dapLog, log } from './log'  // 添加 log 导入
```

#### 4. 创建 i18n.ts
简单的 vue-i18n 配置文件。

#### 5. 复制 crc.bin
从 `123/blog-vite-vue3/src/components/elaphure/dap/verify/crc.bin` 复制到当前项目。

---

## 三、关键配置文件对比

### blog-api-ts/src/config/index.ts
```typescript
import process from 'node:process'

// 使用环境变量，带默认值
export const DS_API_KEY = process.env.DS_API_KEY || 'sk-sp-...'
export const DS_TARGET_API_URL = process.env.DS_TARGET_API_URL || 'https://...'
export const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/mmfblog_v2'
```

### blog-vite-vue3/vite.config.ts
```typescript
export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        '~': path.join(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': { target: 'http://localhost:3000', changeOrigin: true },
      },
    },
  }
})
```

---

## 四、启动顺序

1. **启动后端** (blog-api-ts)
```bash
pnpm serve  # 运行在 localhost:3000
```

2. **启动前端** (blog-vite-vue3)
```bash
pnpm serve  # 运行在 localhost:5173
```

---

## 五、常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| AI 页面 500 错误 | 后端未加载 .env | 添加 `import 'dotenv/config'` |
| 流式返回不工作 | 缺少 proxy 配置 | 在 vite.config.ts 添加 server.proxy |
| `~` 导入失败 | 缺少别名配置 | 添加 `'~': path.join(__dirname, './src')` |
| crc.bin 404 | 文件缺失 | 复制 verify/crc.bin 文件 |
| onDownload 导出错误 | 语法问题 | 确保函数不在其他函数内部 |

---

## 六、相关文件清单

### 后端修改文件
- `blog-api-ts/.env` (新建)
- `blog-api-ts/src/app.ts`
- `blog-api-ts/src/mongoose.ts`
- `blog-api-ts/src/config/index.ts`
- `blog-api-ts/src/app/chat-helper.ts`

### 前端修改文件
- `blog-vite-vue3/vite.config.ts`
- `blog-vite-vue3/src/api/useMakeAutosuggestion.ts`
- `blog-vite-vue3/src/shims.d.ts`
- `blog-vite-vue3/src/components/elaphure/dap/download.ts`
- `blog-vite-vue3/src/components/elaphure/dap/preprocess.ts`
- `blog-vite-vue3/src/components/elaphure/i18n.ts` (新建)
- `blog-vite-vue3/src/components/elaphure/dap/verify/crc.bin` (复制)