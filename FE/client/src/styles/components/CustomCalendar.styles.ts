import { styled, MainColor, SubColor } from "../global";

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  "& .title": {
    fontSize: "18px",
    fontWeight: "bold",
    padding: "15px",
  },
  "&.inCreateJob": {
    marginTop: "-35px",
    width: "350px",
    "@bp2": {
      marginTop: "-25px",
      gap: "6px",
      "& .title": {
        fontSize: "16px",
        padding: "10px",
      },
      "& .dateItem": {
        padding: "6px",
        fontSize: "14px",
      },
    },
    "@bp1": {
      width: "280px",
      "& .title": {
        fontSize: "14px",
        padding: "8px",
      },
      "& .dateItem": {
        padding: "4px",
        fontSize: "13px",
      },
    },
  },
});

export const Calendar = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  "& > *": {
    width: "calc(100% / 7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
  "& .day": {
    padding: "4px",
    fontSize: "14px",
    color: "#9A9A9A",
    fontWeight: "normal",
  },
});

export const DateItem = styled("button", {
  borderRadius: "100px",
  padding: "10px",
  fontSize: "16px",
  border: "none",
  background: "none",
  transitionProperty: "background border-radius",
  transitionDuration: "0.2s",
  "&.selectable": {
    cursor: "pointer",
    "&:hover": {
      background: SubColor,
    },
  },
  "&.selectable, &.viewable": {
    "&.sunday": {
      color: "#BD2A2E",
    },
    "&.selected": {
      background: MainColor,
      color: "white",
      "&.rightSelected": {
        borderTopRightRadius: "0",
        borderBottomRightRadius: "0",
      },
      "&.leftSelected": {
        borderTopLeftRadius: "0",
        borderBottomLeftRadius: "0",
      },
    },
  },
  "&:not(.selectable):not(.viewable)": {
    color: "#9A9A9A",
    cursor: "not-allowed",
  },
});
