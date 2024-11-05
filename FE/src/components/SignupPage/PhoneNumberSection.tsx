import React, { useState, useEffect } from "react";
import CustomInput from "../CustomInput.tsx";
import PhoneNumberInput from "../PhoneNumberInput.tsx";
import useCountdownTimer from "../../utils/useCountdownTimer.ts";
import NotificationBox from "../NotificationBox.tsx";
import {
  PhoneNumberContainer,
  SendNumberButton,
  TimeCounter,
} from "../../styles/SignupPage.styles.ts";
import { WarningText } from "../../styles/global.ts";
import {
  SEND_AUTHNUMBER_COUNTDOWN_SEC,
  IP_ADDRESS,
  ERROR,
} from "../../constants/constants.ts";

type SendAuthNumberResponseData = {
  error?: string;
  remainingPhoneAuthenticationCount?: number;
};

const PhoneNumberSection = (props) => {
  const {
    inputValue,
    updateValue,
    isValid,
    getIsValid,
    checkValidation,
    signupWarning,
  } = props;

  const [isSent, setIsSent] = useState(false); // 인증번호를 전송한 적 있는가?
  const [isNotiVisible, setIsNotiVisible] = useState(false); // 남은 인증번호 전송 가능 횟수를 표시하는 노티 표시 여부
  const countdownTimer = useCountdownTimer(SEND_AUTHNUMBER_COUNTDOWN_SEC); // 5분 카운트다운 타이머
  const [remainingCount, setRemainingCount] = useState<number>(0); // 일일 인증번호 전송 가능 남은 횟수
  const [warning, setWarning] = useState("");
  const [recentPhoneNumber, setRecentPhoneNumber] = useState(""); // 가장 최근에 인증번호 전송을 누른 시점에 입력되어 있던 전화번호

  useEffect(() => {
    const getWarning = () => {
      if (signupWarning.phoneNumber) return signupWarning.phoneNumber;
      if (inputValue.phoneNumber === "") return "";
      if (!isValid.phoneNumber.isRulePassed) return ERROR.INVALID_PHONE_NUMBER;
      return "";
    };
    setWarning(getWarning());
  }, [isValid, signupWarning]);

  useEffect(() => {
    if (!countdownTimer.isActive) {
      updateValue("authNumber", "");
      checkValidation("authNumber", "");
    }
  }, [countdownTimer.isActive, updateValue]);

  // 인증번호 전송 버튼 클릭
  const sendNumberButtonClicked = async () => {
    // 인증번호 전송
    try {
      const remainingCount: number = await sendAuthNumber();
      setRemainingCount(remainingCount);
    } catch (e) {
      setWarning(e.message);
      return;
    }
    setRecentPhoneNumber(inputValue.phoneNumber);
    setIsSent(true);
    // 남은 인증번호 전송 가능 횟수를 표시하는 노티를 표시했다가 3초 후 다시 제거
    setIsNotiVisible(true);
    setTimeout(() => {
      setIsNotiVisible(false);
    }, 2000);
    countdownTimer.start(); // 5분 카운트다운 시작
  };

  const getIsSendingPossible = () => {
    if (!isValid.phoneNumber.isRulePassed) return false;
    // 인증번호 전송 후 10초 간 전송 불가능
    if (
      countdownTimer.isActive &&
      SEND_AUTHNUMBER_COUNTDOWN_SEC - 10 < countdownTimer.timeLeft
    )
      return false;
    return true;
  };

  const sendAuthNumber = async (): Promise<number> => {
    let response: Response;
    let data: SendAuthNumberResponseData;
    const requestUrl: string = `https://${IP_ADDRESS}/api/users/phone-auth-code`;
    try {
      response = await fetch(requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          phoneNumber: inputValue.phoneNumber.replaceAll("-", ""),
        }),
      });
    } catch {
      throw new Error(ERROR.NETWORK);
    }
    try {
      data = await response.json();
    } catch {
      throw new Error(ERROR.SERVER);
    }
    if (!response.ok) {
      if (data.error === "하루 최대요청 횟수 초과")
        throw new Error(ERROR.AUTH_NUMBER_SEND_COUNT_EXCEED); // 409
      if (data.error === "전화번호 중복")
        throw new Error(ERROR.SIGNUP.DUPLICATED_PHONE_NUMBER); // 409
      throw new Error(ERROR.SERVER); // 400, 500
    }
    return data.remainingPhoneAuthenticationCount || 0;
  };

  const onPhoneNumberInputBlurStart = () => {
    // phoneNumberInput 블러 시작 시 호출할 함수
    checkValidation("phoneNumber");
    if (
      countdownTimer.isActive &&
      recentPhoneNumber !== inputValue.phoneNumber
    ) {
      // 인증번호 대기 중이면서 휴대폰 번호가 바뀌었다면
      countdownTimer.stop();
    }
  };

  return (
    <>
      <PhoneNumberContainer>
        <PhoneNumberInput
          invalid={!getIsValid("phoneNumber")}
          value={inputValue.phoneNumber}
          setValue={(value) => updateValue("phoneNumber", value)}
          onBlurStart={onPhoneNumberInputBlurStart}
        />
        <SendNumberButton
          onClick={sendNumberButtonClicked}
          className={!getIsSendingPossible() ? "inactivated" : ""}
          disabled={!getIsSendingPossible()}
        >
          인증번호 {isSent ? "재" : ""}전송
          {countdownTimer.isActive && (
            <TimeCounter>
              {countdownTimer.timeLeft > 60
                ? `${Math.floor(countdownTimer.timeLeft / 60)}분 ${
                    countdownTimer.timeLeft % 60
                  }초`
                : `${countdownTimer.timeLeft}초`}
            </TimeCounter>
          )}
        </SendNumberButton>
        {countdownTimer.isActive && (
          <CustomInput
            id="authNumber"
            placeholder="인증번호"
            invalid={false}
            value={inputValue.authNumber}
            eventHandlers={{
              onChange: (e) => {
                updateValue("authNumber", e.target.value);
                checkValidation("authNumber", e.target.value);
              },
            }}
          />
        )}
      </PhoneNumberContainer>
      <WarningText>{warning}</WarningText>
      {isNotiVisible && (
        <NotificationBox>
          {`일일 인증번호 전송 가능 횟수가 ${remainingCount}회 남았습니다.`}
        </NotificationBox>
      )}
    </>
  );
};

export default PhoneNumberSection;
