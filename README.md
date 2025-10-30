# JLPT- Study App

This repository is a minimal scaffold for a JLPT study application.

Structure:
- frontend/  - Next.js + TypeScript + TailwindCSS
- backend/   - Node.js + Express + TypeScript
- infra/     - docker-compose and DB init SQL

Quick start (Windows cmd.exe):

1) Start Postgres with Docker Compose (from project root):

    docker compose up -d

2) Start backend (from project root):

    cd backend
    npm install
    npm run dev

3) Start frontend (in a new terminal):

    cd frontend
    npm install
    npm run dev

Backend default: http://localhost:4000
Frontend default: http://localhost:3000

.env files: use the examples in `infra/.env.example` and `backend/.env.example`.

Notes:
- This is a scaffold. Add migrations, auth, and CI as needed.
