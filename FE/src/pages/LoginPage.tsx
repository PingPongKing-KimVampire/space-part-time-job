import React, { useState } from "react";
import { MainColor } from "../styles/global.ts";
import CustomInput from "../components/CustomInput.tsx";
import { MainButtonStyle } from "../styles/global.ts";
import NotificationBox from "../components/NotificationBox.tsx";
import { WarningText } from "../styles/global.ts";

import { createStitches } from "@stitches/react";
const { styled } = createStitches();

const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "80px",
});

const Title = styled("p", {
  fontSize: "30px",
  fontWeight: "900",
  marginBottom: "50px",
  "& span": {
    color: MainColor,
  },
});

const LoginPanel = styled("div", {
  width: "550px",
});

const TabButton = styled("button", {
  width: "50%",
  padding: "20px",
  fontSize: "20px",
  fontWeight: "600",
  border: "1px solid #CDD2D7",
  background: "#F8F8F8",
  color: "#7C7C7C",
  "&.left": {
    borderTopLeftRadius: "10px",
    borderRight: "none",
  },
  "&.right": {
    borderTopRightRadius: "10px",
  },
  "&.selected": {
    borderBottom: "none",
    background: "white",
    color: "black",
  },
});

const LoginForm = styled("form", {
  padding: "36px 32px 30px 32px",
  background: "white",
  border: "1px solid #CDD2D7",
  borderTop: "none",
  borderRadius: "0 0 10px 10px",
});

const SendNumberButton = styled("button", {
  padding: "7px 10px",
  background: MainColor,
  color: "white",
  border: "none",
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  borderRadius: "8px",
  fontWeight: "600",
  fontSize: "14px",
});

const LoginButton = styled("button", {
  ...MainButtonStyle,
  width: "100%",
  marginTop: "30px",
});

const SignupMessage = styled("div", {
  marginTop: "20px",
  color: "#707070",
  "& span": {
    color: MainColor,
    cursor: "pointer",
  },
});

const ID_PW = "ID_PW";
const PHONE_NUMBER = "PHONE_NUMBER";

const LoginPage = () => {
  const [selectedTab, setSelectedTab] = useState(ID_PW);
  const [notiVisible, setNotiVisible] = useState(false);

  // TODO : SignupPage와 중복되는 로직
  // 이 로직을 NotificationBox 내부에 합쳐버릴까?
  const sendNumberButtonClicked = () => {
    // 인증번호 전송 버튼 클릭
    // 남은 인증번호 전송 가능 횟수를 표시하는 노티를 표시했다가 3초 후 다시 제거
    setNotiVisible(true);
    setTimeout(() => {
      setNotiVisible(false);
    }, 2000);
  };

  return (
    <Background>
      <Container>
        <Title>
          우리 주변의 <span>우주</span>
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
                  placeholder="아이디"
                  borderType="multi-top"
                  value=""
                  eventHandlers={{}}
                />
                <CustomInput
                  placeholder="비밀번호"
                  borderType="multi-bottom"
                  value=""
                  eventHandlers={{}}
                />
              </div>
            )}
            {selectedTab === PHONE_NUMBER && (
              <div>
                <CustomInput
                  placeholder="휴대폰 번호 (- 없이 입력)"
                  borderType="multi-top"
                  value=""
                  eventHandlers={{}}
                >
                  <SendNumberButton
                    type="button"
                    onClick={sendNumberButtonClicked}
                  >
                    인증번호 전송
                  </SendNumberButton>
                </CustomInput>
                <CustomInput
                  placeholder="인증번호"
                  borderType="multi-bottom"
                  value=""
                  eventHandlers={{}}
                />
              </div>
            )}
            <WarningText>
              * 아이디 또는 비밀번호가 올바르지 않습니다.
            </WarningText>
            <LoginButton>로그인</LoginButton>
          </LoginForm>
        </LoginPanel>
        <SignupMessage>
          처음인가요? <span>회원가입</span>
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
