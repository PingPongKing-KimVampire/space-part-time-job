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
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          arrays: true,
          objects: true,
        },
      },
    };

    const grpcClient = ClientProxyFactory.create(
      clientOptions,
    ) as unknown as ClientGrpc;
    this.districtServiceGrpc =
      grpcClient.getService<DistrictServiceGrpc>('DistrictService');
  }

  //행정동 ID가 키이고, 이름이 값인 객체를 반환한다.
  async getDistrictNames(ids: string[]): Promise<Record<string, string>> {
    const response = await lastValueFrom(
      this.districtServiceGrpc.GetDistrictNames({ ids }),
    );
    return response.district_names;
  }
}
