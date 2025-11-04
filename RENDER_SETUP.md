# 🚀 Render Deployment Setup (No Local Backend Needed!)

## ✅ Current Setup

The code is now configured to work with **Render backend URL directly** - no local backend needed!

### Default Backend URL
The app will use: `https://lovemeet-backend.onrender.com` by default

## 📋 Step 1: Deploy Backend to Render

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Add backend API for Render deployment"
git push origin main
```

### 2. Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** > **"Web Service"**
3. Connect GitHub and select your repository

### 3. Configure Settings

- **Name**: `lovemeet-backend`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free

### 4. Add Environment Variables

Add these in Render Dashboard:

```
MONGODB_URI=mongodb+srv://Ganesh517:Ganesh517@cluster0.8vjddhu.mongodb.net/myGameDB?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB=myGameDB
NODE_ENV=production
PORT=10000
FIREBASE_PROJECT_ID=lovemeet-1200b
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@lovemeet-1200b.iam.gserviceaccount.com
ADMIN_TOKEN=9f7c0e3a54a28f0c734b03e6d55aaf9dcb52f6e86fa9d4f2336a84a9ec3f401b
FRONTEND_URL=https://your-frontend-url.com
```

### 5. Get Firebase Admin SDK

1. Firebase Console > Project Settings > Service Accounts
2. Generate New Private Key
3. Copy `private_key` → `FIREBASE_PRIVATE_KEY`
4. Copy `client_email` → `FIREBASE_CLIENT_EMAIL`

### 6. Deploy

Click **"Create Web Service"** and wait for deployment (5-10 minutes)

**Your backend URL will be:** `https://lovemeet-backend.onrender.com`

---

## 📋 Step 2: Update Frontend

### Option A: Use Default (Already Set)
The code already uses Render URL by default - no changes needed!

### Option B: Custom Environment Variable

Create `.env.local` in root directory:
```env
NEXT_PUBLIC_BACKEND_URL=https://lovemeet-backend.onrender.com
```

**Replace with your actual Render URL!**

---

## ✅ MongoDB Connection Check

The backend will automatically check MongoDB connection on startup:

**If connected:**
```
✅ MongoDB Connected Successfully
```

**If not connected:**
- Check MongoDB URI in Render environment variables
- Check MongoDB Atlas Network Access (allow all IPs)
- Check database user permissions

---

## 🧪 Test After Deployment

### 1. Test Backend Health
Open: `https://lovemeet-backend.onrender.com/health`

Should show:
```json
{"status":"ok","message":"LoveMeet Backend API is running"}
```

### 2. Test Image Upload
- Go to profile setup
- Upload images
- Should work with Render backend!

---

## ⚠️ Important Notes

### Render Free Tier
- **Cold starts:** First request after 15 min inactivity takes 30-60 seconds
- **Timeout:** 60 seconds for requests
- **Solution:** Code already has 60-second timeout

### If Upload is Slow
- First request after cold start will be slow
- Subsequent requests will be faster
- Consider upgrading to paid tier for better performance

### MongoDB Connection
- Backend checks connection on startup
- If MongoDB fails, backend won't start
- Check Render logs for MongoDB errors

---

## 🔍 Troubleshooting

### Backend Not Starting
1. Check Render logs
2. Verify MongoDB connection
3. Check environment variables

### Image Upload Fails
1. Check backend URL in frontend
2. Check Render service is running
3. Check Firebase Admin SDK credentials

### MongoDB Connection Failed
1. Verify MongoDB URI in Render
2. Check MongoDB Atlas Network Access
3. Verify database name and credentials

---

## ✅ Current Status

- ✅ Code configured for Render deployment
- ✅ Default backend URL set to Render
- ✅ No local backend needed
- ✅ MongoDB connection check included
- ✅ Ready to deploy!

**Just deploy to Render and you're done!** 🚀

