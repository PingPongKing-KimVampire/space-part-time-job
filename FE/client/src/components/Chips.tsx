import React from "react";
import { Container, Option } from "../styles/components/Chips.styles.ts";

type ChipsPops = {
  id: string;
  options: string[];
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  isSelected?: (day: string) => boolean; // option을 인자로 전달했을 때, selected 여부 반환
  className?: string;
};

const Chips: React.FC<ChipsPops> = (props) => {
  const { id, options, onClick, isSelected, className = "" } = props;

  return (
    <Container id={id} className={className}>
      {options &&
        options.map((option) => (
          <Option
            className={`${className} ${
              isSelected ? (isSelected(option) ? "selected" : "") : ""
            }`}
            key={option}
            onClick={onClick}
          >
            {option}
          </Option>
        ))}
    </Container>
  );
};

export default Chips;
