# vue3-vite-express

一个现代化的全栈博客系统 + DAP 工具。

## 🌐 在线访问

- **网站**: https://zhanming.cc.cd/
- **API**: http://47.76.125.24/
- **后台**: http://47.76.125.24/backend

## 📁 项目结构

```
├── blog-api-ts/      # 后端 (Express + TypeScript + MongoDB)
├── blog-vite-vue3/   # 前端 (Vue 3 + Vite + SSR)
└── elaphure-dap/     # DAP 固件烧录工具
```

## 🚀 快速开始

### 后端
```bash
cd blog-api-ts
pnpm install
cp .env.example .env
pnpm serve      # 开发
pnpm build      # 生产
```
默认: http://localhost:4000

### 前端
```bash
cd blog-vite-vue3
pnpm install
pnpm serve      # 开发
pnpm build      # 生产
```
默认: http://localhost:7776

### DAP 工具
```bash
cd elaphure-dap
npm install
npm run dev
```

## 🔧 环境配置

**blog-api-ts/.env**
```bash
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb://localhost:27017/blog
JWT_SECRET=your_secret
CORS_ORIGINS=http://47.76.125.24,https://zhanming.cc.cd
```

**blog-vite-vue3/.env.production**
```bash
VITE_API_URL=http://47.76.125.24/api/
```

## 📦 技术栈

- **后端**: Express + TypeScript + MongoDB + JWT
- **前端**: Vue 3 + Vite + SSR + Pinia + Element Plus
- **安全**: XSS防护、速率限制、输入验证、bcrypt
- **DAP**: Vue 3 + DAP.js + WebUSB

## 🛡️ 安全

详细安全报告: [SECURITY_AUDIT_REPORT.md](./SECURITY_AUDIT_REPORT.md)

## 👨‍💻 作者

**孙召顺 (eagle-a)** - 哈尔滨工程大学

- 📧 2121612901@qq.com
- 🐙 [@eagle-a](https://github.com/eagle-a)
- 技能: 自动化、嵌入式、Linux、Web

基于 [@lincenying](https://github.com/lincenying) 的 [mmf-blog-vite-vue3](https://github.com/lincenying/mmf-blog-vite-vue3) 修改

## 📄 License

[MIT](./LICENSE)
