import apiRequest from "./apiRequest.ts";
import { IP_ADDRESS, ERROR, LOGIN_TAB } from "../../constants/constants.ts";

// ===== 회원가입 =====

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

export const sendSmsCodeAtSignup = async (
  phoneNumber: string
): Promise<number> => {
  const data = await apiRequest(
    `https://${IP_ADDRESS}/api/users/phone-auth-code`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        phoneNumber: phoneNumber.replace(/-/g, ""),
      }),
    }
  );
  if (data?.error === "하루 최대요청 횟수 초과")
    throw new Error(ERROR.AUTH_NUMBER_SEND_COUNT_EXCEED); // 409
  if (data?.error === "전화번호 중복")
    throw new Error(ERROR.SIGNUP.DUPLICATED_PHONE_NUMBER); // 409
  return data.remainingPhoneAuthenticationCount || 0;
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

// ===== 로그인 =====

export const sendSmsCodeAtLogin = async (
  phoneNumber: string
): Promise<number> => {
  const data = await apiRequest(
    `https://${IP_ADDRESS}/api/users/login/phone-auth-code`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        phoneNumber: phoneNumber.replace(/-/g, ""),
      }),
    }
  );
  if (data?.error === "하루 최대요청 횟수 초과")
    throw new Error(ERROR.AUTH_NUMBER_SEND_COUNT_EXCEED); // 409
  if (data?.error === "존재하지 않는 사용자")
    throw new Error(ERROR.LOGIN.PHONE_NUMBER_NOT_EXIST); // 409
  return data.remainingPhoneAuthenticationCount || 0;
};

type LoginBody = {
  id?: string;
  password?: string;
  phoneNumber?: string;
  smsCode?: string;
};

export const login = async (tab: LOGIN_TAB, input: LoginBody) => {
  const { id, password, phoneNumber, smsCode } = input;
  const body: LoginBody = {};
  let requestUrl: string = "";
  if (tab === LOGIN_TAB.ID_PW) {
    body.id = id;
    body.password = password;
    requestUrl = `https://${IP_ADDRESS}/api/users/login`;
  } else if (tab === LOGIN_TAB.PHONE_NUMBER) {
    body.phoneNumber = phoneNumber?.replace(/-/g, "");
    body.smsCode = smsCode;
    requestUrl = `https://${IP_ADDRESS}/api/users/login/phone`;
  }
  const data = await apiRequest(requestUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
    credentials: "include",
  });
  if (data?.error === "아이디/패스워드 로그인 실패")
    throw new Error(ERROR.LOGIN.INVALID_ID_PW); // 401
  if (data?.error === "휴대폰 인증 실패")
    throw new Error(ERROR.INVALID_AUTH_NUMBER); // 401
};

// ===== 로그아웃 =====

export const logout = async () => {
  await apiRequest(`https://${IP_ADDRESS}/api/users/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
};
