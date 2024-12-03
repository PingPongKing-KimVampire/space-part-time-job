import { Controller, Get, Param } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { DistrictService } from './district.service';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  getDistricts() {
    return { districts: this.districtService.getDistricts() };
  }

  @Get(':id/neighbors')
  getDistrictNeighbors(@Param('id') id: string) {
    return this.districtService.getDistrictNeighbors(id);
  }

  //   @GrpcMethod('DistrictService', 'GetDistrictNames')
  //   getDistrictNames(data: { ids: string[] }): {
  //     district_names: Record<string, string>;
  //   } {
  //     const districtNames = this.districtService.getDistrictNames(data.ids);
  //     return { district_names: districtNames };
  //   }
}
