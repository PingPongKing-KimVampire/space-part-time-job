import { createStitches } from "@stitches/react";
import { OptionHoverColor } from "../styles/global.ts";
import { ReactComponent as ArrowDown } from "../assets/icons/arrow-down.svg";

const { styled } = createStitches();

export const Container = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  marginTop: "20px",
  transition: "margin-bottom 0.2s",
  "&.hasMarginBottom": {
    marginBottom: "215px",
    "&.isMini": {
      marginBottom: "160px",
    },
  },
  "& .waveSymbol": {
    fontSize: "30px",
    fontWeight: "300",
    color: "#B2B2B2",
    "&.isMini": {
      fontSize: "20px",
    },
  },
});

export const TimeSelectionContainer = styled("div", {
  width: "47%",
  position: "relative",
  "& .timeInputButton": {
    width: "100%",
    position: "relative",
    background: "none",
    border: "1px solid #B2B2B2",
    padding: "17px",
    fontSize: "18px",
    boxSizing: "border-box",
    cursor: "pointer",
    textAlign: "left",
    borderRadius: "16px",
    transition: "background 0.2s",
    "&.isMini": {
      padding: "10px",
      fontSize: "15px",
      borderRadius: "10px",
    },
    "&:hover": {
      background: OptionHoverColor,
    },
  },
  "& label": {
    position: "absolute",
    top: "-24px",
    left: "0px",
    color: "#9A9A9A",
    fontSize: "14px",
    "&.isMini": {
      fontSize: "13px",
      top: "-20px",
    },
  },
});

export const ArrowDownIcon = styled(ArrowDown, {
  width: "30px",
  height: "30px",
  strokeWidth: "0.8",
  color: "#7C7C7C",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  right: "15px",
  transition: "transform 0.2s",
  variants: {
    isSelected: {
      true: {
        transform: "translateY(-50%) rotate(180deg)",
      },
      false: {
        transform: "translateY(-50%)",
      },
    },
  },
});

export const SelectBox = styled("div", {
  position: "absolute",
  top: "130%",
  left: "0",
  width: "100%",
  height: "200px",
  overflow: "auto",
  borderRadius: "14px",
  padding: "6px",
  border: "1px solid #B2B2B2",
  boxSizing: "border-box",
  "& .optionButton": {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "none",
    background: "none",
    cursor: "pointer",
    transition: "background 0.2s",
    letterSpacing: "1px",
    color: "#9A9A9A",
    "&:hover": {
      background: OptionHoverColor,
      color: "black",
    },
  },
  "&.isMini": {
    height: "150px",
    padding: "4px",
    "& .optionButton": {
      padding: "6px",
      fontSize: "14px",
    },
  },
  "&::-webkit-scrollbar": {
    display: "none",
  },
});