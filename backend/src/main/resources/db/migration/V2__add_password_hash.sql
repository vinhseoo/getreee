-- =============================================================================
-- V2__add_password_hash.sql
-- Add password_hash column to support LOCAL provider authentication.
-- NULL for GOOGLE-only accounts.
-- =============================================================================

ALTER TABLE users
    ADD COLUMN password_hash VARCHAR(255);

COMMENT ON COLUMN users.password_hash
    IS 'BCrypt-hashed password. NULL for accounts authenticated via GOOGLE OAuth2.';
