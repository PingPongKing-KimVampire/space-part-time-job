import {
  styled,
  MainColor,
  MainHoverColor,
  SubColor,
  MainButtonStyle,
  ellipsisStyle,
} from "../global";

export const Background = styled("div", {
  width: "100%",
  flex: "1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "@media (max-height: 750px)": {
    alignItems: "flex-start",
  },
  "@bp4": {
    alignItems: "flex-start",
  },
});

export const Container = styled("div", {
  width: "1000px",
  marginTop: "calc(var(--navigation-bar-height) / 2)",
  "@media (max-height: 750px)": {
    marginTop: "calc(var(--navigation-bar-height) + 40px)",
    paddingBottom: "40px",
  },
  "@bp5": {
    width: "900px",
  },
  "@bp4": {
    width: "90%",
    marginTop: "calc(var(--navigation-bar-height) + 40px)",
    paddingBottom: "40px",
  },
  "@bp2": {
    marginTop: "calc(var(--navigation-bar-height) + 30px)",
    paddingBottom: "30px",
  },
});

export const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginBottom: "35px",
  "& .jobTypesContainer": {
    display: "flex",
    gap: "6px",
    "& .jobType": {
      color: MainColor,
      border: `1px solid ${MainColor}`,
      padding: "5px 9px",
      background: SubColor,
      borderRadius: "10px",
      fontWeight: "500",
      fontSize: "16px",
    },
  },
  "& .title": {
    fontSize: "24px",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    lineHeight: "30px",
  },
  "& .subInfo": {
    color: "#828282",
    fontSize: "14px",
    whiteSpace: "pre",
  },
  "@bp2": {
    marginBottom: "25px",
    gap: "8px",
    "& .jobTypesContainer .jobType": {
      fontSize: "14px",
    },
    "& .title": {
      fontSize: "22px",
    },
    "& .subInfo": {
      fontSize: "13px",
    },
  },
  "@bp1": {
    gap: "5px",
    "& .jobTypesContainer": {
      gap: "5px",
      "& .jobType": {
        fontSize: "13px",
        padding: "5px 7px",
        borderRadius: "8px",
      },
    },
    "& .title": {
      fontSize: "20px",
    },
    "& .subInfo": {
      fontSize: "13px",
    },
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
  "@bp4": {
    flexDirection: "column",
    gap: "30px",
    "& .leftSection": {
      width: "100%",
    },
    "& .rightSection": {
      width: "100%",
      gap: "40px",
      "& .textInfo": {
        aspectRatio: "auto",
      },
    },
  },
  "@bp2": {
    gap: "20px",
    "& .rightSection": {
      gap: "30px",
      "& .textInfo": {
        gap: "25px",
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
    strokeWidth: "1",
    cursor: "pointer",
    transition: "opacity 0.4s",
    filter: "drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.4))",
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
  "@bp2": {
    marginBottom: "10px",
  },
  "@bp1": {
    marginBottom: "8px",
  },
});

export const ProfileContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  "& .userInfo": {
    width: "300px",
    "& .nickname": {
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "7px",
      ...ellipsisStyle,
    },
    "& .timeTogether": {
      fontSize: "14px",
      color: "#828282",
      ...ellipsisStyle,
    },
  },
  "& svg": {
    width: "12%",
    fill: MainColor,
  },
  "@bp4": {
    gap: "10px",
    "& .userInfo": {
      width: "100%",
      "& .nickname": {
        fontSize: "22px",
      },
      "& .timeTogether": {
        fontSize: "15px",
      },
    },
    "& svg": {
      width: "68px",
      height: "68px",
    },
  },
  "@bp2": {
    "& .userInfo": {
      "& .nickname": {
        fontSize: "20px",
      },
      "& .timeTogether": {
        fontSize: "13px",
      },
    },
    "& svg": {
      width: "60px",
      height: "60px",
    },
  },
  "@bp1": {
    "& .userInfo": {
      "& .nickname": {
        fontSize: "18px",
      },
      "& .timeTogether": {
        fontSize: "12px",
      },
    },
    "& svg": {
      width: "55px",
      height: "55px",
    },
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
          background: SubColor,
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
    gap: "12px",
    "& .applyButton": {
      ...MainButtonStyle,
      fontSize: "20px",
      padding: "12px",
      width: "94%",
    },
    "& svg": {
      width: "8%",
      strokeWidth: "0.6",
      stroke: "#828282",
      transition: "all 0.2s",
      cursor: "pointer",
      "&:hover": {
        fill: SubColor,
        stroke: MainColor,
        strokeWidth: "1.5",
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
        stroke: "#B0B0B0",
        strokeWidth: "0.6",
        fill: "#B0B0B0",
      },
    },
  },
  "@bp4": {
    "& .interaction": {
      gap: "16px",
      "& .applyButton": {
        background: "red",
        padding: "16px",
      },
      "& svg": {
        width: "55px",
      },
    },
  },
  "@bp3": {
    "& .interaction": {
      gap: "14px",
      "& .applyButton": {
        padding: "14px",
        fontSize: "18px",
      },
      "& svg": {
        width: "50px",
      },
    },
  },
  "@bp1": {
    "& .interaction": {
      gap: "10px",
      "& .applyButton": {
        padding: "10px",
        fontSize: "16px",
        borderRadius: "12px",
      },
    },
  },
});
