import React, { useState } from "react";
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
  SendNumberButton,
  LoginButton,
  SignupMessage,
} from "../styles/LoginPage.styles.ts";

const ID_PW = "ID_PW";
const PHONE_NUMBER = "PHONE_NUMBER";

const LoginPage = () => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState(ID_PW);
  const [notiVisible, setNotiVisible] = useState(false);

  const [inputValue, setInputValue] = useState({
    id: "",
    password: "",
    phoneNumber: "",
    authNumber: "",
  });
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(false);
  const [warningText, setWarningText] = useState("");

  // TODO : SignupPage와 중복되는 로직
  // 이 로직을 NotificationBox 내부에 합쳐버릴까?
  const sendNumberButtonClicked = () => {
    // 인증번호 전송 버튼 클릭
    // 전화번호 유효성 검증 및 오류 표시
    if (!isValidPhoneNumber) {
      setWarningText("* 휴대폰 번호가 유효하지 않습니다.");
      return;
    }
    // 남은 인증번호 전송 가능 횟수를 표시하는 노티를 표시했다가 3초 후 다시 제거
    setNotiVisible(true);
    setTimeout(() => {
      setNotiVisible(false);
    }, 2000);
  };

  const LoginButtonClicked = (e) => {
    e.preventDefault();
    const getWarningText = () => {
      if (selectedTab === ID_PW) {
        if (inputValue.id === "") return "* 아이디를 입력해주세요.";
        if (inputValue.password === "") return "* 비밀번호를 입력해주세요.";
      } else if (selectedTab === PHONE_NUMBER) {
        if (inputValue.phoneNumber === "")
          return "* 휴대폰 번호를 입력해주세요.";
        if (!isValidPhoneNumber) return "* 휴대폰 번호가 유효하지 않습니다.";
        if (inputValue.authNumber === "") return "* 인증번호를 입력해주세요.";
      }
      return "";
    };
    setWarningText(getWarningText());
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
                  setIsValid={(isValid) => {
                    setIsValidPhoneNumber(isValid);
                  }}
                >
                  <SendNumberButton
                    type="button"
                    onClick={sendNumberButtonClicked}
                  >
                    인증번호 전송
                  </SendNumberButton>
                </PhoneNumberInput>

                {/* <CustomInput
                  id="phoneNumber"
                  placeholder="휴대폰 번호 (- 없이 입력)"
                  borderType="multi-top"
                  value={inputValue.phoneNumber}
                  eventHandlers={{
                    onChange: (e) => {
                      setInputValue((state) => ({
                        ...state,
                        phoneNumber: e.target.value,
                      }));
                    },
                    onBlur: () => {
                      setIsValidPhoneNumber(
                        validatePhoneNumber(inputValue.phoneNumber)
                      );
                    },
                  }}
                >
                  <SendNumberButton
                    type="button"
                    onClick={sendNumberButtonClicked}
                  >
                    인증번호 전송
                  </SendNumberButton>
                </CustomInput> */}
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
            <WarningText>{warningText}</WarningText>
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
          일일 인증번호 전송 가능 횟수가 4회 남았습니다.
        </NotificationBox>
      )}
    </Background>
  );
};

export default LoginPage;
