# Apexa Project - Render Deployment Guide

## 📋 Prerequisites

1. **GitHub Repository**: Ensure your code is pushed to GitHub
2. **MongoDB Atlas**: Set up a free cloud database
3. **Render Account**: Sign up at [render.com](https://render.com)

## 🔧 Backend Deployment

### 1. Database Setup (MongoDB Atlas)
```bash
1. Go to https://www.mongodb.com/atlas
2. Create a free cluster
3. Create a database user
4. Get connection string: mongodb+srv://username:password@cluster.mongodb.net/apexa-project
5. Whitelist all IPs (0.0.0.0/0) for Render access
```

### 2. Deploy Backend API
```bash
Render Configuration:
- Service Type: Web Service
- Name: apexa-backend
- Environment: Node
- Branch: main
- Root Directory: backend
- Build Command: npm install
- Start Command: npm start
```

**Environment Variables:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/apexa-project
PORT=10000
FRONTEND_URL=https://your-frontend-app.onrender.com
JWT_SECRET=your_super_secure_jwt_secret_256_bits_long
NODE_ENV=production
```

**Backend URL:** `https://apexa-backend.onrender.com`

## 🌐 Frontend Deployment

### 1. Update Environment Variables
Before deploying, update `.env.production`:
```env
VUE_APP_API_URL=https://apexa-backend.onrender.com/api
VUE_APP_NODE_ENV=production
VUE_APP_EMAILJS_SERVICE_ID=service_omkadu
VUE_APP_EMAILJS_TEMPLATE_ID=template_olwhaoj
VUE_APP_EMAILJS_PUBLIC_KEY=Zdk-CWeb9tjSmayYd
```

### 2. Deploy Frontend Static Site
```bash
Render Configuration:
- Service Type: Static Site
- Name: apexa-frontend
- Branch: main
- Root Directory: frontend
- Build Command: npm run build
- Publish Directory: dist
```

**Environment Variables:**
```env
NODE_ENV=production
VUE_APP_API_URL=https://apexa-backend.onrender.com/api
VUE_APP_EMAILJS_SERVICE_ID=service_omkadu
VUE_APP_EMAILJS_TEMPLATE_ID=template_olwhaoj
VUE_APP_EMAILJS_PUBLIC_KEY=Zdk-CWeb9tjSmayYd
```

**Frontend URL:** `https://apexa-frontend.onrender.com`

## 🔄 Post-Deployment Updates

### 1. Update Backend CORS
After frontend deployment, update backend environment:
```env
FRONTEND_URL=https://apexa-frontend.onrender.com
```

### 2. Redeploy Backend
Trigger a manual deploy in Render dashboard for the backend service.

## ✅ Verification Steps

1. **Backend Health Check:**
   ```bash
   curl https://apexa-backend.onrender.com/
   # Should return: "Hello world I am root"
   ```

2. **Frontend Access:**
   - Navigate to `https://apexa-frontend.onrender.com`
   - Test login/signup functionality
   - Verify API calls work in browser dev tools

3. **API Connectivity:**
   - Check browser Network tab
   - Ensure API calls go to the correct backend URL
   - Verify no CORS errors

## 🛠 Why Proxy/CORS Configuration?

### CORS (Cross-Origin Resource Sharing)
- **Purpose**: Allows frontend (different domain) to access backend API
- **Security**: Prevents unauthorized domains from accessing your API
- **Production**: Frontend and backend have different URLs on Render

### Proxy Benefits:
1. **Development**: Seamless API calls during local development
2. **Environment Separation**: Different configs for dev/prod
3. **API Gateway**: Single entry point for all API requests
4. **CORS Handling**: Proper cross-origin request management

## 🔍 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Check FRONTEND_URL in backend environment
   - Verify corsOptions configuration

2. **API Not Found:**
   - Confirm backend is deployed and running
   - Check API_URL in frontend environment

3. **Database Connection:**
   - Verify MongoDB Atlas connection string
   - Check IP whitelist (0.0.0.0/0)

4. **Build Failures:**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json

### Logs Access:
- Backend: Render Dashboard → apexa-backend → Logs
- Frontend: Render Dashboard → apexa-frontend → Deploy Logs

## 📱 Final URLs

- **Frontend (User Access):** `https://apexa-frontend.onrender.com`
- **Backend API:** `https://apexa-backend.onrender.com/api`
- **Database:** MongoDB Atlas Cloud

## 🎉 Deployment Complete!

Your Vue.js application is now live with:
- ✅ Scalable backend API on Render
- ✅ Static frontend hosting on Render
- ✅ Cloud database with MongoDB Atlas
- ✅ Proper CORS configuration
- ✅ Environment-based configuration
- ✅ Production-ready setup