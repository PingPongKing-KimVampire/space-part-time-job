import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Photo } from './mongoose/photos.schema';
import { Model } from 'mongoose';

@Injectable()
export class ImageUploadService {
  s3Client: S3Client;
  private readonly MAX_USER_PHOTO_LIMIT = 50;

  constructor(
    private configService: ConfigService,
    @InjectModel(Photo.name) private readonly photoModel: Model<Photo>,
  ) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  async uploadImageList(userId: string, files: Array<Express.Multer.File>) {
    try {
      const uploadPromiseList = files.map((file) => {
        const fileName = uuidv4();
        return this.imageUploadToRemoteRepository(
          fileName,
          file,
          file.mimetype,
        );
      });

      const uploadedFileNameList = await Promise.all(uploadPromiseList);

      this.runAsyncPhotoSaveAndLimitEnforcement(
        userId,
        uploadedFileNameList,
      ).catch((e) => {
        console.error('(비동기 작업) 유저 이미지 저장 오류:', e);
      });

      return uploadedFileNameList.map((uploadedFilename) =>
        this.getPhotoUrl(uploadedFilename),
      );
    } catch (e) {
      console.error('원격 서버 이미지 업로드 오류', e);
      throw new Error('원격 서버 이미지 업로드 에러');
    }
  }

  private async runAsyncPhotoSaveAndLimitEnforcement(
    userId: string,
    uploadedFileNameList: string[],
  ) {
    const photoDocumentList = uploadedFileNameList.map((uploadedFilename) => ({
      user_id: userId,
      file_name: uploadedFilename,
    }));
    await this.photoModel.insertMany(photoDocumentList);

    const existingPhotoList = await this.photoModel
      .find({ user_id: userId })
      .sort({ uploaded_at: 1 });
    if (existingPhotoList.length > this.MAX_USER_PHOTO_LIMIT) {
      const deletePhotos = existingPhotoList.slice(
        0,
        existingPhotoList.length - this.MAX_USER_PHOTO_LIMIT,
      );

      const deletePhotoIdList = deletePhotos.map((photo) => photo._id);
      await this.photoModel.deleteMany({ _id: { $in: deletePhotoIdList } });

      const deleteFileNameList = deletePhotos.map((photo) => photo.file_name);
      deleteFileNameList.forEach((fileName) => {
        this.imageDeleteToRemoteRepository(fileName).catch((err) => {
          console.error(`원격 저장소에서 파일 삭제 오류: ${fileName}`, err);
        });
      });
    }
  }

  private async imageUploadToRemoteRepository(
    fileName: string,
    file: Express.Multer.File,
    mimeType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName,
      Body: file.buffer,
      ContentType: mimeType,
    });
    await this.s3Client.send(command);
    return fileName;
  }

  private getPhotoUrl(fileName: string) {
    const awsRegion = this.configService.get('AWS_REGION');
    const bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
    return `https://s3.${awsRegion}.amazonaws.com/${bucketName}/${fileName}`;
  }

  private async imageDeleteToRemoteRepository(fileName: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: fileName,
    });
    await this.s3Client.send(command);
  }

  async areAllUserURLList(user_id: string, urls: string[]): Promise<boolean> {
    try {
      const userPhotos = await this.photoModel
        .find({ user_id })
        .select('file_name');

      const userFileNameList = userPhotos.map((photo) => photo.file_name);

      const extractedFileNames = urls.map((url) => {
        const urlParts = url.split('/');
        return urlParts[urlParts.length - 1];
      });

      return extractedFileNames.every((fileName) =>
        userFileNameList.includes(fileName),
      );
    } catch (error) {
      console.error('URL 검증 중 오류 발생:', error);
      return false;
    }
  }
}
