-- =============================================================================
-- V4__add_product_trust_fields.sql
-- Adds product_code (unique reference ID) and health/trust signal columns.
-- Chat auto-fill template: "Tôi quan tâm đến [product_code] - [name]. Vui lòng tư vấn thêm."
-- =============================================================================

ALTER TABLE products
    ADD COLUMN product_code       VARCHAR(50),
    ADD COLUMN vaccination_status VARCHAR(255),
    ADD COLUMN character_traits   TEXT;

-- Unique index: users reference products by code in chat (e.g. "TC-012")
CREATE UNIQUE INDEX idx_products_product_code ON products (product_code)
    WHERE product_code IS NOT NULL;
