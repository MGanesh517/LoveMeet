# 🚨 URGENT: Start Backend Server

## The Problem
Backend server is **NOT running** on port 5000!

## ✅ Solution: Start Backend NOW

### Option 1: Use the Script (Easiest)

**Double-click one of these files:**
- `START_BACKEND_SERVER.bat` (Windows)
- Or run in PowerShell: `.\START_BACKEND_SERVER.ps1`

### Option 2: Manual Start

**Open a NEW terminal window** and run:

```bash
cd backend
npm run dev
```

### ✅ You Should See:
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
🔗 Health check: http://localhost:5000/health
🌐 API Base URL: http://localhost:5000/api
```

### ⚠️ Keep This Terminal Open!
Don't close the terminal - the backend needs to keep running!

---

## Step 2: Verify It's Running

Open in browser: `http://localhost:5000/health`

Should show:
```json
{"status":"ok","message":"LoveMeet Backend API is running"}
```

---

## Step 3: Update Frontend

Create/update `.env.local` in **root directory**:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## Step 4: Restart Frontend

In your **frontend terminal**, restart:
```bash
# Press Ctrl+C
npm run dev
```

---

## Step 5: Try Upload Again

Now upload images - it should work! 🎉

---

## ❌ Still Not Working?

### Check if backend is running:
```bash
# PowerShell
Test-NetConnection -ComputerName localhost -Port 5000
```

### Check backend terminal for errors:
- MongoDB connection issues?
- Missing dependencies?
- Port 5000 already in use?

### Kill process on port 5000:
```bash
# Find process
netstat -ano | findstr :5000

# Kill it (replace PID with actual number)
taskkill /PID <PID_NUMBER> /F
```

---

## 🎯 You Need TWO Terminals Running:

1. **Terminal 1:** Frontend (`npm run dev`)
2. **Terminal 2:** Backend (`cd backend && npm run dev`)

**Both must be running at the same time!**

---

## Quick Checklist:

- [ ] Backend terminal shows "Server running on port 5000"
- [ ] `http://localhost:5000/health` works in browser
- [ ] `.env.local` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`
- [ ] Frontend restarted after adding env variable
- [ ] Both terminals are running

Now try uploading! 🚀

