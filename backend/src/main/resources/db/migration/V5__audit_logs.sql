-- =============================================================================
-- V5__audit_logs.sql
-- Admin audit trail for product/category/user mutations.
-- =============================================================================

CREATE TABLE audit_logs (
    id           BIGSERIAL    PRIMARY KEY,
    actor_id     BIGINT,                          -- NULL if system-originated
    action       VARCHAR(64)  NOT NULL,
    entity_type  VARCHAR(32)  NOT NULL,           -- e.g. 'PRODUCT', 'USER', 'CATEGORY'
    entity_id    BIGINT,
    summary      TEXT,                            -- Human-readable Vietnamese summary
    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_audit_logs_actor
        FOREIGN KEY (actor_id) REFERENCES users (id)
        ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_created_at  ON audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_actor       ON audit_logs (actor_id);
CREATE INDEX idx_audit_logs_entity      ON audit_logs (entity_type, entity_id);
