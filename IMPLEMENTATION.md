# Implementation Summary — Phase 5.1 (2026-04-20)

This document describes 5 major features implemented to enhance security, user account management, admin capabilities, and user engagement.

## 1. Security Polish

**Commits:** `e430a54`

### Changes
- **Cookie Secure Flag:** Made refresh token cookie security configurable via `COOKIE_SECURE` environment variable. In production, set to `true`; in development, defaults to `false`.
- **Per-Path Rate Limiting:** Refactored rate limiter to apply different limits per endpoint:
  - Login (`/api/auth/login`): 5 requests/minute — prevents brute-force attacks
  - Refresh (`/api/auth/refresh`): 20 requests/minute — allows legitimate token rotation
  
  Previously: single global limit. Now: endpoint-specific limits for better UX/security tradeoff.

### Files Modified
- `backend/src/main/java/com/gatre/security/RateLimitFilter.java` — Per-path limit map
- `backend/src/main/java/com/gatre/security/oauth2/OAuth2SuccessHandler.java` — Secure flag injection
- `backend/src/main/java/com/gatre/controller/AuthController.java` — Secure flag injection
- `backend/src/main/resources/application.yml` — New `app.security.cookie-secure` property

---

## 2. Profile Management (Local Users)

**Commits:** `c92f253`

### Backend Changes
- **New Endpoints:**
  - `PUT /api/user/me` — Update profile (name, avatar URL)
  - `POST /api/user/me/password` — Change password (with current password verification)
  
- **New DTOs:**
  - `UpdateProfileRequest` — name, avatarUrl
  - `ChangePasswordRequest` — currentPassword, newPassword
  - `UserProfileDTO` — Added `provider` field to indicate OAuth2 vs LOCAL
  
- **Validation:**
  - Password minimum 6 characters
  - Current password verification required for password change
  - LOCAL users only (OAuth2 users cannot change password)

### Frontend Changes
- Redesigned `/dashboard/tai-khoan` (Account page) with:
  - Edit profile modal (name, avatar URL)
  - Password change modal (LOCAL users only, hidden for OAuth2)
  - Avatar display and edit capability
  
- Updated `useAuth` hook to clear favorites store on logout

### Files Modified/Created
**Backend:**
- `backend/src/main/java/com/gatre/controller/user/UserAccountController.java` (new)
- `backend/src/main/java/com/gatre/dto/request/UpdateProfileRequest.java` (new)
- `backend/src/main/java/com/gatre/dto/request/ChangePasswordRequest.java` (new)
- `backend/src/main/java/com/gatre/service/impl/UserServiceImpl.java` — Added methods
- `backend/src/main/java/com/gatre/dto/response/UserProfileDTO.java` — Added provider field
- `backend/src/main/java/com/gatre/exception/ErrorCode.java` — New error codes

**Frontend:**
- `frontend/src/app/dashboard/tai-khoan/page.tsx` (redesigned)
- `frontend/src/types/user.ts` — Added AuthProvider type
- `frontend/src/hooks/useAuth.ts` — Updated logout

---

## 3. Admin User Management

**Commits:** `d6e9e7f`

### Backend Changes
- **New Endpoints:**
  - `POST /api/admin/users` — Create new user (email, name, password, role)
  - `PUT /api/admin/users/{id}` — Update user (name, role, active status)
  - `POST /api/admin/users/{id}/reset-password` — Reset password (LOCAL users only)
  
- **New DTOs:**
  - `AdminCreateUserRequest` — email, name, password, role
  - `AdminUpdateUserRequest` — name, role, active
  - `AdminResetPasswordRequest` — newPassword
  
- **Validation:**
  - Email uniqueness check
  - Password minimum 6 characters
  - Cannot reset password for OAuth2 users
  - Admin-only access (ROLE_ADMIN)

### Frontend Changes
- Redesigned `/admin/nguoi-dung` (User Management) with:
  - User table showing name, email, role, active status
  - "Add User" button opens creation modal
  - Edit button per user opens edit modal (name, role, active toggle)
  - Reset password button (LOCAL users only)
  
- Created `useAdminUsers` hook with methods: `createUser`, `updateUser`, `resetPassword`

### Files Modified/Created
**Backend:**
- `backend/src/main/java/com/gatre/controller/admin/AdminUserController.java` (new)
- `backend/src/main/java/com/gatre/dto/request/AdminCreateUserRequest.java` (new)
- `backend/src/main/java/com/gatre/dto/request/AdminUpdateUserRequest.java` (new)
- `backend/src/main/java/com/gatre/dto/request/AdminResetPasswordRequest.java` (new)
- `backend/src/main/java/com/gatre/service/impl/UserServiceImpl.java` — Added methods

