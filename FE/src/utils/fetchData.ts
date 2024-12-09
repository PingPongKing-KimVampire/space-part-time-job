import { ERROR, IP_ADDRESS } from "../constants/constants";

// TODO : 모든 데이터 패치 함수를 여기에 구현하기 (graphql 제외)

const fetchData = async (requestUrl, headers, processData) => {
  let response: Response, data;
  try {
    response = await fetch(requestUrl, { headers });
  } catch {
    throw new Error(ERROR.NETWORK);
  }
  if (!response.ok) throw new Error(ERROR.SERVER);
  try {
    data = await response.json();
  } catch {
    throw new Error(ERROR.SERVER);
  }
  return processData(data);
};

export const fetchDistrictBoundary = async (id) => {
  return await fetchData(
    `https://${IP_ADDRESS}/district/${id}/neighbors`,
    {},
    (data) => {
      for (const level in data.levels) {
        // TODO : 백엔드에서 위도, 경도 순서 바꾸면 제거하기
        data.levels[level].outer_boundary.coordinates.forEach((coordinate) => {
          coordinate.reverse();
        });
      }
      return data.levels;
    }
  );
};

export const fetchCoordinateByAddress = async (address) => {
  return await fetchData(
    `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
      address
    )}`,
    {
      Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
    },
    (data) => {
      if (!data?.documents?.length) return null;
      return { x: data.documents[0].x, y: data.documents[0].y };
    }
  );
};

export const fetchNeighborInfoByCoordinate = async ({ x, y }) => {
  return await fetchData(
    `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${x}&y=${y}`,
    {
      Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
    },
    (data) => {
      const neighbor = data.documents.find(
        (document) => document.region_type === "H"
      );
      return { id: neighbor.code, name: neighbor.region_3depth_name };
    }
  );
};
