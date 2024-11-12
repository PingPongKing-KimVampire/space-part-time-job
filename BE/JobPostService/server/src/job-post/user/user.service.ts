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

interface AuthService {
  authenticateUser(data: { token: string }): Observable<{ id: string }>;
}

@Injectable()
export class UserService implements OnModuleInit {
  private authService: AuthService;
  private client: ClientGrpc;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const grpcUrl = this.configService.get<string>('GRPC_USER_SERVER_URL');
    const clientOptions: ClientOptions = {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: join(__dirname, './proto/auth.proto'),
        url: grpcUrl,
      },
    };
    this.client = ClientProxyFactory.create(
      clientOptions,
    ) as unknown as ClientGrpc;
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  async authenticateUser(token: string): Promise<{ id: string }> {
    try {
      const response = await this.authService
        .authenticateUser({ token })
        .toPromise();
      return {
        id: response.id,
      };
    } catch (e) {
      if (e.details === '유저 인증 실패') {
        throw new Error('유저 인증 실패');
      }
      //logging
      console.log(e);
      throw e;
    }
  }
}
