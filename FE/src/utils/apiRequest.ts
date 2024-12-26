import { ERROR, IP_ADDRESS } from "../constants/constants";

// TODO : 모든 api 요청 함수를 여기에 구현하기 (graphql 제외)

const apiRequest = async (
  requestUrl: string,
  requestInit: RequestInit = {},
  processData?: (data: any) => any
) => {
  let response: Response, data;
  try {
    response = await fetch(requestUrl, requestInit);
  } catch {
    throw new Error(ERROR.NETWORK);
  }
  if (response.status === 204) return; // No Content
  try {
    data = await response.json();
  } catch {
    throw new Error(ERROR.SERVER);
  }
  if (!response.ok && !data.error) throw new Error(ERROR.SERVER);
  return processData ? processData(data) : data;
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
  await apiRequest(`https://${IP_ADDRESS}/api/users/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};

export const checkDuplicated = async (
  fieldName: "id" | "nickname",
  value: string
) => {
  const data = await apiRequest(
    `https://${IP_ADDRESS}/api/users/check-${fieldName}/${value}`
  );
  if (data?.error === "아이디 중복")
    throw new Error(ERROR.SIGNUP.DUPLICATED_ID); // 409
  if (data?.error === "닉네임 중복")
    throw new Error(ERROR.SIGNUP.DUPLICATED_NICKNAME); // 409
};

export const signup = async ({
  id,
  password,
  nickname,
  phoneNumber,
  smsCode,
}) => {
  const data = await apiRequest(`https://${IP_ADDRESS}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      id,
      password,
      nickname,
      phoneNumber: phoneNumber.replace(/-/g, ""),
      smsCode,
    }),
  });
  if (data?.error === "닉네임 중복")
    throw Error(ERROR.SIGNUP.DUPLICATED_NICKNAME); // 409
  if (data?.error === "아이디 중복") throw Error(ERROR.SIGNUP.DUPLICATED_ID); // 409
  if (data?.error === "휴대폰 번호 중복")
    throw Error(ERROR.SIGNUP.DUPLICATED_PHONE_NUMBER); // 409
  if (data?.error === "휴대폰 인증 실패")
    throw Error(ERROR.INVALID_AUTH_NUMBER); // 401
};
