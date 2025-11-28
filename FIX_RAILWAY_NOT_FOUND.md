# 🔧 Fix "Not Found" Error on Railway Backend

## Problem
When visiting your Railway backend URL, you see "Not Found" or 404 error.

## ✅ Solution: Use the Correct API Endpoints

### ❌ Don't Visit the Root URL
```
https://your-backend.up.railway.app/
```
This will show "Not Found" because there's no route at `/`

### ✅ Visit the API Endpoints Instead

1. **Health Check** (Test this first):
   ```
   https://your-backend.up.railway.app/api/health
   ```
   Should return: `{"status":"ok"}`

2. **Courses Endpoint**:
   ```
   https://your-backend.up.railway.app/api/courses
   ```
   Should return: Array of courses or `[]`

3. **Auth Endpoints**:
   ```
   POST https://your-backend.up.railway.app/api/auth/register
   POST https://your-backend.up.railway.app/api/auth/login
   ```

## 🔍 Verify Your Railway Setup

### Step 1: Check Railway Domain

1. Go to Railway dashboard
2. Click on your service
3. Go to **"Settings"** tab
4. Scroll to **"Networking"** section
5. Verify you have a **"Public Domain"** set
6. If not, click **"Generate Domain"**

### Step 2: Check Service is Running

1. Go to Railway dashboard
2. Click on your service
3. Go to **"Deployments"** tab
4. Check the latest deployment:
   - Should show "Active" status
   - Should show "MongoDB connected" in logs
   - Should show "Server running on port..."

### Step 3: Test the Health Endpoint

Open your browser and visit:
```
https://your-railway-domain.up.railway.app/api/health
```

**Expected Result:**
```json
{"status":"ok"}
```

If you see this, your backend is working! ✅

## 🐛 Common Issues

### Issue 1: Visiting Root URL

**Problem**: Visiting `https://your-backend.up.railway.app/` shows "Not Found"

**Solution**: This is normal! Visit `/api/health` instead

### Issue 2: Domain Not Generated

**Problem**: No public domain in Railway settings

**Solution**: 
1. Railway dashboard → Your service → Settings
2. Networking section → Click "Generate Domain"
3. Wait for domain to be created
4. Test the new domain

### Issue 3: Service Not Deployed

**Problem**: Service shows as "Building" or "Failed"

**Solution**:
1. Check deployment logs for errors
2. Verify environment variables are set
3. Check MongoDB connection
4. Redeploy if needed

### Issue 4: Wrong URL Format

**Problem**: Using wrong URL format

**Correct Format:**
```
https://your-service-name.up.railway.app/api/health
```

**Wrong Formats:**
```
http://your-service-name.up.railway.app/api/health  ❌ (missing 's' in https)
https://your-service-name.railway.app/api/health   ❌ (missing '.up.')
```

## 🧪 Complete Test Checklist

Test these endpoints in order:

1. ✅ **Health Check**
   ```
   GET https://your-backend.up.railway.app/api/health
   ```
   Expected: `{"status":"ok"}`

2. ✅ **Courses List**
   ```
   GET https://your-backend.up.railway.app/api/courses
   ```
   Expected: `[]` or array of courses

3. ✅ **Test with Frontend**
   - Add `VITE_API_URL` to Vercel
   - Deploy frontend
   - Test from frontend

## 🔧 Quick Fix Steps

1. **Get your Railway URL**:
   - Railway → Service → Settings → Networking
   - Copy the public domain

2. **Test health endpoint**:
   - Visit: `https://your-domain.up.railway.app/api/health`
   - Should return: `{"status":"ok"}`

3. **If still not working**:
   - Check Railway logs for errors
   - Verify MongoDB connection
   - Check environment variables
   - Redeploy service

## 📝 Adding a Root Route (Optional)

If you want a root route for testing, you can add this to `backend/server.js`:

```javascript
// Add this before the error handlers
app.get('/', (req, res) => {
  res.json({ 
    message: 'Academy Backend API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      courses: '/api/courses',
      auth: '/api/auth',
      blog: '/api/blog'
    }
  });
});
```

But this is **optional** - your API works fine without it!

## ✅ Success Indicators

Your backend is working correctly when:

- ✅ `/api/health` returns `{"status":"ok"}`
- ✅ `/api/courses` returns data (or empty array)
- ✅ Railway logs show "MongoDB connected"
- ✅ Railway logs show "Server running on port..."

---

## 🎯 Remember

- **Root URL (`/`)** = Not Found (this is normal!)
- **API Endpoints (`/api/*`)** = Working! ✅

Always test with `/api/health` first!

