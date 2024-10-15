import React, { useState, useEffect } from "react";
import CustomInput from "../components/CustomInput.tsx";
import {
  Background,
  Container,
  PhoneNumberContainer,
  SendNumberButton,
  SignupButton,
  WarningText,
  TimeCounter,
  NotificationBox,
} from "../styles/SignupPage.styles.ts";
import {
  validateId,
  validatePassword,
  validateNickname,
  validatePhoneNumber,
} from "../utils/validation.ts";

const SignupPage = () => {
  let sent = true;

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
  const [isBlured, setIsBlured] = useState({
    // 포커스아웃된 적이 있는가?
    id: false,
    password: false,
    nickname: false,
    phoneNumber: false,
    authNumber: false,
  });

  const [notiVisible, setNotiVisible] = useState(false); // 남은 인증번호 전송 가능 횟수를 표시하는 노티 표시 여부
  const [warningTexts, setWarningTexts] = useState(["", ""]); // 경고 문구

  const sendNumberButtonClicked = () => {
    // 인증번호 전송 버튼 클릭
    // 남은 인증번호 전송 가능 횟수를 표시하는 노티를 표시했다가 3초 후 다시 제거
    setNotiVisible(true);
    setTimeout(() => {
      setNotiVisible(false);
    }, 2000);
  };

  useEffect(() => {
    // 유효한지, 포커스아웃된 적 있는지에 따라 경고문구 업데이트
    const firstText = () => {
      // 아이디, 비밀번호, 닉네임
      if (!isValid.id && isBlured.id)
        return "* 아이디는 5~20자의 영문 소문자, 숫자를 사용해 주세요.";
      if (!isValid.password && isBlured.password)
        return "* 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.";
      if (!isValid.nickname && isBlured.nickname)
        return "닉네임은 1~10자의 한글, 영문, 숫자를 사용해 주세요.";
      return "";
    };
    const secondText = () => {
      // 전화번호
      if (!isValid.phoneNumber && isBlured.phoneNumber)
        return "* 전화번호가 유효하지 않습니다.";
      return "";
    };
    setWarningTexts([firstText(), secondText()]);
  }, [isValid, isBlured]);

  return (
    <Background>
      <Container>
        <div>
          <CustomInput
            placeholder="아이디 (5~10자의 영문 소문자, 숫자)"
            borderType="multi-top"
            invalid={!isValid.id && isBlured.id}
            value={inputValue.id}
            eventHandlers={{
              onChange: (e) => {
                setInputValue((state) => ({ ...state, id: e.target.value }));
              },
              onBlur: () => {
                setIsBlured((state) => ({ ...state, id: true }));
                setIsValid((state) => ({
                  ...state,
                  id: validateId(inputValue.id),
                }));
              },
            }}
          />
          <CustomInput
            placeholder="비밀번호 (8~16자의 영문 대/소문자, 숫자, 특수문자)"
            borderType="multi-middle"
            invalid={!isValid.password && isBlured.password}
            value={inputValue.password}
            eventHandlers={{
              onChange: (e) => {
                setInputValue((state) => ({
                  ...state,
                  password: e.target.value,
                }));
              },
              onBlur: () => {
                setIsBlured((state) => ({ ...state, password: true }));
                setIsValid((state) => ({
                  ...state,
                  password: validatePassword(inputValue.password),
                }));
              },
            }}
          />
          <CustomInput
            placeholder="닉네임 (1~10자의 한글, 영문, 숫자)"
            borderType="multi-bottom"
            invalid={!isValid.nickname && isBlured.nickname}
            value={inputValue.nickname}
            eventHandlers={{
              onChange: (e) => {
                setInputValue((state) => ({
                  ...state,
                  nickname: e.target.value,
                }));
              },
              onBlur: () => {
                setIsBlured((state) => ({ ...state, nickname: true }));
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
          <CustomInput
            placeholder="휴대전화번호 (- 없이 입력)"
            borderType="single"
            invalid={!isValid.phoneNumber && isBlured.phoneNumber}
            value={inputValue.phoneNumber}
            eventHandlers={{
              onChange: (e) => {
                setInputValue((state) => ({
                  ...state,
                  phoneNumber: e.target.value,
                }));
              },
              onFocus: () => {
                setInputValue((state) => ({
                  ...state,
                  phoneNumber: state.phoneNumber.replaceAll("-", ""),
                }));
              },
              onBlur: () => {
                setIsBlured((state) => ({ ...state, phoneNumber: true }));
                setIsValid((state) => ({
                  ...state,
                  phoneNumber: validatePhoneNumber(inputValue.phoneNumber),
                }));
                // 전화번호 포맷으로 가공하기
                const part1 = inputValue.phoneNumber.slice(0, 3);
                const part2 = inputValue.phoneNumber.slice(3, 7);
                const part3 = inputValue.phoneNumber.slice(7, 11);
                setInputValue((state) => ({
                  ...state,
                  phoneNumber: [part1, part2, part3].filter(Boolean).join("-"),
                }));
              },
            }}
          />
          <SendNumberButton onClick={sendNumberButtonClicked}>
            인증번호 {sent ? "재" : ""}전송
            <TimeCounter>4분 50초</TimeCounter>
          </SendNumberButton>
          {sent && (
            <CustomInput
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
              }}
            />
          )}
        </PhoneNumberContainer>
        <WarningText>{warningTexts[1]}</WarningText>
      </Container>
      <SignupButton
        className={
          isValid.id &&
          isValid.password &&
          isValid.nickname &&
          isValid.phoneNumber
            ? "activated"
            : "inactivated"
        }
      >
        시작하기
      </SignupButton>
      {notiVisible && (
        <NotificationBox>
          일일 인증번호 전송 가능 횟수가 4회 남았습니다.
        </NotificationBox>
      )}
    </Background>
  );
};

export default SignupPage;
