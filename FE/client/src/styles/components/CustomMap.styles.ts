import { styled } from "../global";

export const Container = styled("div", {
  width: "100%",
  height: "280px",
  borderRadius: "16px",
  border: "1px solid #E3E9ED",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  zIndex: "0",
  "&.inCreateJob": {
    "@bp5": {
      height: "calc(17vw + 80px)",
    },
    "@bp2": {
      height: "calc(25vw + 30px)",
    },
  },
  "&.inViewJob": {
    boxShadow: "none",
    "@bp6": {
      height: "calc(18vw - 10px)",
    },
    "@bp4": {
      height: "calc(22vw + 50px)",
    },
    "@bp2": {
      height: "calc(24vw + 50px)",
    },
  },
  "&.inSetNeighborhoodScope": {
    position: "absolute",
    top: "0",
    left: "0",
    height: "100%",
    width: "100%",
    zIndex: "0",
    boxSizing: "border-box",
  },
});
