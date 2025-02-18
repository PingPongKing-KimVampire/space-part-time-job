import React, { useState } from "react";
import CustomInput, { InputProps } from "./CustomInput.tsx";
import { ReactComponent as EyeIcon } from "../assets/icons/eye.svg";
import { ReactComponent as EyeSlashIcon } from "../assets/icons/eye-slash.svg";
import { EyeButton } from "../styles/components/CustomInput.styles.ts";

const PasswordInput: React.FC<InputProps> = (props) => {
  const {
    id = "password",
    placeholder = "",
    borderType = "single",
    invalid = false,
    value,
    eventHandlers,
    width = "100%",
    maxLength = 35,
  } = props;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // 비밀번호 보이기 여부

  const onPasswordVisibleButtonClick = () => {
    setIsPasswordVisible((state) => !state);
  };

  return (
    <>
      <CustomInput
        id={id}
        placeholder={placeholder}
        type={isPasswordVisible ? "text" : "password"}
        borderType={borderType}
        invalid={invalid}
        value={value}
        eventHandlers={eventHandlers}
        width={width}
        maxLength={maxLength}
      >
        <EyeButton type="button" onClick={onPasswordVisibleButtonClick}>
          {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
        </EyeButton>
      </CustomInput>
    </>
  );
};

export default PasswordInput;
