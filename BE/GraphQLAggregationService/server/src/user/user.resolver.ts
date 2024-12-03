import { HttpException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Neighborhood, SetResidentNeighborhoodInput, User } from 'src/graphql';
import { UserService } from './user.service';
import { DistrictService } from 'src/district/district.service';
import { RpcException } from '@nestjs/microservices';

@Resolver('User')
export class meResolver {
  constructor(
    private readonly userService: UserService,
    private readonly districtService: DistrictService,
  ) {}
  @Query('me')
  async getMe(@Context('req') req: Request): Promise<User> {
    const user = this.parseUserDataHeader(req);

    if (user.residentDistricts) {
      user.residentDistricts = await this.getNeighborhoodById(
        user.residentDistricts,
      );
    }
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      residentNeighborhood: user.residentDistricts,
    } as User;
  }

  private parseUserDataHeader(req: Request): any {
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
  ): Promise<Neighborhood[]> {
    try {
      const user: User = this.parseUserDataHeader(req);
      await this.userService.setUserResidentDistrict(
        user.id,
        setResidentNeighborhoodInput.neighborhoods,
      );

      return await this.getNeighborhoodById(
        setResidentNeighborhoodInput.neighborhoods.map((value) => value.id),
      );
    } catch (e) {
      if (e.details === '동네를 찾을 수 없음') {
        throw new RpcException(e.details);
      }
      throw new RpcException(e);
    }
  }

  async getNeighborhoodById(districtIdList: string[]) {
    const districtIdNameObj =
      await this.districtService.getDistrictNames(districtIdList);
    return Object.keys(districtIdNameObj).map((id) => ({
      id,
      name: districtIdNameObj[id],
    }));
  }
}
