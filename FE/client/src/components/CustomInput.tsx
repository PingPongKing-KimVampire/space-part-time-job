import React, { forwardRef } from "react";
import { Container, Input } from "../styles/components/CustomInput.styles.ts";

export type InputProps = {
  id: string;
  type?: string;
  placeholder?: string;
  borderType?: "multi-top" | "multi-middle" | "multi-bottom" | "single";
  invalid?: boolean;
  value: string;
  eventHandlers?: EventHandlers;
  children?: React.ReactNode;
  maxLength?: number;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
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
    maxLength = 50,
    disabled = false,
    readOnly = false,
    className = "",
  } = props;
  const { onChange, onFocus, onBlur } = eventHandlers;
  return (
    <Container>
      <Input
        ref={ref}
        id={id}
        className={`${className} ${invalid ? "invalid" : ""}`}
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
      />
      {children}
    </Container>
  );
});

export default CustomInput;
