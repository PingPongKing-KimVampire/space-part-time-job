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
  transition: "background 0.2s",
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
    boxShadow: "0 0 7px 2px #9FB0FF",
    "&:hover": {
      background: MainHoverColor,
    },
  },
});

interface ChipsPops {
  options: string[];
}

const Chips: React.FC<ChipsPops> = (props) => {
  const { options } = props;
  return (
    <Container>
      {options &&
        options.map((option) => (
          <Option className="" key={option}>
            {option}
          </Option>
        ))}
    </Container>
  );
};

export default Chips;
