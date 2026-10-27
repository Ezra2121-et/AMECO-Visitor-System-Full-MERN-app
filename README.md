# AMECO Visitor Management System

A full-stack visitor-management application developed during my Full-Stack Developer Internship at Amhara Media Corporation (AMECO), Bahir Dar, Ethiopia. I led a 9-member team during the internship.

## Features
- Visitor registration, search and date-based filtering.
- Separate receptionist, administrator and system-administrator areas.
- JWT login and role-protected frontend routes.
- Visitor reporting, analytics, user management, settings and audit logs.

## Stack
**Frontend:** React, Vite, React Router, Axios, Tailwind CSS  
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt

## Run locally
Requirements: Node.js/npm and a running MongoDB instance.

1. Configure the backend:
   ```bash
   cd backend && npm install
   cp .env.example .env
   npm run seed
   npm run dev
   ```
2. In a second terminal at the repository root, configure and start the frontend:
   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```

The API defaults to `http://localhost:5000`; Vite normally serves the frontend at `http://localhost:5173`. Set your local MongoDB URI and a unique `JWT_SECRET` in `backend/.env`. The seed script contains development-only demo credentials—never use these defaults in a public deployment.

## Scope and security
This is an internship/portfolio project, not a claim of a production-hosted service. Before any public deployment, replace demo credentials, review authorization on every API route, configure restrictive CORS, validate requests and add deployment monitoring.

## License
No open-source license is granted in this repository at this time. Because this work was developed in an internship setting, confirm ownership and reuse rights with the relevant rights holder before redistributing or licensing the source code.
