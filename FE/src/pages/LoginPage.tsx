import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../components/CustomInput.tsx";
import PhoneNumberInput from "../components/PhoneNumberInput.tsx";
import PasswordInput from "../components/PasswordInput.tsx";
import NotificationBox from "../components/NotificationBox.tsx";
import { WarningText } from "../styles/global.ts";
import {
  Background,
  Container,
  Title,
  LoginPanel,
  TabButton,
  LoginForm,
  LoginButton,
  SignupMessage,
  PhoneNumberInputChild,
} from "../styles/LoginPage.styles.ts";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import checkRulePass from "../utils/checkRulePass.ts";
import useCountdownTimer from "../utils/useCountdownTimer.ts";
import {
  SEND_AUTHNUMBER_COUNTDOWN_SEC,
  IP_ADDRESS,
} from "../constants/constants.ts";

const ID_PW = "ID_PW";
const PHONE_NUMBER = "PHONE_NUMBER";

type loginRequestBody = {
  id?: string;
  password?: string;
  phoneNumber?: string;
  smsCode?: string;
};

const LoginPage = () => {
  useBackgroundColor("#F9FBFC");
  const navigate = useNavigate();
  const countdownTimer = useCountdownTimer(SEND_AUTHNUMBER_COUNTDOWN_SEC);

  const [selectedTab, setSelectedTab] = useState(ID_PW);
  const [notiVisible, setNotiVisible] = useState(false);

  const [inputValue, setInputValue] = useState({
    id: "",
    password: "",
    phoneNumber: "",
    authNumber: "",
  });
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [warning, setWarning] = useState("");
  const [sendNumberInfo, setSendNumberInfo] = useState({
    // 휴대폰 번호 인증 API 관련 정보
    hasError: false,
    errorMessage: "",
    remainingCount: 5,
  });
  const [isSent, setIsSent] = useState(false); // 인증번호를 전송한 적이 있나?

  const sendAuthNumber = async () => {
    // const response = await fetch(
    //   `http://${IP_ADDRESS}/api/users/login/phone-auth-code`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json; charset=utf-8",
    //     },
    //     body: JSON.stringify({
    //       phoneNumber: inputValue.phoneNumber.replaceAll("-", ""),
    //     }),
    //   }
    // );
    // const data = await response.json();
    // if (!response.ok) {
    //   if (response.status === 409) {
    //     return { hasError: true, errorMessage: data.error };
    //   }
    //   // 400, 500
    //   return {
    //     hasError: true,
    //     errorMessage: "서버가 불안정합니다. 나중에 시도해주세요.",
    //   };
    // }
    const data = {
      // 임시
      remainingPhoneAuthenticationCount: sendNumberInfo.remainingCount - 1,
    };
    return {
      remainingCount: data.remainingPhoneAuthenticationCount,
      hasError: false,
      errorMessage: "",
    };
  };

  // TODO : SignupPage와 중복되는 로직
  // 이 로직을 NotificationBox 내부에 합쳐버릴까?
  const sendNumberButtonClicked = async () => {
    // 인증번호 전송 버튼 클릭
    // 전화번호 유효성 검증 및 오류 표시
    if (inputValue.phoneNumber === "") {
      setWarning("* 휴대폰 번호를 입력해주세요.");
      return;
    }
    if (!isValidPhoneNumber) {
      setWarning("* 휴대폰 번호가 유효하지 않습니다.");
      return;
    }
    // TODO : PhoneNumberSection 이랑 같은 로직..!
    const result = await sendAuthNumber();
    setSendNumberInfo((state) => ({ ...state, ...result }));
    if (result.hasError) {
      setWarning(result.errorMessage);
    } else {
      setWarning("");
      setIsSent(true);
      // 남은 인증번호 전송 가능 횟수를 표시하는 노티를 표시했다가 3초 후 다시 제거
      setNotiVisible(true);
      setTimeout(() => {
        setNotiVisible(false);
      }, 2000);
      // 5분 카운트다운 시작
      countdownTimer.start();
    }
  };

  const getIsSendingPossible = () => {
    // 인증번호 전송 후 10초 간 전송 불가능
    if (
      countdownTimer.isActive &&
      SEND_AUTHNUMBER_COUNTDOWN_SEC - 10 < countdownTimer.timeLeft
    )
      return false;
    return true;
  };

  const login = async () => {
    const body: loginRequestBody = {};
    if (selectedTab === ID_PW) {
      body.id = inputValue.id;
      body.password = inputValue.password;
    } else if (selectedTab === PHONE_NUMBER) {
      body.phoneNumber = inputValue.phoneNumber.replaceAll("-", "");
      body.smsCode = inputValue.authNumber;
    }
    const response = await fetch(`http://${IP_ADDRESS}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      if (response.status === 401) {
        if (selectedTab === ID_PW) {
          return {
            hasError: true,
            errorMessage: "아이디 또는 비밀번호가 유효하지 않습니다.",
          };
        } else if (selectedTab === ID_PW) {
          return {
            hasError: true,
            errorMessage: "인증번호가 유효하지 않습니다.",
          };
        }
      }
      // 400, 500
      return {
        hasError: true,
        errorMessage: "서버가 불안정합니다. 나중에 다시 시도해주세요.",
      };
    }
    return { hasError: false, errorMessage: "" };
  };

  const LoginButtonClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 기본 유효성 검사
    try {
      if (selectedTab === ID_PW) {
        if (inputValue.id === "") throw new Error("* 아이디를 입력해주세요.");
        if (inputValue.password === "")
          throw new Error("* 비밀번호를 입력해주세요.");
      } else if (selectedTab === PHONE_NUMBER) {
        if (inputValue.phoneNumber === "")
          throw new Error("* 휴대폰 번호를 입력해주세요.");
        if (!isValidPhoneNumber)
          throw new Error("* 휴대폰 번호가 유효하지 않습니다.");
        if (inputValue.authNumber === "")
          throw new Error("* 인증번호를 입력해 주세요.");
      }
    } catch (e) {
      setWarning(e.message);
      return;
    }
    // 기본 유효성 검사를 통과한 경우 로그인 API 요청
    const result = await login();
    if (!result.hasError) {
      // TODO : 다음 페이지로 이동
      console.log("로그인 성공!");
    } else {
      setWarning(`* ${result.errorMessage}`);
    }
  };

  useEffect(() => {
    setInputValue({ id: "", password: "", phoneNumber: "", authNumber: "" });
    setWarning("");
  }, [selectedTab]);

  return (
    <Background>
      <Container>
        <Title>
          <div className="sub">
            <span>우</span>리 <span>주</span>변의 <span>알바</span>
          </div>
          <div className="main">우주 알바</div>
        </Title>
        <LoginPanel>
          <div>
            <TabButton
              className={`left ${selectedTab === ID_PW ? "selected" : ""}`}
              onClick={() => {
                setSelectedTab(ID_PW);
              }}
            >
              아이디/비밀번호
            </TabButton>
            <TabButton
              className={`right ${
                selectedTab === PHONE_NUMBER ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedTab(PHONE_NUMBER);
              }}
            >
              휴대폰 번호
            </TabButton>
          </div>
          <LoginForm>
            {selectedTab === ID_PW && (
              <div>
                <CustomInput
                  id="id"
                  placeholder="아이디"
                  borderType="multi-top"
                  value={inputValue.id}
                  eventHandlers={{
                    onChange: (e) => {
                      setInputValue((state) => ({
                        ...state,
                        id: e.target.value,
                      }));
                    },
                  }}
                />
                <PasswordInput
                  id="password"
                  placeholder="비밀번호"
                  borderType="multi-bottom"
                  value={inputValue.password}
                  eventHandlers={{
                    onChange: (e) => {
                      setInputValue((state) => ({
                        ...state,
                        password: e.target.value,
                      }));
                    },
                  }}
                />
              </div>
            )}
            {selectedTab === PHONE_NUMBER && (
              <div>
                <PhoneNumberInput
                  borderType="multi-top"
                  value={inputValue.phoneNumber}
                  setValue={(value) => {
                    setInputValue((state) => ({
                      ...state,
                      phoneNumber: value,
                    }));
                  }}
                  onBlurStart={() => {
                    const isRulePassed = checkRulePass["phoneNumber"](
                      inputValue.phoneNumber
                    );
                    setIsValidPhoneNumber(isRulePassed);
                  }}
                >
                  <PhoneNumberInputChild>
                    <button
                      type="button"
                      onClick={sendNumberButtonClicked}
                      className={`sendNumberButton ${
                        !getIsSendingPossible() ? "inactivatede" : " "
                      }`}
                      disabled={!getIsSendingPossible()}
                    >
                      인증번호 {isSent ? "재" : ""}전송
                    </button>
                    {countdownTimer.isActive && (
                      <div className="timeCounter">
                        {`${Math.floor(countdownTimer.timeLeft / 60)}:${
                          countdownTimer.timeLeft % 60
                        }`}
                      </div>
                    )}
                  </PhoneNumberInputChild>
                </PhoneNumberInput>
                <CustomInput
                  id="authNumber"
                  placeholder="인증번호"
                  borderType="multi-bottom"
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
              </div>
            )}
            <WarningText>{warning}</WarningText>
            <LoginButton onClick={LoginButtonClicked}>로그인</LoginButton>
          </LoginForm>
        </LoginPanel>
        <SignupMessage>
          처음인가요?{" "}
          <span
            onClick={() => {
              navigate("/signup");
            }}
          >
            회원가입
          </span>
        </SignupMessage>
      </Container>
      {notiVisible && (
        <NotificationBox>
          {`일일 인증번호 전송 가능 횟수가 ${sendNumberInfo.remainingCount}회 남았습니다.`}
        </NotificationBox>
      )}
    </Background>
  );
};

export default LoginPage;
