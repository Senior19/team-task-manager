# Team Task Manager 🚀

Live Demo: https://your-app.railway.app

## Features
✅ User Auth (Admin/Member RBAC)  
✅ Project Creation & Team Management  
✅ Task Assignment & Status Tracking  
✅ Dashboard Analytics  
✅ Full CRUD Operations  

## Tech Stack
- React + Tailwind (Frontend)  
- Node.js + Express (Backend)  
- PostgreSQL (Database)  
- Railway (Deployment)  

## Roles & Access

- **Member** — default role assigned on signup. Can view dashboard, tasks assigned to them, and projects they belong to.
- **Admin** — can create projects, assign tasks, and manage team members.

> **Note:** Admin accounts cannot be created through the signup page. They must be created directly via the backend by setting `role: "admin"` in the database or through a direct API call:
> ```bash
> curl -X POST http://localhost:5001/api/auth/signup \
>   -H "Content-Type: application/json" \
>   -d '{"name": "Admin Name", "email": "admin@example.com", "password": "yourpassword", "role": "admin"}'
> ```

## Local Setup
```bash
npm install
npm run dev