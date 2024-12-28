import apiRequest from "./apiRequest.ts";
import { Neighbor } from "../../pages/SearchNeighborPage.tsx";
import { IP_ADDRESS } from "../../constants/constants.ts";

export const fetchTotalNeighbors = async (): Promise<Neighbor[]> => {
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

export const fetchNeighborInfoByCoordinate = async ({ x, y }) => {
  return await apiRequest(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${x}&y=${y}`,
    {
      headers: {
        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
      },
    },
    (data) => {
      const neighbor = data.documents.find(
        (document) => document.region_type === "H"
      );
      return { id: neighbor.code, name: neighbor.region_3depth_name };
    }
  );
};
