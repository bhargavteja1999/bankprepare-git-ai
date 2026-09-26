# BankPrepare AI — IBPS / SBI / RBI Exam Prep

AI-powered bank exam platform (FastAPI + React + Vite) with mock tests, adaptive practice, mistake notebook, weekly tournaments, current-affairs digest, spaced review (SM-2) and Gemini tutor.

## Quick Start

### 1. Env setup
```bash
cp .env.example .env
# edit .env — set SECRET_KEY (openssl rand -hex 32) and GEMINI_API_KEY
```

### 2. Local dev (without Docker)
```bash
# backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# frontend (new terminal)
cd frontend
npm install
npm run dev   # http://localhost:5173  -> proxies /api to :8000
```

### 3. Docker
```bash
docker compose up --build
# frontend: http://localhost:5173 (nginx)
# backend:  http://localhost:8000/docs
# health:   http://localhost:8000/api/health
```

For Postgres in prod, uncomment `db` service in `docker-compose.yml` and set `DATABASE_URL=postgresql+psycopg2://...`.

## Project Structure
```
backend/app/
  config.py, database.py, main.py
  models/, routes/, schemas/, services/, utils/, seed/, prompts/
frontend/src/
  App.jsx, pages/, components/, services/, hooks/, context/
```

## Key Fixes (2026-09)
- `requirements.txt`: removed `passlib` (breaks with `bcrypt>=4.1`, caused 500s on register/login on fresh installs) — hashing uses `bcrypt` directly; added `psycopg2-binary` for Postgres, plus `google-generativeai`, `alembic`, `gunicorn`.
- `backend/app/main.py:165`: removed `DATABASE_URL` leak from `/api/health`.
- `backend/app/routes/quizzes.py:25` & `questions.py:10-16`: `GET` no longer leaks `answer_idx`/`explanation` (only `POST /submit` returns correct_map).
- `backend/app/config.py:1`, `utils/security.py:1,21,50`: Pydantic v2 `ConfigDict`, `SECRET_KEY` validator, `datetime.now(timezone.utc)`, narrow `except`.
- `frontend/src/services/api.js`, `vite.config.js`: `VITE_API_URL` env var + Docker-safe proxy (`VITE_API_PROXY_TARGET`).
- Added `.gitignore`, `docker-compose.yml`, both `Dockerfile`s (with healthchecks, non-root, multi-stage nginx).

## API
- `GET /api/health` — service + DB counts (no secrets)
- `POST /api/auth/register`, `POST /api/auth/login` → `GET /api/users/me`
- `GET /api/questions`, `GET /api/quizzes`, `POST /api/quizzes/submit`
- `GET /api/mock-tests`, `POST /api/mock-tests/{id}/start`, `POST /api/mock-tests/{id}/submit`
- `GET /api/progress`, `GET /api/leaderboard`, `POST /api/ai/tutor`

See `http://localhost:8000/docs` for full OpenAPI.

## Deploying to Vercel (fixes "Request failed with status code 500" on login/register)

The old `vercel.json` used a `services` key that Vercel does not support, and SQLite cannot
take writes on Vercel's read-only serverless filesystem — so every login/register failed
with a 500. Deploy the two halves separately:

**1. Database (required):** create a free Postgres (Neon, Supabase, or Vercel Postgres).
Copy its connection string, e.g. `postgresql+psycopg2://user:pass@host/db`.

**2. Backend:** deploy `backend/` on Render / Railway / Fly.io (persistent server, not Vercel
Functions) with env vars:
- `DATABASE_URL` = your Postgres URL above (SQLite only works for local dev)
- `SECRET_KEY` = `openssl rand -hex 32` output (min 32 chars)
- `CORS_ORIGINS` = your Vercel frontend URL, e.g. `https://bankprepare.vercel.app`
- `GEMINI_API_KEY` = optional (AI tutor falls back to built-in answers without it)

Then run migrations once: `alembic upgrade head` (or let `init_db()` create tables).

**3. Frontend:** deploy this repo on Vercel (root `vercel.json` already builds `frontend/`)
with env var:
- `VITE_API_URL` = `https://<your-backend>/api` (must be the full backend URL —
  without this, the app calls same-origin `/api` which does not exist on Vercel)

## Security Notes
- Rotate `SECRET_KEY` per env, never commit `.env`.
- Answers are hidden until submit; add rate-limiting (e.g. `slowapi`) before public deploy.
- Token is in `localStorage` — consider moving to `httpOnly` cookie + refresh token for prod XSS hardening.

## Tests (TODO)
```bash
# backend
pytest -q
# frontend
npm run test
```

## License
Private — add LICENSE before public release.
