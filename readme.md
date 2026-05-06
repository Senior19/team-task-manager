# Team Task Manager 🚀

> A full-stack collaborative task management platform with role-based access control, project tracking, and real-time dashboard analytics.

**Live Demo:** https://your-app.railway.app

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Authentication & RBAC](#authentication--rbac)
- [Database Schema](#database-schema)
- [Local Setup](#local-setup)
- [Railway Deployment](#railway-deployment)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

---

## Features

| Feature | Description |
|--------|-------------|
| 🔐 Auth | JWT-based login with Admin/Member roles |
| 📁 Projects | Create projects, assign teams |
| ✅ Tasks | Assign tasks, track status & progress |
| 📊 Dashboard | Analytics and activity overview |
| 🔄 CRUD | Full Create/Read/Update/Delete operations |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Tailwind CSS |
| Backend | Node.js, Express |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Railway |

---

## Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Frontend (React + Tailwind)"]
        UI[UI Components]
        Auth[Auth Context]
        API_Client[Axios API Client]
    end

    subgraph Server["⚙️ Backend (Node.js + Express)"]
        Router[Express Router]
        Middleware[JWT Middleware]
        Controllers[Controllers]
        ORM[Sequelize ORM]
    end

    subgraph DB["🗄️ Database (PostgreSQL)"]
        Users[(Users)]
        Projects[(Projects)]
        Tasks[(Tasks)]
        Members[(Project Members)]
    end

    UI --> Auth
    Auth --> API_Client
    API_Client -->|HTTP + JWT| Router
    Router --> Middleware
    Middleware --> Controllers
    Controllers --> ORM
    ORM --> Users
    ORM --> Projects
    ORM --> Tasks
    ORM --> Members
```

---

## Authentication & RBAC

```mermaid
sequenceDiagram
    participant U as User
    participant FE as Frontend
    participant BE as Backend
    participant DB as PostgreSQL

    U->>FE: Enter credentials
    FE->>BE: POST /api/auth/login
    BE->>DB: Lookup user by email
    DB-->>BE: User record + role
    BE-->>FE: JWT token (contains role)
    FE->>FE: Store token in localStorage

    Note over FE,BE: Subsequent authenticated requests

    FE->>BE: GET /api/projects (Authorization: Bearer <token>)
    BE->>BE: Verify JWT + extract role
    alt role = admin
        BE-->>FE: Full project data + management options
    else role = member
        BE-->>FE: Only assigned projects/tasks
    end
```

### Roles & Permissions

```mermaid
flowchart LR
    subgraph Roles
        A[👤 Member]
        B[🛡️ Admin]
    end

    subgraph MemberAccess["Member Access"]
        M1[View Dashboard]
        M2[View Assigned Tasks]
        M3[View Own Projects]
        M4[Update Task Status]
    end

    subgraph AdminAccess["Admin Access"]
        A1[Everything Member Can Do]
        A2[Create Projects]
        A3[Assign Tasks]
        A4[Manage Team Members]
        A5[View All Projects & Tasks]
    end

    A --> MemberAccess
    B --> AdminAccess
```

> **⚠️ Admin Creation Note:** Admin accounts **cannot** be created via the signup page. Create one directly via API:
> ```bash
> curl -X POST http://localhost:5001/api/auth/signup \
>   -H "Content-Type: application/json" \
>   -d '{"name": "Admin Name", "email": "admin@example.com", "password": "yourpassword", "role": "admin"}'
> ```

---

## Database Schema

```mermaid
erDiagram
    USERS {
        int id PK
        string name
        string email
        string password_hash
        enum role "admin | member"
        timestamp created_at
    }

    PROJECTS {
        int id PK
        string title
        string description
        int created_by FK
        timestamp created_at
    }

    TASKS {
        int id PK
        string title
        string description
        enum status "todo | in_progress | done"
        int project_id FK
        int assigned_to FK
        timestamp due_date
    }

    PROJECT_MEMBERS {
        int id PK
        int project_id FK
        int user_id FK
    }

    USERS ||--o{ PROJECTS : "creates"
    USERS ||--o{ TASKS : "assigned to"
    USERS ||--o{ PROJECT_MEMBERS : "belongs to"
    PROJECTS ||--o{ TASKS : "contains"
    PROJECTS ||--o{ PROJECT_MEMBERS : "has"
```

---

## Local Setup

### Prerequisites

- Node.js v18+
- PostgreSQL running locally
- npm or yarn

### Backend

```bash
cd backend

# Create a .env file with the following:
# DATABASE_URL=postgresql://postgres:admin@localhost:5432/teamtaskmanager
# JWT_SECRET=supersecretvalue123!
# NODE_ENV=development

npm install
npm start
# Server runs on http://localhost:5001
```

### Frontend

```bash
cd frontend

# Create a .env file with the following:
# REACT_APP_API_URL=http://localhost:5001

npm install
npm start
# App runs on http://localhost:3000
```

### Startup Flow

```mermaid
flowchart TD
    A[Clone Repository] --> B[Setup PostgreSQL]
    B --> C[Configure backend .env]
    C --> D[npm install - backend]
    D --> E[npm start - backend]
    E --> F{Database synced?}
    F -- ✅ Yes --> G[Configure frontend .env]
    F -- ❌ No --> H[Check DATABASE_URL & PostgreSQL]
    H --> E
    G --> I[npm install - frontend]
    I --> J[npm start - frontend]
    J --> K[🎉 App running on localhost:3000]
```

---

## Railway Deployment

### Deployment Architecture

```mermaid
graph LR
    GH[GitHub Repo] -->|Auto Deploy| RW

    subgraph RW["☁️ Railway"]
        FE_SVC[Frontend Service\nReact Build]
        BE_SVC[Backend Service\nNode.js]
        PG[(PostgreSQL\nManaged DB)]
    end

    FE_SVC -->|REACT_APP_API_URL| BE_SVC
    BE_SVC -->|DATABASE_URL| PG
```

### Backend Service

1. Push your code to GitHub
2. In Railway Dashboard → **Backend Service** → **Variables**, add:

| Variable | Value |
|----------|-------|
| `DATABASE_URL` | Your Railway PostgreSQL URL |
| `JWT_SECRET` | `supersecretvalue123!` |
| `NODE_ENV` | `production` |

3. Deploy and confirm logs show: `✅ Database synced`

### Frontend Service

1. Add a **Frontend Service** in Railway
2. Set variables:

| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | Your Railway Backend URL |

3. Build command: `npm run build`
4. Start command: `npm run serve`

---

## API Reference

### Auth

```bash
# Sign Up
POST /api/auth/signup
Body: { "name": "string", "email": "string", "password": "string", "role": "member" }

# Login
POST /api/auth/login
Body: { "email": "string", "password": "string" }
Response: { "token": "<JWT>" }
```

### Projects *(requires auth)*

```bash
# List all projects
GET /api/projects
Headers: Authorization: Bearer <token>

# Create project (admin only)
POST /api/projects
Body: { "title": "string", "description": "string" }
```

### Tasks *(requires auth)*

```bash
# Get tasks
GET /api/tasks

# Create task (admin only)
POST /api/tasks
Body: { "title": "string", "projectId": 1, "assignedTo": 5 }
```

> See `DATABASE_SYNC_FIX.md` and `RAILWAY_DEPLOYMENT_CHECKLIST.md` for detailed deployment guides.

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Port 5001 already in use | Another process using the port | Run `lsof -i :5001` and kill the process |
| Database connection fails | Wrong credentials or DB not running | Check `DATABASE_URL` format and ensure PostgreSQL is running |
| Frontend CORS errors | Wrong API URL | Verify `REACT_APP_API_URL` points to the correct backend URL |
| Tables not syncing | Sequelize sync failed | Check backend logs for `Database synced` message |
| JWT errors | Mismatched or missing secret | Ensure `JWT_SECRET` is the same in `.env` and Railway variables |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---



