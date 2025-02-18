import {
  styled,
  MainColor,
  SubColor,
  MainHoverColor,
  SubHoverColor,
  NavigationBarHeight,
  getResponsiveStyleByBp,
  ellipsisStyle,
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
  "@bp7": {
    width: "90%",
    "& .createJobButton": {
      right: "calc(10vw / 2)",
    }
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
  zIndex: "1",
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
      background: SubColor,
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
      padding : "8px",
      borderRadius: "16px",
      "& .optionButton": {
        padding: "8px 25px",
        fontSize: "16px",
        borderRadius: "16px",
      }
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
  "@bp3": {
    marginTop: "15px",
  },
  "@bp1": {
    marginTop: "5px",
  }
});

export const JobFilterContainer = styled("div", {
  width: "300px",
  boxSizing: "border-box",
  background: "white",
  border: "1px solid #E3E9ED",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  marginBottom: "40px",
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
  "@bp5": {
    width: "260px",
  }
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
});

export const ChipsContainerStyle = {
  gap: "8px 5px",
};

export const ChipsOptionStyle = {
  fontSize: "15px",
  fontWeight: "500",
  padding: "5px 10px",
};

export const JobListContainer = styled("div", {
  width: "1050px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginLeft: "350px",
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
  "& .jobList": {
    display: "flex",
    flexDirection: "column",
  },
  "&.full": {
    width: "95%",
    margin: "auto",
  },
  "@bp5": {
    marginLeft: "300px",
    marginBottom: "40px !important",
  },
  "@bp4": {
    gap: "0px",
  },
  "@bp3": {
    "& .totalCount": {
      fontSize: "16px",
      "& .count": {
        fontSize: "18px",
      }
    }
  },
  "@bp1": {
    "& .totalCount": {
      alignSelf: "flex-start",
      fontSize: "14px",
      "& .count": {
        fontSize: "16px",
      },
    },
  }
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
  }
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
      }
    },
    "& .subInfo": {
      "& .pay": {
        fontSize: "15px",
      },
      "& .periodAndTime": {
        fontSize: "14px",
      }
    }
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
      }
    },
    "& .subInfo": {
      "& .pay": {
        fontSize: "14px",
      },
      "& .periodAndTime": {
        fontSize: "13px",
      }
    }
  }
});
