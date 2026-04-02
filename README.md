# Finance Dashboard Backend

Minimal Node.js + Express backend with SQLite persistence.

Features:
- User management with roles: `viewer`, `analyst`, `admin`
- Role-based access control (RBAC) via middleware
- Financial records CRUD (soft delete)
- Dashboard summary endpoints: totals, category breakdown, recent activity, monthly trend
- SQLite persistence using `better-sqlite3`

Quick start

1. From project folder:

```bash
cd finance-backend
npm install
```

2. Start the server:

```bash
npm run dev
```

3. Seeded admin user (created on first run):
- email: `admin@example.com`
- password: `adminpass`

API highlights

- POST `/api/auth/login` { email, password } -> { token }
- Users (admin only): GET/POST/PUT/DELETE `/api/users`
- Records: GET `/api/records` (all roles), POST/PUT/DELETE `/api/records` (admin only)
- Dashboard summary: GET `/api/dashboard/summary` (analyst+viewer+admin)

Auth

- Provide `Authorization: Bearer <token>` header for protected endpoints.

Notes & Tradeoffs

- This is intentionally minimal and synchronous (uses `better-sqlite3`) for simplicity.
- Passwords are hashed with `bcryptjs`.
- For production: use environment-configured `JWT_SECRET`, HTTPS, migrations tooling, tests, and a stronger DB setup.
