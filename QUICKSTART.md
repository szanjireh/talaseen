# 🚀 Quick Start Guide - Talaseen Gold Marketplace

## What You Have

A complete **Iranian Gold Marketplace** MVP with Etsy-like UI/UX:

### ✅ 3 Applications:
1. **Customer Frontend** (Next.js) - Browse and buy gold products
2. **Vendor Panel** (React) - Manage products and inventory  
3. **Backend API** (Express) - RESTful API with PostgreSQL

### ✅ Key Features:
- Etsy-inspired beautiful UI
- Persian/Farsi language with RTL support
- Product filtering (category, gold purity, price)
- Vendor dashboard with analytics
- Authentication & authorization
- Product management (CRUD)
- Docker setup for easy deployment

---

## ⚡ Start in 3 Steps

### Step 1: Setup Environment

```bash
cd /home/sajad/talaseen

# Copy environment file
cp .env.example .env

# Optional: Edit .env if needed
nano .env
```

### Step 2: Start with Docker (Easiest)

```bash
# Start all services
npm run docker:up

# Wait 30-60 seconds for services to initialize
```

### Step 3: Access Your Apps

```
✨ Customer Frontend: http://localhost:3000
🛒 Vendor Panel:      http://localhost:5173  
📡 Backend API:       http://localhost:4000/health
```

---

## 🎯 For Investor Demo

### Show This Flow:

1. **Homepage** (localhost:3000)
   - Beautiful Etsy-like landing page
   - Category browsing
   - Featured products section

2. **Products Page** (localhost:3000/products)
   - Grid layout with filters
   - Category, purity, price filters
   - Search functionality
   - Responsive design

3. **Vendor Panel** (localhost:5173)
   - Login page
   - Dashboard with statistics
   - Product management
   - Add new product form

### Demo Script:

```
"Talaseen is a marketplace connecting Iranian gold sellers with customers.

1. Customers browse beautiful gold products in an Etsy-like interface
2. Advanced filters help find exactly what they want
3. Vendors manage their inventory through a powerful dashboard
4. Secure authentication protects both buyers and sellers
5. Built with modern tech stack - scalable and production-ready"
```

---

## 🛠️ Alternative: Run Locally (Without Docker)

```bash
# 1. Install dependencies
./setup.sh

# 2. Make sure PostgreSQL is running
# Update DATABASE_URL in .env

# 3. Start all services
npm run dev

# Or start individually:
npm run dev:backend   # Port 4000
npm run dev:frontend  # Port 3000
npm run dev:vendor    # Port 5173
```

---

## 📊 Tech Stack (For Investors)

| Component | Technology | Why? |
|-----------|-----------|------|
| Frontend | Next.js 14 | SEO, performance, React |
| Styling | Tailwind CSS | Fast development, modern |
| Backend | Express.js | Battle-tested, scalable |
| Database | PostgreSQL | Reliable, ACID compliant |
| Language | TypeScript | Type safety, less bugs |
| Deployment | Docker | Easy scaling, cloud-ready |

---

## 🎨 Design Highlights

- **Etsy-inspired**: Clean, trustworthy, familiar
- **Persian-first**: RTL layout, Farsi typography
- **Mobile-ready**: Responsive on all devices
- **Fast**: Optimized images, lazy loading
- **Accessible**: WCAG compliant

---

## 📝 Current Status (MVP)

✅ **Completed:**
- Full UI/UX for customer frontend
- Vendor dashboard and product management
- Backend API with authentication
- Database models and relationships
- Docker deployment setup
- Documentation

⚠️ **Using Mock Data:**
- Products (for demo purposes)
- Can be replaced with real data immediately

🔜 **Post-Funding Features:**
- Payment gateway (Zarinpal, etc.)
- Order processing
- Email notifications
- Admin panel
- Reviews & ratings
- Advanced search (Elasticsearch)
- Mobile apps (React Native)

---

## 💡 Customization for Demo

### Add Sample Products:

```bash
# After services start, you can add products via:
# 1. Vendor Panel UI (recommended for demo)
# 2. API calls
# 3. Database seed script (to be created)
```

### Customize Branding:

Edit these files:
- Logo/colors: `services/frontend/app/layout.tsx`
- Homepage hero: `services/frontend/app/page.tsx`
- Vendor panel theme: `services/vendor-panel/src/pages/Dashboard.tsx`

---

## 🐛 Troubleshooting

### Services won't start?
```bash
# Check if ports are free
lsof -i :3000
lsof -i :4000
lsof -i :5173
lsof -i :5432

# Stop conflicting services
npm run docker:down
```

### Database connection error?
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check logs
docker logs talaseen-db
```

### Need fresh start?
```bash
npm run docker:down
docker system prune -a
npm run docker:up
```

---

## 📞 Support

For the presentation:
1. Test everything 1 day before
2. Have backup screenshots ready
3. Prepare offline demo if needed
4. Know your numbers (target market, pricing model)

---

## 🎯 Next Steps After Demo

1. **Feedback**: Collect investor feedback
2. **Iterate**: Refine based on input  
3. **Scale**: Add payment, orders, reviews
4. **Launch**: Beta with select vendors
5. **Growth**: Marketing, partnerships

---

**Good luck with your presentation! 🚀**

You have 8 days - use them wisely:
- Days 1-2: Test everything, fix bugs
- Days 3-4: Add sample products, polish UI
- Days 5-6: Prepare presentation, slides
- Day 7: Full rehearsal
- Day 8: Final checks, demo day!
