import React from "react";
import { Container, Option } from "../styles/components/Chips.styles.ts";

type ChipsPops = {
  id: string;
  options: string[];
  // TODO : 이 물음표 없애야함
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // option을 인자로 전달했을 때, selected 여부 반환
  isSelected?: (day: string) => boolean;
  containerStyle?: Record<string, string>;
  optionStyle?: Record<string, string>;
};

const Chips: React.FC<ChipsPops> = (props) => {
  const {
    id,
    options,
    onClick,
    isSelected,
    containerStyle = {},
    optionStyle = {},
  } = props;

  return (
    <Container id={id} className="chips" style={containerStyle}>
      {options &&
        options.map((option) => (
          <Option
            className={`option ${
              isSelected ? (isSelected(option) ? "selected" : "") : ""
            }`}
            key={option}
            onClick={onClick}
            style={optionStyle}
          >
            {option}
          </Option>
        ))}
    </Container>
  );
};

export default Chips;
