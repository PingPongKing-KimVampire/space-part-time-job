import React, { useRef } from "react";
import CustomInput from "./CustomInput.tsx";
import { validatePhoneNumber } from "../utils/validation.ts";

interface PhoneNumberInputProps {
  borderType?: "multi-top" | "multi-middle" | "multi-bottom" | "single";
  invalid?: boolean;
  value: string;
  setValue: (value: string) => void;
  setIsValid: (isValid: boolean) => void;
  children?: React.ReactNode;
  width?: string;
}

// CustomInput을 활용해 구현한 휴대전화번호 전용 인풋 컴포넌트
// 클릭 시 커서 위치를 원하는 대로 지정하기 위해 ref가 필요하여 컴포넌트로 분리했음
const PhoneNumberInput: React.FC<PhoneNumberInputProps> = (props) => {
  const {
    borderType = "single",
    invalid = false,
    value,
    setValue,
    setIsValid,
    children,
    width = "100%",
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onFocus = () => {
    setValue(value.replaceAll("-", ""));
    setTimeout(() => {
      // onFocus 이벤트 직후 커서 위치 변경이 반영되지 않아 setTimeout 활용
      if (!inputRef.current) return;
      if (!inputRef.current.selectionStart) return;
      let cursorPos = inputRef.current.selectionStart;
      // - 삭제로 인해 커서 위치 밀리는 문제 해결
      // TODO : 휴대폰 인풋에서 입력된 마지막 숫자의 뒷 부분을 누르면, 커서가 맨 마지막에서 한 칸 앞에 위치하는 문제가 있음
      if (inputRef.current.selectionStart >= 4) {
        cursorPos -= 1;
      }
      inputRef.current.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const onBlur = () => {
    setIsValid(validatePhoneNumber(value));
    // 전화번호 포맷으로 가공하기
    const part1 = value.slice(0, 3);
    const part2 = value.slice(3, 7);
    const part3 = value.slice(7, 11);
    setValue([part1, part2, part3].filter(Boolean).join("-"));
  };

  return (
    <>
      <CustomInput
        id="phoneNumber"
        placeholder="휴대전화번호 (- 없이 입력)"
        borderType={borderType}
        invalid={invalid}
        eventHandlers={{ onChange, onFocus, onBlur }}
        value={value}
        width={width}
        ref={inputRef}
        maxLength={11}
      >
        {children && children}
      </CustomInput>
    </>
  );
};

export default PhoneNumberInput;
