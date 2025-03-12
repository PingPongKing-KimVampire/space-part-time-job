import { styled, MainColor } from "../global";

export const Container = styled("div", {
  width: "100%",
  background: "white",
  border: "1px solid #B2B2B2",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  overflow: "hidden",
  paddingRight: "10px",
  position: "relative",
  variants: {
    borderType: {
      "multi-top": {
        borderRadius: "16px 16px 0 0",
        borderBottomWidth: "0.5px",
      },
      "multi-middle": {
        borderTopWidth: "0.5px",
        borderBottomWidth: "0.5px",
      },
      "multi-bottom": {
        borderRadius: "0 0 16px 16px",
        borderTopWidth: "0.5px",
      },
      single: {
        borderRadius: "16px",
      },
    },
  },
});

export const Input = styled("input", {
  flex: "1",
  padding: "17px",
  fontSize: "18px",
  border: "0",
  "&::placeholder": {
    fontSize: "18px",
    color: "#B2B2B2",
  },
  outline: "none",
  "&.invalid": {
    borderColor: "#FF4043",
  },
  "&:focus": {
    borderColor: MainColor,
  },
  "&:-webkit-autofill": {
    // For Safari
    boxShadow: "0 0 0px 1000px white inset",
  },
  "&.inCreateJob": {
    "&.placeInput": {
      cursor: "pointer",
    },
    "@bp2": {
      padding: "15px",
    },
    "@bp1": {
      padding: "13px",
      fontSize: "16px",
      "&::placeholder": {
        fontSize: "16px",
      },
    },
  },
  "&.inLogin, &.inSearchNeighborhood": {
    "@bp3": {
      padding: "16px",
      fontSize: "16px",
      "&::placeholder": {
        fontSize: "16px",
      },
    },
    "@bp1": {
      padding: "14px",
      fontSize: "15px",
      "&::placeholder": {
        fontSize: "15px",
      },
    },
  },
  "&.inSignup": {
    "@bp3": {
      padding: "16px",
      fontSize: "16px",
      "&::placeholder": {
        fontSize: "16px",
      },
    },
    "@bp1": {
      padding: "14px",
      fontSize: "15px",
      "&::placeholder": {
        fontSize: "15px",
      },
    },
  },
});

export const EyeButton = styled("button", {
  width: "35px",
  height: "35px",
  border: "none",
  background: "none",
  cursor: "pointer",
  outline: "none",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& svg": {
    height: "30px",
    width: "30px",
    strokeWidth: "0.8",
    color: "#7C7C7C",
  },
});
