# Project Rules & Coding Standards
## Gà Tre Catalog & Negotiation System

> This document is the single source of truth for all development decisions.
> Every contributor (human or AI) must read this before writing a single line of code.

---

## 1. Business Rules

### 1.1 Localization
- The application serves **Vietnamese users exclusively**.
- **NO** multi-language (i18n) framework shall be implemented.
- All user-facing text (UI labels, button text, error messages, toast notifications, email templates) **MUST be in Vietnamese**.
- All source code identifiers (variables, methods, classes, interfaces) **MUST be in English**.
- All database tables and columns **MUST be in English** (snake_case).

### 1.2 The "Hidden Price" Rule
This is a catalog system, **not** an e-commerce checkout.

- The `Product` entity has `price_from` (Long) and `price_to` (Long) fields.
- These fields **MUST NEVER** appear in any public-facing API response.
- Two separate DTO families must be maintained:
  - `PublicProductDTO` — no price fields. Used for all unauthenticated/user endpoints.
  - `AdminProductDTO` — includes `priceFrom`, `priceTo`. Used for admin-only endpoints.
- The mapper layer is the **enforcement point**. Do not rely on `@JsonIgnore` as a safety net.
- Any endpoint under `/api/public/**` or `/api/user/**` must return only `PublicProductDTO`.

### 1.3 Real-Time Chat (Shopee-Style)
- Users negotiate via a built-in WebSocket chat (Spring WebSocket + STOMP).
- A `ChatMessage` entity has a nullable `product_id` foreign key.
- When `product_id` is present in a message payload, the backend **must include** a `ProductSnapshotDTO` (public, price-stripped) in the response.
- The frontend renders a `<ProductCard />` mini-component inside the chat bubble when `productSnapshot` is present.
- Admin users can read and reply to any conversation.
- Regular users can only read/write their own conversations.

### 1.4 Admin Privileges
Only users with the `ROLE_ADMIN` authority may:
- Create, update, delete Product listings.
- Create, update, delete Categories.
- Manage user accounts (activate/deactivate).
- View admin-side chat dashboard and reply to user messages.

---

## 2. Tech Stack Decisions

| Layer | Technology | Notes |
|---|---|---|
| Backend Language | Java 21 | Use Records for all DTOs |
| Backend Framework | Spring Boot 3.x | Layered architecture |
| Database | PostgreSQL | Migrations via Flyway |
| Auth | JWT + Google OAuth2 | Stateless JWT; refresh token in HttpOnly cookie |
| Media Storage | Cloudinary | Images and videos for products |
| Real-time | Spring WebSocket + STOMP | `/ws` endpoint, `/topic` and `/queue` destinations |
| Frontend | Next.js (App Router) | SSR required for SEO |
| Styling | Tailwind CSS | Design tokens in `tailwind.config.ts` |
| State Management | Zustand | One store per domain |
| Scale | Monolithic | 100–200 concurrent users; no microservices |

---

## 3. Backend Coding Standards

### 3.1 Package Structure
```
com.gatre
├── config/        # Spring configuration beans
├── controller/
│   ├── admin/     # Admin-only controllers
│   └── public/    # Public & authenticated-user controllers
├── service/       # Business logic interfaces + implementations
├── repository/    # Spring Data JPA repositories
├── entity/        # JPA entities (@Entity)
├── dto/
│   ├── admin/     # Admin DTOs (Records, include sensitive fields)
│   └── public/    # Public DTOs (Records, price fields excluded)
├── mapper/        # Entity <-> DTO mapping (MapStruct preferred)
├── exception/     # Custom exceptions + @RestControllerAdvice handler
├── security/      # JWT filter, OAuth2 handlers, UserDetails impl
└── websocket/     # STOMP message handlers, WebSocket config
```

### 3.2 DTO Convention
- All DTOs **must** be Java Records.
- Naming: `Public{Entity}DTO`, `Admin{Entity}DTO`, `{Entity}CreateRequest`, `{Entity}UpdateRequest`.
- No business logic inside Records.

