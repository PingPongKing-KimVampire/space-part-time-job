import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const gRPCPort = process.env.GRPC_PORT ?? 2500;
  console.log(gRPCPort);
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'jobApply',
        protoPath: join(__dirname, 'job-apply/grpc/proto/job-apply.proto'),
        url: `0.0.0.0:${gRPCPort}`,
      },
    },
  );
  grpcApp.listen();
}
bootstrap();
