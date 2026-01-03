import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

// Dynamic import for sharp - only loaded if available
let sharp: any;
try {
  sharp = require('sharp');
} catch (error) {
  console.log('⚠️  Sharp not installed - image optimization unavailable');
}

@Injectable()
export class ImageOptimizerService {
  private readonly MAX_WIDTH = 1200;
  private readonly MAX_HEIGHT = 1200;
  private readonly THUMBNAIL_SIZE = 400;
  private readonly QUALITY = 80;

  /**
   * Optimize a single image - resize and compress
   */
  async optimizeImage(filePath: string): Promise<void> {
    if (!sharp) {
      throw new Error('Sharp is not installed');
    }
    
    try {
      const buffer = await fs.readFile(filePath);
      
      // Optimize the main image
      await sharp(buffer)
        .resize(this.MAX_WIDTH, this.MAX_HEIGHT, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: this.QUALITY })
        .toFile(filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

      // Delete original if it was converted to webp
      if (!filePath.endsWith('.webp')) {
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error('Error optimizing image:', error);
      throw error;
    }
  }

  /**
   * Create a thumbnail version of the image
   */
  async createThumbnail(filePath: string): Promise<string> {
    if (!sharp) {
      throw new Error('Sharp is not installed');
    }
    
    try {
      const buffer = await fs.readFile(filePath);
      const thumbnailPath = filePath.replace(/(\.\w+)$/, '-thumb$1');

      await sharp(buffer)
        .resize(this.THUMBNAIL_SIZE, this.THUMBNAIL_SIZE, {
          fit: 'cover',
        })
        .webp({ quality: 75 })
        .toFile(thumbnailPath.replace(/\.(jpg|jpeg|png)$/i, '.webp'));

      return thumbnailPath;
    } catch (error) {
      console.error('Error creating thumbnail:', error);
      throw error;
    }
  }

  /**
   * Optimize multiple images in batch
   */
  async optimizeImages(filePaths: string[]): Promise<void> {
    await Promise.all(filePaths.map((path) => this.optimizeImage(path)));
  }

  /**
   * Get file size in MB
   */
  async getFileSize(filePath: string): Promise<number> {
    const stats = await fs.stat(filePath);
    return stats.size / (1024 * 1024); // Convert to MB
  }

  /**
   * Clean up old images (older than X days)
   */
  async cleanupOldImages(directory: string, daysOld: number = 30): Promise<void> {
    try {
      const files = await fs.readdir(directory);
      const now = Date.now();
      const maxAge = daysOld * 24 * 60 * 60 * 1000;

      for (const file of files) {
        const filePath = join(directory, file);
        const stats = await fs.stat(filePath);
        
        if (now - stats.mtimeMs > maxAge) {
          await fs.unlink(filePath);
          console.log(`Deleted old image: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up old images:', error);
    }
  }
}
