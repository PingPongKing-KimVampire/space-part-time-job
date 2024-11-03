import { Module } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadController } from './image-upload.controller';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user/user.service';

@Module({
  controllers: [ImageUploadController],
  providers: [ImageUploadService, UserService],
  imports: [ConfigModule],
})
export class ImageUploadModule {}
