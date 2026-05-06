# Team Task Manager - Database Sync Fix & Deployment Guide

## Problems Found & Fixed ✅

### 1. **Backend Database Configuration Mismatch**
   - **Problem**: `backend/.env` was using `localhost:5432` instead of Railway URL
   - **Fix**: Updated `backend/.env` with correct Railway `DATABASE_URL`
   - **Status**: ✅ FIXED

### 2. **Unused Legacy Database Connection**
   - **Problem**: `db.js` was hardcoded to localhost and never imported
   - **Fix**: Replaced with deprecation notice, backend uses Sequelize properly
   - **Status**: ✅ FIXED

### 3. **Task Model Missing Field Definition**
   - **Problem**: `assignedTo` field was referenced in relationships but not defined
   - **Fix**: Added explicit `assignedTo` field to Task model with proper foreign key
   - **Status**: ✅ FIXED

### 4. **Database Sync Issues**
   - **Problem**: `sequelize.sync()` called without proper error logging
   - **Fix**: Added `alter: true` for non-destructive schema updates, improved logging
   - **Status**: ✅ FIXED

### 5. **Frontend Hardcoded API URL**
   - **Problem**: React frontend hardcoded to `http://localhost:5001`
   - **Fix**: 
     - Created `frontend/.env` with `REACT_APP_API_URL` variable
     - Updated `AuthContext.jsx` to use environment variable
   - **Status**: ✅ FIXED

---

## Railway Deployment Setup

### Step 1: Update Backend Environment Variables in Railway Dashboard

Go to **Railway Dashboard** → **Your Backend Service** → **Variables Tab**:

```
DATABASE_URL = postgresql://postgres:ZsIpRqNUJjFqtySrtIdtkneldxmpyCXw@trolley.proxy.rlwy.net:39638/railway
JWT_SECRET = supersecretvalue123!
NODE_ENV = production
```

### Step 2: Update Frontend Environment Variables in Railway Dashboard

Go to **Railway Dashboard** → **Your Frontend Service** → **Variables Tab**:

```
REACT_APP_API_URL = https://your-railway-backend-url.railway.app
```

**Get your backend URL from:**
- Railway Dashboard → Backend Service → Public Domain

### Step 3: Verify Database Tables

After deployment, check your Railway Postgres database:

1. Go to **Railway Dashboard** → **Postgres Database** → **Database Tab**
2. You should see these tables:
   - `Users`
   - `Projects`
   - `Tasks`
   - `ProjectMembers` (junction table)

If tables don't exist, the backend failed to sync. Check backend logs.

---

## Local Development Setup

### For Backend (Node.js):

1. **Ensure backend/.env has correct settings:**
   ```
   DATABASE_URL=postgresql://postgres:admin@localhost:5432/teamtaskmanager
   JWT_SECRET=supersecretvalue123!
   NODE_ENV=development
   ```

2. **Start PostgreSQL locally:**
   ```bash
   # Make sure PostgreSQL server is running on localhost:5432
   ```

3. **Install & start backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

   Expected output:
   ```
   🔍 Connecting to database: LOCAL_URL (or RAILWAY_URL)
   ✅ Database connection authenticated.
   ✅ Database synced - All tables created/updated.
   🚀 Server running on port 5001
   ```

### For Frontend (React):

1. **Ensure frontend/.env:**
   ```
   REACT_APP_API_URL=http://localhost:5001
   ```

2. **Install & start frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```

   The React dev server will proxy API calls to backend.

---

## Testing Database Sync

### Check if tables were created:

**Using Railway Dashboard:**
1. Go to Database → Data Tab
2. Click "Select * FROM table_name"
3. You should see your tables listed

**Using psql (command line):**
```bash
psql -U postgres -h trolley.proxy.rlwy.net -p 39638 -d railway -c "\dt"
```

---

## Troubleshooting

### Backend logs show "Connection error"?
- [ ] Verify `DATABASE_URL` in Railway Variables matches exactly
- [ ] Check if database is accessible: `psql -U postgres -h trolley.proxy.rlwy.net -d railway`
- [ ] Ensure `NODE_ENV=production` for SSL connection

### Frontend shows CORS errors?
- [ ] Verify `REACT_APP_API_URL` is set correctly in frontend variables
- [ ] Backend must have `cors` middleware enabled (already configured ✅)

### No tables in database?
- [ ] Check backend logs: "Database synced" should appear
- [ ] Try redeploying backend from Railway dashboard
- [ ] Verify backend service is running (check Status in Railway)

### Tasks not showing "assignedTo" field?
- [ ] The model was fixed to include `assignedTo` field
- [ ] Old database might need migration (contact DB admin)

---

## Files Modified

✅ `backend/.env` - Updated DATABASE_URL
✅ `backend/server.js` - Improved logging for sync
✅ `backend/models/index.js` - Added assignedTo field
✅ `db.js` - Marked as deprecated
✅ `frontend/.env` - Created with REACT_APP_API_URL
✅ `frontend/src/context/AuthContext.jsx` - Made API URL configurable

---

## Summary

Your database should now sync properly when the backend starts. All tables (Users, Projects, Tasks, ProjectMembers) will be created automatically via Sequelize ORM.

**Next Steps:**
1. Deploy to Railway
2. Monitor backend logs for "Database synced" message
3. Check Railway database UI to verify tables exist
4. Test signup → create project → create task workflow
