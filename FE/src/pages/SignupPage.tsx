import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Background,
  Container,
  SignupButton,
} from "../styles/SignupPage.styles";
import { checkRulePassInAuth } from "../utils/checkRulePass";
import { Title } from "../styles/LoginPage.styles";
import UserInfoSection from "../components/SignupPage/UserInfoSection.tsx";
import PhoneNumberSection from "../components/SignupPage/PhoneNumberSection.tsx";
import useBackgroundColor from "../utils/useBackgroundColor";
import { IP_ADDRESS, ERROR } from "../constants/constants";
import { MainBackgroundColor } from "../styles/global";

type InputValue = {
  id: string;
  password: string;
  nickname: string;
  phoneNumber: string;
  authNumber: string;
};

type IsValid = {
  id: {
    isDuplicated: boolean;
    isRulePassed: boolean;
    hasError: boolean;
    errorMessage: string;
  };
  password: { isRulePassed: boolean };
  nickname: {
    isDuplicated: boolean;
    isRulePassed: boolean;
    hasError: boolean;
    errorMessage: string;
  };
  phoneNumber: { isRulePassed: boolean };
  authNumber: { isRulePassed: boolean };
};

type CheckDuplicatedResponseData = {
  error: string;
};

type SignupResponseData = {
  error: string;
};

const SignupPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const [inputValue, setInputValue] = useState<InputValue>({
    id: "",
    password: "",
    nickname: "",
    phoneNumber: "",
    authNumber: "",
  });
  const [isValid, setIsValid] = useState<IsValid>({
    id: {
      isDuplicated: false,
      isRulePassed: false,
      hasError: false,
      errorMessage: "",
    },
    password: { isRulePassed: false },
    nickname: {
      isDuplicated: false,
      isRulePassed: false,
      hasError: false,
      errorMessage: "",
    },
    phoneNumber: { isRulePassed: false },
    authNumber: { isRulePassed: false },
  });
  const [signupWarning, setSignupWarning] = useState({
    userInfo: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  // 경고 문구 표시 여부 결정
  const getIsValid = (fieldName: string): boolean => {
    if (inputValue[fieldName] === "") return true;
    if (!isValid[fieldName].isRulePassed) return false;
    if (isValid[fieldName].isDuplicated) return false;
    if (isValid[fieldName].hasError) return false;
    return true;
  };

  const checkDuplicated = async (fieldName: "id" | "nickname") => {
    let response: Response;
    const requestUrl: string = `https://${IP_ADDRESS}/api/users/check-${fieldName}/${inputValue[fieldName]}`;
    try {
      response = await fetch(requestUrl);
    } catch {
      throw new Error(ERROR.NETWORK);
    }

    if (!response.ok) {
      let data: CheckDuplicatedResponseData;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error(ERROR.SERVER);
      }
      if (data.error === "아이디 중복")
        throw new Error(ERROR.SIGNUP.DUPLICATED_ID); // 409
      if (data.error === "닉네임 중복")
        throw new Error(ERROR.SIGNUP.DUPLICATED_NICKNAME); // 409
      throw new Error(ERROR.SERVER);
    }
  };

  const checkValidation = async (fieldName: string, value?: string) => {
    value = value !== undefined ? value : inputValue[fieldName];
    // 규칙 통과 검사
    const isRulePassed = checkRulePassInAuth[fieldName](value);
    if ((fieldName !== "id" && fieldName !== "nickname") || !isRulePassed) {
      setIsValid((state) => ({ ...state, [fieldName]: { isRulePassed } }));
      return;
    }
    // 중복 검사
    try {
      await checkDuplicated(fieldName);
      setIsValid((state) => ({
        ...state,
        [fieldName]: { isRulePassed, hasError: false },
      }));
    } catch (e) {
      setIsValid((state) => ({
        ...state,
        [fieldName]: { isRulePassed, hasError: true, errorMessage: e.message },
      }));
    }
  };

  const isAllValid = useMemo(() => {
    const { id, password, nickname, phoneNumber, authNumber } = isValid;
    if (!id.isRulePassed || id.isDuplicated || id.hasError) return false;
    if (!password.isRulePassed) return false;
    if (!nickname.isRulePassed || nickname.isDuplicated || nickname.hasError)
      return false;
    if (!phoneNumber.isRulePassed) return false;
    if (!authNumber.isRulePassed) return false;
    return true;
  }, [isValid]);

  const updateInputValue = useCallback((fieldName: string, value: string) => {
    setInputValue((state) => ({ ...state, [fieldName]: value }));
  }, []);

  const signup = async () => {
    let response: Response;
    try {
      response = await fetch(`https://${IP_ADDRESS}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          id: inputValue.id,
          password: inputValue.password,
          nickname: inputValue.nickname,
          phoneNumber: inputValue.phoneNumber.replace(/-/g, ""),
          smsCode: inputValue.authNumber,
        }),
      });
    } catch {
      return {
        phoneNumber: ERROR.NETWORK,
      };
    }

    if (!response.ok) {
      let data: SignupResponseData;
      try {
        data = await response.json();
      } catch {
        return {
          phoneNumber: ERROR.SERVER,
        };
      }
      if (data.error === "닉네임 중복")
        return { userInfo: ERROR.SIGNUP.DUPLICATED_NICKNAME }; // 409
      if (data.error === "아이디 중복")
        return { userInfo: ERROR.SIGNUP.DUPLICATED_ID }; // 409
      if (data.error === "휴대폰 번호 중복")
        return { phoneNumber: ERROR.SIGNUP.DUPLICATED_PHONE_NUMBER }; // 409
      if (data.error === "휴대폰 인증 실패")
        return { phoneNumber: ERROR.INVALID_AUTH_NUMBER }; // 401
      return {
        phoneNumber: ERROR.SERVER,
      }; // 400, 500
    }
  };

  const SignupButtonClicked = async () => {
    const error = await signup();
    if (error) {
      setSignupWarning({ userInfo: "", phoneNumber: "", ...error });
      return;
    }
    navigate("/login");
  };

  return (
    <Background>
      <Container>
        <Title>
          <div className="sub">
            <span>우</span>리 <span>주</span>변의 <span>알바</span>
          </div>
          <div className="main">우주 알바</div>
        </Title>
        <UserInfoSection
          inputValue={inputValue}
          updateValue={updateInputValue}
          isValid={isValid}
          getIsValid={getIsValid}
          checkValidation={checkValidation}
          signupWarning={signupWarning}
        />
        <PhoneNumberSection
          inputValue={inputValue}
          updateValue={updateInputValue}
          isValid={isValid}
          getIsValid={getIsValid}
          checkValidation={checkValidation}
          signupWarning={signupWarning}
        />
      </Container>
      <SignupButton
        className={isAllValid ? "" : "inactivated"}
        disabled={!isAllValid}
        onClick={SignupButtonClicked}
      >
        시작하기
      </SignupButton>
    </Background>
  );
};

export default SignupPage;
