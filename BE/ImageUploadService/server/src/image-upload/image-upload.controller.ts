import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('/api/image-upload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('imageFiles'))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    if (!files) throw new HttpException('파일이 없습니다.', 400);
    if (files.length > 10)
      throw new HttpException(`최대 파일개수 초과`, HttpStatus.BAD_REQUEST);

    const maxSize = 1000 * 1000 * 10;
    for (const file of files) {
      if (file.size > maxSize) {
        throw new HttpException(
          `파일 크기 초과 (최대 10MB)`,
          HttpStatus.PAYLOAD_TOO_LARGE,
        );
      }
    }
  }
}
