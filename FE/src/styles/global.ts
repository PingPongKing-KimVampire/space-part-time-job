import { createStitches } from "@stitches/react";

const { styled } = createStitches();

export const MainColor = "#4361EE";
export const MainHoverColor = "#2E4BD5";
export const MainBackgroundColor = "#F9FBFC";
export const OptionHoverColor = "#DCE2FF";

const ButtonStyle = {
  fontWeight: "bold",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  position: "relative",
  transitionDuration: "0.2s",
  transitionProperty: "background border",
};

export const MainButtonStyle = {
  ...ButtonStyle,
  fontSize: "24px",
  "&.inactivated": {
    background: "#EDEDED",
    color: "#B0B0B0",
    cursor: "not-allowed",
  },
  "&:not(.inactivated)": {
    background: MainColor,
    color: "white",
    cursor: "pointer",
    "&:hover": {
      background: MainHoverColor,
    },
  },
};

export const OptionButtonStyle = {
  ...ButtonStyle,
  fontSize: "16px",
  "&.inactivated": {
    background: "#EDEDED",
    color: "#B0B0B0",
    cursor: "not-allowed",
    border: `0.9px solid #EDEDED`,
  },
  "&.selected": {
    background: MainColor,
    border: `0.9px solid ${MainColor}`,
    color: "white",
    cursor: "pointer",
    "&:hover": {
      background: MainHoverColor,
      borderColor: MainHoverColor,
    },
  },
  "&:not(.selected):not(.inactivated)": {
    border: `0.9px solid ${MainColor}`,
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
    "&:hover": {
      background: OptionHoverColor,
      borderColor: OptionHoverColor,
    },
  },
};

export const WarningText = styled("div", {
  marginTop: "10px",
  color: "#FF4043",
  fontSize: "14px",
});
