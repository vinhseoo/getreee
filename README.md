# Gà Tre — Miniature Chicken Catalog & Negotiation System

A web-based catalog and real-time negotiation platform for Vietnamese miniature chicken (Gà Tre) enthusiasts. Prices are hidden from the public; buyers negotiate directly with the admin via built-in chat.

## Tech Stack

| | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3.x, PostgreSQL, Flyway |
| Auth | JWT (stateless) + Google OAuth2 |
| Media | Cloudinary (images & video) |
| Real-time | Spring WebSocket + STOMP |
| Frontend | Next.js 14+ (App Router), React, Tailwind CSS, Zustand |
| Scale | Monolithic — 100–200 concurrent users |

---

## Development Roadmap

### Phase 0 — System Design & Database Schema ✅
- Define business rules and coding standards (`project-rules.md`)
- Establish folder structure for `backend/` and `frontend/`
- Design full PostgreSQL schema (ERD)
- Define API contract (endpoint list)

---

### Phase 1 — Backend Foundation & Auth
- Spring Boot project init (Maven, Java 21)
- Flyway migration: initial schema
- User entity, repository, service
- JWT authentication filter + token provider
- Google OAuth2 login callback
- Auth endpoints: `POST /api/auth/login`, `POST /api/auth/refresh`, `GET /api/auth/me`
- Spring Security config (route protection by role)

**Deliverable:** A user can register/login via Google OAuth2 and receive a JWT.

---

### Phase 2 — Catalog & Media APIs
- Category entity, CRUD (Admin only)
- Product entity with `price_from` / `price_to` (internal only)
- `PublicProductDTO` (price-stripped) vs `AdminProductDTO` (full)
- Cloudinary integration for image/video upload
- Public endpoints: `GET /api/public/products`, `GET /api/public/products/{slug}`
- Admin endpoints: `POST /api/admin/products`, `PUT /api/admin/products/{id}`, `DELETE /api/admin/products/{id}`

**Deliverable:** Admin can manage listings. Public API returns no price data.

---

### Phase 3 — Frontend Foundation & UI
- Next.js project init (App Router, TypeScript, Tailwind)
- Design system: tokens defined in `tailwind.config.ts`
- Layout components: Header, Footer, Sidebar
- Public catalog page (SSR, SEO optimized)
- Product detail page (SSR)
- Auth flow: Google login button, session handling
- Admin panel skeleton: product list, create/edit form

**Deliverable:** Public catalog and admin product management are fully functional in the browser.

---

### Phase 4 — Real-Time Chat Integration
- `Conversation` and `ChatMessage` entities
- `ChatMessage.product_id` nullable FK → renders product card in bubble
- WebSocket config (STOMP broker), `/ws` endpoint
- Chat endpoints: list conversations, message history
- Backend: hydrate `ProductSnapshotDTO` into message payload when `product_id` is set
- Frontend: `<ChatWindow />`, `<MessageBubble />` with embedded `<ProductCard />` mini-component
- Admin chat dashboard: see all conversations, reply to users
- Zustand `useChatStore` for real-time message state

**Deliverable:** Users can open a chat, reference a product in a message, and negotiate in real time with the admin.

---

## Project Structure

```
/
├── backend/          # Spring Boot application
├── frontend/         # Next.js application
├── project-rules.md  # Coding standards and business rules
└── README.md         # This file
```

## Getting Started

> Setup instructions will be added after Phase 1 completion.

See [`project-rules.md`](./project-rules.md) for full coding standards and environment variable definitions.