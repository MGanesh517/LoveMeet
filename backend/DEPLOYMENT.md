# 🚀 Render Deployment Guide

## Step 1: Prepare Your Repository

1. **Commit all backend files to GitHub:**
   ```bash
   git add backend/
   git commit -m "Add backend API"
   git push origin main
   ```

## Step 2: Deploy to Render

### Option A: Using Render Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** > **"Web Service"**
3. Connect your GitHub account (if not already connected)
4. Select your repository
5. Fill in the settings:

   **Basic Settings:**
   - **Name**: `lovemeet-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or upgrade for better performance)

6. **Add Environment Variables:**
   Click "Environment" tab and add:

   ```
   MONGODB_URI=mongodb+srv://Ganesh517:Ganesh517@cluster0.8vjddhu.mongodb.net/myGameDB?retryWrites=true&w=majority&appName=Cluster0
   MONGODB_DB=myGameDB
   NODE_ENV=production
   PORT=10000
   FIREBASE_PROJECT_ID=lovemeet-1200b
   FIREBASE_PRIVATE_KEY=your_private_key_here
   FIREBASE_CLIENT_EMAIL=your_client_email_here
   ADMIN_TOKEN=9f7c0e3a54a28f0c734b03e6d55aaf9dcb52f6e86fa9d4f2336a84a9ec3f401b
   FRONTEND_URL=https://your-frontend-url.com
   ```

7. Click **"Create Web Service"**
8. Wait for build to complete (usually 2-5 minutes)

### Option B: Using render.yaml (Auto-deploy)

If you added `render.yaml`, Render will automatically detect it:

1. Go to Render Dashboard
2. Click **"New"** > **"Blueprint"**
3. Connect repository
4. Render will read `render.yaml` and configure automatically
5. Add environment variables manually in dashboard

## Step 3: Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select project: **LoveMeet**
3. Go to **Project Settings** > **Service Accounts**
4. Click **"Generate New Private Key"**
5. Download the JSON file
6. Extract values:
   - `private_key` → `FIREBASE_PRIVATE_KEY`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `project_id` → Already set (`lovemeet-1200b`)

**Important:** When adding `FIREBASE_PRIVATE_KEY` to Render:
- Keep the `\n` characters in the private key
- The entire key should be in quotes
- Example: `"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0...\n-----END PRIVATE KEY-----\n"`

## Step 4: Update Frontend

Add to your frontend `.env.local`:

```env
NEXT_PUBLIC_BACKEND_URL=https://lovemeet-backend.onrender.com
```

Replace with your actual Render backend URL.

## Step 5: Test Deployment

1. **Check Health Endpoint:**
   ```
   https://your-backend-url.onrender.com/health
   ```

2. **Test API:**
   ```bash
   curl https://your-backend-url.onrender.com/api/users
   ```

3. **Test from Frontend:**
   - Sign up a user
   - Complete profile
   - Check MongoDB for saved data

## ✅ Your Backend URL

After deployment, your backend will be available at:
```
https://lovemeet-backend.onrender.com
```

Update frontend `.env.local` with this URL!

## 🔍 Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript compiles: `npm run build`

### MongoDB Connection Fails
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas Network Access (allow all IPs or add Render IPs)
- Verify database user has correct permissions

### Images Not Uploading
- Check Firebase Admin SDK credentials
- Verify `FIREBASE_PRIVATE_KEY` includes `\n` characters
- Check Firebase Storage rules allow uploads

### CORS Errors
- Set `FRONTEND_URL` in backend environment variables
- Update CORS origin in `src/server.ts` if needed

## 📝 Quick Checklist

- [ ] Backend code pushed to GitHub
- [ ] Render service created
- [ ] Environment variables added
- [ ] Firebase Admin SDK credentials configured
- [ ] Build successful
- [ ] Health endpoint working
- [ ] Frontend updated with backend URL
- [ ] Test sign up and profile creation

---

**Your backend is now ready for production! 🎉**

