import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const gRPCPort = process.env.GRPC_PORT ?? 2500;
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'image_upload',
        protoPath: join(__dirname, 'image-upload/grpc/image_upload.proto'),
        url: `0.0.0.0:${gRPCPort}`,
        loader: { keepCase: true },
      },
    },
  );
  await grpcApp.listen();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  //   app.enableCors({
  //     origin: true,
  //     credentials: true,
  //   });
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
