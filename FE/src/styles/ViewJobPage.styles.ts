import { createStitches } from "@stitches/react";
import {
  MainColor,
  MainHoverColor,
  OptionHoverColor,
  MainButtonStyle,
} from "./global";

const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  flex: "1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const Container = styled("div", {
  width: "1000px",
});

export const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "25px",
  "& .jobTypesContainer": {
    display: "flex",
    gap: "6px",
    "& .jobType": {
      color: MainColor,
      border: `1px solid ${MainColor}`,
      padding: "4px 9px",
      background: OptionHoverColor,
      borderRadius: "10px",
      fontWeight: "500",
      fontSize: "13px",
    },
  },
  "& .title": {
    fontSize: "24px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  "& .subInfo": {
    color: "#828282",
    fontSize: "13px",
    whiteSpace: "pre",
  },
});

export const ContentContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "50px",
  "& .leftSection": {
    width: "40%",
  },
  "& .rightSection": {
    width: "60%",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    "& .textInfo": {
      width: "100%",
      aspectRatio: 6 / 4,
      display: "flex",
      flexDirection: "column",
      gap: "30px",
      overflow: "auto",
      paddingRight: "20px",
      "& .detail": {
        "& .title": {
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "10px",
        },
        "& .description": {
          fontSize: "14px",
          lineHeight: "22px",
          whiteSpace: "pre-line",
        },
      },
    },
  },
});

export const ImageSliderContainer = styled("div", {
  width: "100%",
  aspectRatio: "1/1",
  border: "1px solid #DBDBDB",
  borderRadius: "10px",
  overflow: "hidden",
  marginBottom: "20px",
  position: "relative",
  "& .imageList": {
    display: "flex",
    height: "100%",
    transition: "transform 0.5s",
    "& .imageBox": {
      height: "100%",
      aspectRatio: "1/1",
      "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
      },
    },
  },
  "& .indicatorContainer": {
    position: "absolute",
    left: "0",
    right: "0",
    bottom: "0",
    height: "10%",
    background:
      "linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3))",
    "& .indicator": {
      display: "flex",
      gap: "10px",
      position: "absolute",
      bottom: "40%",
      left: "50%",
      transform: "translateX(-50%)",
      "& .item": {
        width: "8px",
        height: "8px",
        background: "white",
        borderRadius: "10px",
        opacity: "0.3",
        border: "none",
        padding: "0",
        cursor: "pointer",
        "&.active": {
          opacity: "1",
        },
      },
    },
  },
  "& svg": {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "10%",
    height: "10%",
    stroke: "white",
    strokeWidth: "0.8",
    cursor: "pointer",
    transition: "opacity 0.4s",
    "&.inactive": {
      opacity: "0",
      pointerEvents: "none",
    },
    "&.left": {
      left: "0%",
    },
    "&.right": {
      right: "0%",
    },
  },
});

export const ProfileContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  "& .userInfo": {
    "& .nickname": {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "4px",
    },
    "& .timeTogether": {
      fontSize: "12px",
      color: "#828282",
    },
  },
  "& svg": {
    width: "12%",
    fill: MainColor,
  },
});

export const BasicInfoContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  "& .item": {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    borderRadius: "10px",
    transition: "background 0.2s, padding 0.2s",
    "& .main": {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      fontSize: "14px",
      "& svg": {
        width: "23px",
        height: "23px",
        stroke: MainColor,
        strokeWidth: "1",
      },
      "& .hoverTarget": {
        fontSize: "13px",
        color: MainColor,
        transition: "background 0.2s",
        padding: "2px 7px",
        borderRadius: "10px",
        marginLeft: "-5px",
        "&:hover": {
          background: OptionHoverColor,
        },
      },
    },
    "& .detail": {
      marginBottom: "15px",
      padding: "0 20px",
    },
  },
});

export const InteractionContainer = styled("div", {
  "& .info": {
    color: "#828282",
    fontSize: "13px",
    marginBottom: "10px",
  },
  "& .interaction": {
    display: "flex",
    gap: "15px",
    "& .applyButton": {
      ...MainButtonStyle,
      fontSize: "20px",
      padding: "12px",
      width: "94%",
    },
    "& svg": {
      width: "6%",
      strokeWidth: "0.6",
      stroke: "#828282",
      transition: "all 0.2s",
      "&:hover": {
        fill: OptionHoverColor,
        stroke: MainColor,
        strokeWidth: "0.8",
      },
      "&.selected": {
        fill: MainColor,
        stroke: MainColor,
        strokeWidth: "0.8",
        "&:hover": {
          fill: MainHoverColor,
        },
      },
      "&:not(.selected).inactivated": {
        cursor: "not-allowed",
        pointerEvents: "none",
        // TODO : 비활성화 스타일로 변경
      },
    },
  },
});

export const ApplicationModalBackground = styled("div", {
  position: "absolute",
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .container": {
    width: "400px",
    background: "white",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 24px",
    gap: "18px",
    position: "relative",
    "& .title": {
      fontSize: "22px",
      fontWeight: "bold",
    },
    "& .textareaContainer": {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      marginBottom: "15px",
    },
    "& .applyButton": {
      ...MainButtonStyle,
      width: "100%",
      fontSize: "20px",
      padding: "12px",
      textAlign: "center",
      boxSizing: "border-box",
    },
    "& svg": {
      position: "absolute",
      top: "12px",
      right: "12px",
      width: "30px",
      color: MainColor,
      strokeWidth: "1",
      cursor: "pointer",
    },
  },
});
