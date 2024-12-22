import { ERROR, IP_ADDRESS } from "../constants/constants";

// TODO : 모든 api 요청 함수를 여기에 구현하기 (graphql 제외)

const apiRequest = async (
  requestUrl: string,
  requestInit: RequestInit,
  processData?: (data: any) => any
) => {
  let response: Response, data;
  try {
    response = await fetch(requestUrl, requestInit);
  } catch {
    throw new Error(ERROR.NETWORK);
  }
  if (!response.ok) throw new Error(ERROR.SERVER);
  try {
    data = await response.json();
  } catch {
    throw new Error(ERROR.SERVER);
  }
  return processData ? processData(data) : null;
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

export const requestLogout = async () => {
  await apiRequest(`http://${IP_ADDRESS}/api/users/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
};
