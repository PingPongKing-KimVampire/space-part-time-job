import React from "react";
import { createStitches } from "@stitches/react";

const { styled } = createStitches();

const Input = styled("input", {
  background: "white",
  border: "0.6px solid #343434",
  width: "100%",
  padding: "16px",
  fontSize: "22px",
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
    border: "2px solid #4361EE",
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
  type?: string;
  placeholder: string;
  borderType: "multi-top" | "multi-middle" | "multi-bottom" | "single";
  invalid: boolean;
  value: string;
  eventHandlers: EventHandlers;
}

const CustomInput: React.FC<InputProps> = (props) => {
  const {
    type = "text",
    placeholder,
    borderType,
    invalid,
    value,
    eventHandlers,
  } = props;
  const { onChange, onFocus, onBlur } = eventHandlers;
  return (
    <Input
      className={invalid ? "invalid" : ""}
      type={type}
      placeholder={placeholder}
      borderType={borderType}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
};

export default CustomInput;
