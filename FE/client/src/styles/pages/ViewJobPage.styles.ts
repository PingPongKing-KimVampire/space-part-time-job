import {
  styled,
  MainColor,
  MainHoverColor,
  SubColor,
  MainButtonStyle,
  ellipsisStyle,
  skeletonStyle,
} from "../global";

const flexStartHeight = "1000px";

export const Background = styled("div", {
  width: "100%",
  flex: "1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  overflowX: "hidden",
  [`@media (max-height: ${flexStartHeight})`]: {
    alignItems: "flex-start",
  },
  "@bp4": {
    alignItems: "flex-start",
  },
});

export const Container = styled("div", {
  width: "1400px",
  marginTop: "calc(var(--navigation-bar-height) / 2)",
  [`@media (max-height: ${flexStartHeight})`]: {
    marginTop: "calc(var(--navigation-bar-height) + 60px)",
    paddingBottom: "60px",
  },
  "@bp7": {
    width: "90%",
  },
  "@bp4": {
    marginTop: "calc(var(--navigation-bar-height-bp5) + 50px)",
    paddingBottom: "50px",
  },
  "@bp3": {
    marginTop: "calc(var(--navigation-bar-height-bp3) + 40px)",
    paddingBottom: "40px",
  },
  "@bp2": {
    marginTop: "calc(var(--navigation-bar-height-bp3) + 30px)",
    paddingBottom: "30px",
  },
  "@bp1": {
    marginTop: "calc(var(--navigation-bar-height-bp3) + 20px)",
  },
  "& .loading": {
    ...skeletonStyle,
  },
});

export const HeaderContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
  marginBottom: "45px",
  "& .jobTypesContainer": {
    display: "flex",
    gap: "8px",
    "& .jobType": {
      color: MainColor,
      border: `1px solid ${MainColor}`,
      padding: "7px 11px",
      background: SubColor,
      borderRadius: "10px",
      fontWeight: "500",
      fontSize: "17px",
      "&.loading": {
        border: "none",
      },
    },
  },
  "& .title": {
    fontSize: "30px",
    fontWeight: "bold",
    maxWidth: "100%",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "& .titleText": {
      ...ellipsisStyle,
    },
    "&.loading": {
      borderRadius: "15px",
      width: "fit-content",
    },
  },
  "& .subInfo": {
    color: "#828282",
    fontSize: "17px",
    whiteSpace: "pre",
    "&.loading": {
      borderRadius: "15px",
      width: "fit-content",
    },
  },
  "@bp6": {
    gap: "16px",
    marginBottom: "37px",
    "& .title": {
      fontSize: "29px",
    },
    "& .subInfo": {
      fontSize: "16px",
    },
  },
  "@bp4": {
    gap: "12px",
    marginBottom: "25px",
    "& .jobTypesContainer": {
      gap: "7px",
      "& .jobType": {
        padding: "6px 9px",
        fontSize: "16px",
      },
    },
    "& .title": {
      fontSize: "27px",
    },
  },
  "@bp3": {
    gap: "10px",
    "& .jobTypesContainer .jobType": {
      fontSize: "15px",
    },
    "& .title": {
      fontSize: "25px",
    },
    "& .subInfo": {
      fontSize: "14px",
    },
  },
  "@bp2": {
    "& .jobTypesContainer .jobType": {
      fontSize: "14px",
      padding: "5px 8px",
    },
    "& .title": {
      fontSize: "22px",
    },
    "& .subInfo": {
      fontSize: "13px",
    },
  },
  "@bp1": {
    "& .jobTypesContainer": {
      gap: "6px",
      "& .jobType": {
        fontSize: "13px",
        padding: "4.5px 7px",
        borderRadius: "7.5px",
      },
    },
    "& .title": {
      fontSize: "20px",
    },
    "& .subInfo": {
      fontSize: "12px",
    },
  },
});

