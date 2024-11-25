import { Module } from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { ImageUploadController } from './image-upload.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './mongoose/photos.schema';

@Module({
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }]),
  ],
})
export class ImageUploadModule {}
