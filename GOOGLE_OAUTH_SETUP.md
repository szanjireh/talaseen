# Google Cloud Console - OAuth 2.0 Configuration

## Overview
Your Google OAuth integration requires proper configuration in Google Cloud Console. This guide shows you exactly what to check/update.

## Current Configuration
- **Project**: talaseen
- **Client ID**: `YOUR_GOOGLE_CLIENT_ID_HERE` (stored securely in production .env)
- **Client Secret**: `YOUR_GOOGLE_CLIENT_SECRET_HERE` (stored securely in production .env)

## Step-by-Step Setup

### 1. Access Google Cloud Console
1. Go to: https://console.cloud.google.com/
2. Sign in with your Google account
3. Select project: **talaseen** (or your project name)

### 2. Navigate to OAuth Credentials
1. Left sidebar → **APIs & Services**
2. Click **Credentials**
3. Look for **OAuth 2.0 Client IDs**
4. You should see an entry for **Web client** or **talaseen-oauth**
5. Click on it to edit

### 3. Update Authorized Redirect URIs
This is the MOST IMPORTANT step - Google needs to know where it can redirect users after login.

**Current URIs to add:**
```
http://localhost:4000/api/auth/google/callback
https://talaseen.com/api/auth/google/callback
```

**Steps to add:**
1. Click **Edit** on the OAuth 2.0 Client ID
2. Scroll to **Authorized redirect URIs**
3. Click **Add URI**
4. Paste: `http://localhost:4000/api/auth/google/callback` (for local development)
5. Click **Add URI** again
6. Paste: `https://talaseen.com/api/auth/google/callback` (for production)
7. Click **Save**

### 4. Verify OAuth Consent Screen
1. Go to **OAuth consent screen** (left sidebar)
2. Check **Test users** section
3. Ensure your test user email is listed
4. Status should be **In production** or **Testing**

### 5. Verify API Enabled
1. Go to **APIs & Services** → **Enabled APIs & services**
2. Search for: **Google+ API**
3. Ensure it's **Enabled**
4. If not, click it and press **Enable**

## Common Issues & Solutions

### Issue: "Redirect URI mismatch"
**Problem**: The redirect URI in the request doesn't match any configured URI

**Solution**:
1. Check your `.env` file: `grep GOOGLE_CALLBACK_URL .env`
2. It should be one of:
   - `http://localhost:4000/api/auth/google/callback` (development)
   - `https://talaseen.com/api/auth/google/callback` (production)
3. Compare with Google Cloud Console settings
4. Add the missing URI if needed

**How to debug**:
```bash
# On production server
docker logs talaseen-backend | grep -i "callback\|redirect"

# You should see something like:
# GoogleStrategy: callbackURL = https://talaseen.com/api/auth/google/callback
```

### Issue: "Client ID mismatch"
**Problem**: Frontend is using wrong Client ID

**Solution**:
1. Verify your `.env` has correct Client ID
2. Check frontend build includes it: `docker logs talaseen-frontend | grep NEXT_PUBLIC`
3. Clear browser cache and refresh

### Issue: "Client ID or Client Secret is Invalid"
**Problem**: Credentials are incorrect

**Solution**:
1. Go to Google Cloud Console
2. Copy exact Client ID: `556915763794-a7btd8o0cumlga9n8tadelthfh1qpvba.apps.googleusercontent.com`
3. Copy exact Client Secret
4. Update `.env` with exact values
5. Restart containers: `docker-compose -f docker-compose.prod.yml restart talaseen-backend`

## Testing OAuth Locally vs Production

### Local Testing
```bash
# Ensure .env has:
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback
FRONTEND_URL=http://localhost:3002
NODE_ENV=development

# Start containers
docker-compose up -d

# Visit: http://localhost:3002/login
# Click Google Login button
# Should redirect to Google, then back to callback page
```

### Production Testing
```bash
# Ensure .env has:
GOOGLE_CALLBACK_URL=https://talaseen.com/api/auth/google/callback
FRONTEND_URL=https://talaseen.com
NODE_ENV=production

# Restart containers
docker-compose -f docker-compose.prod.yml restart

# Visit: https://talaseen.com/login
# Click Google Login button
# Should redirect to Google, then back to callback page
```