export const ContentContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-start",
  gap: "40px",
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
      gap: "40px",
      overflow: "auto",
      paddingRight: "20px",
      "& .detail": {
        "& .title": {
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "15px",
        },
        "& .description": {
          fontSize: "18px",
          lineHeight: "22px",
          whiteSpace: "pre-line",
          "&.loading": {
            borderRadius: "15px",
          },
        },
      },
    },
  },
  "@bp6": {
    "& .rightSection .textInfo": {
      gap: "30px",
      "& .detail": {
        "& .title": {
          marginBottom: "12px",
        },
        "& .description": {
          fontSize: "17px",
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
      gap: "36px",
      "& .textInfo": {
        aspectRatio: "auto",
        gap: "35px",
        "& .detail": {
          "& .title": {
            fontSize: "19px",
            marginBottom: "8px",
          },
          "& .description": {
            fontSize: "16px",
          },
        },
      },
    },
  },
  "@bp2": {
    gap: "22px",
    "& .rightSection": {
      gap: "28px",
      "& .textInfo": {
        gap: "23px",
        "& .detail": {
          "& .title": {
            fontSize: "18px",
          },
          "& .description": {
            fontSize: "15px",
          },
        },
      },
    },
  },
  "@bp1": {
    gap: "19px",
    "& .rightSection": {
      gap: "22px",
      "& .textInfo": {
        gap: "20px",
        "& .detail": {
          "& .title": {
            fontSize: "16.5px",
          },
          "& .description": {
            fontSize: "14px",
            lineHeight: "18px",
          },
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
  "&.loading": {
    ...skeletonStyle,
  },
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
  "@bp4": {
    aspectRatio: "1.4/1",
    marginBottom: "15px",
    "& .imageList .imageBox": {
      aspectRatio: "1.4/1",
    },
    "& svg": {
      width: "5%",
      "&.left": {
        left: "5px",
      },
      "&.right": {
        right: "5px",
      },
    },
  },
  "@bp2": {
    marginBottom: "12px",
  },
  "@bp1": {
    marginBottom: "8px",
  },
});

export const ProfileContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  "& .userInfo": {
    maxWidth: "calc(100% - 100px)",
    "& .nickname": {
      fontSize: "28px",
      fontWeight: "600",
      marginBottom: "8px",
      ...ellipsisStyle,
      "&.loading": {
        width: "fit-content",
        borderRadius: "15px",
      },
    },
    "& .timeTogether": {
      fontSize: "17px",
      color: "#828282",
      ...ellipsisStyle,
      "&.loading": {
        width: "fit-content",
        borderRadius: "15px",
      },
    },
  },
  "& svg": {
    width: "75px",
    height: "75px",
    fill: MainColor,
  },
  "@bp6": {
    gap: "8px",
    "& .userInfo": {
      "& .nickname": {
        fontSize: "24px",
        marginBottom: "7px",
      },
      "& .timeTogether": {
        fontSize: "16px",
      },
    },
    "& svg": {
      width: "65px",
      height: "65px",
    },
  },
  "@bp4": {
    "& .userInfo": {
      "& .nickname": {
        fontSize: "23px",
      },
      "& .timeTogether": {
        fontSize: "15px",
      },
    },
  },
  "@bp2": {
    "& .userInfo": {
      "& .nickname": {
        fontSize: "21px",
      },
      "& .timeTogether": {
        fontSize: "13.5px",
      },
    },
    "& svg": {
      width: "60px",
      height: "60px",
    },
  },
  "@bp1": {
    gap: "6px",
    "& .userInfo": {
      "& .nickname": {
        fontSize: "19px",
        marginBottom: "6px",
      },
      "& .timeTogether": {
        fontSize: "12.5px",
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
  gap: "12px",
  "& .item": {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    transition: "background 0.2s, padding 0.2s",
    "& .main": {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      "& svg": {
        width: "26px",
        height: "26px",
        stroke: MainColor,
        strokeWidth: "1",
      },
      "& .infoText": {
        fontSize: "18px",
        "&.loading": {
          borderRadius: "15px",
        },
      },
      "& .detailButton": {
        fontSize: "14px",
        color: MainColor,
        padding: "6px 9.5px",
        borderRadius: "15px",
        marginLeft: "-5px",
        cursor: "pointer",
        border: "none",
        background: "none",
        transition: "background 0.5s",
        "&.isSelected": {
          background: SubColor,
        },
      },
    },
    "& .detail": {
      marginBottom: "15px",
      padding: "0 20px",
    },
  },
  "@bp6": {
    gap: "8px",
    "& .item .main": {
      "& .infoText": {
        fontSize: "17px",
      },
      "& svg": {
        width: "24px",
        height: "24px",
      },
    },
  },
  "@bp5": {
    "& .item .main .detailButton": {
      fontSize: "13px",
      padding: "5px 8.5px",
    },
  },
  "@bp4": {
    gap: "7px",
    "& .item .main": {
      "& .infoText": {
        fontSize: "16px",
      },
      "& .detailButton": {
        padding: "4px 7.5px",
      },
    },
  },
  "@bp3": {
    "& .item .main .detailButton": {
      marginLeft: "-4px",
    },
  },
  "@bp2": {
    gap: "6px",
    "& .item .main": {
      "& .infoText": {
        fontSize: "15px",
      },
      "& .detailButton": {
        fontSize: "12px",
        marginLeft: "0px",
      },
    },
  },
  "@bp1": {
    gap: "4px",
    "& .item": {
      gap: "7px",
      "& .main": {
        fontSize: "14px",
        gap: "7px",
      },
    },
  },
});

export const InteractionContainer = styled("div", {
  "& .interaction": {
    display: "flex",
    gap: "16px",
    "& .applyButton": {
      ...MainButtonStyle,
      fontSize: "24px",
      padding: "12px",
      width: "92%",
      "&.loading": {
        ...skeletonStyle,
      },
    },
    "& svg": {
      width: "58px",
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
  "@bp7": {
    "& .interaction svg": {
      width: "55px",
    },
  },
  "@bp6": {
    "& .interaction": {
      "& .applyButton": {
        fontSize: "21px",
      },
      "& svg": {
        width: "53px",
      },
    },
  },
  "@bp4": {
    "& .interaction svg": {
      width: "51px",
    },
  },
  "@bp3": {
    "& .interaction": {
      gap: "14px",
      "& .applyButton": {
        fontSize: "19px",
      },
      "& svg": {
        width: "49px",
      },
    },
  },
  "@bp1": {
    "& .interaction": {
      gap: "12px",
      "& .applyButton": {
        fontSize: "17.5px",
        borderRadius: "14px",
        padding: "10px",
      },
      "& svg": {
        width: "45px",
      },
    },
  },
});
