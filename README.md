# vue3-vite-express

A full-stack blog system + DAP tools collection.

## Project Structure

```
vue3-vite-express/
├── blog-api-ts/       # Backend API (Express + TypeScript + MongoDB)
├── blog-vite-vue3/    # Frontend (Vue 3 + Vite + Pinia + Element Plus)
└── elaphure-dap/      # DAP (Debug Adapter Protocol) tools
```

## blog-api-ts

Express + TypeScript REST API server with MongoDB.

### Features
- Express + TypeScript
- MongoDB + Mongoose
- JWT authentication
- RESTful API
- Multi-platform support (Weibo, Douyin, Qiniu, etc.)

### Setup

```bash
cd blog-api-ts

# Install dependencies
pnpm install

# Create config files (optional)
# src/config/mpapp.js - WeChat mini-program login
# src/config/shihua.js - Baidu AI image recognition
```

```bash
# Development
pnpm serve

# Production
pnpm build
pnpm start
```

Runs on http://localhost:4000

---

## blog-vite-vue3

Vue 3 + Vite SPA blog frontend.

### Features
- Vue 3 + Vue Router 4 + Pinia
- Vite 5
- Element Plus
- Markdown editor
- PWA support

### Setup

```bash
cd blog-vite-vue3

# Install dependencies
pnpm install

# Development
pnpm serve

# Production
pnpm build
pnpm start
```

Runs on http://localhost:7776

### Access
- Frontend: http://localhost:7776
- Admin: http://localhost:7776/backend-login

---

## elaphure-dap

DAP (Debug Adapter Protocol) related tools.

---

## License

MIT
