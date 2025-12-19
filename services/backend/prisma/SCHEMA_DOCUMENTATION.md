# Talaseen MVP Database Schema Documentation

**Version:** 1.0 (Finalized for MVP)  
**Date:** December 17, 2025  
**Status:** 🔒 Frozen for MVP Development

## Schema Overview

The database is designed to support a gold jewelry marketplace with role-based access control, seller management, and product listings.

## Models

### User
**Purpose:** Core authentication and user management

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | ✓ | Primary key |
| name | String | ✓ | User's display name |
| email | String | ✓ | Unique email address |
| googleId | String | ✗ | Google OAuth identifier |
| avatar | String | ✗ | Profile image URL |
| role | UserRole | ✓ | USER/SELLER/ADMIN (default: USER) |
| createdAt | DateTime | ✓ | Auto-generated |
| updatedAt | DateTime | ✓ | Auto-updated |

**Relations:**
- `seller` → One-to-one with Seller (optional)

**Indexes:**
- `email` (unique)
- `googleId` (unique)
- `role`

---

### Seller
**Purpose:** Seller profile and shop information

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | ✓ | Primary key |
| userId | String | ✓ | Foreign key to User |
| shopName | String | ✓ | Shop/store name |
| isApproved | Boolean | ✓ | Admin approval status (default: false) |
| createdAt | DateTime | ✓ | Auto-generated |
| updatedAt | DateTime | ✓ | Auto-updated |

**Relations:**
- `user` → One-to-one with User (cascade delete)
- `goldProducts` → One-to-many with GoldProduct

**Indexes:**
- `userId` (unique)
- `isApproved`

**Business Rules:**
- Users must request seller status (role = SELLER)
- Admin approval required before seller can create products
- Deleting user cascades to seller profile

---

### GoldProduct
**Purpose:** Gold jewelry product listings

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | ✓ | Primary key |
| sellerId | String | ✓ | Foreign key to Seller |
| title | String | ✓ | Product name |
| description | String | ✗ | Product description (optional) |
| type | GoldProductType | ✓ | Product category enum |
| weight | Float | ✓ | Weight in grams |
| size | Float | ✗ | Optional (for rings, bracelets) |
| makingFee | Float | ✓ | Manufacturing cost |
| profitPercent | Float | ✓ | Profit margin percentage |
| goldPriceAtCreation | Float | ✓ | Gold price when created |
| finalPrice | Float | ✓ | Calculated final price |
| createdAt | DateTime | ✓ | Auto-generated |
| updatedAt | DateTime | ✓ | Auto-updated |

**Relations:**
- `seller` → Many-to-one with Seller (cascade delete)
- `images` → One-to-many with ProductImage

**Indexes:**
- `sellerId`
- `type`
- `createdAt`

**Business Rules:**
- Only approved sellers can create products
- Deleting seller cascades to all products

---

### ProductImage
**Purpose:** Product image management with primary image support

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | ✓ | Primary key |
| productId | String | ✓ | Foreign key to GoldProduct |
| url | String | ✓ | Image URL/path |
| isPrimary | Boolean | ✓ | Primary display image (default: false) |
| createdAt | DateTime | ✓ | Auto-generated |

**Relations:**
- `product` → Many-to-one with GoldProduct (cascade delete)

**Indexes:**
- `productId`
- `isPrimary`

**Business Rules:**
- Products can have multiple images
- One image should be marked as primary for display
- Deleting product cascades to all images

---

### Announcement
**Purpose:** Site-wide announcements and banners

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | UUID | ✓ | Primary key |
| title | String | ✓ | Announcement title |
| content | String | ✗ | Announcement content (optional) |
| isActive | Boolean | ✓ | Display status (default: true) |
| priority | Int | ✓ | Display order (default: 0) |
| createdAt | DateTime | ✓ | Auto-generated |
| updatedAt | DateTime | ✓ | Auto-updated |

**Indexes:**
- `[isActive, priority]` (composite)

**Business Rules:**
- Higher priority = displayed first
- Only active announcements shown to users

---

## Enums

### UserRole
```
USER    - Regular customer
SELLER  - Approved vendor
ADMIN   - Platform administrator
```

### GoldProductType
```
RING
BRACELET
NECKLACE
EARRING
BANGLE
PENDANT
ANKLET
CHAIN
COIN
BAR
OTHER
```

---

## Migration Notes

- Shadow database migration failed due to permissions
- Using `prisma db push` for development
- For production: Set up proper migration workflow with shadow database access
- All changes applied successfully to database

---

## Future Expansion (Post-MVP)

Potential additions to consider:
- Order management system
- Shopping cart
- Payment processing
- Product reviews/ratings
- Wishlist functionality
- Advanced search/filtering
- Gold price tracking history
- Seller analytics dashboard

---

**⚠️ IMPORTANT:** This schema is frozen for MVP development. Any changes must be documented and approved before implementation.
