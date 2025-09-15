-- Recommended Postgres schema for "Support" features (FAQs, Contacts, Callbacks, Tickets, Chat, Tips)
-- Assumes Postgres 12+; run as a DB superuser (extensions)

-- Enable extensions (run once per DB)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pg_trgm;    -- optional but helpful for fuzzy search

-- -------------------------
-- ENUMS
-- -------------------------
CREATE TYPE callback_status AS ENUM ('pending','scheduled','completed','failed','cancelled');
CREATE TYPE ticket_status AS ENUM ('open','pending','in_progress','resolved','closed','spam');
CREATE TYPE ticket_priority AS ENUM ('low','medium','high','urgent');
CREATE TYPE channel_type_enum AS ENUM ('web','email','phone','whatsapp','twitter','in_app');
CREATE TYPE sender_role AS ENUM ('user','agent','system');

-- =========================
-- 1) FAQs (searchable)
-- =========================
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  views BIGINT DEFAULT 0
);

-- CREATE INDEX faqs_search_idx ON faqs USING GIN (search_vector);
-- CREATE INDEX faqs_question_trgm_idx ON faqs USING GIN ((question) gin_trgm_ops);

-- =========================
-- 2) Knowledge Base / Suggested Articles
-- =========================
CREATE TABLE kb_articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  summary TEXT,
  body TEXT NOT NULL,             -- markdown / html
  slug TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  category TEXT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  views BIGINT DEFAULT 0
);

-- CREATE INDEX kb_articles_search_idx ON kb_articles USING GIN (search_vector);
-- CREATE INDEX kb_articles_title_trgm_idx ON kb_articles USING GIN ((title) gin_trgm_ops);

-- Optional attachments for KB
CREATE TABLE kb_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  storage_key TEXT NOT NULL,     -- e.g. s3 key
  uploaded_at TIMESTAMPTZ DEFAULT now()
);


-- =========================
-- 4) Callback Requests
-- =========================
CREATE TABLE callback_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NULL,                -- if you have users table
  country_code TEXT DEFAULT '+91',
  phone_number TEXT NOT NULL,
  preferred_time TIMESTAMPTZ NULL,  -- user's preferred callback time (with TZ)
  timezone TEXT NULL,               -- optional timezone string supplied by user
  brief_query TEXT NULL,            -- short description provided by user
  source channel_type_enum DEFAULT 'web',
  status callback_status DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT now(),
  scheduled_at TIMESTAMPTZ NULL,
  assigned_agent UUID NULL,         -- FK to support_agents (created below)
  notes TEXT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_callback_status ON callback_requests (status);
CREATE INDEX idx_callback_scheduled_at ON callback_requests (scheduled_at);

-- =========================
-- 5) Support Tickets & Messages
-- =========================
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_id TEXT UNIQUE,            -- optional friendly ID like TCK-000123 (generate in app or via trigger)
  user_id UUID NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  priority ticket_priority DEFAULT 'medium',
  status ticket_status DEFAULT 'open',
  channel channel_type_enum DEFAULT 'web',
  source TEXT NULL,                 -- e.g., 'support page'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  assigned_agent UUID NULL,         -- FK to support_agents.id
  last_message_at TIMESTAMPTZ NULL,
  attachments_count INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_tickets_status ON support_tickets (status);
CREATE INDEX idx_tickets_user ON support_tickets (user_id);

-- Messages within a ticket (conversation)
CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_role sender_role NOT NULL,
  sender_id UUID NULL,              -- optional FK to user/agent
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Attachments for tickets (store files in S3 and record keys here)
CREATE TABLE ticket_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  message_id UUID NULL REFERENCES ticket_messages(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  storage_key TEXT NOT NULL,
  uploaded_by UUID NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Feedback / rating on tickets
CREATE TABLE ticket_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NULL,
  created_by UUID NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================
-- 6) Live Chat (sessions & messages) + Agents
-- =========================
CREATE TABLE support_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NULL,                -- optional mapping to user table
  display_name TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMPTZ NULL,
  skills TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE live_chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NULL,
  session_token TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ NULL,
  assigned_agent UUID NULL REFERENCES support_agents(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  estimated_wait_seconds INT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE live_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES live_chat_sessions(id) ON DELETE CASCADE,
  sender_role sender_role NOT NULL,
  sender_id UUID NULL,
  text TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_live_chat_session ON live_chat_messages (session_id);

-- =========================
-- 7) Support Tips & UI Settings
-- =========================
CREATE TABLE support_tips (
  id BIGSERIAL PRIMARY KEY,
  tip_text TEXT NOT NULL,
  priority SMALLINT DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE support_settings (
  key_text TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =========================
-- 8) Activity / Audit Log (simple)
-- =========================
CREATE TABLE support_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NULL,
  actor_type TEXT NULL,
  action TEXT NOT NULL,
  resource_type TEXT NULL,
  resource_id UUID NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =========================
-- Helpful indexes & notes
-- =========================
-- You will likely want indexes on fields you query frequently:
CREATE INDEX idx_tickets_assigned_agent ON support_tickets (assigned_agent);
CREATE INDEX idx_sessions_assigned_agent ON live_chat_sessions (assigned_agent);
CREATE INDEX idx_ticket_messages_ticket ON ticket_messages (ticket_id);

-- NOTES:
-- 1) Files: store binary files in S3 (or other object store) and reference them with storage_key.
-- 2) Search: use the tsvector + GIN index for fast FAQ/Kb article search.
-- 3) Public ticket id: generate user-friendly public_id in application code or add a DB trigger if you want automatic generation.
-- 4) Use application-level code to increment attachments_count and update last_message_at when messages/attachments are created.
-- 5) If you have a users table, convert user_id columns to actual FK constraints referencing it.
