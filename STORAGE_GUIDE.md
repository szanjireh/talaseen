# Storage Management Configuration

## Current Setup
- **Total Space**: 45GB
- **Available**: 30GB
- **Current Usage**: 34%

## Image Storage Strategy

### Optimization Settings
- **Max Image Width**: 1200px
- **Max Image Height**: 1200px
- **Compression Quality**: 80%
- **Format**: WebP (60-80% smaller than JPEG)
- **Max Upload Size**: 10MB per image

### Expected Savings
- **Before**: ~10MB per product (10 images)
- **After**: ~2-3MB per product (70-80% reduction)
- **Capacity**: ~10,000 products with 30GB

## Automated Cleanup
Images older than 60 days are automatically deleted if:
- Product is deleted
- Disk usage exceeds 80%

## Monitoring

### Manual Check
```bash
cd /opt/project/talaseen
./storage-monitor.sh
```

### Cron Job (Daily at 2 AM)
```bash
0 2 * * * /opt/project/talaseen/storage-monitor.sh
```

## Migration to Cloud Storage (Recommended)

### Option 1: Arvan Cloud (Iranian - Best)
**Cost**: ~200,000 Toman/month for 100GB
**Setup**:
```bash
npm install @aws-sdk/client-s3
```

### Option 2: DigitalOcean Spaces
**Cost**: $5/month for 250GB
**Setup**:
```bash
npm install @aws-sdk/client-s3
```

### Option 3: Cloudinary (Easiest)
**Free tier**: 25GB storage + 25GB bandwidth
**Setup**:
```bash
npm install cloudinary
```

## Installation

1. Install Sharp for image optimization:
```bash
cd services/backend
npm install sharp
```

2. Make monitoring script executable:
```bash
chmod +x storage-monitor.sh
```

3. Set up daily monitoring:
```bash
crontab -e
# Add: 0 2 * * * /opt/project/talaseen/storage-monitor.sh
```

4. Restart backend:
```bash
docker-compose restart backend
```

## Benefits

✅ **70-80% storage savings** with WebP compression
✅ **Faster page loads** (smaller images)
✅ **Automated cleanup** of old images
✅ **Monitoring alerts** before running out of space
✅ **10,000+ products capacity** with current storage
