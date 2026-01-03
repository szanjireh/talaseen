#!/bin/bash

# Storage monitoring and cleanup script for Talaseen

UPLOAD_DIR="/opt/project/talaseen/services/backend/uploads/products"
LOG_FILE="/opt/project/talaseen/storage-monitor.log"
ALERT_THRESHOLD=80  # Alert when disk usage exceeds 80%
DAYS_OLD=60  # Delete images older than 60 days

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "=== Storage Monitor - $(date) ===" >> "$LOG_FILE"

# Check current disk usage
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')

echo "Current disk usage: ${DISK_USAGE}%" >> "$LOG_FILE"

if [ "$DISK_USAGE" -gt "$ALERT_THRESHOLD" ]; then
    echo -e "${RED}WARNING: Disk usage is at ${DISK_USAGE}%${NC}"
    echo "WARNING: Disk usage is at ${DISK_USAGE}%" >> "$LOG_FILE"
    
    # Cleanup old images
    echo "Starting cleanup of images older than $DAYS_OLD days..." >> "$LOG_FILE"
    find "$UPLOAD_DIR" -type f -mtime +$DAYS_OLD -delete
    
    # Report cleaned space
    NEW_USAGE=$(df -h / | awk 'NR==2 {print $5}')
    echo "Cleanup complete. New disk usage: $NEW_USAGE" >> "$LOG_FILE"
else
    echo -e "${GREEN}Disk usage is healthy: ${DISK_USAGE}%${NC}"
fi

# Show upload directory statistics
if [ -d "$UPLOAD_DIR" ]; then
    TOTAL_FILES=$(find "$UPLOAD_DIR" -type f | wc -l)
    TOTAL_SIZE=$(du -sh "$UPLOAD_DIR" | cut -f1)
    
    echo "Upload directory stats:" >> "$LOG_FILE"
    echo "  Total files: $TOTAL_FILES" >> "$LOG_FILE"
    echo "  Total size: $TOTAL_SIZE" >> "$LOG_FILE"
    
    echo -e "${YELLOW}Upload stats: $TOTAL_FILES files, $TOTAL_SIZE${NC}"
fi

echo "---" >> "$LOG_FILE"
