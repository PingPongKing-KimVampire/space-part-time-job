import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { JobPostResolver } from './job-post/job-post.resolver';
import { meResolver } from './user/user.resolver';

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
  ],
  controllers: [AppController],
  providers: [AppService, JobPostResolver, meResolver],
})
export class AppModule {}
