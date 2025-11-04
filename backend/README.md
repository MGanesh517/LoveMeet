# LoveMeet Backend API

Backend API server for LoveMeet dating app, built with Express.js, MongoDB, and Firebase Storage.

## 🚀 Features

- User management (CRUD operations)
- Image upload to Firebase Storage
- MongoDB for data persistence
- RESTful API endpoints
- CORS enabled for frontend integration
- TypeScript for type safety

## 📋 Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account or local MongoDB
- Firebase project with Storage enabled

## 🔧 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
MONGODB_DB=myGameDB
NODE_ENV=development
PORT=5000
FIREBASE_PROJECT_ID=lovemeet-1200b
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@lovemeet-1200b.iam.gserviceaccount.com
ADMIN_TOKEN=your_admin_token_here
FRONTEND_URL=http://localhost:3000
```

### 3. Get Firebase Admin SDK Credentials

1. Go to Firebase Console > Project Settings > Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Extract `private_key`, `client_email`, and `project_id` from the JSON
5. Add to `.env` file

### 4. Run Development Server

```bash
npm run dev
```

Server will start on `http://localhost:5000`

### 5. Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Server health status

### Users
- `GET /api/users` - Get all users (with pagination)
- `GET /api/users/:firebaseUid` - Get user by Firebase UID
- `POST /api/users` - Create or update user
- `PUT /api/users/:firebaseUid` - Update user
- `DELETE /api/users/:firebaseUid` - Delete user

### Upload
- `POST /api/upload/images` - Upload multiple images (max 6)
- `POST /api/upload/image` - Upload single image

## 🚢 Deployment to Render

### Steps:

1. **Push to GitHub**
   - Commit all backend files
   - Push to your GitHub repository

2. **Create Render Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" > "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Settings**
   - **Name**: lovemeet-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid)

4. **Environment Variables**
   Add all variables from `.env`:
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `NODE_ENV=production`
   - `PORT=10000` (Render assigns port, but we use env var)
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_CLIENT_EMAIL`
   - `ADMIN_TOKEN`
   - `FRONTEND_URL` (your frontend URL)

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically

### Render Configuration

The backend will automatically:
- Use the PORT environment variable provided by Render
- Connect to MongoDB using your MONGODB_URI
- Serve API endpoints on the Render URL

## 📝 API Usage Examples

### Create/Update User
```bash
POST /api/users
Content-Type: application/json

{
  "firebaseUid": "user123",
  "email": "user@example.com",
  "name": "John Doe",
  "age": 25,
  "gender": "male"
}
```

### Upload Images
```bash
POST /api/upload/images
Content-Type: multipart/form-data

Form Data:
- images: [file1, file2, ...]
- userId: "user123"
```

## 🔒 Security Notes

- Never commit `.env` file
- Use environment variables in production
- Validate all inputs
- Use Firebase Admin SDK for secure operations
- Implement rate limiting for production

## 📚 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Storage**: Firebase Storage
- **Language**: TypeScript
- **Deployment**: Render

