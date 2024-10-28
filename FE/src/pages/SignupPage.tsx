import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Background,
  Container,
  SignupButton,
} from "../styles/SignupPage.styles.ts";
import checkRulePass from "../utils/checkRulePass.ts";
import { Title } from "../styles/LoginPage.styles.ts";
import UserInfoSection from "../components/SignupPage/UserInfoSection.tsx";
import PhoneNumberSection from "../components/SignupPage/PhoneNumberSection.tsx";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import { IP_ADDRESS } from "../constants/constants.ts";

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

const SignupPage = () => {
  useBackgroundColor("#F9FBFC");
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
  const [signupInfo, setSignupInfo] = useState({
    hasError: false,
    status: 0,
    errorMessage: "",
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
    const response = await fetch(
      `http://${IP_ADDRESS}/api/users/check-${fieldName}/${inputValue[fieldName]}`
    );
    if (!response.ok) {
      if (response.status === 409) {
        return { isDuplicated: true, hasError: false };
      }
      // 400, 500
      return {
        isDuplicated: false,
        hasError: true,
        errorMessage: "서버가 불안정합니다. 나중에 시도해주세요.",
      };
    }
    return { isDuplicated: false, hasError: false };
  };

  const checkValidation = async (fieldName: string, value?: string) => {
    value = value || inputValue[fieldName];
    // 규칙 통과 검사
    const isRulePassed = checkRulePass[fieldName](value);
    if ((fieldName !== "id" && fieldName !== "nickname") || !isRulePassed) {
      setIsValid((state) => ({ ...state, [fieldName]: { isRulePassed } }));
      return;
    }
    // 중복 검사
    const result = await checkDuplicated(fieldName);
    setIsValid((state) => ({
      ...state,
      [fieldName]: { isRulePassed, ...result },
    }));
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
    const response = await fetch(`http://${IP_ADDRESS}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        id: inputValue.id,
        password: inputValue.password,
        nickname: inputValue.nickname,
        phoneNumber: inputValue.phoneNumber.replaceAll("-", ""),
        smsCode: inputValue.authNumber,
      }),
    });
    if (!response.ok) {
      const data = await response.json();
      if (response.status === 409)
        return { hasError: true, status: 409, errorMessage: data.error };
      if (response.status === 401)
        return { hasError: true, status: 401, errorMessage: data.error };
      // 400, 500
      return {
        hasError: true,
        status: response.status,
        errorMessage: "서버가 불안정합니다. 나중에 다시 시도해주세요.",
      };
    }
    return {
      hasError: false,
    };
  };

  const SignupButtonClicked = async () => {
    const result = await signup();
    setSignupInfo((state) => ({ ...state, ...result }));
    if (!result.hasError) navigate("/create-job"); // 다음 페이지로 넘어가기
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
          signupInfo={signupInfo}
        />
        <PhoneNumberSection
          inputValue={inputValue}
          updateValue={updateInputValue}
          isValid={isValid}
          getIsValid={getIsValid}
          checkValidation={checkValidation}
          signupInfo={signupInfo}
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
