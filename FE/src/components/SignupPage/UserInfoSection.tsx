import React, { useState, useEffect } from "react";
import CustomInput from "../CustomInput.tsx";
import PasswordInput from "../PasswordInput.tsx";
import { WarningText } from "../../styles/global.ts";

const UserInfoSection = (props) => {
  const {
    inputValue,
    updateValue,
    isValid,
    getIsValid,
    checkValidation,
    signupWarning,
  } = props;
  const [warning, setWarning] = useState(" ");

  useEffect(() => {
    const getWarning = () => {
      if (signupWarning.userInfo) return signupWarning.userInfo;
      if (inputValue.id !== "" && !isValid.id.isRulePassed)
        return "* 아이디는 5~20자의 영문 소문자, 숫자를 사용해 주세요.";
      if (isValid.id.hasError) return isValid.id.errorMessage;
      if (isValid.id.isDuplicated) return "* 중복되는 아이디입니다.";
      // 비밀번호 유효성
      if (inputValue.password !== "" && !isValid.password.isRulePassed)
        return "* 비밀번호는 8~16자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.";
      // 닉네임 유효성
      if (inputValue.nickname !== "" && !isValid.nickname.isRulePassed)
        return "* 닉네임은 1~10자의 한글, 영문, 숫자를 사용해 주세요.";
      if (isValid.nickname.hasError) return isValid.nickname.errorMessage;
      if (isValid.nickname.isDuplicated) return "* 중복되는 닉네임입니다.";
      return "";
    };
    setWarning(getWarning());
  }, [isValid, signupWarning]);

  return (
    <>
      <div>
        <CustomInput
          id="id"
          placeholder="아이디 (5~10자의 영문 소문자, 숫자)"
          borderType="multi-top"
          invalid={!getIsValid("id")}
          value={inputValue.id}
          eventHandlers={{
            onChange: (e) => updateValue("id", e.target.value),
            onBlur: () => checkValidation("id"),
          }}
        />
        <PasswordInput
          id="password"
          placeholder="비밀번호 (8~16자의 영문 대/소문자, 숫자, 특수문자)"
          borderType="multi-middle"
          invalid={!getIsValid("password")}
          value={inputValue.password}
          eventHandlers={{
            onChange: (e) => updateValue("password", e.target.value),
            onBlur: () => checkValidation("password"),
          }}
        />
        <CustomInput
          id="nickname"
          placeholder="닉네임 (1~10자의 한글, 영문, 숫자)"
          borderType="multi-bottom"
          invalid={!getIsValid("nickname")}
          value={inputValue.nickname}
          eventHandlers={{
            onChange: (e) => updateValue("nickname", e.target.value),
            onBlur: async () => checkValidation("nickname"),
          }}
        />
      </div>
      <WarningText>{warning}</WarningText>
    </>
  );
};

export default UserInfoSection;
