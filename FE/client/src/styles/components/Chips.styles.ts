import { styled, MainColor, MainHoverColor, SubColor } from "../global";

export const Container = styled("div", {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: "9px 7px",
});

export const Option = styled("button", {
  padding: "5px 12px",
  borderRadius: "18px",
  fontSize: "16px",
  display: "flex",
  border: `1px solid ${MainColor}`,
  cursor: "pointer",
  transitionProperty: "background boxShadow",
  transitionDuration: "0.2s",
  "&:not(.selected)": {
    background: "white",
    "&:hover": {
      background: SubColor,
      borderColor: SubColor,
    },
  },
  "&.selected": {
    background: MainColor,
    color: "white",
    boxShadow: "0 0 3px 1px #AFB7DB",
    "&:hover": {
      background: MainHoverColor,
      borderColor: MainHoverColor,
    },
  },
});
