# MANGA READER PLATFORM: NEXT-GEN ARCHITECTURE BLUEPRINT
> **System Version**: 2.0 (High-Fidelity Specification)
> **Classification**: CONFIDENTIAL
> **Target Audience**: AI Agents & Senior Architects

---

## 🏗️ 1. SYSTEM ARCHITECTURE & INSTALLATION

### 1.1 First-Run Experience (Installation Wizard)
The system must not require manual `.env` editing. It features a self-hosted installation wizard.

#### Logic Flow: System Startup
```mermaid
graph TD
    A[Server Start] --> B{Is Configured?}
    B -->|Yes| C[Launch Application]
    B -->|No| D[Start Setup Server (Port 3000)]
    D --> E[Serve /install UI]
    E --> F[User Inputs DB Credentials]
    F --> G[Test Connection]
    G -->|Success| H[Run Migrations]
    H --> I[Create 'Owner' Account]
    I --> J[Generate .env & Restart]
```

#### First-Run Configuration Fields (UI)
- **Database Settings**:
  - Type: `MySQL` (Preferred by User) or `PostgreSQL`
  - Host: `localhost` (Default) or IP
  - Port: `3306`
  - Username/Password
  - Database Name
- **Owner Account Setup**:
  - Email (System Owner)
  - Secure Password
  - Recovery Key Generation

---

## 👥 2. ADVANCED ROLE HIERARCHY

Distinction between **OWNER** and **ADMIN** is critical for security and platform control.

| Feature Scope | 👑 OWNER | 🛡️ ADMIN | 👤 MEMBER |
| :--- | :---: | :---: | :---: |
| **System Config** (DB, SMTP, Storage) | ✅ | ❌ | ❌ |
| **Financials** (Ads, Gateway, Payouts) | ✅ | ❌ | ❌ |
| **User Management** (Ban, Promote) | ✅ | ✅ | ❌ |
| **Content Management** (Upload, Edit) | ✅ | ✅ | ❌ |
| **Scraper Configuration** | ✅ | ✅ | ❌ |
| **Database Access** (Raw SQL) | ✅ | ❌ | ❌ |
| **Access Logs/Security Audit** | ✅ | ✅ | ❌ |

---

## 🛠️ 3. CORE TECHNOLOGY STACK (MANDATORY)

### Backend (The Brain)
- **Framework**: `NestJS` (Modular Monolith)
- **Language**: `TypeScript` (Strict Mode)
- **Database**: `MySQL` (Primary) + `Redis` (Queue/Cache)
  - *Reasoning*: MySQL chosen per user preference for easier local hosting/XAMPP compatibility if needed.
- **ORM**: `Prisma` or `TypeORM`
- **Queue**: `BullMQ` (Scraping Jobs)

### Frontend (The Face)
- **Framework**: `Next.js` (App Router)
- **Styling**: `Tailwind CSS` + `Shadcn/UI`
- **State**: `Zustand` (Client) + `React Query` (Server State)

---

## 📊 4. COMPREHENSIVE DATA MODELS

### 4.1 User & Authorization
```typescript
/**
 * User Entity
 * Represents any actor in the system.
 */
interface User {
  id: string; // UUID
  email: string;
  passwordHash: string;
  
  // Role Definition
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'MEMBER' | 'GUEST';
  
  // Security
  isEmailVerified: boolean;
  twoFactorSecret?: string;
  securityStamp: string; // Rotates on password change
  
  // Profile
  username: string;
  avatarUrl?: string; // CDN path
  
  // Activity
  lastLoginAt: Date;
  registeredAt: Date;
  metadata: Record<string, any>; // JSON for extensibility
}
```

### 4.2 Manga & Taxonomy
```typescript
interface Manga {
  id: string;
  slug: string; // Optimized SEO slug (e.g., 'solo-leveling')
  
  title: {
    en: string;
    jp?: string;
    id?: string; // Bahasa Indonesia
  };
  
  // High-performance filtering
  status: 'ONGOING' | 'COMPLETED' | 'HIATUS';
  type: 'MANGA' | 'MANHWA' | 'MANHUA';
  isAdult: boolean;
  
  // Taxonomy
  genes: Genre[];
  tags: Tag[];
  authors: Author[];
  
  // Aggregated Stats (Updated via cron)
  metrics: {
    viewsTotal: number;
    viewsWeekly: number;
    rating: number; // 0-10
    follows: number;
  };
}
```

