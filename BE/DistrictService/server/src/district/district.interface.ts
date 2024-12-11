export type DistrictId = string;
export type DistrictName = string;

export interface Coordinate {
  longitude: number;
  latitude: number;
}

export interface OuterBoundary {
  type: 'Polygon';
  coordinates: Coordinate[];
}

export interface districtBrief {
  id: DistrictId;
  name: DistrictId;
}

export interface NeighborDistrict {
  districts: districtBrief[];
  outer_boundary: OuterBoundary;
}

export interface DistrictLevels {
  1: NeighborDistrict;
  2: NeighborDistrict;
  3: NeighborDistrict;
  4: NeighborDistrict;
}

export interface District {
  district_id: string;
  district_korean_name: string;
  district_english_name: string;
  levels: DistrictLevels;
}
