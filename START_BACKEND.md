# ⚡ Quick Start: Backend Server

## 🚀 Start Backend Now (3 Steps)

### Step 1: Open New Terminal
Open a **NEW terminal window** (keep your frontend terminal running)

### Step 2: Navigate to Backend
```bash
cd backend
```

### Step 3: Start Server
```bash
npm run dev
```

### ✅ You Should See:
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
🔗 Health check: http://localhost:5000/health
🌐 API Base URL: http://localhost:5000/api
```

### Step 4: Update Frontend Environment

Create/update `.env.local` in the **root directory**:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Step 5: Restart Frontend

Go back to your frontend terminal and restart:
```bash
# Press Ctrl+C to stop
npm run dev
```

### Step 6: Test Upload

Now try uploading images - it should work! 🎉

---

## 🔍 Verify Backend is Running

Open in browser: `http://localhost:5000/health`

Should show:
```json
{
  "status": "ok",
  "message": "LoveMeet Backend API is running"
}
```

---

## ❌ If You See Errors

### Error: "Port 5000 already in use"
**Fix:** Kill the process using port 5000:
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Error: "MongoDB connection failed"
**Fix:** Check your MongoDB URI in `backend/.env`

### Error: "Cannot find module"
**Fix:** Install dependencies:
```bash
cd backend
npm install
```

---

## 🎯 You're All Set!

Keep both terminals running:
- **Terminal 1:** Frontend (`npm run dev`)
- **Terminal 2:** Backend (`cd backend && npm run dev`)

Now upload images and it will work! 🚀

