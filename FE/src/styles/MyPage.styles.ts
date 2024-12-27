import { createStitches } from "@stitches/react";
import {
  MainButtonStyle,
  MainColor,
  MainHoverColor,
  OptionHoverColor,
  NavigationBarHeight,
} from "./global";
import { ReactComponent as ArrowDown } from "../assets/icons/arrow-down.svg";

const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  paddingTop: NavigationBarHeight,
  boxSizing: "border-box",
});

export const TopArea = styled("div", {
  width: "100%",
  background: "white",
  display: "flex",
  justifyContent: "center",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  "& .container": {
    width: "700px",
  },
});

export const ProfileContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "80px",
  margin: "60px 0 40px 0",
  "& .userInfo": {
    flexGrow: "1",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    height: "100%",
    "& svg": {
      fill: MainColor,
      height: "100%",
      aspectRatio: "1/1",
    },
    "& .textInfo": {
      "& .nickname": {
        fontSize: "24px",
        fontWeight: "900",
        marginBottom: "4px",
      },
      "& .subInfo": {
        fontSize: "15px",
        color: "#828282",
      },
    },
  },
  "& .logoutButton": {
    ...MainButtonStyle,
    fontSize: "17px",
    padding: "10px 22px",
    borderRadius: "12px",
  },
});

export const TabsContainer = styled("div", {
  width: "100%",
  display: "flex",
  position: "relative",
  height: "50px",
  "& .tabButton": {
    fontSize: "20px",
    fontWeight: "600",
    background: "none",
    border: "none",
    height: "100%",
    position: "absolute",
    cursor: "pointer",
    width: "150px",
    "&:nth-of-type(1)": {
      left: "0",
    },
    "&:nth-of-type(2)": {
      left: "50%",
      transform: "translateX(-50%)",
    },
    "&:nth-of-type(3)": {
      left: "100%",
      transform: "translateX(-100%)",
    },
    "&.selected": {
      color: MainColor,
      fontWeight: "800",
    },
    "&:hover": {
      color: MainColor,
    },
  },
  "& .tabIndicator": {
    position: "absolute",
    width: "150px",
    height: "4px",
    background: MainColor,
    bottom: "0",
    transition: "left 0.2s",
    "&.left": {
      left: "0",
    },
    "&.middle": {
      left: "50%",
      transform: "translateX(-50%)",
    },
    "&.right": {
      left: "100%",
      transform: "translateX(-100%)",
    },
  },
});

export const BottomArea = styled("div", {
  width: "100%",
  flexGrow: "1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  paddingTop: "24px",
  paddingBottom: "30px",
  overflow: "scroll",
});

export const ListItem = styled("button", {
  width: "700px",
  padding: "13px 17px",
  background: "white",
  borderRadius: "15px",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  transition: "background 0.2s",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "none",
  cursor: "pointer",
  "&.isHovering": {
    background: OptionHoverColor,
    "& .arrowDownIcon": {
      strokeWidth: "2.2",
      color: MainHoverColor,
    },
    "& .withItemHover": {
      textDecoration: "underline !important",
    },
  },
  "& .title": {
    fontWeight: "600",
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "& button": {
      background: "none",
      border: "none",
      color: "black",
      fontSize: "18px",
      fontWeight: "600",
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
  },
  "& .interaction": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    "& button": {
      ...MainButtonStyle,
      fontSize: "15px",
      padding: "6px 11px",
      borderRadius: "9px",
      cursor: "pointer",
      "&:not(.inactivated):hover": {
        background: MainHoverColor,
      },
      "& span": {
        fontWeight: "400",
      },
    },
    "& .interestAgo": {
      fontSize: "15px",
      color: "#828282",
    },
  },
});

export const MainPanel = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
});

export const TogglePanel = styled("div", {
  width: "100%",
  height: "0",
  opacity: "0",
  transition: "all 0.2s",
  pointerEvents: "none",
  overflow: "hidden",
  "&.visible": {
    height: "auto",
    opacity: "1",
    marginTop: "10px",
    pointerEvents: "auto",
    overflow: "visible",
  },
  "& .coverLetter": {
    fontSize: "15px",
    lineHeight: "23px",
    textAlign: "left",
  },
  "& .createdAt": {
    fontSize: "13px",
    color: "#828282",
    textAlign: "right",
  },
});

export const ArrowDownIcon = styled(ArrowDown, {
  width: "26px",
  height: "26px",
  strokeWidth: "1.6",
  color: MainColor,
  transition: "transform 0.2s",
  variants: {
    isSelected: {
      true: {
        transform: "rotate(180deg)",
      },
      false: {
        transform: "none",
      },
    },
  },
});
