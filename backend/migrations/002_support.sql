-- Table to store FAQ questions and answers
CREATE TABLE faqs (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to store different support contact methods
CREATE TABLE support_contacts (
    id SERIAL PRIMARY KEY,
    contact_type VARCHAR(50) NOT NULL,  -- e.g., 'email', 'phone', 'twitter'
    value TEXT NOT NULL,                -- actual contact (e.g., support@saveora.com, +91...)
    availability VARCHAR(100),          -- e.g., '9am–9pm IST'
    response_time VARCHAR(100),         -- e.g., 'within 24 hours'
    is_secure BOOLEAN DEFAULT FALSE
);

-- Table to log callback requests from users
CREATE TABLE callback_requests (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(20) NOT NULL,
    request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'  -- pending, completed, failed
);

-- Table for support tips/messages
CREATE TABLE support_tips (
    id SERIAL PRIMARY KEY,
    tip_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table to track live chat/email/call options
CREATE TABLE support_channels (
    id SERIAL PRIMARY KEY,
    channel_type VARCHAR(50) NOT NULL,   -- e.g., 'live_chat', 'email_support', 'call_us'
    description TEXT,
    link TEXT                            -- e.g., chat link, mailto link, tel link
);
