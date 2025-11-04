# MongoDB Setup Guide

## Step 1: Get MongoDB Connection String

You have two options:

### Option A: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a new cluster (free tier available)
4. Go to **Database Access** > **Add New Database User**
   - Create username and password
   - Save credentials securely
5. Go to **Network Access** > **Add IP Address**
   - Click **Allow Access from Anywhere** (for development)
   - Or add your specific IP
6. Go to **Database** > **Connect**
   - Choose **Connect your application**
   - Copy the connection string
   - It looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

### Option B: Local MongoDB
1. Install MongoDB locally
2. Connection string: `mongodb://localhost:27017`

## Step 2: Add to Environment Variables

Add to your `.env.local` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lovemeet?retryWrites=true&w=majority
```

**Replace:**
- `username` - Your MongoDB username
- `password` - Your MongoDB password
- `cluster` - Your cluster name
- `lovemeet` - Database name (you can change this)

## Step 3: Database Structure

The app will automatically create collections:
- `users` - User profiles and data

## Step 4: Test Connection

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Try signing up or completing profile
3. Check MongoDB Atlas or your local database to see data

## ✅ You're Done!

Once MongoDB URI is added to `.env.local`, your app will:
- ✅ Save user data to MongoDB
- ✅ Upload images to Firebase Storage
- ✅ Store image URLs in MongoDB
- ✅ Auto-authenticate users on page reload

