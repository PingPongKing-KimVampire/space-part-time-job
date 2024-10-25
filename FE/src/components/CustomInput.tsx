import React, { forwardRef } from "react";
import { createStitches } from "@stitches/react";
import { MainColor } from "../styles/global.ts";

const { styled } = createStitches();

const Input = styled("input", {
  background: "white",
  border: "1px solid #B2B2B2",
  padding: "17px",
  fontSize: "18px",
  boxSizing: "border-box",
  "&::placeholder": {
    fontSize: "18px",
    color: "#B2B2B2",
  },
  outline: "none",
  "&.invalid": {
    borderColor: "#FF4043",
  },
  "&:focus": {
    borderColor: MainColor,
  },
  variants: {
    borderType: {
      "multi-top": {
        borderRadius: "16px 16px 0 0",
        borderBottomWidth: "0.5px",
      },
      "multi-middle": {
        borderTopWidth: "0.5px",
        borderBottomWidth: "0.5px",
      },
      "multi-bottom": {
        borderRadius: "0 0 16px 16px",
        borderTopWidth: "0.5px",
      },
      single: {
        borderRadius: "16px",
      },
    },
  },
});

export interface InputProps {
  id: string;
  type?: string;
  placeholder?: string;
  borderType?: "multi-top" | "multi-middle" | "multi-bottom" | "single";
  invalid?: boolean;
  value: string;
  eventHandlers?: EventHandlers;
  children?: React.ReactNode;
  width?: string;
  maxLength?: number;
  disabled?: boolean;
}

export interface EventHandlers {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

const CustomInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    id,
    type = "text",
    placeholder = "",
    borderType = "single",
    invalid = false,
    value,
    eventHandlers = {},
    children,
    width = "100%",
    maxLength = 50,
    disabled = false,
  } = props;
  const { onChange, onFocus, onBlur } = eventHandlers;
  return (
    <div style={{ position: "relative", width }}>
      <Input
        ref={ref}
        style={{ width: "100%" }}
        id={id}
        className={invalid ? "invalid" : ""}
        type={type}
        placeholder={placeholder}
        borderType={borderType}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        maxLength={maxLength}
        disabled={disabled}
      ></Input>
      {children}
    </div>
  );
});

export default CustomInput;
