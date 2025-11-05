# 🚨 CRITICAL: Render Root Directory Fix

## The Problem

Render is **STILL building from root** instead of `backend` folder!

**Evidence:**
```
> dating-web@0.1.0 build
> next build
```

This means it's building Next.js, not the backend!

---

## ✅ The Solution - MUST DO THIS!

### Option 1: Delete and Re-create Service (RECOMMENDED)

1. **Delete current service** in Render
2. **Create NEW Web Service**
3. **Connect GitHub** → Select repository
4. **IMPORTANT:** In the form, look for **"Root Directory"** field
5. **Type:** `backend` (exactly, no slash, no quotes)
6. **Build Command:** `npm install && npm run build`
7. **Start Command:** `npm start`
8. **Click Create**

### Option 2: Update Existing Service

1. Go to Render Dashboard → Your Service
2. Click **"Settings"** tab
3. Scroll to **"Root Directory"** field
4. **Change from:** `/` or empty
5. **Change to:** `backend`
6. **Save Changes**
7. **Re-deploy**

---

## 🔍 How to Verify Root Directory

**In Render Dashboard:**

1. Go to your service
2. Click **"Settings"** tab  
3. Scroll down to **"Build & Deploy"** section
4. Look for **"Root Directory"**
5. **Must say:** `backend`

**If it says:**
- `/` ❌ WRONG
- Empty ❌ WRONG  
- `backend` ✅ CORRECT

---

## 📋 Complete Render Settings

**Service Settings:**
- Name: `lovemeet-backend`
- Environment: `Node`
- Region: `Oregon` (or your preference)
- Branch: `main`
- **Root Directory:** `backend` ⚠️ **CRITICAL!**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- Plan: `Free`

---

## ✅ Environment Variables

Add these with **LoveMeet** database:

```
MONGODB_URI=mongodb+srv://Ganesh517:Ganesh517@cluster0.8vjddhu.mongodb.net/LoveMeet?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB=LoveMeet
NODE_ENV=production
PORT=10000
FIREBASE_PROJECT_ID=lovemeet-1200b
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[your key]\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@lovemeet-1200b.iam.gserviceaccount.com
ADMIN_TOKEN=9f7c0e3a54a28f0c734b03e6d55aaf9dcb52f6e86fa9d4f2336a84a9ec3f401b
FRONTEND_URL=https://your-frontend-url.com
```

---

## ✅ Expected Build Output (When Correct)

```
==> Root Directory: backend
==> Running build command 'npm install && npm run build'...
added 265 packages...
> lovemeet-backend@1.0.0 build
> tsc
✅ Build successful!
```

**NOT:**
```
> dating-web@0.1.0 build
> next build
```

---

## 🎯 Action Steps RIGHT NOW

1. **Open Render Dashboard**
2. **Check Root Directory** = `backend`
3. **If wrong:** Delete service and create new one with Root Directory = `backend`
4. **Add all environment variables**
5. **Deploy**

---

## ⚠️ Why This Keeps Happening

Render might be:
- Ignoring the Root Directory setting
- Using default (root folder)
- Not detecting the `render.yaml` file

**Solution:** Manually set Root Directory in the UI!

---

**The Root Directory MUST be `backend` for this to work!** 🎯

