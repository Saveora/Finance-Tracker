-- 008_setu.sql
CREATE TABLE IF NOT EXISTS consents (
  id BIGSERIAL PRIMARY KEY,
  consent_id TEXT UNIQUE,
  user_id BIGINT NOT NULL REFERENCES users(id),
  status TEXT,
  vua TEXT,
  purpose TEXT,
  consent_duration JSONB,
  consent_date_range JSONB,
  auto_fetch BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  raw_response JSONB
);

CREATE TABLE IF NOT EXISTS data_sessions (
  id BIGSERIAL PRIMARY KEY,
  data_session_id TEXT UNIQUE,
  consent_id TEXT,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  ready_at TIMESTAMPTZ,
  fetched_at TIMESTAMPTZ,
  raw_response JSONB
);

CREATE TABLE IF NOT EXISTS accounts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  consent_id TEXT,
  fip_account_id TEXT,
  bank_name TEXT,
  account_masked TEXT,
  account_type TEXT,
  currency TEXT,
  raw_meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  account_id BIGINT REFERENCES accounts(id),
  consent_id TEXT,
  txn_ref TEXT,
  amount NUMERIC,
  currency TEXT,
  txn_date DATE,
  narration TEXT,
  category TEXT,
  raw_meta JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS webhook_events (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT UNIQUE,
  event_type TEXT,
  payload JSONB,
  received_at TIMESTAMPTZ DEFAULT now()
);
