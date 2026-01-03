# Google OAuth Configuration Fix

## Problem
When trying to register using Google OAuth in production, the app was redirecting to `http://localhost:4000/api/auth/google` instead of the production domain.

## Root Causes
1. **Backend**: `GOOGLE_CALLBACK_URL` was hardcoded to `http://localhost:4000/api/auth/google/callback`
2. **Frontend**: `NEXT_PUBLIC_API_URL` was set to hardcoded localhost URLs in development
3. **Missing Environment Variables**: Production environment wasn't properly configured

## Solution Applied

### 1. Updated Environment Variables
- **`.env.production`**: Updated with correct production URLs using `https://talaseen.com`
  - `GOOGLE_CALLBACK_URL=https://talaseen.com/api/auth/google/callback`
  - `FRONTEND_URL=https://talaseen.com`
  - `NEXT_PUBLIC_API_URL=/api` (relative path - uses same domain)

### 2. Updated Docker Compose Production
- **`docker-compose.prod.yml`**: Added environment variable overrides
  - Backend now reads `GOOGLE_CALLBACK_URL`, `FRONTEND_URL`, `FRONTEND_CALLBACK_URL` from `.env`
  - Frontend now reads `NEXT_PUBLIC_API_URL` from `.env` (defaults to `/api`)

### 3. Updated Backend Development Config
- **`services/backend/.env`**: Added `FRONTEND_CALLBACK_URL` for consistency

## How It Works Now

### Development Flow
1. Frontend runs on `http://localhost:3002`
2. Backend runs on `http://localhost:4000`
3. User clicks "Login with Google"
4. Frontend redirects to `http://localhost:4000/api/auth/google`
5. Google redirects back to `http://localhost:4000/api/auth/google/callback`
6. Backend redirects to `http://localhost:3002/auth/callback` with token

### Production Flow
1. Frontend and Backend behind Nginx reverse proxy
2. Frontend serves from `https://talaseen.com`
3. Nginx routes `/api/*` to backend container
4. User clicks "Login with Google"
5. Frontend redirects to `/api/auth/google` (relative URL)
6. Nginx proxies to backend's `/api/auth/google`
7. Google redirects to `https://talaseen.com/api/auth/google/callback` (registered in Google Cloud Console)
8. Backend redirects to `https://talaseen.com/auth/callback` with token

## Important: Google Cloud Console Configuration

⚠️ **CRITICAL**: You must update the Authorized Redirect URIs in your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **OAuth 2.0 Client IDs**
4. Edit your web client ID (556915763794-...)
5. Add these **Authorized redirect URIs**:
   ```
   http://localhost:4000/api/auth/google/callback
   https://talaseen.com/api/auth/google/callback
   ```

## Deployment Steps

1. Copy `.env.production` to `.env` on your production server:
   ```bash
   ssh talaseen
   cd /path/to/talaseen
   cp .env.production .env
   ```

2. Update sensitive values in `.env`:
   ```bash
   # Change these:
   POSTGRES_PASSWORD=your-actual-strong-password
   JWT_SECRET=your-actual-jwt-secret
   JWT_REFRESH_SECRET=your-actual-refresh-secret
   ```

3. Rebuild and restart containers:
   ```bash
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml build
   docker-compose -f docker-compose.prod.yml up -d
   ```

4. Verify Google OAuth works:
   - Visit `https://talaseen.com/login`
   - Click "Login with Google"
   - Should redirect to Google login, then back to callback page

## Troubleshooting

### Error: "Redirect URI mismatch"
- **Cause**: The callback URL doesn't match what's registered in Google Cloud Console
- **Fix**: Check Google Cloud Console and add the exact URL being used

### Error: "localhost shown instead of domain"
- **Cause**: `.env` file doesn't have the correct values
- **Fix**: Ensure `.env` has `GOOGLE_CALLBACK_URL=https://talaseen.com/api/auth/google/callback`

### Error: "CORS blocked request"
- **Cause**: Browser is blocking cross-origin requests
- **Fix**: Should be resolved by using relative URLs `/api/*`

### Backend logs show old URL
- **Cause**: Container not restarted with new `.env` file
- **Fix**: Run `docker-compose -f docker-compose.prod.yml restart talaseen-backend`

## Environment Variable Reference

| Variable | Development | Production | Notes |
|----------|-------------|------------|-------|
| `GOOGLE_CALLBACK_URL` | `http://localhost:4000/api/auth/google/callback` | `https://talaseen.com/api/auth/google/callback` | Must match Google Cloud Console |
| `FRONTEND_URL` | `http://localhost:3002` | `https://talaseen.com` | Used for redirect after login |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | `/api` | Relative path uses same domain |
| `NODE_ENV` | `development` | `production` | Controls Next.js build mode |

## Files Modified
- ✅ `/home/yousef/talaseen/.env.production` - Updated with production URLs
- ✅ `/home/yousef/talaseen/docker-compose.prod.yml` - Added env var overrides
- ✅ `/home/yousef/talaseen/services/backend/.env` - Added FRONTEND_CALLBACK_URL
