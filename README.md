# mmf-blog

A full-stack blog system built with Vue 3 + Vite + Express + MongoDB.

## Project Structure

```
mmf-blog/
├── mmf-blog-api-ts/     # Backend API (Express + TypeScript + MongoDB)
└── mmf-blog-vite-vue3/ # Frontend (Vue 3 + Vite + Pinia + Element Plus)
```

## Features

### Frontend
- Vue 3 + Vue Router 4 + Pinia
- Vite 5 build tool
- Element Plus UI component library
- Markdown editor support
- PWA support
- Responsive design

### Backend
- Express + TypeScript
- MongoDB + Mongoose
- JWT authentication
- RESTful API
- Multi-platform support (Weibo, Douyin, Qiniu, etc.)

## Getting Started

### Prerequisites

- Node.js >= 16
- MongoDB >= 4.0
- pnpm (recommended)

### Backend Setup

```bash
cd mmf-blog-api-ts

# Install dependencies
pnpm install

# Create config files
# src/config/mpapp.js - WeChat mini-program login
# src/config/shihua.js - Baidu AI image recognition
```

Example `src/config/mpapp.js`:
```javascript
exports.apiId = ''
exports.secret = ''
```

Example `src/config/shihua.js`:
```javascript
exports.APP_ID = ''
exports.API_KEY = ''
exports.SECRET_KEY = ''
```

```bash
# Development
pnpm serve

# Production build
pnpm build
pnpm start
```

Backend runs on http://localhost:4000

### Frontend Setup

```bash
cd mmf-blog-vite-vue3

# Install dependencies
pnpm install

# Development
pnpm serve

# Production build
pnpm build
pnpm start
```

Frontend runs on http://localhost:7776

### Access

- Frontend: http://localhost:7776
- Backend API: http://localhost:4000
- Admin Panel: http://localhost:7776/backend-login

## API Endpoints

### Frontend
- `GET /api/front/article/list` - Article list
- `GET /api/front/article/:id` - Article detail
- `POST /api/front/user/login` - User login
- `POST /api/front/user/register` - User register
- `POST /api/front/comment` - Add comment

### Backend (Admin)
- `POST /backend/user/login` - Admin login
- `GET /backend/user/list` - User management
- `GET /backend/article/list` - Article management
- `POST /backend/article/insert` - Create article
- `PUT /backend/article/:id` - Update article
- `DELETE /backend/article/:id` - Delete article

## License

MIT
