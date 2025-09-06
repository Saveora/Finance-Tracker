-- =============================
-- USERS (main table)
-- =============================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================
-- USER PROFILE
-- =============================
CREATE TABLE user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    currency VARCHAR(10) DEFAULT 'INR',
    language VARCHAR(50) DEFAULT 'English',
    timezone VARCHAR(100) DEFAULT 'Asia/Kolkata',
    theme VARCHAR(10) DEFAULT 'light',
    profile_picture TEXT
);

-- =============================
-- CONNECTED ACCOUNTS (Banks etc.)
-- =============================
CREATE TABLE connected_accounts (
    account_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    bank_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(50), -- savings/current
    masked_account_no VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================
-- NOTIFICATION SETTINGS
-- =============================
CREATE TABLE notification_settings (
    notification_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    transaction_alerts BOOLEAN DEFAULT TRUE,
    promotions BOOLEAN DEFAULT FALSE,
    payment_reminders BOOLEAN DEFAULT TRUE
);

-- =============================
-- SECURITY SETTINGS
-- =============================
CREATE TABLE security_settings (
    security_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    biometric_unlock BOOLEAN DEFAULT FALSE,
    monitor_payments BOOLEAN DEFAULT TRUE
);

-- =============================
-- DANGER ZONE LOGS (Delete/Export actions)
-- =============================
CREATE TABLE danger_zone_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL CHECK (action IN ('delete_account', 'export_data')),
    performed_at TIMESTAMP DEFAULT NOW()
);

-- =============================
-- TRIGGER FUNCTION: Log account deletion
-- =============================
CREATE OR REPLACE FUNCTION log_account_deletion()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO danger_zone_logs (user_id, action, performed_at)
    VALUES (OLD.user_id, 'delete_account', NOW());
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: Fires before user is deleted
CREATE TRIGGER trg_log_account_deletion
BEFORE DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION log_account_deletion();

-- =============================
-- TRIGGER FUNCTION: Update timestamp on user update
-- =============================
CREATE OR REPLACE FUNCTION update_user_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- TRIGGER: Auto-update timestamp on user update
CREATE TRIGGER trg_update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_user_timestamp();
