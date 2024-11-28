import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver('JobPost')
export class JobPostResolver {
  @Query('getJobPost')
  getJobPost(@Args('id') id: string) {
    console.log(id);
    return null;
  }
}
