# 🔧 Fix MongoDB Connection Error on Railway

## Error Message
```
MongoDB connection error: Could not connect to any servers in your MongoDB Atlas cluster. 
One common reason is that you're trying to access the database from an IP that isn't whitelisted.
```

## ✅ Solution: Whitelist Railway IP Addresses

### Option 1: Allow All IPs (Easiest - For Development/Testing)

**⚠️ Security Note**: This allows connections from anywhere. Use only for development/testing.

1. **Go to MongoDB Atlas**
   - Visit https://cloud.mongodb.com
   - Log in to your account

2. **Navigate to Network Access**
   - Click on your project
   - Click **"Network Access"** in the left sidebar
   - Or go directly: https://cloud.mongodb.com/v2#/security/network/whitelist

3. **Add IP Address**
   - Click **"Add IP Address"** button
   - Click **"Allow Access from Anywhere"** button
   - This adds `0.0.0.0/0` to your whitelist
   - Click **"Confirm"**

4. **Wait 1-2 minutes** for changes to propagate

5. **Redeploy on Railway**
   - Go to Railway dashboard
   - Your service should auto-redeploy, or click "Redeploy"

### Option 2: Whitelist Specific Railway IPs (More Secure)

Railway uses dynamic IPs, so this is harder. Option 1 is recommended for now.

---

## 🔍 Additional Checks

### 1. Verify MONGO_URI Format

In Railway, check your `MONGO_URI` environment variable:

**Correct format:**
```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

**Common issues:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Wrong username/password
- ❌ Missing database name
- ❌ Special characters in password not URL-encoded

**If your password has special characters**, URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- `$` becomes `%24`
- `%` becomes `%25`
- etc.

### 2. Verify Database User

1. Go to MongoDB Atlas
2. Click **"Database Access"** in left sidebar
3. Verify your database user exists
4. Check user has **"Read and write to any database"** permission
5. If needed, create a new user:
   - Click **"Add New Database User"**
   - Choose **"Password"** authentication
   - Set username and password
   - Select **"Atlas Admin"** role (or custom role with read/write access)
   - Click **"Add User"**

### 3. Verify Connection String

1. In MongoDB Atlas, click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **"Node.js"** and version **"5.5 or later"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Replace `<dbname>` with your actual database name
7. Use this exact string in Railway's `MONGO_URI` variable

**Example:**
```
mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

---

## 🧪 Test Connection

### Test 1: Check Railway Logs

1. Go to Railway dashboard
2. Click on your service
3. Go to **"Deployments"** tab
4. Click on the latest deployment
5. Check logs for:
   - ✅ `MongoDB connected` - Success!
   - ❌ `MongoDB connection error` - Still having issues

### Test 2: Test Health Endpoint

After fixing, test your backend:
```
https://your-backend.up.railway.app/api/health
```

Should return: `{"status":"ok"}`

### Test 3: Test Database Connection Locally

Test your connection string locally first:

1. Create a test file `test-db.js`:
```javascript
import mongoose from 'mongoose';

const MONGO_URI = '<your-connection-string-here>';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });
```

2. Run: `node test-db.js`

---

## 🔄 Step-by-Step Fix

### Quick Fix (Recommended)

1. **MongoDB Atlas** → Network Access → Add IP → Allow from Anywhere (`0.0.0.0/0`)
2. **Wait 1-2 minutes**
3. **Railway** → Check if service auto-redeploys, or manually redeploy
4. **Check Railway logs** → Should see "MongoDB connected"
5. **Test**: Visit `https://your-backend.up.railway.app/api/health`

---

## 🐛 Still Not Working?

### Check These:

1. **Password Encoding**
   - If password has special characters, URL-encode them
   - Or create a new user with a simpler password

2. **Database Name**
   - Ensure database name in connection string matches
   - Default: `<database-name>`

3. **Cluster Status**
   - Check if your MongoDB Atlas cluster is running
   - Free tier clusters pause after inactivity

4. **Connection String Format**
   - Must start with `mongodb+srv://`
   - Must include database name
   - Must include query parameters: `?retryWrites=true&w=majority`

5. **Railway Environment Variables**
   - Double-check `MONGO_URI` is set correctly
   - No extra spaces or quotes
   - Case-sensitive

---

## 📝 Example Correct Setup

### MongoDB Atlas:
- Network Access: `0.0.0.0/0` (Allow from anywhere)
- Database User: `<username>` with password `<password>`
- Database Name: `<database-name>`

### Railway Environment Variable:
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

---

## ✅ Success Indicators

You'll know it's working when:

1. Railway logs show: `MongoDB connected`
2. Health endpoint returns: `{"status":"ok"}`
3. No connection errors in Railway logs
4. API endpoints work correctly

---

**Need more help?** Check MongoDB Atlas documentation: https://docs.atlas.mongodb.com/security/ip-access-list/

