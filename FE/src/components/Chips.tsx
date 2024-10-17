import React from "react";
import { createStitches } from "@stitches/react";
import { MainColor, MainHoverColor } from "../styles/global.ts";

const { styled } = createStitches();

const Container = styled("div", {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "9px 7px",
});

const Option = styled("button", {
  padding: "5px 12px",
  borderRadius: "18px",
  fontSize: "16px",
  display: "flex",
  border: `1px solid ${MainColor}`,
  transitionProperty: "background boxShadow",
  transitionDuration: "0.2s",
  "&:not(.selected)": {
    background: "white",
    "&:hover": {
      background: "#DCE2FF",
      borderColor: "#DCE2FF",
    },
  },
  "&.selected": {
    background: MainColor,
    color: "white",
    boxShadow: "0 0 3px 1px #9FB0FF",
    "&:hover": {
      background: MainHoverColor,
    },
  },
});

interface ChipsPops {
  id: string;
  options: string[];
  // TODO : 이 물음표 없애야함
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // option을 인자로 전달했을 때, selected 여부 반환
  isSelected?: (day: string) => boolean;
}

const Chips: React.FC<ChipsPops> = (props) => {
  const { id, options, onClick, isSelected } = props;

  return (
    <Container id={id}>
      {options &&
        options.map((option) => (
          <Option
            className={isSelected ? (isSelected(option) ? "selected" : "") : ""}
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
