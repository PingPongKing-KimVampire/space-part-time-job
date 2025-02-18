import React, { forwardRef } from "react";
import { Input } from "../styles/components/CustomInput.styles.ts";

export type InputProps = {
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
  readOnly?: boolean;
};

export type EventHandlers = {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
};

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
    readOnly = false,
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
        readOnly={readOnly}
        autoComplete="off"
      ></Input>
      {children}
    </div>
  );
});

export default CustomInput;
