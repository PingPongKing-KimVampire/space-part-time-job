import { styled, MainColor, NegativeColor } from "../global";

export const Badge = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "3px",
  fontWeight: "bold",
  fontSize: "16px",
  "&.accepted": {
    color: MainColor,
  },
  "&.rejected": {
    color: NegativeColor,
  },
  "& svg": {
    width: "20px",
    height: "20px",
    strokeWidth: "2",
  },
});
