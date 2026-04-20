# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Gà Tre** — a Vietnamese miniature chicken catalog and real-time negotiation platform.
- Prices are **hidden from the public**. Buyers negotiate via built-in chat.
- Target scale: 100–200 concurrent users. Monolithic architecture.
- Full rules: [`project-rules.md`](./project-rules.md). Read it before making changes.

## Tech Stack

- **Backend:** Java 21, Spring Boot 3.x, PostgreSQL, Flyway, MapStruct, jjwt, Cloudinary SDK
- **Auth:** Stateless JWT + Google OAuth2
- **Real-time:** Spring WebSocket + STOMP
- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS, Zustand, @stomp/stompjs

## Commands

### Backend (`backend/`)
```bash
# Run (requires .env populated)
./mvnw spring-boot:run

# Build JAR
./mvnw clean package -DskipTests

# Run tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=UserServiceTest
```

### Frontend (`frontend/`)
```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npm run type-check   # tsc --noEmit, no output files
npm run lint
```

## Architecture

### Backend Package Layout (`com.gatre`)
- `entity/` — JPA entities. Audit fields via Spring Data `@CreatedDate`/`@LastModifiedDate`.
- `dto/admin/` — Records that include sensitive fields (e.g., `priceFrom`, `priceTo`). **Admin endpoints only.**
- `dto/public/` — Records with price fields stripped. **All public/user endpoints.**
- `mapper/` — MapStruct mappers are the **only** place where entity ↔ DTO conversion happens.
- `controller/admin/` → `/api/admin/**` (ROLE_ADMIN only)
- `controller/public/` → `/api/public/**` (no auth) and `/api/user/**` (any authenticated user)
- `security/` — JWT filter chain + OAuth2 success handler.
- `websocket/` — STOMP message handlers. Chat messages carry optional `productId`; backend hydrates a `ProductSnapshotDTO` into the response.
- DB migrations: `src/main/resources/db/migration/V{n}__{description}.sql`. Never use `ddl-auto=create`.

### Frontend Structure (`src/`)
- `app/` — Next.js App Router. `(public)/` for SSR catalog pages; `admin/` for admin panel.
- `components/ui/` — Atomic components (Button, Input, Badge, Modal). Use design tokens only.
- `components/chat/` — `ChatWindow`, `MessageBubble`. When `message.productSnapshot` is present, render `<ProductCardMini />` inside the bubble.
- `store/` — One Zustand file per domain: `useAuthStore`, `useProductStore`, `useChatStore`.
- `styles/tailwind.config.ts` — All colors defined as semantic tokens (`text-primary`, `bg-surface`, etc.). **No raw hex values in components.**

## Critical Rules (Non-Negotiable)

1. **Hidden Price:** `price_from`/`price_to` never appear in `PublicProductDTO` or any public API response. Enforced in the mapper layer.
2. **Vietnamese UI:** All user-facing strings are in Vietnamese. No i18n framework.
3. **Step-by-Step:** Propose design/logic first → wait for approval → then write implementation code.
4. **Design tokens:** Use Tailwind semantic classes (`text-primary`, `bg-danger`). Never hardcode colors.
5. **Log every change to `IMPLEMENTATION.md`:** After completing any feature, fix, or non-trivial refactor, append a new section to `IMPLEMENTATION.md` at the repo root. The section must include: feature/fix name, date, files modified/created, what changed and why. This is mandatory — no commit without a corresponding entry.