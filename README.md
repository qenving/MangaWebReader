# 🎬 MangaVerse - Next-Gen Manga Reader Platform

A powerful, self-hosted manga reader platform with intelligent content aggregation, built with NestJS and Next.js.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/typescript-%5E5.0.0-blue.svg)

## ✨ Features

- 🔐 **Installation Wizard** - No manual `.env` editing required
- 👥 **Role-Based Access** - Owner, Admin, Moderator, Member, Guest
- 📖 **Manga Management** - Multi-language titles, genres, tags, authors
- 📚 **Chapter System** - Image arrays with source tracking
- 🔍 **Smart Search** - Filter by status, type, genre, and more
- 📊 **Analytics** - View counts, ratings, bookmarks tracking
- 🛡️ **Security** - JWT with security stamps, rate limiting, bcrypt

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose (for MySQL & Redis)
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   cd "Manga Website"
   
   # Backend
   cd backend
   npm install
   cp .env.example .env
   
   # Frontend
   cd ../frontend
   npm install
   ```

2. **Start database services**
   ```bash
   docker-compose up -d
   ```

3. **Initialize database**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   ```

4. **Run development servers**
   ```bash
   # Terminal 1 - Backend (port 3001)
   cd backend && npm run start:dev
   
   # Terminal 2 - Frontend (port 3000)
   cd frontend && npm run dev
   ```

5. **Open browser**
   - Navigate to `http://localhost:3000/install`
   - Complete the installation wizard
   - Start reading! 📖

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  NestJS API     │
│   (Port 3000)   │     │  (Port 3001)    │
└─────────────────┘     └────────┬────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     MySQL       │     │     Redis       │     │  File Storage   │
│   (Port 3306)   │     │   (Port 6379)   │     │    (Local)      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 📁 Project Structure

```
├── backend/                 # NestJS API Server
│   ├── src/
│   │   ├── auth/           # JWT Authentication
│   │   ├── users/          # User Management
│   │   ├── manga/          # Manga CRUD
│   │   ├── chapters/       # Chapter Management
│   │   ├── install/        # Installation Wizard
│   │   └── prisma/         # Database Service
│   └── prisma/
│       └── schema.prisma   # Database Schema
│
├── frontend/               # Next.js Application
│   ├── src/
│   │   ├── app/           # App Router Pages
│   │   ├── components/    # UI Components
│   │   └── lib/           # Utilities & API
│
└── docker-compose.yml      # MySQL + Redis
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="mysql://user:password@localhost:3306/manga_db"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# App
PORT=3001
NODE_ENV=development
```

## 📝 API Documentation

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/manga` | List manga with filters |
| GET | `/manga/:slug` | Get manga details |
| GET | `/chapters/latest` | Latest chapters feed |
| GET | `/chapters/:id` | Get chapter with navigation |
| POST | `/auth/login` | User login |
| POST | `/auth/register` | User registration |

### Protected Endpoints (Admin)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/manga` | Create manga |
| PUT | `/manga/:id` | Update manga |
| DELETE | `/manga/:id` | Delete manga |
| POST | `/chapters` | Create chapter |

## 🛡️ Security

- **Authentication**: JWT with security stamp rotation
- **Password Hashing**: bcrypt with 12 salt rounds
- **Rate Limiting**: 
  - 10 requests/second
  - 100 requests/minute
  - 1000 requests/10 minutes
- **Input Validation**: Zod schema validation
- **Role-Based Access**: Granular permissions per role

## 📄 License

MIT License - feel free to use this project for any purpose.

---

Built with ❤️ using NestJS, Next.js, Prisma, and Tailwind CSS
