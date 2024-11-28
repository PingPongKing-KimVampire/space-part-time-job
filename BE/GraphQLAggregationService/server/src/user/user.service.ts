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
import { NeighborhoodInput } from 'src/graphql';

interface UserServiceGrpc {
  setUserResidentDistrict(data: {
    userId: string;
    residentDistrict: string[];
  }): Observable<void>;
}

@Injectable()
export class UserService implements OnModuleInit {
  private userServiceGrpc: UserServiceGrpc;
  private client: ClientGrpc;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const grpcUrl = this.configService.get<string>('GRPC_USER_SERVER_URL');
    const clientOptions: ClientOptions = {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: join(__dirname, './grpc/user.proto'),
        url: grpcUrl,
      },
    };
    this.client = ClientProxyFactory.create(
      clientOptions,
    ) as unknown as ClientGrpc;
    this.userServiceGrpc =
      this.client.getService<UserServiceGrpc>('UserService');
  }

  async setUserResidentDistrict(
    userId: string,
    neighborhoodInputs: NeighborhoodInput[],
  ): Promise<void> {
    try {
      const residentDistricts = neighborhoodInputs.map(
        (neighborhoodInput) => neighborhoodInput.id,
      );
      return await this.userServiceGrpc
        .setUserResidentDistrict({
          userId,
          residentDistrict: residentDistricts,
        })
        .toPromise();
    } catch (e) {
      console.error('예상하지 못한 에러', e);
      throw e;
    }
  }
}
