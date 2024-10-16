import { createStitches } from "@stitches/react";

const { styled } = createStitches();

export const MainColor = "#4361EE";

const ButtonStyle = {
  fontSize: "24px",
  fontWeight: "bold",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  position: "relative",
};

export const MainButtonStyle = {
  ...ButtonStyle,
  "&.inactivated": {
    background: "#EDEDED",
    color: "#B0B0B0",
    cursor: "not-allowed",
  },
  "&:not(.inactivated) ": {
    background: MainColor,
    color: "white",
    cursor: "pointer",
    transition: "background 0.2s",
    "&:hover": {
      background: "#2E4BD5",
    },
  },
};

export const WarningText = styled("div", {
  marginTop: "10px",
  color: "#FF4043",
});
