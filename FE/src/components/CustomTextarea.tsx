import React from "react";
import {
  Container,
  Textarea,
  CharCounter,
} from "../styles/CustomTextarea.styles.ts";

type CustomTextareaProps = {
  placeholder: string;
  value: string;
  eventHandlers?: {
    onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  };
  maxLength?: number;
};

const CustomTextarea: React.FC<CustomTextareaProps> = (props) => {
  const { placeholder, value, eventHandlers = {}, maxLength = 2000 } = props;
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
      />
      <CharCounter>
        <span>{value.length}</span>/2000
      </CharCounter>
    </Container>
  );
};

export default CustomTextarea;