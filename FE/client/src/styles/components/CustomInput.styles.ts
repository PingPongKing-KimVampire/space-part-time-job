import { styled, MainColor } from "../global";

export const Input = styled("input", {
  background: "white",
  border: "1px solid #B2B2B2",
  padding: "17px",
  fontSize: "18px",
  boxSizing: "border-box",
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

export const EyeButton = styled("button", {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  height: "60%",
  border: "none",
  background: "none",
  cursor: "pointer",
  outline: "none",
  "& svg": {
    width: "100%",
    height: "100%",
    strokeWidth: "0.8",
    color: "#7C7C7C",
  },
});
