# 🔧 Image Upload Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Failed to upload images" Error

**Symptoms:**
- Error when submitting profile with images
- Request shows `multipart/form-data` but fails

**Solutions:**

1. **Check if backend is running:**
   ```bash
   cd backend
   npm run dev
   ```
   Server should start on `http://localhost:5000`

2. **Check backend URL in frontend:**
   - Verify `.env.local` has `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000`
   - Restart frontend dev server after changing env vars

3. **Check CORS:**
   - Backend should allow requests from `http://localhost:3000`
   - Check console for CORS errors

4. **Check Firebase Storage:**
   - Firebase Admin SDK must be configured
   - Add to `backend/.env`:
     ```env
     FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
     FIREBASE_CLIENT_EMAIL=firebase-adminsdk@lovemeet-1200b.iam.gserviceaccount.com
     ```

### Issue 2: Multer Errors

**Error: "File too large"**
- Maximum file size: 5MB per file
- Check image file sizes before upload

**Error: "Too many files"**
- Maximum: 6 files
- Reduce number of images

**Error: "Only image files are allowed"**
- Ensure files are actual images (jpg, png, webp, etc.)
- Check file extensions

### Issue 3: Network Errors

**Error: "Network request failed"**
- Backend server not running
- Wrong backend URL
- Firewall blocking connection

**Solution:**
```bash
# Start backend
cd backend
npm run dev

# Check health endpoint
curl http://localhost:5000/health
```

### Issue 4: MongoDB Connection Issues

**Error: "Failed to save profile"**
- Check MongoDB connection string
- Verify MongoDB Atlas network access allows your IP
- Check `.env` file has correct `MONGODB_URI`

### Issue 5: Firebase Storage Not Initialized

**Error: "Firebase Storage not initialized"**
- Firebase Admin SDK credentials missing
- Add credentials to `backend/.env`
- Restart backend server

## 🧪 Testing Upload Endpoint

### Test with cURL:
```bash
curl -X POST http://localhost:5000/api/upload/images \
  -F "userId=test123" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### Test with Postman:
1. POST to `http://localhost:5000/api/upload/images`
2. Body type: `form-data`
3. Add field: `userId` (text) = `test123`
4. Add field: `images` (file) - select multiple images
5. Send request

## ✅ Verification Checklist

- [ ] Backend server running on port 5000
- [ ] Frontend can reach backend (`/health` endpoint works)
- [ ] MongoDB connection successful
- [ ] Firebase Admin SDK configured
- [ ] Environment variables set correctly
- [ ] Images are valid (not corrupted)
- [ ] Image file sizes < 5MB
- [ ] Number of images ≤ 6

## 📝 Debug Logging

The backend now includes detailed logging:
- Upload request received
- Number of files
- User ID
- Upload success/failure
- Error details

Check backend console for detailed logs when uploading.

## 🔍 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `userId is required` | userId not sent in form data | Ensure `formData.append('userId', user.uid)` |
| `No images provided` | Files not attached | Check file upload in frontend |
| `Firebase Storage not initialized` | Missing Firebase credentials | Add to `.env` |
| `File too large` | Image > 5MB | Compress or resize image |
| `CORS error` | Backend not allowing frontend origin | Check CORS config |

## 🚀 Quick Fix

If uploads still fail, try:

1. **Restart both servers:**
   ```bash
   # Stop all servers
   # Restart backend
   cd backend && npm run dev
   
   # Restart frontend (in another terminal)
   npm run dev
   ```

2. **Clear browser cache and try again**

3. **Check browser console for detailed errors**

4. **Check backend console for server-side errors**

