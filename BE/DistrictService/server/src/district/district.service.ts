import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import * as path from 'path';
import {
  District,
  DistrictId,
  DistrictLevels,
  DistrictName,
} from './district.interface';
import { SrcDistrict } from './src-district.interface';

@Injectable()
export class DistrictService {
  private readonly districtsIdNameMappingData: Record<DistrictId, DistrictName>;
  private readonly districtsNeighborsData: District[];

  constructor() {
    const { districtsIdNameMappingData, districtsNeighborsData } =
      this.loadData();
    this.districtsIdNameMappingData = districtsIdNameMappingData;
    this.districtsNeighborsData = districtsNeighborsData;
  }

  private loadData(): {
    districtsIdNameMappingData: Record<DistrictId, DistrictName>;
    districtsNeighborsData: District[];
  } {
    const filePath = path.join(
      __dirname,
      '../../../district-data/districts-data.json',
    );
    if (!existsSync(filePath)) {
      throw new Error(`파일이 존재하지 않습니다: ${filePath}`);
    }

    const fileContent = readFileSync(filePath, 'utf-8');
    const srcDistrictData = JSON.parse(fileContent) as SrcDistrict[];

    const districtsIdNameMappingData = srcDistrictData.reduce(
      (acc, district) => {
        acc[district.district_id] = district.district_korean_name;
        return acc;
      },
      {},
    );

    const districtsNeighborsData: any = srcDistrictData.map((srcDistrict) => ({
      district_id: srcDistrict.district_id,
      district_korean_name: srcDistrict.district_korean_name,
      district_english_name: srcDistrict.district_english_name,
      levels: [1, 2, 3, 4].reduce((acc, level) => {
        acc[level] = {
          districts: srcDistrict.levels[level].districts.map((districtId) => ({
            id: districtId,
            name: districtsIdNameMappingData[districtId],
          })),
          outer_boundary: srcDistrict.levels[level].outer_boundary,
        };
        return acc;
      }, {}),
    }));
    return { districtsIdNameMappingData, districtsNeighborsData };
  }

  getDistricts(): { id: DistrictId; name: DistrictName }[] {
    return Object.entries(this.districtsIdNameMappingData).map(
      ([id, name]) => ({
        id,
        name,
      }),
    );
  }

  getDistrictNeighbors(districtId: string): { levels: DistrictLevels } {
    const districtNeighborsData = this.districtsNeighborsData.find(
      (data) => data.district_id === districtId,
    );
    if (!districtNeighborsData)
      throw new NotFoundException('동네를 찾을 수 없음');
    const ret = {
      levels: districtNeighborsData.levels,
    };
    return ret;
  }

  getDistrictNames(ids: string[]): Record<DistrictId, DistrictName> {
    return ids.reduce((acc, id) => {
      if (!this.districtsIdNameMappingData[id])
        throw new Error('동네를 찾을 수 없음');
      acc[id] = this.districtsIdNameMappingData[id];
      return acc;
    }, {});
  }
}
