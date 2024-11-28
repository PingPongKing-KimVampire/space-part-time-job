import { HttpException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SetResidentNeighborhoodInput } from 'src/graphql';

@Resolver('User')
export class meResolver {
  @Query('me')
  getMe(@Context('req') req: Request) {
    const user = this.parseUserDataHeader(req);
    return user;
  }

  private parseUserDataHeader(req: Request): string {
    try {
      const userDataHeader =
        req.headers['space-part-time-job-user-data-base64'];
      const decodedData = Buffer.from(
        userDataHeader as string,
        'base64',
      ).toString('utf-8');
      let user = JSON.parse(decodedData);
      return user;
    } catch (e) {
      console.error(e);
      throw new HttpException('예상하지 못한 오류', 500);
    }
  }

}
