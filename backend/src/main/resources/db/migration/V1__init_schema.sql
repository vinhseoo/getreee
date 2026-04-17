-- =============================================================================
-- V1__init_schema.sql
-- Gà Tre Catalog & Negotiation System — Initial Schema
-- =============================================================================

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------

CREATE TYPE user_role AS ENUM (
    'USER',
    'ADMIN'
);

CREATE TYPE auth_provider AS ENUM (
    'LOCAL',
    'GOOGLE'
);

CREATE TYPE product_status AS ENUM (
    'AVAILABLE',
    'SOLD',
    'HIDDEN'
);

CREATE TYPE media_type AS ENUM (
    'IMAGE',
    'VIDEO'
);

-- -----------------------------------------------------------------------------
-- TABLE: users
-- -----------------------------------------------------------------------------

CREATE TABLE users (
    id              BIGSERIAL       PRIMARY KEY,
    email           VARCHAR(255)    NOT NULL,
    name            VARCHAR(255)    NOT NULL,
    avatar_url      VARCHAR(500),
    role            user_role       NOT NULL DEFAULT 'USER',
    provider        auth_provider   NOT NULL DEFAULT 'LOCAL',
    provider_id     VARCHAR(255),                           -- Google subject ID; NULL for LOCAL
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_users_email         ON users (email);
CREATE        INDEX idx_users_role          ON users (role);

-- -----------------------------------------------------------------------------
-- TABLE: categories
-- -----------------------------------------------------------------------------

CREATE TABLE categories (
    id          BIGSERIAL       PRIMARY KEY,
    name        VARCHAR(255)    NOT NULL,
    slug        VARCHAR(255)    NOT NULL,               -- URL-safe, e.g. "ga-tre-long-do"
    description TEXT,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_categories_slug ON categories (slug);

-- -----------------------------------------------------------------------------
-- TABLE: products
-- CRITICAL: price_from / price_to are ADMIN-ONLY fields.
--           They must NEVER appear in any public-facing DTO or API response.
--           The mapper layer (AdminProductMapper vs PublicProductMapper) is the
--           enforcement point.
-- -----------------------------------------------------------------------------

CREATE TABLE products (
    id              BIGSERIAL       PRIMARY KEY,
    category_id     BIGINT          NOT NULL,
    created_by      BIGINT          NOT NULL,           -- FK → users (must be ADMIN)
    name            VARCHAR(255)    NOT NULL,
    slug            VARCHAR(255)    NOT NULL,           -- URL-safe, unique, used in SEO routes
    description     TEXT,

    -- Pricing — ADMIN ONLY. Prices are in Vietnamese Đồng (no decimals needed).
    price_from      NUMERIC(15, 0),
    price_to        NUMERIC(15, 0),

    -- Miniature chicken attributes (for future filtering)
    feather_color   VARCHAR(100),
    weight_grams    INTEGER,
    age_months      INTEGER,

    status          product_status  NOT NULL DEFAULT 'AVAILABLE',
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id) REFERENCES categories (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_products_created_by
        FOREIGN KEY (created_by) REFERENCES users (id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_products_price_range
        CHECK (price_to IS NULL OR price_from IS NULL OR price_to >= price_from)
);

CREATE UNIQUE INDEX idx_products_slug           ON products (slug);
CREATE        INDEX idx_products_category_id    ON products (category_id);
CREATE        INDEX idx_products_status         ON products (status);
CREATE        INDEX idx_products_feather_color  ON products (feather_color);

-- -----------------------------------------------------------------------------
-- TABLE: product_media
-- -----------------------------------------------------------------------------

CREATE TABLE product_media (
    id                      BIGSERIAL       PRIMARY KEY,
    product_id              BIGINT          NOT NULL,
    media_url               VARCHAR(500)    NOT NULL,
    media_type              media_type      NOT NULL,
    is_primary              BOOLEAN         NOT NULL DEFAULT FALSE,
    cloudinary_public_id    VARCHAR(255),               -- Required to call Cloudinary Delete API
    display_order           INTEGER         NOT NULL DEFAULT 0,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_product_media_product
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE                               -- Media deleted when product is deleted
);

CREATE        INDEX idx_product_media_product_id ON product_media (product_id);

-- Guarantees exactly one primary media entry per product.
CREATE UNIQUE INDEX idx_product_media_one_primary
    ON product_media (product_id)
    WHERE is_primary = TRUE;

-- -----------------------------------------------------------------------------
-- TABLE: conversations
-- One conversation per user (unique constraint on user_id).
-- The admin is the implicit other party — no admin FK needed.
-- last_message_at is denormalized to avoid expensive subqueries in the admin inbox.
-- -----------------------------------------------------------------------------

CREATE TABLE conversations (
    id                  BIGSERIAL   PRIMARY KEY,
    user_id             BIGINT      NOT NULL,
    last_message_at     TIMESTAMPTZ,                    -- Updated on every new message
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_conversations_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE RESTRICT
);

-- One conversation per user; enforced at DB level.
CREATE UNIQUE INDEX idx_conversations_user_id       ON conversations (user_id);
CREATE        INDEX idx_conversations_last_message  ON conversations (last_message_at DESC NULLS LAST);

-- -----------------------------------------------------------------------------
-- TABLE: chat_messages
-- sender_id can be either the customer (USER) or the admin (ADMIN).
-- product_id is nullable — when set, the backend hydrates a ProductSnapshotDTO
-- (price-stripped) into the WebSocket message payload for the "product card in bubble" feature.
-- -----------------------------------------------------------------------------

CREATE TABLE chat_messages (
    id                  BIGSERIAL   PRIMARY KEY,
    conversation_id     BIGINT      NOT NULL,
    sender_id           BIGINT      NOT NULL,
    product_id          BIGINT,                         -- NULLABLE — Shopee-style attachment
    content             TEXT        NOT NULL,
    is_read             BOOLEAN     NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_chat_messages_conversation
        FOREIGN KEY (conversation_id) REFERENCES conversations (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_chat_messages_sender
        FOREIGN KEY (sender_id) REFERENCES users (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_chat_messages_product
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE SET NULL                              -- Keep message history if product is deleted
);

CREATE INDEX idx_chat_messages_conversation_id  ON chat_messages (conversation_id);
CREATE INDEX idx_chat_messages_sender_id        ON chat_messages (sender_id);
CREATE INDEX idx_chat_messages_unread
    ON chat_messages (conversation_id)
    WHERE is_read = FALSE;
-- Sparse index — only rows with a product attachment are indexed
CREATE INDEX idx_chat_messages_product_id
    ON chat_messages (product_id)
    WHERE product_id IS NOT NULL;
