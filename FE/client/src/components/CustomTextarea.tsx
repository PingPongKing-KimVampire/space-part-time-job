import React from "react";
import {
  Container,
  Textarea,
  CharCounter,
} from "../styles/components/CustomTextarea.styles";

type CustomTextareaProps = {
  placeholder: string;
  value: string;
  eventHandlers?: {
    onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  };
  maxLength?: number;
  className?: string;
};

const CustomTextarea: React.FC<CustomTextareaProps> = (props) => {
  const {
    placeholder,
    value,
    eventHandlers = {},
    maxLength = 200,
    className = "",
  } = props;
  const { onFocus, onChange, onBlur } = eventHandlers;

  return (
    <Container>
      <Textarea
        placeholder={placeholder}
        rows={5}
        value={value}
        onFocus={onFocus}
        onChange={onChange}
        onBlur={onBlur}
        maxLength={maxLength}
        className={className}
      />
      <CharCounter className={className}>
        <span>{[...value].length}</span>/{maxLength}
      </CharCounter>
    </Container>
  );
};

export default CustomTextarea;