## OAuth Flow Diagram

```
┌─────────────┐
│   Browser   │
│ talaseen.com│
└──────┬──────┘
       │
       │ 1. Click "Login with Google"
       │ GET /login
       ↓
┌─────────────────────┐
│   Frontend (Next.js)│
│  port 3000          │
└──────┬──────────────┘
       │
       │ 2. window.location = "/api/auth/google"
       ↓
┌──────────────────┐
│ Nginx (Reverse   │
│ Proxy)           │
│ port 80/443      │
└─────┬────────────┘
      │
      │ 3. Route to backend
      │ /api/auth/google → http://backend:4000/api/auth/google
      ↓
┌────────────────────────┐
│  Backend (NestJS)      │
│  port 4000             │
│  GoogleStrategy        │
└─────┬──────────────────┘
      │
      │ 4. Passport redirects to Google
      │ https://accounts.google.com/o/oauth2/v2/auth
      │ ?client_id=556915763794-...
      │ &redirect_uri=https://talaseen.com/api/auth/google/callback
      │ &scope=email+profile
      ↓
┌──────────────────┐
│  Google OAuth    │
│  /o/oauth2/auth  │
└─────┬────────────┘
      │
      │ 5. User logs in
      │ Google validates
      │ Redirects back to:
      │ https://talaseen.com/api/auth/google/callback?code=...&state=...
      ↓
┌──────────────────┐
│    Nginx         │
│  Routes to:      │
│  http://backend: │
│  4000/api/auth/  │
│  google/callback │
└─────┬────────────┘
      │
      │ 6. Backend validates code
      │ Gets user profile from Google
      │ Creates JWT token
      ↓
┌────────────────────────┐
│  Backend redirects to: │
│  https://talaseen.com/ │
│  auth/callback?        │
│  token=...&user=...    │
└─────┬──────────────────┘
      │
      │ 7. Frontend receives token
      │ Saves to localStorage
      │ Redirects to dashboard
      ↓
┌────────────────────┐
│ Authenticated User │
│ Dashboard loaded   │
└────────────────────┘
```

## Checklist Before Going Live

- [ ] Google Cloud Console has OAuth 2.0 Client ID created
- [ ] **Authorized Redirect URIs** includes both:
  - [ ] `http://localhost:4000/api/auth/google/callback`
  - [ ] `https://talaseen.com/api/auth/google/callback`
- [ ] `.env` on production server has:
  - [ ] Correct `GOOGLE_CLIENT_ID`
  - [ ] Correct `GOOGLE_CLIENT_SECRET`
  - [ ] `GOOGLE_CALLBACK_URL=https://talaseen.com/api/auth/google/callback`
- [ ] Google+ API is **Enabled**
- [ ] OAuth Consent Screen is configured
- [ ] Test users can access the login page
- [ ] Containers are restarted after `.env` changes
- [ ] HTTPS certificate is valid (Let's Encrypt)

## Help & Support

### Debug Commands
```bash
# Check backend environment
docker exec talaseen-backend env | grep GOOGLE

# Check if backend sees the correct URL
docker logs talaseen-backend | grep -i "googlestrategy\|callback"

# Test backend directly
curl -v "https://talaseen.com/api/auth/google"
# Should redirect to Google OAuth URL
```

### Check Nginx Configuration
```bash
# Verify Nginx is routing /api/auth/google correctly
docker exec talaseen-nginx cat /etc/nginx/conf.d/default.conf | grep -A5 "location /api"
```

### Verify Certificate
```bash
# Check SSL certificate validity
echo | openssl s_client -servername talaseen.com -connect talaseen.com:443 2>/dev/null | grep -i "subject\|issuer"
# Should show valid Let's Encrypt certificate
```

---

**Key Takeaway**: If you see "Redirect URI mismatch" error, it means the URL in your `.env` file doesn't match what's registered in Google Cloud Console. Update both to match!
