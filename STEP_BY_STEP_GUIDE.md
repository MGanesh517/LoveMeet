# 🚀 Step-by-Step Deployment Guide

Follow these steps in order to deploy your backend to Render.

---

## 📋 Step 1: Prepare Your Code

### 1.1 Check Git Status
```bash
git status
```

### 1.2 Add All Files
```bash
git add .
```

### 1.3 Commit Changes
```bash
git commit -m "Add backend API and configure for Render deployment"
```

### 1.4 Push to GitHub
```bash
git push origin main
```

**✅ Checkpoint:** Make sure all code is pushed to GitHub!

---

## 📋 Step 2: Get Firebase Admin SDK Credentials

### 2.1 Go to Firebase Console
1. Open: https://console.firebase.google.com
2. Select your project: **LoveMeet**

### 2.2 Go to Service Accounts
1. Click **⚙️ Project Settings** (gear icon)
2. Click **Service Accounts** tab
3. Click **Generate New Private Key**
4. Click **Generate Key** in the popup
5. **Download the JSON file** (save it somewhere safe)

### 2.3 Extract Credentials
Open the downloaded JSON file and copy:
- `private_key` → You'll need this for Render
- `client_email` → You'll need this for Render

**✅ Checkpoint:** You have Firebase Admin SDK credentials ready!

---

## 📋 Step 3: Create Render Account & Service

### 3.1 Create Render Account
1. Go to: https://dashboard.render.com
2. Sign up / Log in with GitHub
3. Connect your GitHub account

### 3.2 Create New Web Service
1. Click **"New"** button (top right)
2. Select **"Web Service"**
3. Click **"Connect GitHub"** (if not connected)
4. Select your repository: **dating-web** (or your repo name)

### 3.3 Configure Service Settings
Fill in these settings:

- **Name**: `lovemeet-backend`
- **Environment**: `Node`
- **Region**: Choose closest to you (e.g., `Oregon`)
- **Branch**: `main` (or `master`)
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: `Free` (or upgrade if needed)

### 3.4 Click "Create Web Service"

**✅ Checkpoint:** Render service is created (not deployed yet)!

---

## 📋 Step 4: Add Environment Variables in Render

### 4.1 Go to Environment Tab
In your Render service dashboard, click **"Environment"** tab

### 4.2 Add Each Variable
Click **"Add Environment Variable"** and add these one by one:

#### Variable 1: MongoDB URI
- **Key**: `MONGODB_URI`
- **Value**: `mongodb+srv://Ganesh517:Ganesh517@cluster0.8vjddhu.mongodb.net/myGameDB?retryWrites=true&w=majority&appName=Cluster0`

#### Variable 2: MongoDB Database
- **Key**: `MONGODB_DB`
- **Value**: `myGameDB`

#### Variable 3: Node Environment
- **Key**: `NODE_ENV`
- **Value**: `production`

#### Variable 4: Port
- **Key**: `PORT`
- **Value**: `10000`

#### Variable 5: Firebase Project ID
- **Key**: `FIREBASE_PROJECT_ID`
- **Value**: `lovemeet-1200b`

#### Variable 6: Firebase Private Key
- **Key**: `FIREBASE_PRIVATE_KEY`
- **Value**: `"-----BEGIN PRIVATE KEY-----\n...your key from JSON file...\n-----END PRIVATE KEY-----\n"`
  - ⚠️ **Important:** Copy the entire `private_key` value from JSON file
  - Keep the `\n` characters
  - Keep the quotes

#### Variable 7: Firebase Client Email
- **Key**: `FIREBASE_CLIENT_EMAIL`
- **Value**: Copy `client_email` from JSON file (e.g., `firebase-adminsdk-xxxxx@lovemeet-1200b.iam.gserviceaccount.com`)

#### Variable 8: Admin Token
- **Key**: `ADMIN_TOKEN`
- **Value**: `9f7c0e3a54a28f0c734b03e6d55aaf9dcb52f6e86fa9d4f2336a84a9ec3f401b`

#### Variable 9: Frontend URL (Optional)
- **Key**: `FRONTEND_URL`
- **Value**: Your frontend URL (e.g., `https://your-frontend.vercel.app`)

**✅ Checkpoint:** All environment variables are added!

---

## 📋 Step 5: Deploy to Render

### 5.1 Start Deployment
1. Go back to **"Settings"** tab
2. Scroll down and click **"Save Changes"** (if needed)
3. Go to **"Events"** tab
4. Click **"Manual Deploy"** > **"Deploy latest commit"**

### 5.2 Wait for Build
- Watch the build logs
- Build will take 3-5 minutes
- Look for: `✅ Build successful`
- Look for: `✅ MongoDB Connected Successfully`

### 5.3 Get Your Backend URL
Once deployed, you'll see:
- **Your URL**: `https://lovemeet-backend.onrender.com`
- (Or your custom name)

**✅ Checkpoint:** Backend is deployed and running!

---

## 📋 Step 6: Test Backend

### 6.1 Test Health Endpoint
Open in browser: `https://lovemeet-backend.onrender.com/health`

Should show:
```json
{
  "status": "ok",
  "message": "LoveMeet Backend API is running"
}
```

### 6.2 Check Logs
In Render dashboard:
- Go to **"Logs"** tab
- Should see: `✅ MongoDB Connected Successfully`
- Should see: `🚀 Server running on port 10000`

**✅ Checkpoint:** Backend is working!

---

## 📋 Step 7: Update Frontend

### 7.1 Create/Update `.env.local`
In your **root directory** (not backend folder), create/update `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=https://lovemeet-backend.onrender.com
```

**Replace with your actual Render URL!**

### 7.2 Restart Frontend
```bash
# Stop current server (Ctrl+C)
npm run dev
```

**✅ Checkpoint:** Frontend is configured!

---

## 📋 Step 8: Test Image Upload

### 8.1 Test Upload
1. Go to your app
2. Sign up / Login
3. Go to Profile Setup
4. Upload images
5. Should work now! 🎉

---

## ✅ Deployment Complete!

Your backend is now live on Render!

---

## 🔍 Troubleshooting

### Build Fails
- Check build logs in Render
- Verify Root Directory is `backend`
- Check all dependencies in `package.json`

### MongoDB Connection Fails
- Check `MONGODB_URI` is correct
- Check MongoDB Atlas Network Access (allow all IPs: `0.0.0.0/0`)
- Verify database user has correct permissions

### Firebase Upload Fails
- Check `FIREBASE_PRIVATE_KEY` has correct format
- Check `FIREBASE_CLIENT_EMAIL` matches JSON file
- Verify Firebase Storage is enabled

### Service Crashes
- Check Render logs
- Verify all environment variables are set
- Check MongoDB connection

---

## 📝 Quick Checklist

Before deploying:
- [ ] Code pushed to GitHub
- [ ] Firebase Admin SDK JSON downloaded
- [ ] Render account created
- [ ] Service configured with Root Directory: `backend`

After deploying:
- [ ] All environment variables added
- [ ] Build successful
- [ ] MongoDB connected
- [ ] Health endpoint works
- [ ] Frontend `.env.local` updated
- [ ] Image upload tested

---

**You're all set! Follow these steps and your backend will be live! 🚀**

