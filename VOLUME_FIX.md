# ✅ Docker Volume Configuration - FIXED

## What Was Wrong

**Production (docker-compose.prod.yml)** was missing the uploads volume mapping, meaning:
- ❌ Images saved inside container only
- ❌ Lost when container restarts
- ❌ Lost when rebuilding/updating

## What Was Fixed

### 1. **Production Configuration** (`docker-compose.prod.yml`)
```yaml
backend:
  volumes:
    - backend_uploads:/app/uploads  # ← ADDED

volumes:
  backend_uploads:  # ← ADDED
```

### 2. **Development Already Had It** (`docker-compose.yml`)
```yaml
backend:
  volumes:
    - ./services/backend/uploads:/app/uploads  # ✅ Already there
```

## How Images Are Now Saved

### Development Mode:
```
Local Machine:
/opt/project/talaseen/services/backend/uploads/products/
    ↕️  (Direct mount)
Container:
/app/uploads/products/
```

### Production Mode:
```
Docker Volume: talaseen_backend_uploads
    ↕️  (Persistent volume)
Container:
/app/uploads/products/
```

## Deploy the Fix

**Run this on your server:**

```bash
cd /opt/project/talaseen
chmod +x fix-uploads-volume.sh
./fix-uploads-volume.sh
```

This script will:
1. ✅ Backup existing uploads
2. ✅ Create uploads directory
3. ✅ Rebuild containers with new volume
4. ✅ Restore backed up images
5. ✅ Verify everything works

## Verify It Works

### Check volume exists:
```bash
docker volume ls | grep backend_uploads
```

### Check volume contents:
```bash
docker volume inspect talaseen_backend_uploads
```

### Check inside container:
```bash
docker-compose -f docker-compose.prod.yml exec backend ls -lah /app/uploads/products/
```

## Where Images Are Stored Now

| Environment | Location | Type |
|-------------|----------|------|
| **Development** | `/opt/project/talaseen/services/backend/uploads/` | Direct mount |
| **Production** | Docker volume `backend_uploads` | Named volume |
| **Access URL** | `https://talaseen.com/uploads/products/xxx.webp` | Both |

## Benefits

✅ **Images persist** across container restarts
✅ **Images persist** when rebuilding/updating
✅ **Can backup** Docker volume easily
✅ **Can migrate** to another server
✅ **Nginx caches** images (1 day)

## Backup Strategy

### Manual Backup:
```bash
# Backup the volume
docker run --rm -v talaseen_backend_uploads:/data -v $(pwd):/backup \
  alpine tar czf /backup/uploads-backup-$(date +%Y%m%d).tar.gz -C /data .
```

### Restore Backup:
```bash
# Restore from backup
docker run --rm -v talaseen_backend_uploads:/data -v $(pwd):/backup \
  alpine tar xzf /backup/uploads-backup-YYYYMMDD.tar.gz -C /data
```

## Next Steps

1. ✅ **Deploy the fix** (run the script)
2. ⏳ **Test upload** a product with images
3. ⏳ **Restart container** and verify images still there
4. ⏳ **Set up daily backups** of the volume
5. 🔮 **Plan migration** to cloud storage (Arvan/Cloudinary)

## Important Notes

- 🔴 **Old uploads before this fix may be lost** if you restart container
- 🟡 **After running the script**, uploads are safe
- 🟢 **Volume is independent** of container lifecycle
- 🔵 **Can move to cloud storage** anytime without losing data