**Frontend:**
- `frontend/src/app/admin/nguoi-dung/page.tsx` (redesigned)
- `frontend/src/hooks/useAdminUsers.ts` (new)

---

## 4. Audit Logging

**Commits:** `fbc0866`

### Backend Changes
- **Database Migration** (`V5__audit_logs.sql`):
  - New `audit_logs` table with columns: actor_id, action, entity_type, entity_id, summary, created_at
  - Indexes on entity_type and created_at for quick filtering and sorting
  
- **New Components:**
  - `AuditLog` JPA entity
  - `AuditLogRepository` with custom queries
  - `AuditLogService` (interface + implementation) — Best-effort, never throws (won't break business logic)
  - `AdminAuditLogDTO` — DTO with actor name and audit details
  - `AdminAuditLogController` — GET `/api/admin/audit-logs` with pagination and optional entityType filter
  
- **Integration:** Audit recording wired into:
  - **ProductServiceImpl:** PRODUCT_CREATE, PRODUCT_UPDATE, PRODUCT_DELETE, PRODUCT_STATUS_CHANGE
  - **CategoryServiceImpl:** CATEGORY_CREATE, CATEGORY_UPDATE, CATEGORY_DELETE
  - **UserServiceImpl:** USER_CREATE, USER_UPDATE, USER_TOGGLE_ACTIVE, USER_RESET_PASSWORD

### Frontend Changes
- New admin page `/admin/nhat-ky` (Audit Log) with:
  - EntityType filter dropdown (show all / PRODUCT / CATEGORY / USER)
  - Table showing timestamp, action (color-coded badge), entity type, actor name
  - Action badges: CREATE (blue), UPDATE (amber), DELETE (red), ACTIVATE/TOGGLE_ACTIVE (green)
  - Pagination controls
  
- Updated `AdminSidebar` with link to audit log page

### Files Modified/Created
**Backend:**
- `backend/src/main/resources/db/migration/V5__audit_logs.sql` (new)
- `backend/src/main/java/com/gatre/entity/AuditLog.java` (new)
- `backend/src/main/java/com/gatre/repository/AuditLogRepository.java` (new)
- `backend/src/main/java/com/gatre/service/AuditLogService.java` (new)
- `backend/src/main/java/com/gatre/service/impl/AuditLogServiceImpl.java` (new)
- `backend/src/main/java/com/gatre/controller/admin/AdminAuditLogController.java` (new)
- `backend/src/main/java/com/gatre/dto/admin/AdminAuditLogDTO.java` (new)
- `backend/src/main/java/com/gatre/service/impl/ProductServiceImpl.java` — Audit calls added
- `backend/src/main/java/com/gatre/service/impl/CategoryServiceImpl.java` — Audit calls added
- `backend/src/main/java/com/gatre/service/impl/UserServiceImpl.java` — Audit calls added

**Frontend:**
- `frontend/src/app/admin/nhat-ky/page.tsx` (new)
- `frontend/src/components/layout/AdminSidebar.tsx` — Added audit link

---

## 5. Favorites Feature

**Commits:** `b50cc02`

### Backend Changes
- **Database Migration** (`V6__favorites.sql`):
  - New `favorites` table with columns: id, user_id, product_id, created_at
  - Unique constraint on (user_id, product_id) prevents duplicate saves
  - Foreign key constraints to users and products
  
- **New Components:**
  - `Favorite` JPA entity
  - `FavoriteRepository` with methods for list, existence checks, and ID filtering
  - `FavoriteService` (interface + implementation) — Pagination, batch media fetching
  - `FavoriteController` with endpoints:
    - `GET /api/user/favorites?page=0&size=12` — Paginated list of favorited products
    - `GET /api/user/favorites/ids` — Quick ID check for frontend state hydration
    - `POST /api/user/favorites/{productId}` — Add to favorites
    - `DELETE /api/user/favorites/{productId}` — Remove from favorites

### Frontend Changes
- **State Management:** New `useFavoritesStore` (Zustand) with:
  - `ids: Set<number>` — Stores favorited product IDs
  - Methods: `setIds`, `add`, `remove`, `has`, `clear`
  
- **Components:**
  - New `FavoriteButton` component — Heart icon with optimistic updates and rollback on error
  - Integrated into `ProductCTA` next to contact button
  
- **Pages & Navigation:**
  - New `/dashboard/yeu-thich` page — Shows paginated favorites with ProductGrid, requires authentication
  - Added "Yêu thích" link to Header avatar dropdown menu
  
- **User Experience:**
  - Favorites hydrate per-product on detail page (not global fetch to avoid loading thousands of IDs)
  - Optimistic UI updates with error rollback
  - Clear favorites on logout

### Files Modified/Created
**Backend:**
- `backend/src/main/resources/db/migration/V6__favorites.sql` (new)
- `backend/src/main/java/com/gatre/entity/Favorite.java` (new)
- `backend/src/main/java/com/gatre/repository/FavoriteRepository.java` (new)
- `backend/src/main/java/com/gatre/service/FavoriteService.java` (new)
- `backend/src/main/java/com/gatre/service/impl/FavoriteServiceImpl.java` (new)
- `backend/src/main/java/com/gatre/controller/user/FavoriteController.java` (new)

**Frontend:**
- `frontend/src/store/useFavoritesStore.ts` (new)
- `frontend/src/components/product/FavoriteButton.tsx` (new)
- `frontend/src/app/dashboard/yeu-thich/page.tsx` (new)
- `frontend/src/components/product/ProductCTA.tsx` — Integrated FavoriteButton
- `frontend/src/components/layout/Header.tsx` — Added favorites link
- `frontend/src/app/admin/nguoi-dung/page.tsx` — Integrated FavoriteButton context

---

## Testing Notes

- **Frontend:** All pages tested with `npm run type-check` — no type errors
- **Backend:** Java code reviewed for correctness (Maven not available locally for compilation verification)
- **Database:** Two new Flyway migrations (V5, V6) will auto-run on next Spring Boot startup

## Deployment Checklist

- [ ] Run `./mvnw compile` to verify backend code
- [ ] Set `COOKIE_SECURE=true` in production environment
- [ ] Run database migrations (Flyway handles automatically on startup)
- [ ] Test favorites feature in browser (add, remove, navigate to list)
- [ ] Verify audit log appears on admin page after any product/user actions
- [ ] Test password change for local users only (OAuth2 users should not see button)

---

# Implementation Summary — Phase 6A (2026-04-20)

## 1. Chat Mark-as-Read (User Side)

**Commit:** `2df15ed`

### Problem
The unread badge in the Header (`Nhắn tin`) showed a count from the initial conversation fetch but never cleared — there was no endpoint for users to mark messages as read.

### Changes
- **New endpoint:** `PATCH /api/user/chat/conversation/{id}/read` in `ChatRestController` — reuses existing `chatService.markConversationRead()`
- **`useChatStore`:** Added `clearUnread()` action — sets `conversation.unreadCount = 0` in store without a network round-trip
- **`ChatWindow`:** After loading message history, fires the mark-as-read PATCH then calls `clearUnread()` so the Header badge disappears immediately

### Files Modified
- `backend/src/main/java/com/gatre/controller/user/ChatRestController.java` — new PATCH endpoint
- `frontend/src/store/useChatStore.ts` — added `clearUnread` action
- `frontend/src/components/chat/ChatWindow.tsx` — calls mark-as-read on mount

---

## 2. Product View Count

**Commit:** `2df15ed`

### Changes
- **Database Migration** (`V7__view_count.sql`): `ALTER TABLE products ADD COLUMN view_count BIGINT NOT NULL DEFAULT 0`
- **`Product` entity:** Added `private long viewCount` field
- **`ProductRepository`:** Added `@Modifying incrementViewCount(@Param("id") Long id)` JPQL query
- **`ProductServiceImpl.findBySlugPublic()`:** Changed from `readOnly = true` to `@Transactional`, calls `incrementViewCount` on every detail page load
- **`PublicProductDTO` / `AdminProductDTO`:** Added `long viewCount` field (MapStruct auto-maps from entity)
- **Frontend `types/product.ts`:** Added `viewCount: number` to `PublicProduct` and `AdminProduct`
- **Product detail page:** Displays view count next to product name (`X lượt xem`)
- **`AdminProductTable`:** Added "Lượt xem" column

### Files Modified/Created
- `backend/src/main/resources/db/migration/V7__view_count.sql` (new)
- `backend/src/main/java/com/gatre/entity/Product.java`
- `backend/src/main/java/com/gatre/repository/ProductRepository.java`
- `backend/src/main/java/com/gatre/service/impl/ProductServiceImpl.java`
- `backend/src/main/java/com/gatre/dto/response/PublicProductDTO.java`
- `backend/src/main/java/com/gatre/dto/admin/AdminProductDTO.java`
- `frontend/src/types/product.ts`
- `frontend/src/app/(public)/san-pham/[slug]/page.tsx`
- `frontend/src/components/product/AdminProductTable.tsx`

---

## 3. Mandatory Change Log Rule

**Commit:** `(this commit)`

Added rule 5 to `CLAUDE.md` and rule 5.4 to `project-rules.md`: every feature, fix, or non-trivial refactor must be documented in `IMPLEMENTATION.md` before committing.

### Files Modified
- `CLAUDE.md` — Critical Rules #5
- `project-rules.md` — Section 5.4
