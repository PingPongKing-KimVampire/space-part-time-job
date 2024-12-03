import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  //   const gRPCPort = process.env.GRPC_PORT ?? 2500;
  //   const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
  //     AppModule,
  //     {
  //       transport: Transport.GRPC,
  //       options: {
  //         package: 'district',
  //         protoPath: join(__dirname, 'grpc/district.proto'),
  //         url: `0.0.0.0:${gRPCPort}`,
  //       },
  //     },
  //   );
  //   await grpcApp.listen();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
