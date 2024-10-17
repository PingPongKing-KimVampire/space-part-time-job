import React from "react";
import { createStitches } from "@stitches/react";
import { MainColor } from "../styles/global.ts";

const { styled } = createStitches();

const Input = styled("input", {
  background: "white",
  border: "0.6px solid #343434",
  padding: "17px",
  fontSize: "18px",
  boxSizing: "border-box",
  "&::placeholder": {
    fontSize: "18px",
    color: "#B2B2B2",
  },
  outline: "none",
  "&.invalid": {
    border: "2px solid #FF4043",
  },
  "&:focus": {
    border: `2px solid ${MainColor}`,
  },
  variants: {
    borderType: {
      "multi-top": {
        borderRadius: "16px 16px 0 0",
        borderBottom: "none",
      },
      "multi-middle": {
        borderBottom: "none",
      },
      "multi-bottom": {
        borderRadius: "0 0 16px 16px",
      },
      single: {
        borderRadius: "16px",
      },
    },
  },
});

interface EventHandlers {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

interface InputProps {
  id: string;
  type?: string;
  placeholder?: string;
  borderType?: "multi-top" | "multi-middle" | "multi-bottom" | "single";
  invalid?: boolean;
  value: string;
  eventHandlers: EventHandlers;
  children?: React.ReactNode;
  width?: string;
}

const CustomInput: React.FC<InputProps> = (props) => {
  const {
    type = "text",
    placeholder = "",
    borderType = "single",
    invalid = false,
    value,
    eventHandlers,
    children,
    width = "100%",
  } = props;
  const { onChange, onFocus, onBlur } = eventHandlers;
  return (
    <div style={{ position: "relative", width }}>
      <Input
        style={{ width: "100%" }}
        className={invalid ? "invalid" : ""}
        type={type}
        placeholder={placeholder}
        borderType={borderType}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      ></Input>
      {children}
    </div>
  );
};

export default CustomInput;
