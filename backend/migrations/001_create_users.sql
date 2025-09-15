-- migrations/001_create_users.sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,          -- login/display name
  email TEXT UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT false,
  first_name TEXT NOT NULL,               -- store separately
  last_name TEXT NOT NULL,                -- store separately
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);


CREATE TABLE IF NOT EXISTS auth_credentials (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  password_hash TEXT NOT NULL,            -- argon2 hash
  reset_password_token TEXT,
  reset_password_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT uq_auth_credentials_user UNIQUE(user_id)
);

-- CREATE TABLE IF NOT EXISTS social_accounts (
--   id BIGSERIAL PRIMARY KEY,
--   user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   provider TEXT NOT NULL,                 -- 'google'
--   provider_user_id TEXT NOT NULL,         -- provider id
--   provider_data JSONB,
--   UNIQUE(provider, provider_user_id)
-- );

CREATE TABLE IF NOT EXISTS user_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  device_info TEXT,
  ip INET,
  is_remember boolean NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  last_used_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  expires_at TIMESTAMPTZ,
  revoked BOOLEAN DEFAULT false
);

-- 10) trigger: update updated_at on users
CREATE OR REPLACE FUNCTION update_user_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_user_timestamp ON users;
CREATE TRIGGER trg_update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_timestamp();

-- helpful indexes (create while tables exist)
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_revoked_expires ON user_sessions(revoked, expires_at);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);

