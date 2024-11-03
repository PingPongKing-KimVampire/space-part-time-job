import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ImageUploadService } from './image-upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { UserService } from './user/user.service';

@Controller('/api/image-upload')
export class ImageUploadController {
  constructor(
    private readonly imageUploadService: ImageUploadService,
    private readonly userService: UserService,
  ) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('imageFiles'))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    if (!req.cookies.access_token) throw new HttpException('토큰 없음', 401);
    try {
      await this.userService.authenticateUser(req.cookies.access_token);
    } catch (e) {
      if (e.message === '유저 인증 실패')
        throw new HttpException('유저 인증 실패', 401);
      throw e;
    }
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
    const imageUrlList = await this.imageUploadService.uploadImages(files);
    return { imageUrlList };
  }
}
