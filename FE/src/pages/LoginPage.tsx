import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { sendSmsCodeAtLogin, login } from "../api/rest/auth.ts";
import CustomInput from "../components/CustomInput.tsx";
import PhoneNumberInput from "../components/PhoneNumberInput.tsx";
import PasswordInput from "../components/PasswordInput.tsx";
import NotificationBox from "../components/NotificationBox.tsx";
import LoadingOverlay from "../components/LoadingOverlay.tsx";
import { WarningText, MainBackgroundColor } from "../styles/global";
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
} from "../styles/LoginPage.styles";
import useBackgroundColor from "../utils/useBackgroundColor";
import { checkRulePassInAuth } from "../utils/checkRulePass";
import useCountdownTimer from "../utils/useCountdownTimer";
import {
  SEND_SMSCODE_COUNTDOWN_SEC,
  ERROR,
  LOGIN_TAB,
} from "../constants/constants";
import { GET_RESIDENT_NEIGHBORHOOD } from "../api/graphql/queries.js";

const LoginPage = (): React.JSX.Element => {
  useBackgroundColor(MainBackgroundColor);
  const navigate = useNavigate();
  const countdownTimer = useCountdownTimer(SEND_SMSCODE_COUNTDOWN_SEC);

  const [selectedTab, setSelectedTab] = useState<LOGIN_TAB>(LOGIN_TAB.ID_PW);
  const [notiVisible, setNotiVisible] = useState<boolean>(false);

  const [inputValue, setInputValue] = useState({
    id: "",
    password: "",
    phoneNumber: "",
    smsCode: "",
  });
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [warning, setWarning] = useState("");
  const [remainingCount, setRemainingCount] = useState<number>(0); // 일일 인증번호 전송 가능 남은 횟수
  const [isSent, setIsSent] = useState(false); // 인증번호를 전송한 적이 있나?
  const [recentPhoneNumber, setRecentPhoneNumber] = useState(""); // 가장 최근에 인증번호 전송을 누른 시점에 입력되어 있던 전화번호

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
    try {
      const remainingCount: number = await sendSmsCodeAtLogin(
        inputValue.phoneNumber
      );
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
      SEND_SMSCODE_COUNTDOWN_SEC - 10 < countdownTimer.timeLeft
    )
      return false;
    return true;
  };

  const [
    getResidentNeighborhood,
    {
      loading: getResidentNeighborhoodLoading,
      error: getResidentNeighborhoodError,
    },
  ] = useLazyQuery(GET_RESIDENT_NEIGHBORHOOD, {
    onCompleted: (data) => {
      if (
        !data.me.residentNeighborhood ||
        data.me.residentNeighborhood.length === 0
      ) {
        navigate("/search-neighbor");
      } else {
        navigate("/explore-jobs");
      }
    },
  });
  useEffect(() => {
    if (getResidentNeighborhoodError) setWarning(ERROR.SERVER);
  }, [getResidentNeighborhoodError]);

  const LoginButtonClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 기본 유효성 검사
    try {
      if (selectedTab === LOGIN_TAB.ID_PW) {
        if (inputValue.id === "") throw new Error(ERROR.LOGIN.ENTER_ID);
        if (inputValue.password === "") throw new Error(ERROR.LOGIN.ENTER_PW);
      } else if (selectedTab === LOGIN_TAB.PHONE_NUMBER) {
        if (inputValue.phoneNumber === "")
          throw new Error(ERROR.LOGIN.ENTER_PHONE_NUMBER);
        if (!isValidPhoneNumber) throw new Error(ERROR.INVALID_PHONE_NUMBER);
        if (inputValue.smsCode === "")
          throw new Error(ERROR.LOGIN.ENTER_AUTH_NUMBER);
      }
    } catch (e) {
      setWarning(e.message);
      return;
    }
    // 기본 유효성 검사를 통과한 경우 로그인 API 요청
    try {
      await login(selectedTab, inputValue);
      getResidentNeighborhood(); // 상주 지역 설정 여부 확인 -> 결과에 따라 다른 페이지로 이동
    } catch (e) {
      setWarning(e.message);
    }
  };

  useEffect(() => {
    setInputValue({ id: "", password: "", phoneNumber: "", smsCode: "" });
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
      {getResidentNeighborhoodLoading && <LoadingOverlay />}
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
              className={`left ${
                selectedTab === LOGIN_TAB.ID_PW ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedTab(LOGIN_TAB.ID_PW);
              }}
            >
              아이디/비밀번호
            </TabButton>
            <TabButton
              className={`right ${
                selectedTab === LOGIN_TAB.PHONE_NUMBER ? "selected" : ""
              }`}
              onClick={() => {
                setSelectedTab(LOGIN_TAB.PHONE_NUMBER);
              }}
            >
              휴대폰 번호
            </TabButton>
          </div>
          <LoginForm>
            {selectedTab === LOGIN_TAB.ID_PW && (
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
            {selectedTab === LOGIN_TAB.PHONE_NUMBER && (
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
                  id="smsCode"
                  placeholder="인증번호"
                  borderType="multi-bottom"
                  value={inputValue.smsCode}
                  eventHandlers={{
                    onChange: (e) => {
                      setInputValue((state) => ({
                        ...state,
                        smsCode: e.target.value,
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
