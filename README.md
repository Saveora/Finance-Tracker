
---

````md
# Finance-Tracker

> **Work in progress — all active development is on the `dev` branch.**  
> This repository contains the source for the Finance-Tracker web app (React / Next.js frontend + Node/Express backend + PostgreSQL). The app provides a dashboard to view deposits, spends and transactions across connected bank accounts (via Setu / Open Banking). **Project is ongoing** — see Roadmap below for planned features.

![Dashboard screenshot](/mnt/data/56575a3d-737e-4e2f-b68a-b1593fd04245.png)

---

## Table of contents

- [Overview](#overview)  
- [Current features](#current-features)  
- [Architecture & Tech stack](#architecture--tech-stack)  
- [Quick start (local development)](#quick-start-local-development)  
- [Important environment variables](#important-environment-variables)  
- [API overview (existing endpoints)](#api-overview-existing-endpoints)  
- [Database schema & migrations (notes)](#database-schema--migrations-notes)  
- [Roadmap (planned / ongoing work)](#roadmap-planned--ongoing-work)  
  - Budget Goals  
  - Razorpay Integration  
  - Settings (User Preferences)  
  - Support / Ticketing  
  - Optional upgrade: Exact totals with `/api/dashboard/summary`  
- [Testing & deployment notes](#testing--deployment-notes)  
- [Contributing](#contributing)

---

## Overview

Finance-Tracker is a personal finance dashboard that connects to bank accounts (via Setu / other bank connectors), pulls transaction history and account balances, and shows a consolidated dashboard (deposits, spent, total balance, charts, recent transactions, payment schedule, budget goals UI). The codebase is split across:

- `frontend/` — Next.js / React app (client + server components where used)
- `backend/` — Express API and DB migrations
- `migrations/` — (SQL) database migration files

> **Important:** Active development is on the `dev` branch. `main` may contain stable snapshots only.

---

## Current features

- Connect bank accounts via Setu-like flows (consents & data sessions)
- List connected accounts, read their `raw_meta` and current balances
- Fetch transactions with pagination (`/api/transactions`) and show in Dashboard → Recent Transactions and in separate Transactions page.
- Dashboard with Stat cards (Deposits, Spent, Total Current Balance), Spend chart (monthly), Virtual card, Payment Schedule, Recent Transactions
- Authentication routes and token middleware (JWT-based access)
- Backend enforces `requireAuth` middleware for protected endpoints
- Very small admin / account utilities (account listing)

---

## Architecture & Tech stack

- Frontend: **Next.js (app router)**, React, Tailwind CSS, lucide-react icons, framer-motion
- Backend: **Node.js + Express**
- Database: **Postgres**
- Authentication: JWT tokens + cookie-based flows (see `auth` routes)
- Deployment: Designed for Heroku/Render/AWS for backend and Vercel/Netlify for frontend
- External integration: Setu-like Bank Connector (consents/data_session), (planned) Razorpay for payments

---

## Quick start (local development)

> These instructions assume you have Node.js (>=16), npm or pnpm, and PostgreSQL installed.

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd Finance-Tracker
   git checkout dev
````

2. **Backend**

   ```bash
   cd backend
   npm install
   # create .env from .env.example and set DB connection + other secrets
   npm run dev         # or: nodemon index.js
   ```

   * Backend runs on `http://localhost:5000` by default (or `PORT` env var).

3. **Frontend**

   ```bash
   cd ../frontend
   npm install
   # update NEXT_PUBLIC_BACKEND_URL to your backend (example: http://localhost:5000)
   npm run dev         # next dev
   ```

   * Frontend runs on `http://localhost:3000` by default.

4. **Database**

   * Create Postgres DB and set `DATABASE_URL` in backend `.env`.
   * Run migrations (some projects use an internal helper — the backend has `runMigrations()` invoked by start if not PROD).

   ```bash
   # if using provided helper
   node backend/index.js
   # OR run SQL scripts inside migrations folder manually with psql
   ```

---

## Important environment variables

Set these in `backend/.env` (names found in code):

* `DATABASE_URL` — Postgres connection string (e.g., `postgres://user:pass@localhost:5432/financetracker`)
* `PORT` — backend port (default `5000`)
* `FRONTEND_URL` — allowed origin for CORS (e.g., `http://localhost:3000`)
* `NEXT_PUBLIC_BACKEND_URL` — used by frontend (set in frontend env) e.g. `http://localhost:5000`
* `SETU_AUTH_URL`, `SETU_CLIENT_ID`, `SETU_CLIENT_SECRET` — (Setu / Open-banking) credentials used by tokenManager
* `RATE_LIMIT_MAX` — API rate limiting max calls per minute
* Add your JWT secret or keys if required by your auth/token manager

> Keep all secrets out of source control (use `.env` or secret manager).

---

## API overview (existing endpoints)

> Summary of server endpoints that currently exist in code:

**Public / Auth**

* `POST /login`, `POST /register` (if present in `routes/auth`) — user auth flows
* `POST /logout` — server logout route (cookies)

**Auth protected (requires `Authorization: Bearer <token>` or cookie as configured)**

* `GET /api/me` — returns current user
* `GET /api/accounts` — list accounts for the authenticated user (`?consentId=...` supported)
* `GET /api/transactions` — list transactions with pagination and filters:

  * `limit`, `offset`
  * `accountId` (filter by single account)
  * `consentId`
  * returns `{ ok: true, transactions: [...], total }` (total is authoritative)
* `POST /api/setu/*` — Setu-consent related endpoints (under `/api/setu` routes)
* `GET /api/payment-schedules` — payment schedule listing (used for the right column)
* `GET /health` — healthcheck

**Recommended optional endpoints (suggested / planned)**
(You can implement these to make frontend faster and accurate)

* `GET /api/dashboard/summary` — **aggregate** totals for deposits, spent, and balances across all user accounts (exact DB SUMs). This removes the need to fetch many transactions client-side to compute totals.
* `GET /api/accounts/:id` — get account details + transactions (already in accountsController as `getAccount()` but route commented out; enable it if needed)

---

## Database schema & migrations (notes)

Tables used (see `001_create_users.sql` style):

* `users` (existing auth table)
* `consents` — store consent metadata
* `data_sessions` — Setu/connector session records
* `accounts` — user_id, consent_id, fip_account_id, bank_name, account_masked, raw_meta JSONB, created_at
* `transactions` — user_id, account_id, txn_ref, amount NUMERIC, currency, txn_date, narration, category, raw_meta JSONB
* `webhook_events` — store webhook events if needed

If you add new features, add migrations for:

* `goals` and `goal_transactions`
* `payments`
* `user_settings`
* `support_tickets`

Example migration command pattern:

```sql
-- migrations/002_create_goals.sql
CREATE TABLE IF NOT EXISTS goals (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id),
  name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL,
  timeframe JSONB,
  category TEXT,
  progress JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Roadmap (planned / ongoing work — detailed)

**Status:** *Ongoing project* — the items below are planned and being worked on. Please open Issues or PRs against the `dev` branch.

### 1) Budget Goals (High priority)

**What:** Allow users to create budgets (monthly/quarterly/yearly), track transaction matches to budgets, visualize progress, and notify near-limit.
**Backend:** CRUD endpoints:

* `POST /api/goals`
* `GET /api/goals`
* `GET /api/goals/:id`
* `PUT /api/goals/:id`
* `DELETE /api/goals/:id`
  **DB:** `goals` and `goal_transactions` join table to map transactions to goals.
  **Frontend:** `BudgetGoals` page — create/edit modal, progress bar, charts.

### 2) Razorpay Integration (Medium)

**What:** Accept payments / top-ups (e.g., user topping virtual card), or pay vendors.
**Security:** Create orders server-side and verify webhook signature on server. **Do not** store Razorpay secret on client.
**Backend endpoints:**

* `POST /api/payments/create-order` — server-side create order
* `POST /api/payments/verify` — verify success signature
* `POST /api/payments/webhook` — listen for payment events
  **DB:** `payments` table storing order_id, payment_id, status, amount, metadata.

### 3) Settings (User Preferences) (Medium)

**What:** User preferences (notifications, theme, auto-refresh connected banks, currency, date format).
**Backend:** `GET/PUT /api/user/settings`
**DB:** either `user_settings` table or `settings` JSONB column on `users`.

### 4) Support / Ticketing (Low -> Medium)

**What:** Allow users to raise support tickets, store them in DB, admin panel to view.
**Backend:** `POST /api/support/tickets`, `GET /api/support/tickets` (admin)
**DB:** `support_tickets` table.

---

## UX & data behavior notes (important)

* Transactions may have inconsistent shapes from different banks; server normalizes:

  * `amount` is stored as positive numeric (sign handled by `direction` / `raw_meta`)
  * `direction` computed server-side from `amount` sign or `raw_meta.type`
* The frontend uses a `limit=200` maximum when fetching transactions (backend enforces `Math.min(200, ...)`).

  * For full-history calculations (sums across all time) use `GET /api/dashboard/summary` (recommended).
* When `ALL accounts` is selected in Dashboard, the frontend displays aggregated totals from accounts list + optionally from `/api/dashboard/summary`.

---

## Recent transactions on Dashboard (behavior)

* Dashboard displays at most 5 most recent transactions in the RecentTransactions component.
* Refactor note: to show account next to each transaction when `All accounts` is selected, ensure backend returns `account` (id, bank_name, account_masked) for each transaction — the current `transactionsController` already left-joins `accounts a` and returns `account` with `bank_name` and `account_masked`. Use these fields in RecentTransactions display.

---

## Testing & deployment notes

* Add unit tests for `transactionsController` edgecases (direction detection, negative amounts, missing raw_meta).
* Use environment-specific configs for Setu and Razorpay keys (test vs production).
* Recommended deployment:

  * Backend: Heroku / Render / AWS ECS with `DATABASE_URL` and env secrets.
  * Frontend: Vercel (set `NEXT_PUBLIC_BACKEND_URL` accordingly).

---


## contact

* Author / Maintainer: Diptesh Singh 
* Project status: **Ongoing** — active development in `dev` branch.

---

### Quick copy: Short badge and top message for README (paste at top):

```
**All code in the `dev` branch — work in progress**  
Status: **Work in progress** — Budget Goals, Razorpay integration, Settings & Support are planned and under development. Contributions welcome (open PRs against `dev`).
```

---

