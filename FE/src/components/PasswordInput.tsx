import React, { useState } from "react";
import CustomInput, { InputProps } from "./CustomInput.tsx";
import { createStitches } from "@stitches/react";
import { ReactComponent as EyeIcon } from "../assets/icons/eye.svg";
import { ReactComponent as EyeSlashIcon } from "../assets/icons/eye-slash.svg";

const { styled } = createStitches();

export const EyeButton = styled("button", {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  height: "60%",
  border: "none",
  background: "none",
  cursor: "pointer",
  "& svg": {
    width: "100%",
    height: "100%",
    strokeWidth: "0.8",
    color: "#7C7C7C",
  },
});

const PasswordInput: React.FC<InputProps> = (props) => {
  const {
    id = "password",
    placeholder = "",
    borderType = "single",
    invalid = false,
    value,
    eventHandlers,
    width = "100%",
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
      >
        <EyeButton type="button" onClick={onPasswordVisibleButtonClick}>
          {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
        </EyeButton>
      </CustomInput>
    </>
  );
};

export default PasswordInput;
