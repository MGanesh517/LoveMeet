# ⚡ Quick Start Checklist

## Before You Start
- [ ] Code is ready in your project
- [ ] GitHub account ready
- [ ] Firebase project ready
- [ ] MongoDB Atlas account ready

---

## 🎯 5-Minute Quick Steps

### 1️⃣ Push to GitHub (2 min)
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### 2️⃣ Get Firebase Key (1 min)
- Firebase Console → Project Settings → Service Accounts
- Generate New Private Key → Download JSON

### 3️⃣ Create Render Service (1 min)
- Render Dashboard → New → Web Service
- Connect GitHub → Select repo
- Root Directory: `backend`
- Click Create

### 4️⃣ Add Environment Variables (1 min)
Copy-paste from `RENDER_SETUP.md`:
- MongoDB URI ✅ (you have it)
- MongoDB DB ✅ (`myGameDB`)
- Firebase credentials (from JSON)
- Admin Token ✅ (you have it)

### 5️⃣ Deploy (1 min)
- Click "Deploy latest commit"
- Wait 3-5 minutes
- Get your URL!

---

## ✅ That's It!

Your backend URL: `https://lovemeet-backend.onrender.com`

Update frontend `.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=https://lovemeet-backend.onrender.com
```

**Done! 🎉**

---

## 📖 Detailed Steps
See `STEP_BY_STEP_GUIDE.md` for complete instructions.

