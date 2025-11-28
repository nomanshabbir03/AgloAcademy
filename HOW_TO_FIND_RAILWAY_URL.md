# 🔍 How to Find Your Railway Backend URL

## Step-by-Step Guide

### After Deploying to Railway:

1. **Go to Railway Dashboard**
   - Visit https://railway.app
   - Log in to your account

2. **Select Your Project**
   - Click on the project you just created
   - You'll see your service listed

3. **Get the URL - Method 1 (Settings)**
   - Click on your service (the backend service)
   - Click on the **"Settings"** tab (top menu)
   - Scroll down to **"Networking"** section
   - You'll see **"Public Domain"** or **"Generate Domain"** button
   - If you see "Generate Domain", click it
   - Your URL will be displayed, e.g., `https://your-service-name.up.railway.app`

4. **Get the URL - Method 2 (Deployments)**
   - Click on your service
   - Look at the **"Deployments"** tab
   - After successful deployment, you'll see a URL in the deployment logs
   - Or check the **"Settings"** → **"Networking"** section

5. **Copy the URL**
   - The URL format is: `https://[service-name].up.railway.app`
   - Copy this entire URL (including `https://`)

## Visual Guide

```
Railway Dashboard
  └── Your Project
      └── Your Service (backend)
          ├── Settings Tab
          │   └── Networking Section
          │       └── Public Domain: https://xxx.up.railway.app
          │
          └── Deployments Tab
              └── (Shows URL after deployment)
```

## Example URL Format

Your Railway backend URL will look like:
```
https://academy-backend-production.up.railway.app
```
or
```
https://web-production-xxxx.up.railway.app
```

## What to Do With This URL

1. **For Vercel Frontend**:
   - Add environment variable: `VITE_API_URL=https://your-backend.up.railway.app`

2. **For Railway Backend**:
   - Add environment variable: `FRONTEND_URL=https://your-frontend.vercel.app`
   - (After you get your Vercel URL)

## Testing the URL

Once you have the URL, test it:
- Visit: `https://your-backend.up.railway.app/api/health`
- You should see: `{"status":"ok"}`

If you see this, your backend is working! ✅

## Troubleshooting

**Can't find the URL?**
- Make sure deployment completed successfully (green checkmark)
- Check the "Deployments" tab for any errors
- Try clicking "Generate Domain" in Settings → Networking

**URL not working?**
- Wait a few minutes after deployment (Railway needs time to provision)
- Check deployment logs for errors
- Verify environment variables are set correctly

---

**Need help?** Check Railway docs: https://docs.railway.app/reference/public-networking

