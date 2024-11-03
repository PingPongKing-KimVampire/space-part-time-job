import { Module } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadController } from './image-upload.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
  imports: [ConfigModule]
})
export class ImageUploadModule {}
