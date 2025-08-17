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
  created_at TIMESTAMPTZ DEFAULT now()
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
  created_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  revoked BOOLEAN DEFAULT false
);


CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
