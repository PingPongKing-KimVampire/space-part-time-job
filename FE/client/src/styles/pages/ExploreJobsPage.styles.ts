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
  position: "relative",
  "& .createJobButton": {
    position: "absolute",
    bottom: "35px",
    right: "0px",
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
  },
});

// TODO: CustomInput의 스타일과 재사용할 방법 없나!
export const InputContainer = styled("div", {
  background: "white",
  border: "1px solid #E3E9ED",
  padding: "10px",
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
    maxWidth: "200px",
    padding: "8px 12px",
    background: SubColor,
    border: "none",
    fontSize: "18px",
    fontWeight: "bold",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "4px",
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
    padding: "6px",
    marginTop: "0px",
    borderRadius: "18px",
    background: SubColor,
    visibility: "hidden",
    opacity: "0",
    transition: "all 0.3s",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
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
      width: "120px",
    },
  },
});

export const ArrowDownIcon = styled(ArrowDown, {
  width: "18px",
  height: "18px",
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
  width: "20px",
  height: "20px",
  fill: "black",
});

export const ContentContainer = styled("div", {
  width: "100%",
  marginTop: "20px",
  display: "flex",
  justifyContent: "flex-start",
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
  gap: "20px",
  position: "absolute",
  "& .topContainer": {
    display: "flex",
    justifyContent: "space-between",
    alignContent: "flex-end",
    "& .title": {
      fontSize: "18px",
      fontWeight: "bold",
    },
    "& .initButton": {
      background: "none",
      border: "none",
      fontSize: "14px",
      color: "#828282",
      textDecoration: "underline",
      cursor: "pointer",
    },
  },
});

export const FilterField = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  transition: "opacity 0.2s, height 0.2s",
  "& label": {
    fontSize: "16px",
    fontWeight: "600",
  },
});

export const ChipsContainerStyle = {
  gap: "6px 4px",
};

export const ChipsOptionStyle = {
  fontSize: "14px",
  padding: "4px 8px",
};

export const JobListContainer = styled("div", {
  width: "1055px",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  marginLeft: "345px",
  "& .totalCount": {
    textDecoration: "underline",
    alignSelf: "flex-end",
    "& .count": {
      fontWeight: "bold",
      fontSize: "18px",
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
  "@bp2": {
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
  height: "140px",
  cursor: "pointer",
  "& .imageBox": {
    height: "82%",
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
  "@bp2": {},
});

export const JobItemContextBox = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  width: "470px",
  padding: "25px 0",
  boxSizing: "border-box",
  "& .mainInfo": {
    "& .title": {
      paddingBottom: "10px",
      fontSize: "18px",
      fontWeight: "bold",
      ...ellipsisStyle,
    },
    "& .neighborhoodAndPostTime": {
      fontSize: "13px",
      color: "#828282",
      ...ellipsisStyle,
    },
  },
  "& .subInfo": {
    ...ellipsisStyle,
    "& .pay": {
      fontSize: "15px",
      fontWeight: "bold",
      color: "#4D4D4D",
    },
    "& .periodAndTime": {
      fontSize: "13px",
      color: "#828282",
    },
  },
});
