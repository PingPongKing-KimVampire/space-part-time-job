import React, { useState } from "react";
import { createStitches } from "@stitches/react";
import CustomInput from "../components/CustomInput.tsx";

const { styled } = createStitches();

const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

const Container = styled("div", {
  width: "550px",
  marginTop: "40px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "",
});

const PhoneNumberContainer = styled("div", {
  marginTop: "30px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

const activatedButton = {
  background: "#4361EE",
  color: "white",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  position: "relative",
};

const inactivatedButton = {
  background: "#EDEDED",
  color: "#B0B0B0",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  position: "relative",
};

const SendNumberButton = styled("button", {
  ...activatedButton,
  width: "100%",
});

const SignupButton = styled("button", {
  width: "550px",
  marginTop: "180px",
  "&.activated": activatedButton,
  "&.inactivated": inactivatedButton,
});

const WarningText = styled("div", {
  marginTop: "10px",
  color: "#FF4043",
});

const TimeCounter = styled("div", {
  position: "absolute",
  right: "20px",
  top: "50%",
  transform: "translateY(-50%)",
  fontWeight: "400",
  fontSize: "20px",
  letterSpacing: "1px",
});

const NotificationBox = styled("div", {
  position: "fixed",
  bottom: "30px",
  background: "black",
  color: "white",
  width: "550px",
  padding: "16px",
  borderRadius: "10px",
  boxSizing: "border-box",
});

const SignupPage = () => {
  let sent = true;
  let allValid = false;

  const [notiVisible, setNotiVisible] = useState(false); // 남은 인증번호 전송 가능 횟수를 표시하는 노티 표시 여부

  const sendNumberButtonClicked = () => {
    // 남은 인증번호 전송 가능 횟수를 표시하는 노티를 표시했다가 3초 후 다시 제거
    setNotiVisible(true);
    setTimeout(() => {
      setNotiVisible(false);
    }, 2000);
  };

  return (
    <Background>
      <Container>
        <div>
          <CustomInput
            placeholder="아이디 (5~20자의 영문 소문자, 숫자)"
            borderType="multi-top"
            invalid={true}
          />
          <CustomInput
            placeholder="비밀번호 (8~16자의 영문 대/소문자, 숫자, 특수문자)"
            borderType="multi-middle"
            invalid={false}
          />
          <CustomInput
            placeholder="닉네임 (1~10자의 한글, 영문, 숫자)"
            borderType="multi-bottom"
            invalid={false}
          />
        </div>
        <WarningText>
          * 아이디는 5~20자의 영문 소문자 또는 숫자만 입력해 주세요.
        </WarningText>
        <PhoneNumberContainer>
          <CustomInput
            placeholder="휴대전화번호 (- 없이 입력)"
            borderType="single"
            invalid={true}
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
            />
          )}
        </PhoneNumberContainer>
        <WarningText>* 휴대전화번호가 유효하지 않습니다.</WarningText>
      </Container>
      <SignupButton className={allValid ? "activated" : "inactivated"}>
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
