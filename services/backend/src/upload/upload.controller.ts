import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { ImageOptimizerService } from './image-optimizer.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly imageOptimizer: ImageOptimizerService) {}

  @Post('image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `product-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB before compression
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Optimize the image
    const filePath = join('./uploads/products', file.filename);
    await this.imageOptimizer.optimizeImage(filePath);
    
    // Update filename to .webp if it was converted
    const optimizedFilename = file.filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    return {
      url: `/uploads/products/${optimizedFilename}`,
      filename: optimizedFilename,
      originalSize: file.size,
      optimizedSize: await this.imageOptimizer.getFileSize(
        join('./uploads/products', optimizedFilename)
      ),
      mimetype: 'image/webp',
    };
  }

  @Post('images')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `product-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return callback(
            new BadRequestException('Only image files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB per file before compression
      },
    }),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    // Optimize all images
    const filePaths = files.map((file) => join('./uploads/products', file.filename));
    await this.imageOptimizer.optimizeImages(filePaths);

    return {
      files: await Promise.all(
        files.map(async (file) => {
          const optimizedFilename = file.filename.replace(/\.(jpg|jpeg|png)$/i, '.webp');
          return {
            url: `/uploads/products/${optimizedFilename}`,
            filename: optimizedFilename,
            originalSize: file.size,
            optimizedSize: await this.imageOptimizer.getFileSize(
              join('./uploads/products', optimizedFilename)
            ),
            mimetype: 'image/webp',
          };
        })
      ),
    };
  }
}
