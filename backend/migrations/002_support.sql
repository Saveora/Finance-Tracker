-- ============================================
-- EXTENSIONS (only run once per DB)
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   -- generates UUIDs
CREATE EXTENSION IF NOT EXISTS pg_trgm;       -- enables fuzzy search for FAQ/articles

-- ============================================
-- ENUMS (categorical values)
-- ============================================
CREATE TYPE callback_status AS ENUM ('pending','scheduled','completed','failed','cancelled');
CREATE TYPE ticket_status AS ENUM ('open','pending','in_progress','resolved','closed','spam');
CREATE TYPE ticket_priority AS ENUM ('low','medium','high','urgent');
CREATE TYPE channel_type_enum AS ENUM ('email','phone','whatsapp','in_app');
CREATE TYPE sender_role AS ENUM ('user','agent','system');

-- ============================================
-- 1) FAQs (for "Frequently Asked Questions")
-- ============================================
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),   -- unique FAQ id
  question TEXT NOT NULL,                           -- shown in frontend (e.g. "How do I reset my password?")
  answer TEXT NOT NULL,                             -- expanded content
  is_published BOOLEAN DEFAULT TRUE,                -- whether to show or hide FAQ
  created_at TIMESTAMPTZ DEFAULT now(),             -- when FAQ was added
  updated_at TIMESTAMPTZ DEFAULT now(),             -- when FAQ was last updated
  views BIGINT DEFAULT 0                            -- track how many times it was opened
);

-- ============================================
-- 2) Suggested Articles (like "How Saveora keeps your data secure")
-- ============================================
-- CREATE TABLE kb_articles (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   title TEXT NOT NULL,                              -- article title
--   summary TEXT,                                     -- short description (optional)
--   body TEXT NOT NULL,                               -- full text/markdown
--   slug TEXT UNIQUE,                                 -- SEO-friendly identifier
--   is_published BOOLEAN DEFAULT TRUE,
--   category TEXT,                                    -- optional (e.g., "Security")
--   tags TEXT[] DEFAULT '{}',                         -- e.g., ['banking','password']
--   created_at TIMESTAMPTZ DEFAULT now(),
--   updated_at TIMESTAMPTZ DEFAULT now(),
--   views BIGINT DEFAULT 0
-- );

-- -- Attachments for articles (if guide PDFs/screenshots are uploaded)
-- CREATE TABLE kb_attachments (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   article_id UUID NOT NULL REFERENCES kb_articles(id) ON DELETE CASCADE,
--   filename TEXT NOT NULL,                           -- stored file name
--   content_type TEXT,                                -- MIME type
--   size_bytes BIGINT,
--   storage_key TEXT NOT NULL,                        -- S3 path or local path
--   uploaded_at TIMESTAMPTZ DEFAULT now()
-- );

-- ============================================
-- 3) Contact Info (for "Contact Us" section)
-- ============================================
CREATE TABLE support_contacts (
  id BIGSERIAL PRIMARY KEY,
  contact_type TEXT NOT NULL,                       -- e.g., 'email','phone','twitter','whatsapp'
  value TEXT NOT NULL,                              -- actual info (support@saveora.com, phone number)
  display_label TEXT,                               -- optional label shown in UI
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- 4) Callback Requests (matches "Request a callback" form)
-- ============================================
-- CREATE TABLE callback_requests (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   user_id UUID NULL,                                -- if linked to registered user
--   country_code TEXT DEFAULT '+91',
--   phone_number TEXT NOT NULL,                       -- phone number entered
--   preferred_time TIMESTAMPTZ NULL,                  -- optional requested callback time
--   timezone TEXT NULL,                               -- optional timezone
--   brief_query TEXT NULL,                            -- short description ("Need help linking bank")
--   source channel_type_enum DEFAULT 'web',           -- where it came from
--   status callback_status DEFAULT 'pending',         -- default status
--   requested_at TIMESTAMPTZ DEFAULT now(),
--   scheduled_at TIMESTAMPTZ NULL,
--   assigned_agent UUID NULL,                         -- support agent assigned
--   notes TEXT NULL,
--   metadata JSONB DEFAULT '{}'::jsonb
-- );

-- ============================================
-- 5) Support Tickets (matches "Raise a support ticket")
-- ============================================
-- 1) support_tickets: make user_id nullable and reference users(id)
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  public_id TEXT UNIQUE,
  user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,  -- made NULLABLE to allow SET NULL on delete
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status ticket_status DEFAULT 'open',
  channel channel_type_enum DEFAULT 'in_app',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  assigned_agent UUID NULL,
  last_message_at TIMESTAMPTZ NULL,
  attachments_count INT DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 2) ticket_messages: make sender_id BIGINT NULL to match users.id type
CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_role sender_role NOT NULL,
  sender_id BIGINT NULL,                       -- nullable, references users.id (BIGINT)
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 3) ticket_attachments: allow message_id to be NULL so ON DELETE SET NULL works
CREATE TABLE ticket_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  message_id UUID NULL REFERENCES ticket_messages(id) ON DELETE SET NULL, -- nullable to allow SET NULL
  filename TEXT NOT NULL,
  content_type TEXT,
  size_bytes BIGINT,
  storage_key TEXT NOT NULL,
  uploaded_by BIGINT NULL,       -- made BIGINT to match users.id
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Ticket rating (matches "Was this page helpful?" star rating)
CREATE TABLE ticket_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  rating SMALLINT CHECK (rating >= 1 AND rating <= 5),
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,                    -- nullable if anonymous ratings allowed
  created_at TIMESTAMPTZ DEFAULT now()
);
-- ============================================
-- 6) Live Chat (matches chat widget "Welcome to Saveora support")
-- ============================================
CREATE TABLE support_agents (
  id BIGSERIAL PRIMARY KEY,
  display_name TEXT,                                -- agent name
  is_online BOOLEAN DEFAULT FALSE,
  last_seen_at TIMESTAMPTZ NULL,
  skills TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 5) live_chat_sessions: correct REFERENCES and user_id type
CREATE TABLE live_chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id BIGINT NULL REFERENCES users(id) ON DELETE CASCADE,  -- fixed reference; made NULLABLE
  session_token TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ NULL,
  assigned_agent BIGINT NULL REFERENCES support_agents(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  estimated_wait_seconds INT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- 6) live_chat_messages: make sender_id BIGINT NULL
CREATE TABLE live_chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES live_chat_sessions(id) ON DELETE CASCADE,
  sender_role sender_role NOT NULL,
  sender_id BIGINT NULL,           -- nullable to match users.id
  text TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);



-- ============================================
-- 8) Activity Log (internal tracking)
-- ============================================
-- CREATE TABLE support_activity_log (
--   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--   actor_id UUID NULL,
--   actor_type TEXT NULL,                             -- 'user','agent'
--   action TEXT NOT NULL,                             -- e.g., "ticket_created"
--   resource_type TEXT NULL,                          -- "ticket","faq","chat"
--   resource_id UUID NULL,
--   metadata JSONB DEFAULT '{}'::jsonb,
--   created_at TIMESTAMPTZ DEFAULT now()
-- );
