-- Table to store scheduled payments
CREATE TABLE payment_schedules (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,           -- Title of the schedule
    amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    method VARCHAR(50) NOT NULL,           -- e.g., UPI, Card, Bank Transfer
    payee_name VARCHAR(100),               -- Name of recipient
    payee_identifier VARCHAR(150),         -- UPI ID / Bank Account
    start_date DATE NOT NULL,
    recurrence VARCHAR(50) NOT NULL,       -- e.g., One-time, Weekly, Monthly, Yearly
    note TEXT,                             -- Optional note
    is_active BOOLEAN DEFAULT TRUE,        -- Active flag
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Enum for recurrence if you want strict control
CREATE TYPE recurrence_type AS ENUM ('One-time', 'Weekly', 'Monthly', 'Yearly');

-- Example update if you prefer enum instead of free text
ALTER TABLE payment_schedules
    ALTER COLUMN recurrence TYPE recurrence_type USING recurrence::recurrence_type;
