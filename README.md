# Finance-Tracker

> **Work in progress — all active development is on the `dev` branch.**
> This repo contains the Finance-Tracker web app (Next.js frontend + Node/Express backend + PostgreSQL). The project is **ongoing** — core dashboard, account linking and transactions are working, several UX pages are built and more server features are being implemented (see Roadmap).

---

---

> **Branch note:** Development originally happened on the `diptesh` branch for most early commits. For cleanliness and better project structure, all latest and active work has been consolidated into the `dev` branch. If you wish to explore the full commit history or earlier development progression, the `diptesh` branch still contains all previous commits — but it does *not* include the most recent updates.

---

## Screenshots

**Dashboard / Home**
![Dashboard 1](/dashboard-1.png) 

![](/dashboard-2.png)

**Transactions / Recent Transactions**
![](/transactions.png)

**My Bank / Connect Bank**
![](/my-bank.png) 

![](/connect-bank.png)

**Transfer Funds / Payment Schedule**
![](/transfer-funds.png) 

![](/payment-schedule.png)

**Budget Goals / Monthly Budgets**
![](/budget-goals.png) 

![](/monthly-budgets.png)

**Support / Settings**
![](/support.png) 

![](/settings.png)

---

## Table of contents

* [Overview](#overview)
* [Status & Notes](#status--notes)
* [Current features (implemented)](#current-features-implemented)
* [UI done / Pending implementation](#ui-done--pending-implementation)
* [Architecture & tech stack](#architecture--tech-stack)
* [Quick start (local development)](#quick-start-local-development)
* [Important environment variables (summary)](#important-environment-variables-summary)
* [API & DB notes (what exists)](#api--db-notes-what-exists)
* [Roadmap / Planned work (detailed)](#roadmap--planned-work-detailed)
* [Security & auth notes](#security--auth-notes)
* [Contributing & contact](#contributing--contact)

---

## Overview

Finance-Tracker is a personal finance dashboard that connects to bank accounts via a connector (Setu-style), pulls account balances & transactions and shows consolidated views:

* Dashboard with **Deposits**, **Spent**, **Total Current Balance**, monthly charts and **Recent Transactions**.
* Transaction history with pagination and per-account filtering.
* Account management (My Bank / Connect Bank) to view and disconnect accounts.
* Payment schedule and basic transfer UI, Budget Goals UI, Virtual Card UI (UI-only for now).
* Authentication (local + Google OAuth), token-based sessions, and password reset flow.

> **Important:** **All active development is on the `dev` branch.**

---

## Status & Notes

* **Project status:** Ongoing (development). Not deployed to production.
* **Auth / Security:** Access tokens + Refresh tokens implemented. Forgot-password via Nodemailer implemented.
* **OAuth:** Google OAuth implemented (server-side).
* **Images & UI:** Many pages have finished UI/UX. Some backend functionality for planned features is pending.

---

## Current features (implemented)

**Backend & API**

* Express API with routes for auth and protected endpoints.
* `/api/accounts` — list user accounts (reads `raw_meta` and returns current balance).
* `/api/transactions` — paginated transaction listing with `limit`, `offset`, `accountId` and `consentId` filters. Returns normalized transactions and `total` count.
* `transactionsController` normalizes direction/amount and joins `accounts` so each transaction includes account info (bank_name, account_masked).
* Payment schedules table + endpoints (list implemented).
* Database migrations included (Postgres SQL files).

**Frontend**

* Next.js (app router) dashboard with:

  * Stat cards (Deposits, Spent, Balance)
  * Account selector (select single account or All accounts)
  * Recent transactions (top 5 on dashboard)
  * Transactions page (paginated)
  * My Bank and Connect Bank pages (connect/disconnect flows)
  * Payment schedule & Budget Goals UI components
* Responsive layout, Tailwind CSS, reusable components.

---

## UI done / Pending implementation (summary)

**Fully implemented (backend + frontend):**

* **Dashboard** (stat cards, chart, recent transactions)
* **My Bank** (list connected accounts, balances)
* **Connect Bank** (consent / data-session flows integrated)
* **Transactions** page (paginated list using `/api/transactions`)
* **Payment Schedules** (list + UI)

**UI implemented but backend / final logic pending:**

* **Budget Goals** — full UI built (create/edit/top-up flows designed). Backend CRUD endpoints exist in roadmap but final linking of transactions → goals is ongoing.
* **Virtual Card** — UI designed (virtual card mock). Server-side issuance & Razorpay / payment flows pending.
* **Transfer Funds** — UI available (form, beneficiary list). Real transfer flow / third-party integration pending.
* **Settings** — profile/settings UI created; persisting user preferences endpoint pending.
* **Support** — Support page UI & contact form built; ticketing backend not fully implemented.

> **UX note:** When user selects **All accounts**, each transaction on lists now includes account metadata (bank_name / masked) so you can see which account the transaction belongs to — ensure backend keeps returning the `account` object for each transaction (this is already implemented in the `transactionsController` left join).

---

## Architecture & tech stack

* **Frontend:** Next.js (app router), React, Tailwind CSS, lucide-react (icons).
* **Backend:** Node.js + Express.
* **DB:** PostgreSQL. Migrations are in `backend/migrations/`.
* **Auth:** JWT access token + refresh token flow; refresh tokens stored/hashed server-side. Google OAuth supported.
* **External:** Setu (sandbox) connector for account/transaction fetching. Razorpay planned for payment flows.
* **Env / config:** `.env` used locally; secrets must not be checked into git.

---

## Quick start (local development)

1. Clone & checkout `dev`:

```bash
git clone <your-repo-url>
cd Finance-Tracker
git checkout dev
```

2. Backend:

```bash
cd backend
npm install
# create .env (see env summary below)
npm run dev
# backend default: http://localhost:5000
```

3. Frontend:

```bash
cd ../frontend
npm install
# set NEXT_PUBLIC_BACKEND_URL in frontend/.env (e.g. http://localhost:5000)
npm run dev
# frontend default: http://localhost:3000
```

Open `http://localhost:3000` and login / connect bank accounts.

---

## Important environment variables (summary)

> Edit `backend/.env` and `frontend/.env` accordingly.

**backend/.env (examples already in repo)**

```
DATABASE_URL=postgres://postgres:password@localhost:5432/finance_tracker
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_PEPPER=<random-secret>
REFRESH_TOKEN_EXPIRES_DAYS=30

# SMTP (forgot password)
SMTP_HOST=smtp.gmail.com
SMTP_USER=<your-email>
SMTP_PASS=<app-password>

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback

# Setu (sandbox)
SETU_BASE=https://fiu-sandbox.setu.co/v2
SETU_PRODUCT_INSTANCE_ID=...
SETU_CLIENT_ID=...
SETU_CLIENT_SECRET=...
SETU_AUTH_URL=https://orgservice-prod.setu.co/v1/users/login
SETU_AUTO_FETCH=false
```

**frontend/.env**

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

> Keep secrets out of source control. Use a secret manager for production.

---

## API & DB notes (what exists)

**Key backend endpoints**

* `POST /login`, `POST /register`, `POST /logout`
* `GET /api/me` — current user
* `GET /api/accounts` — list accounts (includes `raw_meta` + balance)
* `GET /api/transactions?limit=&offset=&accountId=` — returns `{ ok: true, transactions: [...], total }`
* `GET /api/payment-schedules` — list payment schedules
* Setu related endpoints for creating consents / data sessions / webhooks.

**Database / migrations**

* Migrations in `backend/migrations/` create tables: `users`, `auth_credentials`, `accounts`, `transactions`, `consents`, `data_sessions`, `payment_schedules`, `saving_goals`, `goal_transactions`, `contact_submissions` etc.
* `transactionsController` returns `account` (bank_name, account_masked) with each txn — make sure to keep `LEFT JOIN accounts` so UI shows account per txn.

---

## Roadmap — planned & ongoing work (detailed)

**Status: ongoing — prioritized list**

1. **Budget Goals (High)**

   * Backend endpoints: CRUD for goals + top-ups.
   * Link transactions to goals automatically (matching rules or manual assign).
   * Notifications when goal targets near.

2. **Virtual Card & Card Addition (High)**

   * Issue virtual card to users (server-side), top-up via payments, store masked details.
   * UI exists; server implementation pending.

3. **Transfer Funds / Razorpay Integration (Medium)**

   * Integrate Razorpay for top-ups / payments (server creates orders + routes to verify webhooks).
   * Build secure transfer flows (2FA / confirmation).

4. **Settings & Preferences (Medium)**

   * Persist user preferences (theme, currency, notification toggles).
   * `GET/PUT /api/user/settings` endpoints.

5. **Support / Ticketing (Medium)**

   * Support ticket endpoint, admin view, reply flow.
   * Currently support UI exists; server ticketing pending.

---

## Security & auth notes

* **Two token types:** Access token (short-lived JWT) + Refresh token (opaque string hashed & stored). This approach allows short-lived access tokens while enabling silent refresh.
* **Forgot password** implemented via **nodemailer** (server sends reset email with token).
* **Google OAuth** implemented (server side).
* **Sensitive data:** Bank `raw_meta` stored as JSONB; ensure DB & backups are secure.
* **Webhooks:** If you enable Setu/Payment webhooks, validate signatures (HMAC) before accepting events.

---

## Contributing & contact

* **Team:** Diptesh Singh & Jay Kishan Patra
* **Development branch:** `dev` 

---

## Final notes (short)

* **All active code is on the `dev` branch.**
* **Project is ongoing** — UI for many pages is done, but server-side implementation for *Budget Goals (persist/finalize), Virtual Card issuance, Transfer funds (real payments), Razorpay* and *Support ticketing* is still in progress.
* **Auth:** Access + Refresh -> implemented; **Forgot password** via nodemailer implemented; **Google OAuth** implemented.

**Branch note (friendly):** During early development most pushes and pulls were performed on the `diptesh` branch and it contains the fuller commit history and earlier iterations. To keep the repository history cleaner and make active work easier to follow, the latest, up-to-date code and continuing development have been consolidated on the `dev` branch. If you want to review older commits or the development timeline, the `diptesh` branch is a good place to look — but for the current codebase and ongoing work, please use `dev`.


---




