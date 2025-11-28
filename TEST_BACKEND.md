# 🧪 How to Test Your Railway Backend

## ✅ Your Backend is Working!

The "Not Found" error when visiting the root URL is **normal** - there was no route there. I've now added a root route that shows API information.

## 🧪 Test Your Backend

### 1. Root URL (Now Works!)
```
https://your-backend.up.railway.app/
```
**Expected**: JSON with API information and available endpoints

### 2. Health Check Endpoint
```
https://your-backend.up.railway.app/api/health
```
**Expected**: `{"status":"ok"}`

### 3. Courses Endpoint
```
https://your-backend.up.railway.app/api/courses
```
**Expected**: `[]` or array of courses

### 4. Blog Endpoint
```
https://your-backend.up.railway.app/api/blog
```
**Expected**: `[]` or array of blog posts

## 🔍 How to Test

### In Browser:
1. Copy your Railway backend URL
2. Add `/api/health` at the end
3. Press Enter
4. You should see: `{"status":"ok"}`

### Example:
```
https://academy-backend-production.up.railway.app/api/health
```

## ✅ Success Checklist

Your backend is working when:

- ✅ Root URL (`/`) shows API information
- ✅ `/api/health` returns `{"status":"ok"}`
- ✅ `/api/courses` returns data (or empty array)
- ✅ Railway logs show "MongoDB connected"
- ✅ Railway logs show "Server running on port..."

## 🚀 Next Steps

1. **Test the endpoints** above
2. **Copy your Railway backend URL**
3. **Add to Vercel** as `VITE_API_URL`
4. **Deploy frontend** and test the full app

---

**After you push the updated code, the root URL will show API information instead of "Not Found"!**

