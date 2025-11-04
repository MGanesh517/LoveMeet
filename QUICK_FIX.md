# 🚨 Quick Fix: "Failed to fetch" Error

## Immediate Solution

### Step 1: Start Backend Server
Open a **new terminal** and run:
```bash
cd backend
npm run dev
```

**Wait for this message:**
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

### Step 2: Verify Backend is Running
Open in browser: `http://localhost:5000/health`

Should show:
```json
{"status":"ok","message":"LoveMeet Backend API is running"}
```

### Step 3: Restart Frontend
In your **main terminal**, restart the frontend:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Try Upload Again
- Go to profile setup
- Upload images
- Should work now!

## If Still Not Working

### Check Environment Variable
Make sure `.env.local` in **root directory** has:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Check Port Conflicts
Make sure port 5000 is not used by another app:
```bash
# Windows PowerShell
netstat -ano | findstr :5000
```

### Check Firewall
Temporarily disable firewall or allow Node.js through firewall.

## Common Issues

| Error | Cause | Fix |
|-------|-------|-----|
| Failed to fetch | Backend not running | Start backend server |
| CORS error | Backend not allowing origin | Check CORS config |
| Connection refused | Wrong URL or port | Check `.env.local` |
| Timeout | Backend too slow | Check backend logs |

## Quick Test

Test backend directly:
```bash
curl http://localhost:5000/health
```

Should return JSON with status "ok".

---

**Most likely issue:** Backend server is not running. Start it first!

