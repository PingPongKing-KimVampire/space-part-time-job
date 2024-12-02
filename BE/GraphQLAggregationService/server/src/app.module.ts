import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { JobPostModule } from './job-post/job-post.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphQL'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      path: '/api/graphql',
    }),
    ConfigModule.forRoot(),
    UserModule,
    JobPostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
