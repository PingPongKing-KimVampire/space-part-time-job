import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientGrpc,
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

interface ImageUploadServiceClient {
  areAllUserUrlList(data: {
    userId: string;
    urls: string[];
  }): Observable<{ result: boolean }>;
}

@Injectable()
export class ImageUploadService implements OnModuleInit {
  private imageUploadService: ImageUploadServiceClient;
  private client: ClientGrpc;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const grpcImageUploadServerURL = this.configService.get<string>(
      'GRPC_IMAGE_UPLOAD_SERVER_URL',
    );
    const clientOptions: ClientOptions = {
      transport: Transport.GRPC,
      options: {
        package: 'image_upload',
        protoPath: join(__dirname, './proto/image_upload.proto'),
        url: grpcImageUploadServerURL,
      },
    };
    this.client = ClientProxyFactory.create(
      clientOptions,
    ) as unknown as ClientGrpc;
    this.imageUploadService =
      this.client.getService<ImageUploadServiceClient>('ImageUploadService');
  }

  async areAllUserImageURLList(
    userId: string,
    urls: string[],
  ): Promise<boolean> {
    if (!urls || urls.length === 0) return true;
    try {
      const response = await this.imageUploadService
        .areAllUserUrlList({ userId: userId, urls })
        .toPromise();
      return response.result;
    } catch (e) {
      console.log('URL 검증 실패:', e);
      throw e;
    }
  }
}
