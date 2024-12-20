import { createStitches } from "@stitches/react";
import {
  MainColor,
  OptionHoverColor,
  NavigationBarHeight,
} from "../styles/global.ts";

const { styled } = createStitches();

export const Container = styled("div", {
  background: MainColor,
  height: NavigationBarHeight,
  width: "100%",
  zIndex: "1",
  boxShadow: "0 0 3px 1px #9FB0FF",
  display: "flex",
  justifyContent: "center",
  position: "fixed",
});

export const Content = styled("div", {
  height: "100%",
  width: "1000px",
  display: "flex",
  alignItems: "center",
  color: "white",
  position: "relative",
  variants: {
    type: {
      main: {
        justifyContent: "space-between",
        "& .logo": {
          fontSize: "25px",
          fontWeight: "900",
          cursor: "pointer",
          transition: "color 0.3s",
          "&:hover": {
            color: OptionHoverColor,
          },
        },
        "& .buttons": {
          display: "flex",
          gap: "14px",
          marginRight: "10px",
          "& svg": {
            width: "40px",
            height: "40px",
            cursor: "pointer",
            transition: "fill 0.3s",
            "&:hover": {
              fill: OptionHoverColor,
            },
          },
        },
      },
      local: {
        justifyContent: "center",
        "& .title": {
          fontSize: "24px",
          fontWeight: "700",
        },
        "& svg": {
          position: "absolute",
          left: "10px",
          width: "35px",
          height: "35px",
          cursor: "pointer",
          transition: "fill 0.3s",
          strokeWidth: "1.8",
          "&:hover": {
            stroke: OptionHoverColor,
          },
        },
      },
    },
  },
});
