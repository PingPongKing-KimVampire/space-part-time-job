import { createStitches } from "@stitches/react";

const { styled } = createStitches();

export const MainColor = "#4361EE";
export const MainHoverColor = "#2E4BD5";
export const MainBackgroundColor = "#F9FBFC";
export const OptionHoverColor = "#DCE2FF";
export const NavigationBarHeight = "65px";
export const NegativeColor = "#EE4346";
export const NegativeHoverColor = "#DD2B2E";

export const ButtonStyle = {
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

export const CloseTag = styled("div", {
  fontSize: "15px",
  padding: "6px 11px",
  borderRadius: "9px",
  background: "#E4E4E4",
  color: "#7C7C7C",
  fontWeight: "bold",
  whiteSpace: "nowrap",
});

export const ellipsisStyle = {
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

export const ModalBackground = styled("div", {
  position: "absolute",
  left: "0",
  top: "0",
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .container": {
    width: "400px",
    background: "white",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 24px",
    gap: "18px",
    position: "relative",
    "& .title": {
      fontSize: "22px",
      fontWeight: "bold",
    },
    "& .textareaContainer": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
    },
    "& .applyButton": {
      ...MainButtonStyle,
      width: "100%",
      fontSize: "20px",
      padding: "12px",
      textAlign: "center",
      boxSizing: "border-box",
    },
    "& svg": {
      position: "absolute",
      top: "12px",
      right: "12px",
      width: "30px",
      color: MainColor,
      strokeWidth: "1",
      cursor: "pointer",
    },
  },
});
