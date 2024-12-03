import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientGrpc,
  ClientOptions,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { lastValueFrom, Observable } from 'rxjs';

interface DistrictServiceGrpc {
  GetDistrictNames(data: {
    ids: string[];
  }): Observable<{ district_names: Record<string, string> }>;
}

@Injectable()
export class DistrictService implements OnModuleInit {
  private districtServiceGrpc: DistrictServiceGrpc;

  constructor() {}

  onModuleInit() {
    const grpcUrl = process.env.GRPC_DISTRICT_SERVER_URL;

    const clientOptions: ClientOptions = {
      transport: Transport.GRPC,
      options: {
        package: 'district',
        protoPath: join(__dirname, './grpc/district.proto'),
        url: grpcUrl,
      },
    };

    const grpcClient = ClientProxyFactory.create(
      clientOptions,
    ) as unknown as ClientGrpc;
    this.districtServiceGrpc =
      grpcClient.getService<DistrictServiceGrpc>('DistrictService');
  }

  async getDistrictNames(ids: string[]): Promise<Record<string, string>> {
    try {
      const response = await lastValueFrom(
        this.districtServiceGrpc.GetDistrictNames({ ids }),
      );
      return response.district_names;
    } catch (e) {
      if (e.details === '동네를 찾을 수 없음') throw new Error(e.details);
      console.error('DistrictService gRPC 에러 발생:', e);
      throw new Error(e.details);
    }
  }
}
