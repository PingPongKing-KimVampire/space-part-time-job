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

// interface PhoneNumberSectionProps {
//   phoneNumber: string;
//   authNumber: string;
//   phoneNumberValid: { isRulePassed: boolean };
//   authNumberValid: { isRulePassed: boolean };
//   updateValue: (fieldName: string, value: string) => void;
//   checkValidation: (fieldName: string) => void;
// }

const COUNTDOWN_SEC = 300;

const PhoneNumberSection = (props) => {
  const { inputValue, updateValue, isValid, getIsValid, checkValidation } =
    props;

  const [isSendButtonClicked, setIsSendButtonClicked] = useState(false); // 인증번호 전송 버튼이 클릭된 적 있나?
  const [isNotiVisible, setIsNotiVisible] = useState(false); // 남은 인증번호 전송 가능 횟수를 표시하는 노티 표시 여부
  const countdownTimer = useCountdownTimer(COUNTDOWN_SEC); // 5분 카운트다운 타이머
  const [sendNumberInfo, setSendNumberInfo] = useState({
    // 휴대폰 번호 인증 API 관련 정보
    hasError: false,
    errorMessage: "",
    remainingCount: 5,
  });
  const [warning, setWarning] = useState("");

  useEffect(() => {
    const getWarning = () => {
      if (inputValue.phoneNumber === "") return "";
      if (!isValid.phoneNumber.isRulePassed)
        return "* 전화번호가 유효하지 않습니다.";
      if (sendNumberInfo.hasError) return `* ${sendNumberInfo.errorMessage}`;
      return "";
    };
    setWarning(getWarning());
  }, [isValid]);

  // 인증번호 전송 버튼 클릭
  const sendNumberButtonClicked = async () => {
    // 인증번호 전송
    const result = await sendAuthNumber();
    setSendNumberInfo((state) => ({ ...state, ...result }));
    // 인증번호 입력란 표시
    setIsSendButtonClicked(true);
    // 남은 인증번호 전송 가능 횟수를 표시하는 노티를 표시했다가 3초 후 다시 제거
    setIsNotiVisible(true);
    setTimeout(() => {
      setIsNotiVisible(false);
    }, 2000);
    // 5분 카운트다운 시작
    countdownTimer.start();
  };

  const getIsSendingPossible = () => {
    if (!isValid.phoneNumber.isRulePassed) return false;
    // 인증번호 전송 후 10초 간 전송 불가능
    if (
      countdownTimer.isActive &&
      COUNTDOWN_SEC - 10 < countdownTimer.timeLeft.totalSeconds
    )
      return false;
    return true;
  };

  const sendAuthNumber = async () => {
    // const response = await fetch(`http://???/users/phone-auth-code`, {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json; charset=utf-8",
    //   },
    //   body: JSON.stringify({
    //     phoneNumber: inputValue.phoneNumber.replaceAll("-", ""),
    //   }),
    // });
    // if (!response.ok) {
    //   if (response.status === 409)
    //     return {
    //       hasError: true,
    //       errorMessage: "하루 최대 요청 횟수를 초과하셨습니다.",
    //     };
    //   // 400, 500
    //   return {
    //     hasError: true,
    //     errorMessage: "서버가 불안정합니다. 나중에 시도해주세요.",
    //   };
    // }
    // const data = await response.json();
    const data = {
      // 임시
      remainingPhoneAuthenticationCount: sendNumberInfo.remainingCount - 1,
    };
    return {
      remainingCount: data.remainingPhoneAuthenticationCount,
      hasError: false,
    };
  };

  return (
    <>
      <PhoneNumberContainer>
        <PhoneNumberInput
          invalid={!getIsValid("phoneNumber")}
          value={inputValue.phoneNumber}
          setValue={(value) => updateValue("phoneNumber", value)}
          onBlurStart={() => {
            // blur 시작 시 호출할 함수 전달
            checkValidation("phoneNumber");
          }}
        />
        <SendNumberButton
          onClick={sendNumberButtonClicked}
          className={!getIsSendingPossible() ? "inactivated" : ""}
          disabled={!getIsSendingPossible()}
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
            invalid={false}
            value={inputValue.authNumber}
            eventHandlers={{
              onChange: (e) => updateValue("authNumber", e.target.value),
              onBlur: () => checkValidation("authNumber"),
            }}
          />
        )}
        {isNotiVisible && (
          <NotificationBox>
            {`일일 인증번호 전송 가능 횟수가 ${sendNumberInfo.remainingCount}회 남았습니다.`}
          </NotificationBox>
        )}
      </PhoneNumberContainer>
      <WarningText>{warning}</WarningText>
    </>
  );
};

export default PhoneNumberSection;
