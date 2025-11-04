# 🚀 Deployment Guide: Local vs Render

## Option 1: Run Locally (For Testing) ✅

### Step 1: Start Backend Server

Open a **new terminal** and run:
```bash
cd backend
npm run dev
```

**Wait for:**
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

### Step 2: Update Frontend `.env.local`

Create/update `.env.local` in the **root directory** (not in backend):
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Step 3: Restart Frontend

Restart your frontend dev server:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Test

Now try uploading images again - it should work!

---

## Option 2: Deploy to Render (For Production) 🌐

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Add backend API"
git push origin main
```

### Step 2: Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** > **"Web Service"**
3. Connect your GitHub account
4. Select your repository

### Step 3: Configure Render

**Settings:**
- **Name**: `lovemeet-backend`
- **Root Directory**: `backend`
- **Environment**: `Node`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (or choose paid)

### Step 4: Add Environment Variables

In Render Dashboard, add these:

```
MONGODB_URI=mongodb+srv://Ganesh517:Ganesh517@cluster0.8vjddhu.mongodb.net/myGameDB?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB=myGameDB
NODE_ENV=production
PORT=10000
FIREBASE_PROJECT_ID=lovemeet-1200b
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
ADMIN_TOKEN=9f7c0e3a54a28f0c734b03e6d55aaf9dcb52f6e86fa9d4f2336a84a9ec3f401b
FRONTEND_URL=https://your-frontend-url.com
```

### Step 5: Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **LoveMeet**
3. Go to **Project Settings** > **Service Accounts**
4. Click **"Generate New Private Key"**
5. Download JSON file
6. Copy `private_key` → `FIREBASE_PRIVATE_KEY`
7. Copy `client_email` → `FIREBASE_CLIENT_EMAIL`

**Important:** When adding `FIREBASE_PRIVATE_KEY` to Render:
- Keep the `\n` characters
- Wrap in quotes: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`

### Step 6: Update Frontend for Production

Update `.env.local` (or create `.env.production`):
```env
NEXT_PUBLIC_BACKEND_URL=https://lovemeet-backend.onrender.com
```

Replace with your actual Render URL.

### Step 7: Deploy Frontend

Deploy your frontend (Vercel, Netlify, etc.) with the updated environment variable.

---

## Quick Decision Guide

### Use Local Development If:
- ✅ Testing/developing features
- ✅ Need to debug quickly
- ✅ Don't need it accessible online
- ✅ Want to test before deploying

### Use Render Deployment If:
- ✅ Want it accessible online
- ✅ Ready for production
- ✅ Need to share with others
- ✅ Want permanent URL

---

## Troubleshooting

### Local: "Cannot connect to backend"
- Check backend is running: `cd backend && npm run dev`
- Check port 5000 is free
- Verify `.env.local` has correct URL

### Render: "Build failed"
- Check build logs in Render dashboard
- Verify all environment variables are set
- Check MongoDB connection string

### Render: "Service crashed"
- Check logs in Render dashboard
- Verify Firebase Admin SDK credentials
- Check MongoDB network access

---

## Current Status

**For Now (Testing):** Use Option 1 - Run locally
**For Production:** Use Option 2 - Deploy to Render

Both options work! Choose based on your needs. 🎯

