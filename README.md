# AMECO Visitor Management System

A full-stack visitor-management application developed during my Full-Stack Developer Internship at Amhara Media Corporation (AMECO), Bahir Dar, Ethiopia. I led a 9-member team during the internship.

This repository contains the React frontend and Express/MongoDB API. It is an internship project; no public production deployment is documented here.

## Core workflows

- Receptionist area for registering and managing visitor records.
- Administrator area for visitor lists, reporting and analytics.
- System-administrator area for user management, settings and audit logs.
- JWT-based login and role-protected frontend routes.
- Visitor filtering by search and date range, with optional pagination.
- Application logs for administrative review.

## Technology

**Frontend:** React, Vite, React Router, Axios, Tailwind CSS  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## Repository layout

- `src/pages/` — login, dashboards, visitor workflows, reports and settings.
- `src/components/` — navigation, sidebar and protected-route components.
- `src/services/api.js` — API client and bearer-token handling.
- `backend/routes/` — authentication, users, visitors, sources, logs and settings endpoints.
- `backend/controllers/` — request handlers and business logic.
- `backend/models/` — MongoDB/Mongoose models.
- `backend/middleware/` — authentication and role checks.

## Requirements

- A recent Node.js release compatible with Vite 7.
- npm.
- A running MongoDB instance, local or hosted.

## Local setup

### 1. Configure the backend

```bash
cd backend
npm install
```

Copy the backend environment example and edit the placeholders:

```bash
cp .env.example .env
```

Use these values for local development:

```dotenv
MONGO_URI=mongodb://127.0.0.1:27017/ameco_visitors
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

Make sure MongoDB is running. For a local development database, initialize the demo accounts from the backend directory:

```bash
npm run seed
npm run dev
```

The seed script currently contains predefined development-only demo accounts. Inspect `backend/seed.js` for details. **Do not use those credentials in a public deployment**; replace the defaults and use a unique, strong `JWT_SECRET` before exposing the application.

The API root is available at `http://localhost:5000/`.

### 2. Configure the frontend

In a second terminal, from the repository root:

```bash
npm install
```

Copy the frontend environment example from the repository root and edit it if needed:

```bash
cp .env.example .env
```

The root-level `.env` should contain:

```dotenv
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Build and lint

From the repository root:

```bash
npm run build
npm run lint
```

For the backend, `npm run dev` starts the API using Nodemon; `npm start` starts it with Node.js.

## Current scope and production considerations

This project demonstrates role-based workflows, visitor records, reporting and audit logging. Before a public or production deployment, review authentication and authorization across every API route, replace seeded demo credentials, use a strong secret manager, configure restrictive CORS, validate and rate-limit requests, and add automated tests and deployment monitoring.

## Author

Yosef Getnet — [GitHub profile](https://github.com/Ezra2121-et)
