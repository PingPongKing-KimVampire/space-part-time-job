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
import { checkRulePassInAuth } from "../utils/checkRulePass.ts";
import useCountdownTimer from "../utils/useCountdownTimer.ts";
import {
  SEND_AUTHNUMBER_COUNTDOWN_SEC,
  IP_ADDRESS,
  ERROR,
} from "../constants/constants.ts";

const ID_PW = "ID_PW";
const PHONE_NUMBER = "PHONE_NUMBER";

type LoginRequestBody = {
  id?: string;
  password?: string;
  phoneNumber?: string;
  smsCode?: string;
};

type SendAuthNumberResponseData = {
  error?: string;
  remainingPhoneAuthenticationCount?: number;
};

type LoginResponseData = {
  error?: string;
};

const LoginPage = (): React.JSX.Element => {
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
  const [remainingCount, setRemainingCount] = useState<number>(0); // 일일 인증번호 전송 가능 남은 횟수
  const [isSent, setIsSent] = useState(false); // 인증번호를 전송한 적이 있나?
  const [recentPhoneNumber, setRecentPhoneNumber] = useState(""); // 가장 최근에 인증번호 전송을 누른 시점에 입력되어 있던 전화번호

  const sendAuthNumber = async (): Promise<number> => {
    let response: Response;
    let data: SendAuthNumberResponseData;
    const requestUrl = `http://${IP_ADDRESS}/api/users/login/phone-auth-code`;
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
      if (data.error === "존재하지 않는 사용자")
        throw new Error(ERROR.LOGIN.PHONE_NUMBER_NOT_EXIST); // 409
      throw new Error(ERROR.SERVER); // 400, 500
    }
    return data.remainingPhoneAuthenticationCount || 0;
  };

  // TODO : SignupPage와 중복되는 로직
  // 이 로직을 NotificationBox 내부에 합쳐버릴까?
  const sendNumberButtonClicked = async () => {
    // 인증번호 전송 버튼 클릭
    // 전화번호 유효성 검증 및 오류 표시
    if (inputValue.phoneNumber === "") {
      setWarning(ERROR.LOGIN.ENTER_PHONE_NUMBER);
      return;
    }
    if (!isValidPhoneNumber) {
      setWarning(ERROR.INVALID_PHONE_NUMBER);
      return;
    }
    // TODO : PhoneNumberSection 이랑 같은 로직..!
    try {
      const remainingCount: number = await sendAuthNumber();
      setRemainingCount(remainingCount);
    } catch (e) {
      setWarning(e.message);
      return;
    }
    setRecentPhoneNumber(inputValue.phoneNumber);
    setWarning("");
    setIsSent(true);
    // 남은 인증번호 전송 가능 횟수를 표시하는 노티를 표시했다가 3초 후 다시 제거
    setNotiVisible(true);
    setTimeout(() => {
      setNotiVisible(false);
    }, 2000);
    countdownTimer.start(); // 5분 카운트다운 시작
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
    const body: LoginRequestBody = {};
    let requestUrl: string = "";
    if (selectedTab === ID_PW) {
      body.id = inputValue.id;
      body.password = inputValue.password;
      requestUrl = `http://${IP_ADDRESS}/api/users/login`;
    } else if (selectedTab === PHONE_NUMBER) {
      body.phoneNumber = inputValue.phoneNumber.replaceAll("-", "");
      body.smsCode = inputValue.authNumber;
      requestUrl = `http://${IP_ADDRESS}/api/users/login/phone`;
    }

    let response: Response;
    let data: LoginResponseData;
    try {
      response = await fetch(requestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
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
      if (data.error === "아이디/패스워드 로그인 실패")
        throw new Error(ERROR.LOGIN.INVALID_ID_PW); // 401
      if (data.error === "휴대폰 인증 실패")
        throw new Error(ERROR.INVALID_AUTH_NUMBER); // 401
      throw new Error(ERROR.SERVER); // 400, 500
    }
  };

  const LoginButtonClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 기본 유효성 검사
    try {
      if (selectedTab === ID_PW) {
        if (inputValue.id === "") throw new Error(ERROR.LOGIN.ENTER_ID);
        if (inputValue.password === "") throw new Error(ERROR.LOGIN.ENTER_PW);
      } else if (selectedTab === PHONE_NUMBER) {
        if (inputValue.phoneNumber === "")
          throw new Error(ERROR.LOGIN.ENTER_PHONE_NUMBER);
        if (!isValidPhoneNumber) throw new Error(ERROR.INVALID_PHONE_NUMBER);
        if (inputValue.authNumber === "")
          throw new Error(ERROR.LOGIN.ENTER_AUTH_NUMBER);
      }
    } catch (e) {
      setWarning(e.message);
      return;
    }
    // 기본 유효성 검사를 통과한 경우 로그인 API 요청
    try {
      await login();
      navigate("/create-job");
    } catch (e) {
      setWarning(e.message);
    }
  };

  useEffect(() => {
    setInputValue({ id: "", password: "", phoneNumber: "", authNumber: "" });
    setWarning("");
  }, [selectedTab]);

  const getCountdownTimerString = () => {
    let minutes: string = Math.floor(countdownTimer.timeLeft / 60).toString();
    let seconds: string = (countdownTimer.timeLeft % 60).toString();
    if (minutes.length === 1) minutes = `0${minutes}`;
    if (seconds.length === 1) seconds = `0${seconds}`;
    return `${minutes}:${seconds}`;
  };

  // TODO : SignupPage의 PhoneNumberSection과 겹치는 로직
  const onPhoneNumberInputBlurStart = () => {
    const isRulePassed = checkRulePassInAuth["phoneNumber"](
      inputValue.phoneNumber
    );
    setIsValidPhoneNumber(isRulePassed);
    if (
      countdownTimer.isActive &&
      recentPhoneNumber !== inputValue.phoneNumber
    ) {
      // 인증번호 대기 중이면서 휴대폰 번호가 바뀌었다면
      countdownTimer.stop();
    }
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
                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
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
                  onBlurStart={onPhoneNumberInputBlurStart}
                >
                  <PhoneNumberInputChild>
                    <button
                      type="button"
                      onClick={sendNumberButtonClicked}
                      className={`sendNumberButton ${
                        !getIsSendingPossible() ? "inactivated" : " "
                      }`}
                      disabled={!getIsSendingPossible()}
                    >
                      인증번호 {isSent ? "재" : ""}전송
                    </button>
                    {countdownTimer.isActive && (
                      <div className="timeCounter">
                        {getCountdownTimerString()}
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
          {`일일 인증번호 전송 가능 횟수가 ${remainingCount}회 남았습니다.`}
        </NotificationBox>
      )}
    </Background>
  );
};

export default LoginPage;
