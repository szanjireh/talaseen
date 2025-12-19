# 🔐 Authentication System Documentation

## Overview

Complete Google OAuth authentication with role-based access control implemented without any hardcoded users.

## User Roles

### USER (Default)
- **Auto-assigned**: Every new signup starts as USER
- **Permissions**: 
  - Browse products
  - View shop details
  - Request to become SELLER
- **Access**: Public pages only

### SELLER
- **How to get**: USER must request and get ADMIN approval
- **Permissions**:
  - All USER permissions
  - Create/edit/delete own products
  - Access seller dashboard
  - Manage shop details
- **Access**: Dashboard + public pages

### ADMIN
- **How to get**: Manually set in database (first admin only)
- **Permissions**:
  - All SELLER permissions
  - Approve/reject seller requests
  - Manage all products
  - Access admin panel
- **Access**: Everything

## Authentication Flow

```
1. User clicks "Sign in with Google"
   ↓
2. Redirected to Google OAuth consent
   ↓
3. User approves access
   ↓
4. Google redirects to /api/auth/google/callback
   ↓
5. Backend creates/finds user (role: USER)
   ↓
6. JWT token generated
   ↓
7. Redirected to frontend with token
   ↓
8. Frontend stores token in localStorage
   ↓
9. User authenticated!
```

## Seller Request Flow

```
USER → Requests Seller Access
  ↓
  Fills form (shop name + description)
  ↓
  Request created (status: PENDING)
  ↓
ADMIN → Views pending requests
  ↓
  Approves or Rejects
  ↓
IF APPROVED:
  - User role changed to SELLER
  - Shop details saved
  - Can access dashboard
  
IF REJECTED:
  - User remains USER
  - Can submit new request
```

## API Endpoints

### Public Endpoints
```
GET /api/auth/google
  - Initiates Google OAuth flow
  - No authentication required

GET /api/auth/google/callback
  - OAuth callback handler
  - Returns JWT token + user data
```

### Protected Endpoints (Requires JWT)
```
GET /api/auth/me
  - Returns current user profile
  - Any authenticated user

POST /api/auth/request-seller
  - Submit seller request
  - Body: { shopName, description }
  - USER role only

GET /api/auth/seller-request
  - Get my seller request status
  - USER role only
```

### Admin Endpoints (Requires ADMIN role)
```
GET /api/auth/admin/seller-requests
  - List all seller requests
  - Query: ?status=PENDING|APPROVED|REJECTED

PUT /api/auth/admin/seller-requests/:id/approve
  - Approve seller request
  - Updates user role to SELLER

PUT /api/auth/admin/seller-requests/:id/reject
  - Reject seller request
  - Body: { reason?: string }
```

### Product Endpoints (Role-based)
```
GET /api/products
  - Public: Anyone can view

POST /api/products
  - Protected: SELLER or ADMIN only
  - Creates product for authenticated seller

PUT /api/products/:id
  - Protected: SELLER (own) or ADMIN (any)
  - Updates product

DELETE /api/products/:id
  - Protected: SELLER (own) or ADMIN (any)
  - Deletes product
```

## Frontend Pages

### Public Pages
- `/` - Homepage (shows different content based on role)
- `/login` - Google OAuth login page
- `/products` - Product listing (planned)

### Protected Pages
- `/dashboard` - Seller dashboard (SELLER + ADMIN)
- `/admin` - Admin panel (ADMIN only)
- `/unauthorized` - Access denied page

### Auth Helper Pages
- `/auth/callback` - OAuth redirect handler

## Database Schema

### User Table
```prisma
model User {
  id              String          @id @default(uuid())
  email           String          @unique
  name            String
  googleId        String?         @unique
  avatar          String?
  role            UserRole        @default(USER)
  shopName        String?         // Set when approved as SELLER
  shopDescription String?         // Set when approved as SELLER
  shopLogo        String?
  isActive        Boolean         @default(true)
  products        Product[]
  sellerRequests  SellerRequest[]
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt
}
```

### SellerRequest Table
```prisma
model SellerRequest {
  id          String              @id @default(uuid())
  userId      String
  user        User                @relation(...)
  status      SellerRequestStatus @default(PENDING)
  shopName    String              // Proposed shop name
  description String              // Why they want to sell
  reason      String?             // Rejection reason
  reviewedBy  String?             // Admin user ID
  reviewedAt  DateTime?
  createdAt   DateTime            @default(now())
  updatedAt   DateTime            @updatedAt
}
```

### Enums
```prisma
enum UserRole {
  USER
  SELLER
  ADMIN
}

enum SellerRequestStatus {
  PENDING
  APPROVED
  REJECTED
}
```

## Frontend Components

### AuthContext
```typescript
const { 
  user,           // Current user object
  token,          // JWT token
  isLoading,      // Loading state
  login,          // Login function
  logout,         // Logout function
  isAuthenticated,// Boolean
  isUser,         // user.role === 'USER'
  isSeller,       // user.role === 'SELLER'
  isAdmin         // user.role === 'ADMIN'
} = useAuth();
```

### ProtectedRoute Component
```tsx
<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
  <YourComponent />
</ProtectedRoute>
```

## Setup Instructions

### 1. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI:
   ```
   http://localhost:4000/api/auth/google/callback
   ```
6. Copy Client ID and Client Secret

### 2. Update Environment Variables

**Backend** (`services/backend/.env`):
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
```

**Frontend** (`services/frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Start the Application

```bash
docker-compose up
```

### 4. Create First Admin

Since there are no hardcoded users, you need to manually set the first admin:

1. Sign in with Google (you'll be a USER)
2. Connect to database:
   ```bash
   docker exec -it talaseen-db psql -U talaseen -d talaseen
   ```
3. Update your role:
   ```sql
   UPDATE "User" SET role = 'ADMIN' 
   WHERE email = 'your-email@gmail.com';
   ```
4. Logout and login again
5. You'll now have admin access!

## Testing the System

### Test as USER
1. Visit http://localhost:3000
2. Click "Sign In"
3. Login with Google
4. You'll see "Request Seller Access" option
5. Fill in shop name and description
6. Submit request

### Test as ADMIN
1. Set your role to ADMIN (see above)
2. Visit http://localhost:3000/admin
3. You'll see pending seller requests
4. Approve or reject requests
5. Approved users can access dashboard

### Test as SELLER
1. Get approved as SELLER (by admin)
2. Visit http://localhost:3000/dashboard
3. Access seller features
4. Create/manage products

## Security Features

✅ **No Hardcoded Users** - All users come from Google OAuth
✅ **JWT Authentication** - Secure token-based auth
✅ **Role-Based Access Control** - Guards on routes and endpoints
✅ **Protected Routes** - Frontend route protection
✅ **API Guards** - Backend endpoint protection
✅ **Ownership Checks** - Sellers can only modify their own products
✅ **Admin Approval** - Manual review of seller requests

## Error Handling

- Unauthorized access → Redirects to `/unauthorized`
- Not authenticated → Redirects to `/login`
- Invalid seller request → Error message displayed
- Duplicate requests → Prevented at backend
- Non-existent resources → 404 errors

## Future Enhancements

- [ ] Email notifications for seller request updates
- [ ] SELLER role downgrade/removal by ADMIN
- [ ] Activity logs for ADMIN actions
- [ ] Multi-step seller verification
- [ ] Shop review and rating system
- [ ] Seller performance dashboard
- [ ] Automated seller approval based on criteria

---

**All authentication implemented without any hardcoded users!** 🎉
