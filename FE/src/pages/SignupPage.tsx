import React, { useState, useEffect } from "react";
import CustomInput from "../components/CustomInput.tsx";
import PhoneNumberInput from "../components/PhoneNumberInput.tsx";
import PasswordInput from "../components/PasswordInput.tsx";
import {
  Background,
  Container,
  PhoneNumberContainer,
  SendNumberButton,
  SignupButton,
  TimeCounter,
} from "../styles/SignupPage.styles.ts";
import checkRulePass from "../utils/checkRulePass.ts";
import NotificationBox from "../components/NotificationBox.tsx";
import { WarningText } from "../styles/global.ts";
import useCountdownTimer from "../utils/useCountdownTimer.ts";
import { Title } from "../styles/LoginPage.styles.ts";

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

  const [isNotiVisible, setIsNotiVisible] = useState(false); // 남은 인증번호 전송 가능 횟수를 표시하는 노티 표시 여부
  const [warningTexts, setWarningTexts] = useState(["", ""]); // 경고 문구
  const [isSendButtonClicked, setIsSendButtonClicked] = useState(false); // 인증번호 전송 버튼이 클릭된 적 있나?
  const COUNTDOWN_SEC = 300;
  const countdownTimer = useCountdownTimer(COUNTDOWN_SEC); // 5분 카운트다운 타이머

  const sendNumberButtonClicked = () => {
    // 인증번호 전송 버튼 클릭
    setIsSendButtonClicked(true); // 인증번호 입력란 표시
    // 남은 인증번호 전송 가능 횟수를 표시하는 노티를 표시했다가 3초 후 다시 제거
    setIsNotiVisible(true);
    setTimeout(() => {
      setIsNotiVisible(false);
    }, 2000);
    // 5분 카운트다운 시작
    countdownTimer.start();
  };

  useEffect(() => {
    const getFirstWarning = () => {
      // 아이디 유효성
      if (!getIsRulePassed("id"))
        return "* 아이디는 5~20자의 영문 소문자, 숫자를 사용해 주세요.";
      if (isValid.id.hasError) return `* ${isValid.id.errorMessage}`;
      if (isValid.id.isDuplicated) return "* 중복되는 아이디입니다.";
      // 비밀번호 유효성
      if (!getIsRulePassed("password"))
        return "* 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.";
      // 닉네임 유효성
      if (!getIsRulePassed("nickname"))
        return "* 닉네임은 1~10자의 한글, 영문, 숫자를 사용해 주세요.";
      if (isValid.nickname.hasError)
        return `* ${isValid.nickname.errorMessage}`;
      if (isValid.nickname.isDuplicated) return "* 중복되는 닉네임입니다.";
      return "";
    };
    const getSecondWarning = () => {
      // 전화번호
      if (!getIsRulePassed("phoneNumber"))
        return "* 전화번호가 유효하지 않습니다.";
      return "";
    };
    setWarningTexts([getFirstWarning(), getSecondWarning()]);
  }, [isValid]);

  // 경고 문구 표시 여부 (비어있지 않으면서 규칙을 지키지 않은 경우)
  const getIsRulePassed = (fieldName: string): boolean => {
    if (inputValue[fieldName] === "") return true;
    return isValid[fieldName].isRulePassed;
  };

  const getIsValid = (fieldName: string): boolean => {
    if (!getIsRulePassed(fieldName)) return false;
    if (isValid[fieldName].isDuplicated) return false;
    if (isValid[fieldName].hasError) return false;
    return true;
  };

  const getIsActivatedSendNumberButton = () => {
    if (!isValid.phoneNumber.isRulePassed) return false;
    // 인증번호 전송 후 10초 간 인증번호 전송 버튼 비활성화
    if (
      countdownTimer.isActive &&
      COUNTDOWN_SEC - 10 < countdownTimer.timeLeft.totalSeconds
    )
      return false;
    return true;
  };

  const checkDuplicated = async (
    fieldName: "id" | "nickname",
    value: string
  ) => {
    const response = await fetch(
      `http://???/api/users/check-${fieldName}/${value}`
    );
    if (!response.ok) {
      if (response.status === 409) {
        return { isDuplicated: true, hasError: false, errorMessage: "" };
      }
      // 400, 500
      return {
        isDuplicated: false,
        hasError: true,
        errorMessage: "서버가 불안정합니다. 나중에 시도해주세요.",
      };
    }
    return { isDuplicated: false, hasError: false, errorMessage: "" };
  };

  const checkValidation = async (fieldName: string, value: string) => {
    // 규칙 통과 검사
    const isRulePassed = checkRulePass[fieldName](value);
    if (fieldName !== "id" && fieldName !== "nickname") {
      setIsValid((state) => ({ ...state, [fieldName]: { isRulePassed } }));
      return;
    }
    // 중복 검사
    const { isDuplicated, hasError, errorMessage } = await checkDuplicated(
      fieldName,
      value
    );
    setIsValid((state) => ({
      ...state,
      [fieldName]: { isRulePassed, isDuplicated, hasError, errorMessage },
    }));
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
                checkValidation("id", inputValue.id);
              },
            }}
          />
          <PasswordInput
            id="password"
            placeholder="비밀번호 (8~16자의 영문 대/소문자, 숫자, 특수문자)"
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
                checkValidation("password", inputValue.password);
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
              onBlur: async () => {
                checkValidation("nickname", inputValue.nickname);
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
            onBlurStart={() => {
              // blur 시작 시 호출할 함수 전달
              checkValidation("phoneNumber", inputValue.phoneNumber);
            }}
          />
          <SendNumberButton
            onClick={sendNumberButtonClicked}
            className={!getIsActivatedSendNumberButton() ? "inactivated" : ""}
            disabled={!getIsActivatedSendNumberButton()}
          >
            인증번호 {isSendButtonClicked ? "재" : ""}전송
            {countdownTimer.isActive && (
              <TimeCounter>
                {countdownTimer.timeLeft.minutes > 0
                  ? `${countdownTimer.timeLeft.minutes}분 ${countdownTimer.timeLeft.seconds}초`
                  : `${countdownTimer.timeLeft.seconds}초`}
              </TimeCounter>
            )}
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
                  checkValidation("authNumber", inputValue.authNumber);
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