### 3.3 Entity Convention
- All entities use `Long` as primary key with `@GeneratedValue(strategy = IDENTITY)`.
- Audit fields (`created_at`, `updated_at`) via `@CreatedDate` / `@LastModifiedDate` (Spring Data Auditing).
- No bidirectional `@OneToMany` unless strictly required; prefer explicit queries.

### 3.4 API Design
- Public routes: `GET /api/public/**` (no auth required).
- Authenticated user routes: `/api/user/**` (ROLE_USER or ROLE_ADMIN).
- Admin routes: `/api/admin/**` (ROLE_ADMIN only).
- All responses wrapped in a standard envelope:
  ```json
  { "success": true, "data": {}, "message": "..." }
  ```
- Error responses in Vietnamese for user-visible messages; English for developer `code` field.

### 3.5 Database
- Use Flyway for all schema changes. No `spring.jpa.hibernate.ddl-auto=create`.
- Migration files: `V{n}__{description}.sql` (e.g., `V1__init_schema.sql`).
- Foreign keys and indexes must be explicit in migration scripts.

---

## 4. Frontend Coding Standards

### 4.1 Design System (Non-Negotiable)
- All colors, font sizes, and spacing **must** be defined as design tokens in `tailwind.config.ts`.
- **Forbidden:** hardcoded color values like `text-[#123456]`, `bg-red-500` used directly in components.
- **Required:** semantic class names like `text-primary`, `bg-surface`, `text-danger`.
- A `src/styles/theme.ts` file exports the token values for use in non-Tailwind contexts.

### 4.2 Component Structure
```
src/components/
├── ui/        # Atomic: Button, Input, Badge, Modal, Spinner
├── layout/    # Header, Footer, Sidebar, PageWrapper
├── product/   # ProductCard, ProductGrid, ProductDetail
└── chat/      # ChatWindow, MessageBubble, ProductCard (mini)
```
- One component per file.
- No inline styles.
- Props must be explicitly typed (TypeScript interfaces).

### 4.3 State Management (Zustand)
- One store file per domain: `useAuthStore`, `useProductStore`, `useChatStore`.
- Stores live in `src/store/`.
- No prop-drilling past 2 levels; use store instead.

### 4.4 Data Fetching
- Server Components fetch data directly via `fetch()` with `cache` options for SSR/SSG.
- Client Components use custom hooks in `src/hooks/` wrapping `fetch` or a lightweight API client.
- API base URL configured via `NEXT_PUBLIC_API_URL` env variable.

### 4.5 Route Structure (App Router)
```
src/app/
├── (public)/           # Unauthenticated pages (catalog, product detail)
├── (auth)/             # Login, OAuth callback
├── dashboard/          # Authenticated user area (chat, profile)
└── admin/              # Admin panel (product management, user list, chat)
```

---

## 5. Development Workflow

### 5.1 Step-by-Step Rule
1. **Propose** the design/logic/schema.
2. **Wait for approval** before writing implementation code.
3. **Never skip ahead** to the next phase without explicit sign-off.

### 5.2 Phase Gates
Each phase must be considered "done" only when:
- Backend: Feature endpoints are tested and returning correct responses.
- Frontend: Feature is visually verified in browser, not just type-checked.

### 5.3 Git Conventions
- Branch naming: `feature/{phase}-{short-description}` (e.g., `feature/phase1-auth`).
- Commit messages: `[Phase N] short description` in English.
- Never commit `.env` files.

### 5.4 Change Log (Mandatory)
After every completed feature, fix, or non-trivial refactor, append a new section to **`IMPLEMENTATION.md`** at the repo root before committing. Required fields per entry:
- Feature/fix name and date
- Files modified or created (with a one-line reason each)
- What changed and why (behavior before → behavior after)

No commit that modifies business logic, APIs, DB schema, or UI should lack a corresponding `IMPLEMENTATION.md` entry.

---

## 6. Environment Variables

### Backend (`backend/.env`)
```
DB_URL=jdbc:postgresql://localhost:5432/gatre_db
DB_USERNAME=
DB_PASSWORD=
JWT_SECRET=
JWT_EXPIRATION_MS=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=ws://localhost:8080/ws
NEXTAUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```