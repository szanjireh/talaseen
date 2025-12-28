# Talaseen - Iranian Gold Marketplace 🪙

[![CI Pipeline](https://github.com/YOUR_USERNAME/talaseen/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_USERNAME/talaseen/actions/workflows/ci.yml)
[![CD Pipeline](https://github.com/YOUR_USERNAME/talaseen/actions/workflows/cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/talaseen/actions/workflows/cd.yml)
[![Deploy](https://github.com/YOUR_USERNAME/talaseen/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/talaseen/actions/workflows/deploy.yml)

A modern, Etsy-inspired marketplace platform for Iranian gold sellers to showcase and sell their gold jewelry products.

> 📖 **CI/CD Documentation:** See [CICD_INDEX.md](CICD_INDEX.md) for complete CI/CD setup guide

## 🌟 Features

### Customer Frontend
- **Etsy-like UI/UX**: Clean, modern interface inspired by Etsy
- Browse gold products by category (necklaces, rings, bracelets, etc.)
- Advanced filtering (gold purity, price range, category)
- Search functionality
- Product details with vendor information
- Persian (Farsi) language support with RTL layout

### Vendor Panel
- Dashboard with sales statistics
- Product management (add, edit, delete)
- Inventory tracking
- Order management
- Shop profile customization

### Backend API
- RESTful API with Express.js
- PostgreSQL database with TypeORM
- JWT authentication
- Product management endpoints
- Vendor management
- Image upload support

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, TypeScript
- **Vendor Panel**: React, Vite, Tailwind CSS, TypeScript
- **Backend**: Node.js, Express, TypeORM, PostgreSQL
- **Database**: PostgreSQL 15
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js 20+ 
- PostgreSQL 15+ (or use Docker)
- npm or yarn

## 🚀 Quick Start

### Option 1: Using Docker (Recommended)

```bash
# Clone and setup
git clone <repository-url>
cd talaseen

# Copy environment file
cp .env.example .env

# Start all services with Docker
npm run docker:up

# Access the applications:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:4000
# - Vendor Panel: http://localhost:5173
```

### Option 2: Local Development

```bash
# Run setup script
chmod +x setup.sh
./setup.sh

# Update .env with your PostgreSQL credentials

# Start all services
npm run dev

# Or start individually:
npm run dev:backend   # Backend API (port 4000)
npm run dev:frontend  # Customer frontend (port 3000)
npm run dev:vendor    # Vendor panel (port 5173)
```

## 📁 Project Structure

```
talaseen/
├── services/
│   ├── backend/           # Express API server
│   │   ├── src/
│   │   │   ├── models/    # Database models
│   │   │   ├── routes/    # API routes
│   │   │   ├── middleware/ # Auth, validation
│   │   │   └── utils/     # Helpers
│   │   └── package.json
│   │
│   ├── frontend/          # Next.js customer app
│   │   ├── app/           # App router pages
│   │   ├── components/    # React components
│   │   └── package.json
│   │
│   └── vendor-panel/      # Vite vendor dashboard
│       ├── src/
│       │   ├── pages/     # Dashboard pages
│       │   └── components/
│       └── package.json
│
├── docker-compose.yml     # Docker services
└── package.json          # Root workspace
```

## 🗄️ Database Schema

### Users
- Authentication (vendors, customers, admin)
- Vendor shop information

### Products
- Title, description, images
- Category (necklace, ring, bracelet, etc.)
- Gold purity (18k, 21k, 22k, 24k)
- Weight (grams)
- Price, stock
- Vendor relationship

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/:id` - Update product (vendor only)
- `DELETE /api/products/:id` - Delete product (vendor only)

## 🎨 UI Features

### Etsy-Inspired Design
- Clean, minimalist interface
- Category browsing
- Grid-based product listings
- Hover effects and transitions
- Responsive design
- Persian typography

### Color Scheme
- Primary: Black (#000000)
- Accent: Gold tones (#ffd24d - #7a5c00)
- Background: Light gray (#f9fafb)
- White cards with subtle shadows

## 🔐 Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/talaseen

# Backend
PORT=4000
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:4000

# Vendor Panel
VITE_API_URL=http://localhost:4000
```

## 🐳 Docker Services

- **postgres**: PostgreSQL 15 database
- **backend**: Express API server
- **frontend**: Next.js application
- **vendor-panel**: Vite development server

## � CI/CD Pipeline

This project includes a complete CI/CD pipeline with GitHub Actions:

### Available Workflows
- **CI Pipeline**: Automated testing and building on every push/PR
- **CD Pipeline**: Build and push Docker images to Docker Hub
- **Deploy Pipeline**: Automated deployment to production server

### Setup Instructions
For detailed setup instructions, see:
- [Complete CI/CD Setup Guide (Persian)](CICD_SETUP_GUIDE.md)
- [GitHub Secrets Reference](GITHUB_SECRETS.md)
- [Setup Checklist](CICD_CHECKLIST.md)

### Quick Setup
1. Create Docker Hub account and repositories
2. Add GitHub Secrets (see [GITHUB_SECRETS.md](GITHUB_SECRETS.md))
3. Push to GitHub - workflows run automatically!

### Local Testing
```bash
# Test CI pipeline locally
./test-ci-local.sh
```

## �📝 Development Notes

### For MVP Presentation (8 days)
This is a functional MVP with:
- ✅ Beautiful, Etsy-like UI
- ✅ Working product browsing and filtering
- ✅ Vendor dashboard for product management
- ✅ Authentication system
- ✅ Database with proper relationships
- ⚠️ Mock data for demonstration
- ⚠️ Basic features (can be expanded post-MVP)

### Future Enhancements
- Payment gateway integration
- Order processing and tracking
- Reviews and ratings
- Advanced search with Elasticsearch
- Email notifications
- Admin panel
- Mobile app

## 🤝 Contributing

This is an MVP project for investor presentation. After funding, we'll welcome contributions.

## 📄 License

Proprietary - All rights reserved

## 👥 Team

Developed for Talaseen Gold Marketplace

---

**Note**: This is an MVP (Minimum Viable Product) designed for investor presentation. Some features use mock data and will be fully implemented in production.
