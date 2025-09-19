-- Table for user financial goals
CREATE TABLE saving_goals (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,              -- Goal name (e.g., Vacation 2026)
    target_amount NUMERIC(12,2) NOT NULL CHECK (target_amount >= 0),     -- Goal target (e.g., 150000)
    saved_amount NUMERIC(12,2) DEFAULT 0,     -- Amount saved so far (e.g., 30000)
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    deadline DATE NOT NULL,                   -- Goal deadline (e.g., 2026-06-01)
    is_recurring BOOLEAN DEFAULT FALSE,       -- Whether recurring or not
    color_accent VARCHAR(20),                 -- e.g., 'yellow', 'green', 'blue', 'pink'          
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for goal transactions (top-ups / adds)
CREATE TABLE goal_transactions (
    id SERIAL PRIMARY KEY,
    goal_id INT NOT NULL REFERENCES saving_goals(id) ON DELETE CASCADE,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0), -- Top-up/add amount
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
