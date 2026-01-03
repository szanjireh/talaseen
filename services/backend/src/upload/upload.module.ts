import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ImageOptimizerService } from './image-optimizer.service';

@Module({
  controllers: [UploadController],
  providers: [ImageOptimizerService],
  exports: [ImageOptimizerService],
})
export class UploadModule {}
