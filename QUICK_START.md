# ⚡ Quick Start - Vercel + Railway Deployment

## 🚀 5-Minute Deployment

### 1. MongoDB Atlas Setup
- Create account at https://mongodb.com/cloud/atlas
- Create free cluster
- Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/academy_db`

### 2. Railway Backend (2 min)
1. Go to https://railway.app → New Project → GitHub
2. Select repo → Set root directory: `backend`
3. Add variables:
   - `MONGO_URI` = your Atlas connection string
   - `JWT_SECRET` = random 32+ char string
   - `FRONTEND_URL` = (update after Vercel deploy)
   - `NODE_ENV` = production
4. **Get backend URL:**
   - Wait for deployment to finish
   - Click service → Settings → Networking
   - Click "Generate Domain"
   - Copy URL: `https://xxx.up.railway.app`

### 3. Vercel Frontend (2 min)
1. Go to https://vercel.com → Add Project → GitHub
2. Select repo
3. Add variable: `VITE_API_URL` = your Railway backend URL
4. Deploy → Copy frontend URL

### 4. Update CORS (1 min)
- Go back to Railway
- Update `FRONTEND_URL` = your Vercel frontend URL
- Railway auto-redeploys

## ✅ Done!

**Frontend**: `https://your-project.vercel.app`  
**Backend**: `https://your-backend.up.railway.app`

---

## 🔑 Required Environment Variables

### Railway (Backend)
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-32-chars-min
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend.up.railway.app
```

---

## 🐛 Quick Fixes

**CORS Error?** → Check `FRONTEND_URL` matches Vercel domain exactly

**DB Connection Failed?** → Check MongoDB Atlas IP whitelist (use `0.0.0.0/0` for dev)

**Build Failed?** → Check logs in Railway/Vercel dashboard

---

**Full guide**: See `DEPLOYMENT.md`

