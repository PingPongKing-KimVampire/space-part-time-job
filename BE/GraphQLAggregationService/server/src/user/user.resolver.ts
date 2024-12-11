import { HttpException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Neighborhood, SetResidentNeighborhoodInput, User } from 'src/graphql';
import { UserService } from './user.service';
import { DistrictService } from 'src/district/district.service';
import { RpcException } from '@nestjs/microservices';

type UserData = {
  id: string;
  userId: string;
  nickname: string;
  phoneNumber: string;
  residentDistricts: { id: string; level: number }[];
};

@Resolver('User')
export class meResolver {
  constructor(
    private readonly userService: UserService,
    private readonly districtService: DistrictService,
  ) {}
  @Query('me')
  async getMe(@Context('req') req: Request): Promise<User> {
    const user: UserData = this.parseUserDataHeader(req);
    const residentNeighborhood =
      await this.getResidentNeighborhoodsByUserData(user);
    return {
      id: user.id,
      phoneNumber: user.phoneNumber,
      residentNeighborhood,
    } as User;
  }

  private async getResidentNeighborhoodsByUserData(
    user: UserData,
  ): Promise<Neighborhood[]> {
    if (!user.residentDistricts) {
      return null;
    }
    const neighborhoodsIdAndName = await this.getNeighborhoodIdAndNameById(
      user.residentDistricts.map((residentDistrict) => residentDistrict.id),
    );
    return neighborhoodsIdAndName.map((neighborhoodIdAndName) => ({
      id: neighborhoodIdAndName.id,
      name: neighborhoodIdAndName.name,
      level: user.residentDistricts.find(
        (district) => district.id === neighborhoodIdAndName.id,
      ).level,
    }));
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
      const user: UserData = this.parseUserDataHeader(req);
      await this.userService.setUserResidentDistrict(
        user.id,
        setResidentNeighborhoodInput.neighborhoods,
      );

      const neighborhoodsIdAndName = await this.getNeighborhoodIdAndNameById(
        setResidentNeighborhoodInput.neighborhoods.map((value) => value.id),
      );

      return neighborhoodsIdAndName.map((neighborhoodName, idx) => ({
        name: neighborhoodName.name,
        id: setResidentNeighborhoodInput.neighborhoods[idx].id,
        level: setResidentNeighborhoodInput.neighborhoods[idx].level,
      }));
    } catch (e) {
      if (e.details === '동네를 찾을 수 없음') {
        throw new RpcException(e.details);
      }
      throw new RpcException(e);
    }
  }

  async getNeighborhoodIdAndNameById(
    districtIdList: string[],
  ): Promise<{ id: string; name: string }[]> {
    const districtIdNameObj =
      await this.districtService.getDistrictNames(districtIdList);
    return Object.keys(districtIdNameObj).map((id) => ({
      id: id,
      name: districtIdNameObj[id],
    }));
  }
}
