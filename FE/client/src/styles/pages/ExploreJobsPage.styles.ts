import {
  styled,
  MainColor,
  SubColor,
  MainHoverColor,
  SubHoverColor,
  NavigationBarHeight,
  getResponsiveStyleByBp,
  ellipsisStyle,
  MainButtonStyle,
} from "../global";
import { ReactComponent as ArrowDown } from "../../assets/icons/arrow-down.svg";
import { ReactComponent as Location } from "../../assets/icons/location.svg";

const backgroundResponsiveStyle = getResponsiveStyleByBp(
  (navigationBarHeight) => ({ paddingTop: navigationBarHeight })
);
export const Background = styled("div", {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  paddingTop: NavigationBarHeight.default,
  boxSizing: "border-box",
  ...backgroundResponsiveStyle,
});

export const Container = styled("div", {
  width: "1400px",
  marginTop: "40px",
  display: "flex",
  flexDirection: "column",
  "& .createJobButton": {
    position: "fixed",
    bottom: "35px",
    right: "calc((100vw - 1400px) / 2)",
    background: MainColor,
    color: "white",
    borderRadius: "30px",
    border: "none",
    padding: "10px 11.75px",
    cursor: "pointer",
    boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
    "& svg": {
      width: "35px",
      height: "35px",
    },
    "&:hover": {
      background: MainHoverColor,
      transition: "background 0.2s",
    },
  },
  "& .filterButton": {
    display: "none",
  },
  "@bp7": {
    width: "90%",
    "& .createJobButton": {
      right: "calc(10vw / 2)",
    },
  },
  "@bp4": {
    "& .filterButton": {
      display: "flex",
      marginRight: "auto",
      alignItems: "center",
      gap: "3px",
      fontSize: "15px",
      fontWeight: "600",
      padding: "8px 16px 8px 12px",
      border: "none",
      borderRadius: "20px",
      marginTop: "4px",
      cursor: "pointer",
      zIndex: "1",
      background: SubColor,
      transition: "background 0.2s",
      "&:hover": {
        background: SubHoverColor,
      },
      "& svg": {
        width: "20px",
        top: "50%",
        tansition: "translateY(-50%)",
      },
    },
  },
  "@bp3": {
    "& .filterButton": {
      fontSize: "14px",
      padding: "7px 13px 7px 10px",
      marginTop: "0px",
      "& svg": {
        width: "18px",
      },
    },
  },
  "@bp2": {
    "& .filterButton": {
      gap: "2px",
      fontSize: "13px",
      padding: "6px 11px 6px 8px",
      "& svg": {
        width: "16px",
      },
    },
  },
  "@bp1": {
    "& .filterButton": {
      padding: "5px 9px 5px 7px",
    },
  },
});

// TODO: CustomInput의 스타일과 재사용할 방법 없나!
export const InputContainer = styled("div", {
  background: "white",
  border: "1px solid #E3E9ED",
  padding: "12px",
  boxSizing: "border-box",
  width: "100%",
  position: "relative",
  display: "flex",
  gap: "16px",
  borderRadius: "16px",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  "& input": {
    border: "none",
    fontSize: "18px",
    outline: "none",
    flexGrow: "1",
    "&::placeholder": {
      fontSize: "18px",
      color: "#B2B2B2",
    },
  },
  "@bp3": {
    padding: "10px",
  },
  "@bp2": {
    padding: "9px",
    "& input": {
      fontSize: "17px",
      "&::placeholder": {
        fontSize: "17px",
      },
    },
  },
  "@bp1": {
    padding: "8px",
  },
});

export const NeighborhoodSelectorContainer = styled("div", {
  zIndex: "2",
  "& .selectButton": {
    height: "100%",
    maxWidth: "250px",
    padding: "10px 12px",
    background: SubColor,
    border: "none",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
    cursor: "pointer",
    transition: "background 0.2s",
    position: "relative",
    "&:hover": {
      background: SubHoverColor,
    },
    "& .neighborhoodName": {
      ...ellipsisStyle,
    },
  },
  "& .selectBox": {
    position: "absolute",
    left: "10px",
    top: "80%",
    padding: "10px 9px",
    marginTop: "0px",
    borderRadius: "18px",
    background: SubColor,
    visibility: "hidden",
    opacity: "0",
    transition: "all 0.3s",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
    boxSizing: "border-box",
    "&.isVisible": {
      opacity: "1",
      visibility: "visible",
      marginTop: "10px",
    },
    "& .optionButton": {
      background: "none",
      border: "none",
      padding: "8px 32px",
      fontSize: "17px",
      fontWeight: "bold",
      transition: "background 0.3s",
      borderRadius: "16px",
      whiteSpace: "nowrap",
      cursor: "pointer",
      "&:hover": {
        background: SubHoverColor,
      },
      "&.selected": {
        background: SubHoverColor,
      },
    },
  },
  "@bp3": {
    "& .selectButton": {
      padding: "8px 10px",
      fontSize: "17px",
    },
    "& .selectBox": {
      padding: "8px",
      borderRadius: "16px",
      "& .optionButton": {
        padding: "8px 25px",
        fontSize: "16px",
        borderRadius: "16px",
      },
    },
  },
  "@bp2": {
    "& .selectButton": {
      padding: "6px 8px",
      fontSize: "15px",
    },
    "& .selectBox .optionButton": {
      padding: "5px 25px",
      fontSize: "15px",
    },
  },
  "@bp1": {
    "& .selectButton": {
      maxWidth: "140px",
    },
  },
});

