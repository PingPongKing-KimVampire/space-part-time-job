import { createStitches } from "@stitches/react";
import { MainColor, NegativeColor } from "../global.ts";

const { styled } = createStitches();

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
