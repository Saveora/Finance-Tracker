
-- 5) user profile (one row per user)
CREATE TABLE IF NOT EXISTS user_profiles (
profile_id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
currency VARCHAR(10) DEFAULT 'INR',
language VARCHAR(50) DEFAULT 'English',
timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
theme VARCHAR(20) DEFAULT 'light',
profile_picture TEXT,
created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
CONSTRAINT uq_user_profiles_user UNIQUE(user_id)
);
-- 6) connected accounts (banks, cards, providers)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_type_enum') THEN
    CREATE TYPE account_type_enum AS ENUM ('savings','current','credit','other');
  END IF;
END;
$$ LANGUAGE plpgsql;


CREATE TABLE IF NOT EXISTS connected_accounts (
account_id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
bank_name VARCHAR(100) NOT NULL,
account_type account_type_enum,
masked_account_no VARCHAR(40), -- expected masked format like ****5678
provider TEXT, -- optional external provider/aggregator
provider_data JSONB,
created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
CONSTRAINT uq_connected_user_masked UNIQUE(user_id, masked_account_no)
);

-- 7) notification settings (one row per user)
CREATE TABLE IF NOT EXISTS notification_settings (
notification_id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
transaction_alerts BOOLEAN DEFAULT TRUE,
promotions BOOLEAN DEFAULT FALSE,
payment_reminders BOOLEAN DEFAULT TRUE,
created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
CONSTRAINT uq_notification_settings_user UNIQUE(user_id)
);

-- 8) security settings (one row per user)
CREATE TABLE IF NOT EXISTS security_settings (
security_id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
two_factor_enabled BOOLEAN DEFAULT FALSE,
two_factor_method VARCHAR(50), -- e.g. 'totp','sms','webauthn'
two_factor_secret_encrypted TEXT, -- store encrypted or NULL for non-TOTP
biometric_unlock BOOLEAN DEFAULT FALSE,
monitor_payments BOOLEAN DEFAULT TRUE,
created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
CONSTRAINT uq_security_settings_user UNIQUE(user_id)
);
-- 9) danger zone logs (auditing of delete/export actions)

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'danger_action_enum') THEN
    CREATE TYPE danger_action_enum AS ENUM ('delete_account', 'export_data');
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS danger_zone_logs (
log_id BIGSERIAL PRIMARY KEY,
user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
action danger_action_enum NOT NULL,
metadata JSONB, -- details like filename, ip, user_agent etc.
performed_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_danger_logs_user_time ON danger_zone_logs(user_id, performed_at DESC);

-- 11) trigger: log hard deletes
CREATE OR REPLACE FUNCTION log_account_deletion()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO danger_zone_logs (user_id, action, metadata, performed_at)
VALUES (OLD.id, 'delete_account', jsonb_build_object('deleted_user_email', OLD.email), NOW());
RETURN OLD;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trg_log_account_deletion ON users;
CREATE TRIGGER trg_log_account_deletion
BEFORE DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION log_account_deletion();


-- 12) trigger: log soft-delete (when deleted_at becomes non-null)
CREATE OR REPLACE FUNCTION log_soft_delete_on_deleted_at()
RETURNS TRIGGER AS $$
BEGIN
IF (OLD.deleted_at IS NULL) AND (NEW.deleted_at IS NOT NULL) THEN
INSERT INTO danger_zone_logs (user_id, action, metadata, performed_at)
VALUES (OLD.id, 'delete_account', jsonb_build_object('soft_delete', true, 'deleted_by', current_user), NOW());
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS trg_log_soft_delete ON users;
CREATE TRIGGER trg_log_soft_delete
AFTER UPDATE ON users
FOR EACH ROW
WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
EXECUTE FUNCTION log_soft_delete_on_deleted_at();

-- 13) utility: generic update timestamp for other tables
CREATE OR REPLACE FUNCTION update_row_timestamp()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at := NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- attach to tables that have updated_at
DO $$
BEGIN
IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='updated_at') THEN
DROP TRIGGER IF EXISTS trg_update_user_profiles_ts ON user_profiles;
CREATE TRIGGER trg_update_user_profiles_ts BEFORE UPDATE ON user_profiles
FOR EACH ROW EXECUTE FUNCTION update_row_timestamp();
END IF;


IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='notification_settings' AND column_name='updated_at') THEN
DROP TRIGGER IF EXISTS trg_update_notification_settings_ts ON notification_settings;
CREATE TRIGGER trg_update_notification_settings_ts BEFORE UPDATE ON notification_settings
FOR EACH ROW EXECUTE FUNCTION update_row_timestamp();
END IF;


IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='security_settings' AND column_name='updated_at') THEN
DROP TRIGGER IF EXISTS trg_update_security_settings_ts ON security_settings;
CREATE TRIGGER trg_update_security_settings_ts BEFORE UPDATE ON security_settings
FOR EACH ROW EXECUTE FUNCTION update_row_timestamp();
END IF;
END;
$$ LANGUAGE plpgsql;

CREATE INDEX IF NOT EXISTS idx_connected_accounts_user ON connected_accounts(user_id);