export const ArrowDownIcon = styled(ArrowDown, {
  minWidth: "18px",
  minHeight: "18px",
  maxWidth: "18px",
  maxHeight: "18px",
  strokeWidth: "1.4",
  color: "black",
  transition: "transform 0.2s",
  variants: {
    isSelected: {
      true: {
        transform: "rotate(180deg)",
      },
    },
  },
});

export const LocationIcon = styled(Location, {
  minWidth: "20px",
  minHeight: "20px",
  maxWidth: "20px",
  maxHeight: "20px",
  fill: "black",
});

export const ContentContainer = styled("div", {
  width: "100%",
  marginTop: "20px",
  display: "flex",
  justifyContent: "flex-start",
  "@bp4": {
    marginTop: "-10px",
  },
  "@bp3": {
    marginTop: "-15px",
  },
});

export const JobFilterContainer = styled("div", {
  width: "320px",
  boxSizing: "border-box",
  background: "white",
  border: "1px solid #E3E9ED",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "22px",
  position: "absolute",
  "& .topContainer": {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "flex-end",
    "& .title": {
      fontSize: "20px",
      fontWeight: "bold",
    },
    "& .initButton": {
      background: "none",
      border: "none",
      fontSize: "15px",
      color: "#828282",
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
  "& .content": {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    gap: "22px",
  },
  "& .modalButtonGroups": {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    "& button": {
      ...MainButtonStyle,
      fontSize: "19px",
      padding: "11px",
      borderRadius: "14px",
      "&.initButton": {
        width: "40%",
      },
      "&.applyButton": {
        width: "60%",
      },
    },
  },
  "&:not(.isModal)": {
    "& .xButton": {
      display: "none",
    },
    "& .modalButtonGroups": {
      display: "none",
    },
  },
  "&.isModal": {
    padding: "24px",
    gap: "26px",
    width: "560px",
    maxHeight: "90%",
    "& .xButton": {
      position: "absolute",
      width: "30px",
      height: "30px",
      color: MainColor,
      top: "20px",
      right: "20px",
      cursor: "pointer",
    },
    "& .topContainer": {
      "& .title": {
        fontSize: "22px",
      },
      "& .initButton": {
        display: "none",
      },
    },
    "& .content": {
      gap: "26px",
      "& .field": {
        gap: "13px",
        "& label": {
          fontSize: "18px",
        },
        "& .timeRangeContainer": {
          "&.hasMarginBottom": {
            marginBottom: "175px",
          },
          "& .waveSymbol": {
            fontSize: "20px",
          },
          "& .timeInputButton": {
            padding: "12px",
            fontSize: "15px",
          },
          "& .selectBox": {
            height: "160px",
            "& .optionButton": {
              padding: "7px",
              fontSize: "14px",
            },
          },
        },
      },
    },
  },
  "@bp5": {
    "&:not(.isModal)": {
      width: "260px",
    },
  },
  "@bp4": {
    "&:not(.isModal)": {
      display: "none",
    },
  },
  "@bp3": {
    "&.isModal": {
      gap: "22px !important",
      "& .topContainer .title": {
        fontSize: "20px !important",
      },
      "& .content": {
        gap: "22px !important",
        "& .field": {
          gap: "11px !important",
          "& label": {
            fontSize: "17px !important",
          },
          "& .timeRangeContainer": {
            "&.hasMarginBottom": {
              marginBottom: "155px",
            },
            "& .waveSymbol": {
              fontSize: "18px",
            },
            "& .timeInputButton": {
              padding: "10px",
              fontSize: "14px",
            },
            "& .selectBox": {
              height: "140px",
            },
          },
        },
      },
      "& .modalButtonGroups button": {
        fontSize: "18px !important",
        padding: "10px !important",
        borderRadius: "13px",
      },
    },
  },
  "@bp2": {
    "&.isModal": {
      width: "90% !important",
    },
  },
  "@bp1": {
    "&.isModal": {
      padding: "20px !important",
      gap: "18px !important",
      "& .xButton": {
        width: "25px",
        height: "25px",
        top: "14px",
        right: "14px",
      },
      "& .topContainer .title": {
        fontSize: "17px !important",
      },
      "& .content": {
        gap: "18px !important",
        "& .field": {
          gap: "10px !important",
          "& label": {
            fontSize: "15px !important",
          },
          "& .timeRangeContainer": {
            "&.hasMarginBottom": {
              marginBottom: "145px",
            },
            "& .waveSymbol": {
              fontSize: "16px",
            },
            "& .timeInputButton": {
              padding: "9px",
              fontSize: "13px",
            },
            "& .selectBox": {
              height: "130px",
              "& .optionButton": {
                fontSize: "13px",
                padding: "5px",
              },
            },
          },
        },
      },
      "& .modalButtonGroups button": {
        fontSize: "16px !important",
        padding: "9px !important",
        borderRadius: "12px",
      },
    },
  },
});

export const FilterField = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  transition: "opacity 0.2s, height 0.2s",
  "& label": {
    fontSize: "16px",
    fontWeight: "600",
  },
  "& .chips": {
    gap: "8px 5px",
    "& .option": {
      fontSize: "15px",
      fontWeight: "500",
      padding: "5px 10px",
    },
  },
  "@bp1": {
    "& .chips": {
      gap: "7px 5px",
      "& .option": {
        fontSize: "14px",
        padding: "4px 8px",
      },
    },
  },
});

