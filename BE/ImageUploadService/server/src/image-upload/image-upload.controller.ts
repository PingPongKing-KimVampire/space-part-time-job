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
import { GrpcMethod } from '@nestjs/microservices';

@Controller('/api/image-upload')
export class ImageUploadController {
  constructor(private readonly imageUploadService: ImageUploadService) {}

  @Post('')
  @UseInterceptors(FilesInterceptor('imageFiles'))
  async uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req: Request,
  ) {
    const userDataHeader = req.headers['space-part-time-job-user-data-base64'];
    const userId = this.parseUserDataHeader(userDataHeader);

    this.validateFile(files);
    const imageUrlList = await this.imageUploadService.uploadImageList(
      userId,
      files,
    );
    return { imageUrlList };
  }

  private validateFile(files: Array<Express.Multer.File>) {
    if (!files) throw new HttpException('파일이 없습니다.', 400);
    if (files.length > 10)
      throw new HttpException(`최대 파일개수 초과`, HttpStatus.BAD_REQUEST);
    const maxSize = 1024 * 1024 * 10;
    for (const file of files) {
      if (file.size > maxSize) {
        throw new HttpException(
          `파일 크기 초과 (최대 10MB)`,
          HttpStatus.PAYLOAD_TOO_LARGE,
        );
      }
    }
  }

  private parseUserDataHeader(userData: string | string[] | undefined): string {
    try {
      const decodedData = Buffer.from(userData as string, 'base64').toString(
        'utf-8',
      );
      let user = JSON.parse(decodedData);
      const { id: userId } = user;
      return userId;
    } catch (e) {
      console.error(e);
      throw new HttpException('예상하지 못한 오류', 500);
    }
  }

  @GrpcMethod('ImageUploadService', 'AreAllUserUrlList')
  async areAllUserURLList(data: {
    userId: string;
    urls: string[];
  }): Promise<{ result: boolean }> {
    const { userId, urls } = data;
    const isValid = await this.imageUploadService.areAllUserURLList(
      userId,
      urls,
    );
    return { result: isValid };
  }
}
