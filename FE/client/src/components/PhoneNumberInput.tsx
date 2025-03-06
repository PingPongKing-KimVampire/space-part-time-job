import React, { useState, useRef, useEffect } from "react";
import CustomInput from "./CustomInput.tsx";

type PhoneNumberInputProps = {
  borderType?: "multi-top" | "multi-middle" | "multi-bottom" | "single";
  invalid?: boolean;
  value: string;
  setValue: (value: string) => void;
  onBlurStart?: () => void;
  children?: React.ReactNode;
  className?: string;
};

// CustomInput을 활용해 구현한 휴대전화번호 전용 인풋 컴포넌트
// 클릭 시 커서 위치를 원하는 대로 지정하기 위해 ref가 필요하여 컴포넌트로 분리했음
const PhoneNumberInput: React.FC<PhoneNumberInputProps> = (props) => {
  const {
    borderType = "single",
    invalid = false,
    value,
    setValue,
    onBlurStart = () => {},
    children,
    className = "",
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO : 숫자 아니면 다 지우기?
    // 숫자, - 아니면 다 지우기?
    const value = e.target.value.replace(/[^0-9-]/g, "");
    setValue(value);
  };

  const onBlur = () => {
    if (onBlurStart) onBlurStart();
    const newValue = value.replace(/-/g, "");
    // 전화번호 포맷으로 가공하기
    const part1 = newValue.slice(0, 3);
    const part2 = newValue.slice(3, 7);
    const part3 = newValue.slice(7, 11);
    setValue([part1, part2, part3].filter(Boolean).join("-"));
  };

  return (
    <>
      <CustomInput
        id="phoneNumber"
        placeholder="휴대전화번호 (- 없이 입력)"
        borderType={borderType}
        invalid={invalid}
        eventHandlers={{ onChange, onBlur }}
        value={value}
        ref={inputRef}
        maxLength={20}
        className={className}
      >
        {children && children}
      </CustomInput>
    </>
  );
};

export default PhoneNumberInput;
