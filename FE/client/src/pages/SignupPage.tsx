import React, { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { checkDuplicated, signup } from "../api/rest/auth.ts";
import {
  Background,
  Container,
  SignupButton,
} from "../styles/pages/SignupPage.styles";
import { checkRulePassInAuth } from "../utils/checkRulePass";
import { Title } from "../styles/pages/LoginPage.styles";
import UserInfoSection from "../components/SignupPage/UserInfoSection.tsx";
import PhoneNumberSection from "../components/SignupPage/PhoneNumberSection.tsx";
import useBackgroundColor from "../utils/useBackgroundColor";
import { ERROR } from "../constants/constants";
import { MainBackgroundColor } from "../styles/global";

type InputValue = {
  id: string;
  password: string;
  nickname: string;
  phoneNumber: string;
  smsCode: string;
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
  smsCode: { isRulePassed: boolean };
};

const SignupPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const [inputValue, setInputValue] = useState<InputValue>({
    id: "",
    password: "",
    nickname: "",
    phoneNumber: "",
    smsCode: "",
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
    smsCode: { isRulePassed: false },
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
      await checkDuplicated(fieldName, inputValue[fieldName]);
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
    const { id, password, nickname, phoneNumber, smsCode } = isValid;
    if (!id.isRulePassed || id.isDuplicated || id.hasError) return false;
    if (!password.isRulePassed) return false;
    if (!nickname.isRulePassed || nickname.isDuplicated || nickname.hasError)
      return false;
    if (!phoneNumber.isRulePassed) return false;
    if (!smsCode.isRulePassed) return false;
    return true;
  }, [isValid]);

  const updateInputValue = useCallback((fieldName: string, value: string) => {
    setInputValue((state) => ({ ...state, [fieldName]: value }));
  }, []);

  const SignupButtonClicked = async () => {
    try {
      await signup(inputValue);
    } catch (e) {
      console.log("e", e);
      if (
        e.message === ERROR.SIGNUP.DUPLICATED_NICKNAME ||
        e.message === ERROR.SIGNUP.DUPLICATED_ID
      ) {
        setSignupWarning({ userInfo: e.message, phoneNumber: "" });
      } else {
        setSignupWarning({ userInfo: "", phoneNumber: e.message });
      }
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
        <SignupButton
          className={isAllValid ? "" : "inactivated"}
          disabled={!isAllValid}
          onClick={SignupButtonClicked}
        >
          시작하기
        </SignupButton>
      </Container>
    </Background>
  );
};

export default SignupPage;
