import { createStitches } from "@stitches/react";
import { ReactComponent as ArrowDown } from "../../assets/icons/arrow-down.svg";
import { OptionHoverColor } from "../../styles/global.ts";

const { styled } = createStitches();

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "100%",
  "& .mapContainer": {
    width: "100%",
    height: "240px",
    borderRadius: "16px",
    border: "1px solid #E3E9ED",
    boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  },
});

export const ExposurePanel = styled("div", {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  background: OptionHoverColor,
  borderRadius: "12px",
  padding: "16px",
  boxSizing: "border-box",
  "& .main": {
    position: "relative",
    "& span": {
      fontWeight: "bold",
    },
  },
});

export const ExposureDetailContent = styled("div", {
  lineHeight: "23px",
  transition: "all 0.2s",
  variants: {
    isVisible: {
      true: {
        height: "auto",
        opacity: "1",
        marginTop: "10px",
      },
      false: {
        height: "0",
        opacity: "0",
      },
    },
  },
});

export const ArrowDownIcon = styled(ArrowDown, {
  width: "26px",
  height: "26px",
  strokeWidth: "1.6",
  color: "#7C7C7C",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  right: "0",
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