### 4.3 Chapter & Content
```typescript
interface Chapter {
  id: string;
  mangaId: string;
  
  // Identification
  number: number; // Float support (10.1, 10.5)
  title?: string;
  volume?: number;
  
  // Content
  // Images are never stored in DB as base64. Only paths.
  images: {
    url: string; // Signed CDN URL
    width: number;
    height: number;
  }[];
  
  // Source Tracking (Anti-Scrape Protection)
  source?: {
    origin: string; // 'komiku', 'mangadex'
    externalId: string;
  };
  
  releaseDate: Date;
  isLocked: boolean; // For early access/premium
}
```

---

## 🧠 5. INTELLIGENT SCRAPER & AGGREGATOR SYSTEM

The system acts as a "Content Orchestrator", not just a downloader.

### 5.1 Architecture
```mermaid
graph LR
    S[Scheduler] -->|Trigger| Q[BullMQ Job Queue]
    Q -->|Assign| W[Worker Node]
    W -->|1. Fetch HTML| P[Proxy Network]
    P -->|2. Request| T[Target Site]
    T -->|3. Response| W
    W -->|4. Parse| L[Parser Logic]
    L -->|5. Extract| I[Image Assets]
    I -->|6. Process| O[Optimizer (WebP)]
    O -->|7. Upload| S3[Storage Bucket]
```

### 5.2 Scraper Logic Specs
1.  **Stealth Mode**: Rotates User-Agents and Proxies per request.
2.  **Circuit Breaker**: Auto-pauses scraping from a source if 3 consecutive errors occur.
3.  **Heuristic Matching**: Uses Levenshtein distance to match imported manga titles to existing DB entries to prevent duplicates.
4.  **Priority Queue**: "Popular" manga scrape jobs get processed before "Archive" jobs.

---

## 📖 6. READER ENGINE V2.0 (THE "ZEN" INTERFACE)

The reader must be **client-side rendered (CSR)** for instant interaction, while the manga detail page is **SSR** for SEO.

### 6.1 Dual-Engine Specs

**Mode A: Webtoon (Vertical)**
- **HTML5 Canvas Stitching**: Automatically detects if the bottom pixel row of Image A matches the top row of Image B. If <1% difference, stitch seamlessly.
- **Virtualization**: Use `react-window` to only render images in viewport to save RAM on mobile.

**Mode B: Manga (Horizontal)**
- **RTL Support**: Native CSS `direction: rtl`.
- **Preloading**: When user is on Page 5, silently fetch Pages 6, 7, and 8.

### 6.2 Adaptive Quality (Network Aware)
The Frontend monitors `navigator.connection.saveData`.
- **True**: Request `?quality=low&format=webp` (400px width).
- **False**: Request `?quality=high&format=webp` (1200px width).

---

## 🛡️ 7. SECURITY & PERFORMANCE MANDATES

### 7.1 "Fort Knox" Security Checks
- [ ] **No Raw Exposure**: Database ports (3306) must NOT be exposed publicly.
- [ ] **Rate Limiting**: 
  - Login: 5 attempts / 10 mins
  - API Read: 1000 req / minute
  - API Write: 50 req / minute
- [ ] **Sanitization**: All inputs run through `Zod` validation.
- [ ] **File Upload**: Strict mime-type checking (Magic Bytes) to prevent executable uploads disguised as images.

### 7.2 Performance budgets
- **LCP (Largest Contentful Paint)**: < 1.2s (Skeleton UI required)
- **CLS (Layout Shift)**: 0.00 (Reserved space for images before load)
- **TTFB (Server Response)**: < 100ms (Heavily cached via Redis)

---

## 📈 8. SCALABILITY ROADMAP

1.  **Phase 1 (Single Node)**: App + MySQL + Redis on one VPS.
    - *Capacity*: Approx 1,000 concurrent users.
2.  **Phase 2 (Decoupled)**: App Server separated from Database Server.
    - *Capacity*: 10,000 concurrent users.
3.  **Phase 3 (Global)**: App deployed to Edge (Vercel/Cloudflare) + Read Replicas for DB.
    - *Capacity*: 100,000+ concurrent users.

---

*This document is the master architectural constraint. All code generated must comply with these specifications.*
