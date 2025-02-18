import apiRequest from "./apiRequest.ts";
import { Neighborhood } from "../../types/types.ts";
import { IP_ADDRESS } from "../../constants/constants.ts";

export const fetchTotalNeighborhoods = async (): Promise<Neighborhood[]> => {
  return await apiRequest(
    `https://${IP_ADDRESS}/district`,
    {},
    (data) => data.districts
  );
};

export const fetchDistrictBoundary = async (id) => {
  return await apiRequest(
    `https://${IP_ADDRESS}/district/${id}/neighbors`,
    {},
    (data) => data.levels
  );
};

export const fetchCoordinateByAddress = async (address) => {
  return await apiRequest(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      address
    )}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
      },
    },
    (data) => {
      if (!data?.documents?.length) return null;
      return { x: data.documents[0].x, y: data.documents[0].y };
    }
  );
};

export const fetchNeighborhoodInfoByCoordinate = async ({ x, y }) => {
  return await apiRequest(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${x}&y=${y}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
      },
    },
    (data) => {
      const neighborhood = data.documents.find(
        (document) => document.region_type === "H"
      );
      return { id: neighborhood.code, name: neighborhood.region_3depth_name };
    }
  );
};
