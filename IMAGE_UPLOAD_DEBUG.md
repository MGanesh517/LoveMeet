# 🐛 Image Upload Debug Guide

## Current Issue
The fetch call is "fulfilled" but images aren't uploading properly.

## Debugging Steps

### 1. Check Backend Server
```bash
cd backend
npm run dev
```

**Expected output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

### 2. Check Frontend Environment
Verify `.env.local` exists in root directory:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

**Important:** Restart frontend after changing `.env.local`:
```bash
npm run dev
```

### 3. Test Backend Health
Open in browser: `http://localhost:5000/health`

**Expected response:**
```json
{
  "status": "ok",
  "message": "LoveMeet Backend API is running"
}
```

### 4. Check Browser Console
Open browser DevTools (F12) and check:
- Network tab for failed requests
- Console tab for errors
- Look for these logs:
  - `Uploading images to: http://localhost:5000/api/upload/images`
  - `Upload response status: 200`
  - `Upload success: {...}`

### 5. Check Backend Console
When uploading, backend should show:
```
Upload request received: { body: { userId: '...' }, filesCount: X }
Uploading X images for user: ...
Successfully uploaded X images
```

## Common Issues

### Issue: "Network request failed"
**Cause:** Backend not running
**Fix:** Start backend server

### Issue: "CORS error"
**Cause:** Backend not allowing frontend origin
**Fix:** Check CORS config in `backend/src/server.ts`

### Issue: "Firebase Storage not initialized"
**Cause:** Missing Firebase Admin SDK credentials
**Fix:** Add to `backend/.env`:
```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@lovemeet-1200b.iam.gserviceaccount.com
```

### Issue: "userId is required"
**Cause:** User not authenticated
**Fix:** Check if user is logged in, refresh auth state

### Issue: "No images provided"
**Cause:** Files not attached to FormData
**Fix:** Check browser console, verify files are selected

## Testing with cURL

Test the upload endpoint directly:
```bash
curl -X POST http://localhost:5000/api/upload/images \
  -F "userId=test123" \
  -F "images=@/path/to/image.jpg"
```

**Expected response:**
```json
{
  "message": "Images uploaded successfully",
  "imageUrls": ["https://..."],
  "count": 1
}
```

## Quick Fix Checklist

- [ ] Backend running on port 5000
- [ ] Frontend `.env.local` has `NEXT_PUBLIC_BACKEND_URL`
- [ ] Frontend restarted after env change
- [ ] Backend health endpoint works
- [ ] User is authenticated (check AuthContext)
- [ ] Images are valid files (not corrupted)
- [ ] Image sizes < 5MB
- [ ] Number of images ≤ 6
- [ ] Browser console shows upload logs
- [ ] Backend console shows upload logs

## Next Steps

1. Check browser console for detailed error messages
2. Check backend console for server-side errors
3. Verify both servers are running
4. Test with a single small image first
5. Check network tab in browser DevTools

