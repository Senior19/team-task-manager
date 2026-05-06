# 🚀 Railway Deployment Checklist

## Pre-Deployment
- [ ] All code changes committed to git
- [ ] `.env` files are in `.gitignore` (secrets not in repo)
- [ ] Backend `.env` has correct `DATABASE_URL` from Railway
- [ ] Frontend `.env` has correct `REACT_APP_API_URL`

## Railway Dashboard Configuration

### Backend Service
- [ ] Go to Variables tab
- [ ] Set `DATABASE_URL` = (your Railway Postgres URL)
- [ ] Set `JWT_SECRET` = supersecretvalue123!
- [ ] Set `NODE_ENV` = production
- [ ] Click "Deploy"

### Frontend Service  
- [ ] Go to Variables tab
- [ ] Set `REACT_APP_API_URL` = (your Railway backend domain)
  - Example: https://backend-production-1234.railway.app
- [ ] Click "Deploy"

### PostgreSQL Database
- [ ] Verify status is "Running"
- [ ] Database Tab should show connection variables

## Post-Deployment Verification

### Check Backend Logs
1. Go to Backend Service → Deployments → Latest
2. Look for messages:
   ```
   🔍 Connecting to database: RAILWAY_URL (production)
   ✅ Database connection authenticated.
   ✅ Database synced - All tables created/updated.
   🚀 Server running on port 5001
   ```

### Check Database Tables
1. Go to PostgreSQL Database → Database Tab
2. Execute: `SELECT * FROM "Users" LIMIT 1`
3. Should show table schema (not "no tables" error)

### Test Frontend Connection
1. Open deployed frontend URL in browser
2. Try to sign up with test account
3. Should create user in database without errors

## If Something Goes Wrong

### Backend can't connect to database?
```bash
# Check backend logs for exact error
# Common issues:
# - DATABASE_URL format incorrect
# - SSL certificate verification fails
# - Database not accessible from Railway
```

### Frontend shows blank page or CORS errors?
```bash
# Check frontend logs in browser console (F12)
# Verify REACT_APP_API_URL is set correctly
# Try: curl https://your-backend-url/api/auth/me
```

### Tables don't exist in database?
```bash
# Backend sync failed - check logs for error
# Try redeploying backend service
# Ensure NODE_ENV=production is set
```

---

**Backend URL Format:** https://backend-[PROJECT-ID]-[RANDOM].railway.app
**Frontend URL Format:** https://frontend-[PROJECT-ID]-[RANDOM].railway.app
**Database URL Format:** postgresql://user:password@host:port/database