export const JobListContainer = styled("div", {
  width: "1050px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginLeft: "370px",
  marginBottom: "60px",
  "& .totalCount": {
    textDecoration: "underline",
    alignSelf: "flex-end",
    fontSize: "18px",
    "& .count": {
      fontWeight: "bold",
      fontSize: "20px",
    },
  },
  "& .noJobNotice": {
    width: "100%",
    height: "calc(100vh - 400px)",
    minHeight: "460px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "30px",
    fontWeight: "bold",
  },
  "& .jobList": {
    display: "flex",
    flexDirection: "column",
    minHeight: "460px",
  },
  "@bp5": {
    marginLeft: "300px",
    marginBottom: "40px !important",
  },
  "@bp4": {
    gap: "0px",
    width: "95%",
    margin: "auto",
    "& .jobList": {
      minHeight: "auto",
    },
    "& .noJobNotice": {
      minHeight: "auto",
      fontSize: "28px",
      height: "calc(100vh - 300px)",
    }
  },
  "@bp3": {
    "& .totalCount": {
      fontSize: "16px",
      "& .count": {
        fontSize: "18px",
      },
    },
    "& .noJobNotice": {
      fontSize: "24px",
    }
  },
  "@bp2": {
    "& .noJobNotice": {
      height: "calc(100vh - 280px)",
    }
  },
  "@bp1": {
    "& .totalCount": {
      fontSize: "14px",
      "& .count": {
        fontSize: "16px",
      },
    },
  },
});

export const JobItemContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  position: "relative",
  height: "150px",
  cursor: "pointer",
  "& .imageBox": {
    height: "83%",
    aspectRatio: "1.4/1",
    border: "1px solid #DBDBDB",
    borderRadius: "10px",
    overflow: "hidden",
    "& img": {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
  "& .line": {
    width: "100%",
    background: "#DBDBDB",
    height: "1px",
    position: "absolute",
    bottom: "0",
  },
  "@bp3": {
    height: "140px",
    "& .imageBox": {
      height: "80%",
      aspectRatio: "1.1/1",
    },
  },
  "@bp1": {
    height: "125px",
    "& .imageBox": {
      display: "none",
    },
  },
});

export const JobItemContextBox = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  padding: "28px 0",
  boxSizing: "border-box",
  width: "100%",
  "&.photoExists": {
    width: "calc(100% - 200px)",
  },
  "& .mainInfo": {
    "& .title": {
      paddingBottom: "10px",
      fontSize: "22px",
      fontWeight: "bold",
      ...ellipsisStyle,
    },
    "& .neighborhoodAndPostTime": {
      fontSize: "15px",
      color: "#828282",
      ...ellipsisStyle,
    },
  },
  "& .subInfo": {
    ...ellipsisStyle,
    "& .pay": {
      fontSize: "17px",
      fontWeight: "bold",
      color: "#4D4D4D",
    },
    "& .periodAndTime": {
      fontSize: "15px",
      color: "#828282",
    },
  },
  "@bp3": {
    "&.photoExists": {
      width: "calc(100% - 170px)",
    },
    "& .mainInfo": {
      "& .title": {
        fontSize: "20px",
        fontWeight: "600",
      },
      "& .neighborhoodAndPostTime": {
        fontSize: "14px",
      },
    },
    "& .subInfo": {
      "& .pay": {
        fontSize: "15px",
      },
      "& .periodAndTime": {
        fontSize: "14px",
      },
    },
  },
  "@bp1": {
    "&.photoExists": {
      width: "100%",
    },
    padding: "25px 0",
    "& .mainInfo": {
      "& .title": {
        fontSize: "18px",
        paddingBottom: "6px",
      },
      "& .neighborhoodAndPostTime": {
        fontSize: "13px",
      },
    },
    "& .subInfo": {
      "& .pay": {
        fontSize: "14px",
      },
      "& .periodAndTime": {
        fontSize: "13px",
      },
    },
  },
});
