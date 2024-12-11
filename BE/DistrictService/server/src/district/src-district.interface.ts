interface Coordinate {
  longitude: number;
  latitude: number;
}

interface OuterBoundary {
  type: 'Polygon';
  coordinates: Coordinate[];
}

interface NeighborDistrict {
  districts: string[];
  outer_boundary: OuterBoundary;
}

interface DistrictLevels {
  1: NeighborDistrict;
  2: NeighborDistrict;
  3: NeighborDistrict;
  4: NeighborDistrict;
}

export interface SrcDistrict {
  district_id: string;
  district_korean_name: string;
  district_english_name: string;
  levels: DistrictLevels;
}
