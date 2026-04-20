-- =============================================================================
-- V6__favorites.sql
-- User "yêu thích" for products.
-- =============================================================================

CREATE TABLE favorites (
    id          BIGSERIAL    PRIMARY KEY,
    user_id     BIGINT       NOT NULL,
    product_id  BIGINT       NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_favorites_user
        FOREIGN KEY (user_id) REFERENCES users (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_favorites_product
        FOREIGN KEY (product_id) REFERENCES products (id)
        ON DELETE CASCADE,

    CONSTRAINT uq_favorites_user_product UNIQUE (user_id, product_id)
);

CREATE INDEX idx_favorites_user ON favorites (user_id, created_at DESC);
