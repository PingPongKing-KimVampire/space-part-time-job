import React, { useState, useEffect } from "react";
import CustomInput from "../components/CustomInput.tsx";
import PhoneNumberInput from "../components/PhoneNumberInput.tsx";
import {
  Background,
  Container,
  PhoneNumberContainer,
  SendNumberButton,
  SignupButton,
  TimeCounter,
} from "../styles/SignupPage.styles.ts";
import {
  validateId,
  validatePassword,
  validateNickname,
  validateAuthNumber,
} from "../utils/validation.ts";
import NotificationBox from "../components/NotificationBox.tsx";
import { WarningText } from "../styles/global.ts";

const SignupPage = () => {
  const [inputValue, setInputValue] = useState({
    id: "",
    password: "",
    nickname: "",
    phoneNumber: "",
    authNumber: "",
  });
  const [isValid, setIsValid] = useState({
    id: false,
    password: false,
    nickname: false,
    phoneNumber: false,
    authNumber: false,
  });

  const [isNotiVisible, setIsNotiVisible] = useState(false); // 남은 인증번호 전송 가능 횟수를 표시하는 노티 표시 여부
  const [warningTexts, setWarningTexts] = useState(["", ""]); // 경고 문구
  const [isSendButtonClicked, setIsSendButtonClicked] = useState(false); // 인증번호 전송 버튼이 클릭된 적 있나?

  const [timeCountDown, setTimeCountDown] = useState(null); // 인증번호 전송 후 카운트다운 정보

  const sendNumberButtonClicked = () => {
    // 인증번호 전송 버튼 클릭
    setIsSendButtonClicked(true); // 인증번호 입력란 표시
    // 남은 인증번호 전송 가능 횟수를 표시하는 노티를 표시했다가 3초 후 다시 제거
    setIsNotiVisible(true);
    setTimeout(() => {
      setIsNotiVisible(false);
    }, 2000);
    // 5분 카운트다운 시작
  };

  useEffect(() => {
    const getFirstWarning = () => {
      // 아이디, 비밀번호, 닉네임
      if (!getIsValid("id"))
        return "* 아이디는 5~20자의 영문 소문자, 숫자를 사용해 주세요.";
      if (!getIsValid("password"))
        return "* 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.";
      if (!getIsValid("nickname"))
        return "* 닉네임은 1~10자의 한글, 영문, 숫자를 사용해 주세요.";
      return "";
    };
    const getSecondWarning = () => {
      // 전화번호
      if (!getIsValid("phoneNumber")) return "* 전화번호가 유효하지 않습니다.";
      return "";
    };
    setWarningTexts([getFirstWarning(), getSecondWarning()]);
  }, [isValid]);

  // 경고 문구 표시 여부 (비어있지 않으면서 유효하지 않은 경우)
  const getIsValid = (fieldName: string): boolean => {
    return isValid[fieldName] || inputValue[fieldName] === "";
  };

  return (
    <Background>
      <Container>
        <div>
          <CustomInput
            id="id"
            placeholder="아이디 (5~10자의 영문 소문자, 숫자)"
            borderType="multi-top"
            invalid={!getIsValid("id")}
            value={inputValue.id}
            eventHandlers={{
              onChange: (e) => {
                setInputValue((state) => ({ ...state, id: e.target.value }));
              },
              onBlur: () => {
                setIsValid((state) => ({
                  ...state,
                  id: validateId(inputValue.id),
                }));
              },
            }}
          />
          <CustomInput
            id="password"
            placeholder="비밀번호 (8~16자의 영문 대/소문자, 숫자, 특수문자)"
            type="password"
            borderType="multi-middle"
            invalid={!getIsValid("password")}
            value={inputValue.password}
            eventHandlers={{
              onChange: (e) => {
                setInputValue((state) => ({
                  ...state,
                  password: e.target.value,
                }));
              },
              onBlur: () => {
                setIsValid((state) => ({
                  ...state,
                  password: validatePassword(inputValue.password),
                }));
              },
            }}
          />
          <CustomInput
            id="nickname"
            placeholder="닉네임 (1~10자의 한글, 영문, 숫자)"
            borderType="multi-bottom"
            invalid={!getIsValid("nickname")}
            value={inputValue.nickname}
            eventHandlers={{
              onChange: (e) => {
                setInputValue((state) => ({
                  ...state,
                  nickname: e.target.value,
                }));
              },
              onBlur: () => {
                setIsValid((state) => ({
                  ...state,
                  nickname: validateNickname(inputValue.nickname),
                }));
              },
            }}
          />
        </div>
        <WarningText>{warningTexts[0]}</WarningText>
        <PhoneNumberContainer>
          <PhoneNumberInput
            invalid={!getIsValid("phoneNumber")}
            value={inputValue.phoneNumber}
            setValue={(value) => {
              setInputValue((state) => ({ ...state, phoneNumber: value }));
            }}
            setIsValid={(isValid) => {
              setIsValid((state) => ({ ...state, phoneNumber: isValid }));
            }}
          />
          <SendNumberButton
            onClick={sendNumberButtonClicked}
            className={!isValid.phoneNumber ? "inactivated" : ""}
            disabled={!isValid.phoneNumber}
          >
            인증번호 {isSendButtonClicked ? "재" : ""}전송
            <TimeCounter>4분 50초</TimeCounter>
          </SendNumberButton>
          {isSendButtonClicked && (
            <CustomInput
              id="authNumber"
              placeholder="인증번호"
              borderType="single"
              invalid={false}
              value={inputValue.authNumber}
              eventHandlers={{
                onChange: (e) => {
                  setInputValue((state) => ({
                    ...state,
                    authNumber: e.target.value,
                  }));
                },
                onBlur: () => {
                  setIsValid((state) => ({
                    ...state,
                    authNumber: validateAuthNumber(inputValue.authNumber),
                  }));
                },
              }}
            />
          )}
        </PhoneNumberContainer>
        <WarningText>{warningTexts[1]}</WarningText>
      </Container>
      <SignupButton
        className={Object.values(isValid).every(Boolean) ? "" : "inactivated"}
        disabled={!Object.values(isValid).every(Boolean)}
      >
        시작하기
      </SignupButton>
      {isNotiVisible && (
        <NotificationBox>
          일일 인증번호 전송 가능 횟수가 4회 남았습니다.
        </NotificationBox>
      )}
    </Background>
  );
};

export default SignupPage;
