# SkillBridge — Career Planning Platform

A full-stack MVP built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.

## Features
- Register and log in using JWT authentication
- Dashboard with career readiness summary
- Career interest assessment and recommended roadmap
- Skill roadmap checklist (progress saved to MongoDB)
- Job application tracker (create, update status, delete)
- Responsive layout

## Prerequisites
- Node.js 20+
- MongoDB local installation or a MongoDB Atlas connection string

## 1. Configure the backend
```bash
cd server
cp .env.example .env
```
Update `MONGO_URI` and set a long random `JWT_SECRET`.

## 2. Install and run the backend
```bash
npm install
npm run dev
```
The API runs on `http://localhost:5000`.

## 3. Install and run the frontend
In a second terminal:
```bash
cd client
cp .env.example .env
npm install
npm run dev
```
Open the URL printed by Vite (usually `http://localhost:5173`).

## API routes
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/roadmap`
- `POST /api/assessment`
- `GET /api/jobs`
- `POST /api/jobs`
- `PATCH /api/jobs/:id`
- `DELETE /api/jobs/:id`
- `GET /api/dashboard`

## Notes
- This is a learning MVP, not a production-hardened service.
- Keep `.env` private and never commit secrets.
- Before production, add rate limiting, email verification, password reset, stronger validation, tests, and deployment-specific CORS settings.
