# Mixed Content Security Fix

## Problem
Your HTTPS site was showing a security warning: "Some parts of the site are not secure." This occurs when an HTTPS page loads resources from HTTP endpoints (mixed content).

## Root Cause
The Next.js frontend had a fallback API URL hardcoded to `http://localhost:4000/api`:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
```

Additionally, the Docker build process wasn't passing `NEXT_PUBLIC_*` environment variables at build time. Since Next.js requires these variables **during build** (not runtime), they need to be set via build arguments.

## Changes Made

### 1. Updated Frontend Dockerfile
**File**: `services/frontend/Dockerfile`

- Added build arguments for `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_BACKEND_URL`
- These arguments are now used as environment variables during the Next.js build process
- Default values ensure secure HTTPS:
  - `NEXT_PUBLIC_API_URL=/api` (relative path, uses same protocol as page)
  - `NEXT_PUBLIC_BACKEND_URL=https://talaseen.com`

### 2. Fixed API URL Fallback
**File**: `services/frontend/lib/api.ts`

Changed from:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
```

To:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
```

The relative path `/api` ensures the browser uses the same protocol (HTTPS) as the page itself.

### 3. Updated Production Docker Compose
**File**: `docker-compose.prod.yml`

Added build arguments section to the frontend service:
```yaml
build:
  context: ./services/frontend
  dockerfile: Dockerfile
  args:
    NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-/api}
    NEXT_PUBLIC_BACKEND_URL: ${NEXT_PUBLIC_BACKEND_URL:-https://talaseen.com}
```

## How It Works

1. **Build Time**: When the Docker image is built, the `NEXT_PUBLIC_*` variables are embedded into the Next.js bundle
2. **Runtime**: The frontend connects to `/api`, which nginx proxies to the backend over HTTPS
3. **nginx Configuration**: Handles the HTTPS redirect and proxies `/api` requests to the internal backend service
4. **Security**: All traffic is now HTTPS, preventing mixed content warnings

## Environment Configuration
Your `.env.production` already had correct settings:
```
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_BACKEND_URL=https://talaseen.com
```

These are now properly passed to the Docker build process.

## What to Do Next

### For Development
No changes needed. The fallback `/api` works fine for local development when you have a backend running.

### For Production
1. Rebuild the Docker images:
   ```bash
   docker-compose -f docker-compose.prod.yml build --no-cache
   ```

2. Restart the services:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. Verify HTTPS:
   - Visit your site in a browser
   - Check the certificate indicator
   - Verify no mixed content warnings appear

## Verification
After deployment, check for mixed content warnings:
1. Open Browser DevTools (F12)
2. Check the Console tab
3. Look for "Mixed Content" errors
4. All should be clear ✓

## Security Benefits
- ✓ All API calls now use HTTPS
- ✓ Browser prevents downgrade attacks
- ✓ Cookies with `Secure` flag work properly
- ✓ Better compatibility with modern browser security policies
