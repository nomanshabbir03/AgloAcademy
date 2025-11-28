# 🔧 Fix CORS Error - Trailing Slash Issue

## Problem

```
Access to XMLHttpRequest at 'https://agloacademy-production.up.railway.app//api/courses' 
from origin 'https://aglo-academy.vercel.app' has been blocked by CORS policy: 
The 'Access-Control-Allow-Origin' header has a value 'https://aglo-academy.vercel.app/' 
that is not equal to the supplied origin.
```

## Root Causes

1. **Trailing Slash Mismatch**: Railway `FRONTEND_URL` has trailing slash (`/`), but browser sends origin without it
2. **Double Slash in URL**: `//api/courses` suggests base URL has trailing slash

## ✅ Solution Applied

### 1. Backend CORS Fix
Updated `backend/server.js` to handle trailing slashes:
- Normalizes both the configured URL and incoming origin
- Removes trailing slashes before comparison
- Allows requests from both formats

### 2. Frontend API Client Fix
Updated `src/api/client.js` to:
- Remove trailing slash from `VITE_API_URL`
- Prevents double slashes in API calls

## 🔧 Manual Fix Steps

### Step 1: Update Railway Environment Variable

1. Go to Railway dashboard
2. Your service → "Variables" tab
3. Find `FRONTEND_URL`
4. **Remove trailing slash** if present:
   - ❌ Wrong: `https://aglo-academy.vercel.app/`
   - ✅ Correct: `https://aglo-academy.vercel.app`
5. Save (Railway will auto-redeploy)

### Step 2: Update Vercel Environment Variable

1. Go to Vercel dashboard
2. Your project → Settings → Environment Variables
3. Find `VITE_API_URL`
4. **Remove trailing slash** if present:
   - ❌ Wrong: `https://agloacademy-production.up.railway.app/`
   - ✅ Correct: `https://agloacademy-production.up.railway.app`
5. Redeploy frontend

### Step 3: Verify

After both services redeploy:
1. Clear browser cache
2. Refresh your frontend
3. Check browser console - CORS errors should be gone

## ✅ Correct Configuration

### Railway (Backend)
```
FRONTEND_URL=https://aglo-academy.vercel.app
```
(No trailing slash)

### Vercel (Frontend)
```
VITE_API_URL=https://agloacademy-production.up.railway.app
```
(No trailing slash)

## 🧪 Test

After fixes:
1. Open browser console
2. Visit your frontend
3. Should see API calls working
4. No CORS errors

## 📝 Code Changes

The code now automatically handles trailing slashes, but it's still best practice to:
- Remove trailing slashes from environment variables
- Keep URLs consistent

---

**After pushing the code changes and updating environment variables, the CORS error will be fixed!**

