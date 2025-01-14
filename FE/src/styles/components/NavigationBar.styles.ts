import { createStitches } from "@stitches/react";
import { MainColor, NavigationBarHeight } from "../global.ts";

const { styled } = createStitches();

export const Container = styled("div", {
  background: MainColor,
  height: NavigationBarHeight,
  width: "100%",
  zIndex: "2",
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
          display: "flex",
          alignItems: "center",
          gap: "12px",
          "& img": {
            height: `calc(${NavigationBarHeight} * 0.45)`,
          },
        },
        "& .buttons": {
          display: "flex",
          gap: "16px",
          marginRight: "10px",
          "& svg": {
            width: "36px",
            height: "36px",
            cursor: "pointer",
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
          strokeWidth: "1.8",
        },
      },
    },
  },
});
