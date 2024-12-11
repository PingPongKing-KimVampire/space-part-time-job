import { Controller, Get, Param } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { DistrictService } from './district.service';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  getDistricts(): { districts: Record<string, string>[] } {
    return { districts: this.districtService.getDistricts() };
  }

  @Get(':id/neighbors')
  getDistrictNeighbors(@Param('id') id: string) {
    return this.districtService.getDistrictNeighbors(id);
  }

  @GrpcMethod('DistrictService', 'GetDistrictNames')
  getDistrictNames(data: { ids: string[] }): {
    district_names: Record<string, string>;
  } {
    try {
      const districtNames = this.districtService.getDistrictNames(data.ids);
      return { district_names: districtNames };
    } catch (e) {
      if (e.message === '동네를 찾을 수 없음') {
        throw new RpcException('동네를 찾을 수 없음');
      }
      throw e;
    }
  }
}
