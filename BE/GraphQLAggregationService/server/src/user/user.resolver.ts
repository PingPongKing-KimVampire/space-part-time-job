import { HttpException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Neighborhood, SetResidentNeighborhoodInput, User } from 'src/graphql';
import { UserService } from './user.service';

@Resolver('User')
export class meResolver {
  constructor(private readonly userService: UserService) {}
  @Query('me')
  getMe(@Context('req') req: Request) {
    const user = this.parseUserDataHeader(req);
    return user;
  }

  private parseUserDataHeader(req: Request): User {
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

  @Mutation('setResidentNeighborhood')
  async setResidentNeighborhood(
    @Args('input') setResidentNeighborhoodInput: SetResidentNeighborhoodInput,
    @Context('req') req: Request,
  ): Promise<[Neighborhood]> {
    const user: User = this.parseUserDataHeader(req);
    await this.userService.setUserResidentDistrict(
      user.id,
      setResidentNeighborhoodInput.neighborhoods,
    );

    return setResidentNeighborhoodInput.neighborhoods.map(
      (NeighborhoodInput) => ({
        id: NeighborhoodInput.id,
        name: '하드코딩',
      }),
    ) as [Neighborhood];
  }
}
