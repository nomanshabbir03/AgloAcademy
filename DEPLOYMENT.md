# 🚀 Deployment Guide - Vercel + Railway

## Deployment Architecture

```
Frontend (Vercel) → Backend (Railway) → MongoDB Atlas
```

---

## 📋 Prerequisites

- GitHub account
- MongoDB Atlas account (free tier)
- Vercel account (free)
- Railway account (free)

---

## 🗄️ Step 1: Set Up MongoDB Atlas (5 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster (M0 Sandbox)
3. Create a database user (save username/password)
4. Whitelist IP: `0.0.0.0/0` (for development) or specific IPs for production
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/academy_db?retryWrites=true&w=majority`

---

## 🚂 Step 2: Deploy Backend to Railway (10 minutes)

### 2.1 Connect Repository

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository

### 2.2 Configure Service

1. Railway will auto-detect it's a Node.js project
2. Click on the service → "Settings"
3. Set **Root Directory** to: `backend`
4. Railway will auto-detect:
   - Build Command: `npm install`
   - Start Command: `npm start`

### 2.3 Add Environment Variables

Go to "Variables" tab and add:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/academy_db?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
LOG_LEVEL=combined
PORT=3000
```

**Note**: Railway automatically provides `PORT`, but you can set it explicitly.

**Optional Email Variables**:
```env
RESEND_API_KEY=re_your_resend_api_key
ADMIN_EMAIL=admin@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com
SEND_CONFIRMATION_EMAIL=true
```

### 2.4 Deploy

1. Railway will automatically deploy
2. Wait for deployment to complete (2-3 minutes)
3. Click "Settings" → "Generate Domain" to get your backend URL
4. Copy the URL: `https://your-backend.up.railway.app`

---

## ▲ Step 3: Deploy Frontend to Vercel (5 minutes)

### 3.1 Connect Repository

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository

### 3.2 Configure Project

Vercel will auto-detect Vite, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `.` (root)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3.3 Add Environment Variable

Go to "Settings" → "Environment Variables" and add:

```env
VITE_API_URL=https://your-backend.up.railway.app
```

(Use the Railway backend URL from Step 2)

### 3.4 Deploy

1. Click "Deploy"
2. Wait for deployment (1-2 minutes)
3. Copy your frontend URL: `https://your-project.vercel.app`

---

## 🔄 Step 4: Update Backend CORS (2 minutes)

1. Go back to Railway dashboard
2. Edit the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
   (Use the Vercel frontend URL from Step 3)

3. Railway will automatically redeploy

---

## ✅ Step 5: Test Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend Health**: Visit `https://your-backend.up.railway.app/api/health`
3. **Test Features**:
   - Register/Login
   - Browse courses
   - Create course (admin)
   - Create blog (admin)

---

## 🔐 Environment Variables Summary

### Railway (Backend)

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
LOG_LEVEL=combined
PORT=3000
```

### Vercel (Frontend)

```env
VITE_API_URL=https://your-backend.up.railway.app
```

---

## 🔄 Continuous Deployment

Both platforms support automatic deployments:

- **Railway**: Deploys on push to main branch
- **Vercel**: Deploys on push to main branch

**Workflow:**
```bash
git add .
git commit -m "Your changes"
git push origin main
# Both services auto-deploy
```

---

## 🐛 Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` in Railway matches Vercel domain exactly
- No trailing slashes
- Check browser console for specific error

### Database Connection Failed
- Verify MongoDB Atlas IP whitelist
- Check connection string format
- Verify database user credentials

### Build Failures
- Check build logs in platform dashboard
- Verify all dependencies in package.json
- Check Node.js version compatibility

### Environment Variables Not Working
- Frontend variables must have `VITE_` prefix
- Restart services after adding variables
- Check variable names (case-sensitive)

---

## 💰 Cost Estimate

### Free Tier (MVP)
- **Vercel**: Free (unlimited deployments)
- **Railway**: $5 free credit/month (enough for small projects)
- **MongoDB Atlas**: Free (512MB storage)
- **Total**: ~$0-5/month

### Paid Tier (Production)
- **Vercel Pro**: $20/month
- **Railway**: Pay-as-you-go (~$5-20/month)
- **MongoDB Atlas**: $9/month (M2 cluster)
- **Total**: ~$34-49/month

---

## 📝 Custom Domains

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS instructions
4. SSL certificate auto-generated

### Railway
1. Go to Service Settings → Networking
2. Add custom domain
3. Configure DNS records
4. SSL certificate auto-generated

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Frontend loads at Vercel URL
- ✅ Backend API responds at Railway URL
- ✅ Database connection works
- ✅ Authentication works
- ✅ Course/blog CRUD operations work
- ✅ No CORS errors in browser console

---

## 🎉 You're Live!

Your application is now deployed:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.up.railway.app`

---

**Need help?** Check the platform documentation:
- Railway: https://docs.railway.app
- Vercel: https://vercel.com/docs

