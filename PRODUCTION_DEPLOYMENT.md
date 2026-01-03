# Production Deployment Instructions - Google OAuth Fix

## Quick Summary
Your Google OAuth was failing because the environment variables weren't configured correctly for production. The app was using `localhost:4000` even when deployed to `talaseen.com`.

## What Was Fixed

### ✅ Files Updated:
1. `.env.production` - Corrected all URLs to use `https://talaseen.com`
2. `docker-compose.prod.yml` - Added proper environment variable configuration
3. `services/backend/.env` - Added missing callback URL variable

### ✅ Key Changes:
```
OLD (Broken):
- GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
- FRONTEND_URL=http://185.255.91.45:3002
- NEXT_PUBLIC_API_URL=http://185.255.91.45:4000/api

NEW (Fixed):
- GOOGLE_CALLBACK_URL=https://talaseen.com/api/auth/google/callback
- FRONTEND_URL=https://talaseen.com
- NEXT_PUBLIC_API_URL=/api
```

## On Your Production Server (SSH Access)

### Step 1: Backup Current Environment
```bash
ssh talaseen
cd /path/to/talaseen
cp .env .env.backup.$(date +%Y%m%d-%H%M%S)
```

### Step 2: Copy Production Config
```bash
# Pull the latest changes from your repository (if using git)
git pull origin main

# OR manually copy the .env.production settings
```

### Step 3: Update Secrets (CRITICAL)
Edit `.env` and replace these placeholder values with your actual secrets:
```bash
# Generate new secrets
JWT_SECRET=$(openssl rand -base64 32)
JWT_REFRESH_SECRET=$(openssl rand -base64 32)

# Edit and save the file with your real values
nano .env
```

Required changes in `.env`:
```
POSTGRES_PASSWORD=your-strong-password-here
JWT_SECRET=actual-base64-secret-from-openssl
JWT_REFRESH_SECRET=actual-base64-secret-from-openssl
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=https://talaseen.com/api/auth/google/callback
FRONTEND_URL=https://talaseen.com
NODE_ENV=production
```

### Step 4: Restart Containers
```bash
# Stop running containers
docker-compose -f docker-compose.prod.yml down

# Rebuild images with new config
docker-compose -f docker-compose.prod.yml build

# Start containers
docker-compose -f docker-compose.prod.yml up -d

# Wait 30 seconds for containers to initialize
sleep 30

# Check logs
docker logs talaseen-backend
docker logs talaseen-frontend
```

### Step 5: Verify Deployment
```bash
# Check if containers are running
docker ps | grep talaseen

# Check for errors
docker logs talaseen-backend | grep -i error | tail -10
docker logs talaseen-frontend | grep -i error | tail -10
```

### Step 6: Test Google OAuth
1. Visit https://talaseen.com/login
2. Click "Login with Google"
3. You should be redirected to Google's login
4. After login, you should return to the callback page

## If Google OAuth Still Doesn't Work

### Error: "Redirect URI mismatch"
**This means Google Cloud Console doesn't have the correct callback URL registered**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to APIs & Services → Credentials
4. Find your OAuth 2.0 Client (name: "web client" or similar)
5. Click Edit
6. In "Authorized redirect URIs", add:
   ```
   https://talaseen.com/api/auth/google/callback
   http://localhost:4000/api/auth/google/callback
   ```
7. Save changes (may take a few minutes to apply)

### Error: "Cannot GET /api/auth/google"
**This means the backend container isn't running or Nginx isn't configured correctly**

```bash
# Check if backend is running
docker logs talaseen-backend

# Check if Nginx is proxying correctly
docker logs talaseen-nginx | grep auth/google

# Restart all containers
docker-compose -f docker-compose.prod.yml restart
```

### Error: "localhost shown instead of domain"
**The .env file on the server doesn't have the correct values**

```bash
# Verify .env has production URLs
grep GOOGLE_CALLBACK_URL .env
# Should show: GOOGLE_CALLBACK_URL=https://talaseen.com/api/auth/google/callback

# If not, update it and restart containers
docker-compose -f docker-compose.prod.yml restart talaseen-backend
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `GOOGLE_CALLBACK_URL` | Where Google redirects after user login | `https://talaseen.com/api/auth/google/callback` |
| `GOOGLE_CLIENT_ID` | Google OAuth app ID | `556915763794-...` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret key | `GOCSPX-...` |
| `FRONTEND_URL` | Where backend redirects after auth | `https://talaseen.com` |
| `NEXT_PUBLIC_API_URL` | Frontend API base URL | `/api` (relative, uses same domain) |
| `JWT_SECRET` | Secret for signing JWT tokens | Any random 32+ character string |
| `NODE_ENV` | Environment mode | `production` |

## How Google OAuth Flow Works Now

```
1. User clicks "Login with Google" at https://talaseen.com/login
   ↓
2. Frontend redirects to /api/auth/google (relative URL)
   ↓
3. Nginx reverse proxy forwards to: http://backend:4000/api/auth/google
   ↓
4. Backend (NestJS) redirects to Google OAuth endpoint with:
   - client_id: 556915763794-...
   - redirect_uri: https://talaseen.com/api/auth/google/callback
   - scope: email profile
   ↓
5. User logs in with Google
   ↓
6. Google redirects back to: https://talaseen.com/api/auth/google/callback
   ↓
7. Nginx forwards to: http://backend:4000/api/auth/google/callback
   ↓
8. Backend validates token, creates user session, generates JWT
   ↓
9. Backend redirects to: https://talaseen.com/auth/callback?token=...&user=...
   ↓
10. Frontend saves token in localStorage, redirects to dashboard
```

## Monitoring & Logs

### Check backend logs for auth flow:
```bash
docker logs talaseen-backend | grep -i "google\|auth\|redirect" | tail -20
```

### Check Nginx logs for routing:
```bash
docker logs talaseen-nginx | grep auth/google | tail -10
```

### Check frontend logs:
```bash
docker logs talaseen-frontend | grep -i error | tail -10
```

## Rollback (If something goes wrong)

```bash
# Restore from backup
cp .env.backup.* .env

# Restart containers with old config
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker logs talaseen-backend
```

## Additional Resources

- **Google OAuth Docs**: https://developers.google.com/identity/protocols/oauth2
- **NestJS Passport**: https://docs.nestjs.com/recipes/passport
- **NextJS Environment Variables**: https://nextjs.org/docs/basic-features/environment-variables

---

**Need Help?** Check the server logs with: `docker logs talaseen-backend` and `docker logs talaseen-frontend`
