import { Injectable, NotFoundException } from '@nestjs/common';
import { readFileSync, existsSync } from 'fs';
import * as path from 'path';

@Injectable()
export class DistrictService {
  private readonly districtsData: Record<string, string>;
  private readonly districtsNeighborsData: [any];

  constructor() {
    const { districtsData, districtsNeighborsData } = this.loadData();
    this.districtsData = districtsData;
    this.districtsNeighborsData = districtsNeighborsData;
  }

  private loadData(): {
    districtsData: Record<string, string>;
    districtsNeighborsData: any;
  } {
    const filePath = path.join(
      __dirname,
      '../../../district-data/districts-data.json',
    );

    console.log(filePath);

    if (!existsSync(filePath)) {
      throw new Error(`파일이 존재하지 않습니다: ${filePath}`);
    }

    const fileContent = readFileSync(filePath, 'utf-8');
    const fileData = JSON.parse(fileContent);

    const districtsNeighborsData = fileData;
    const districtsData = fileData.reduce((acc, district) => {
      acc[district.district_id] = district.district_korean_name;
      return acc;
    }, {});
    return { districtsData, districtsNeighborsData };
  }

  getDistricts(): { id: string; name: string }[] {
    return Object.entries(this.districtsData).map(([id, name]) => ({
      id,
      name,
    }));
  }

  getDistrictNeighbors(districtId: string): any {
    const districtsNeighborData = this.districtsNeighborsData.find(
      (data) => data.district_id === districtId,
    );
    if (!districtsNeighborData)
      throw new NotFoundException('동네를 찾을 수 없음');
    const ret = {
      levels: districtsNeighborData.levels,
    };
    return ret;
  }

  getDistrictNames(ids: string[]): Record<string, string> {
    return ids.reduce((acc, id) => {
      if (!this.districtsData[id]) throw new Error('동네를 찾을 수 없음');
      acc[id] = this.districtsData[id];
      return acc;
    }, {});
  }
}
