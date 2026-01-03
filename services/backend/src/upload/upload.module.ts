import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ImageOptimizerService } from './image-optimizer.service';

@Module({
  controllers: [UploadController],
  providers: [
    {
      provide: ImageOptimizerService,
      useFactory: () => {
        try {
          // Only create service if Sharp is available
          require('sharp');
          return new ImageOptimizerService();
        } catch (error) {
          console.log('⚠️  Sharp not installed - image optimization disabled');
          return null;
        }
      },
    },
  ],
  exports: [ImageOptimizerService],
})
export class UploadModule {}
