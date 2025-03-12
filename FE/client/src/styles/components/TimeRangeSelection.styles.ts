import { styled, SubColor } from "../global";
import { ReactComponent as ArrowDown } from "../../assets/icons/arrow-down.svg";

export const Container = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  transition: "margin-bottom 0.2s",
  "&.inCreateJob": {
    marginTop: "20px",
    "&.hasMarginBottom": {
      marginBottom: "215px",
    },
    "& .waveSymbol": {
      fontSize: "30px",
      fontWeight: "300",
    },
    "@bp2": {
      "& .waveSymbol": {
        fontSize: "24px",
      },
    },
    "@bp1": {
      "& .waveSymbol": {
        fontSize: "18px",
      },
    },
  },
  "&.inExploreJobs": {
    "&.hasMarginBottom": {
      marginBottom: "170px",
    },
    "& .waveSymbol": {
      fontSize: "20px",
    },
    "@bp5": {
      "&.hasMarginBottom": {
        marginBottom: "128px",
      },
      "& .waveSymbol": {
        fontSize: "16px",
      },
    },
    "@bp4": {
      "&.hasMarginBottom": {
        marginBottom: "155px",
      },
      "& .waveSymbol": {
        fontSize: "20px",
      },
    },
    "@bp1": {
      "&.hasMarginBottom": {
        marginBottom: "145px",
      },
      "& .waveSymbol": {
        fontSize: "18px",
      },
    },
  },
  "& .waveSymbol": {
    color: "#B2B2B2",
  },
});

export const TimeSelectionContainer = styled("div", {
  width: "47%",
  position: "relative",
  "&.inCreateJob": {
    "& .timeInputButton": {
      padding: "17px",
      fontSize: "18px",
      borderRadius: "16px",
    },
    "@bp2": {
      "& .timeInputButton": {
        padding: "14px",
        fontSize: "16px",
      },
      "& label": {
        top: "-20px",
      },
    },
    "@bp1": {
      "& .timeInputButton": {
        padding: "12px",
        fontSize: "14px",
        borderRadius: "12px",
      },
      "& label": {
        fontSize: "12px",
        top: "-18px",
      },
    },
  },
  "&.inExploreJobs": {
    width: "46%",
    "& .timeInputButton": {
      padding: "10px",
      fontSize: "15px",
      borderRadius: "10px",
    },
    "@bp5": {
      "& .timeInputButton": {
        padding: "8px",
        fontSize: "13px",
      },
    },
    "@bp4": {
      width: "47%",
      "& .timeInputButton": {
        padding: "12px",
        fontSize: "16px",
      },
    },
    "@bp3": {
      "& .timeInputButton": {
        padding: "10px",
        fontSize: "15px",
      },
    },
    "@bp1": {
      "& .timeInputButton": {
        padding: "9.5px",
        fontSize: "14px",
      },
    },
  },
  "& .timeInputButton": {
    width: "100%",
    position: "relative",
    background: "none",
    border: "1px solid #B2B2B2",
    boxSizing: "border-box",
    cursor: "pointer",
    textAlign: "left",
    transition: "background 0.2s",
    "&:hover": {
      background: SubColor,
    },
  },
  "& label": {
    position: "absolute",
    top: "-24px",
    left: "0px",
    color: "#9A9A9A",
    fontSize: "14px",
  },
});

// TODO : ArrowDownIcon 하나로 만들어서 재사용하자.
export const ArrowDownIcon = styled(ArrowDown, {
  strokeWidth: "0.8",
  color: "#7C7C7C",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  transition: "transform 0.2s",
  variants: {
    isSelected: {
      true: {
        transform: "translateY(-50%) rotate(180deg)",
      },
      false: {
        transform: "translateY(-50%)",
      },
    },
  },
  "&.inCreateJob": {
    width: "30px",
    height: "30px",
    strokeWidth: "0.8",
    right: "15px",
    "@bp2": {
      width: "26px",
      height: "26px",
      right: "10px",
    },
    "@bp1": {
      width: "22px",
      height: "22px",
    },
  },
  "&.inExploreJobs": {
    width: "18px",
    height: "18px",
    right: "7px",
    strokeWidth: "1",
    "@bp5": {
      width: "16px",
      height: "16px",
      right: "6px",
    },
    "@bp4": {
      width: "20px",
      height: "20px",
      right: "9px",
    },
  },
});

export const SelectBox = styled("div", {
  position: "absolute",
  left: "0",
  width: "100%",
  overflow: "auto",
  borderRadius: "14px",
  border: "1px solid #B2B2B2",
  boxSizing: "border-box",
  "&.inCreateJob": {
    height: "200px",
    padding: "6px",
    top: "130%",
    "& .optionButton": {
      padding: "8px",
      fontSize: "16px",
    },
    "@bp2": {
      padding: "4px",
      "& .optionButton": {
        padding: "7px",
        fontSize: "14px",
      },
    },
    "@bp1": {
      "& .optionButton": {
        padding: "5px",
        fontSize: "12px",
      },
    },
  },
  "&.inExploreJobs": {
    height: "160px",
    padding: "3px",
    top: "120%",
    "& .optionButton": {
      padding: "7px",
      fontSize: "14px",
    },
    "@bp5": {
      height: "120px",
      "& .optionButton": {
        padding: "5px",
        fontSize: "13px",
      },
    },
    "@bp4": {
      height: "145px",
      "& .optionButton": {
        padding: "7px",
        fontSize: "15px",
      },
    },
    "@bp3": {
      "& .optionButton": {
        padding: "6px",
        fontSize: "14px",
      },
    },
    "@bp1": {
      height: "130px",
      "& .optionButton": {
        fontSize: "13px",
        padding: "5px",
      },
    },
  },
  "& .optionButton": {
    width: "100%",
    borderRadius: "10px",
    border: "none",
    background: "none",
    cursor: "pointer",
    transition: "background 0.2s",
    letterSpacing: "1px",
    color: "#9A9A9A",
    "&:hover": {
      background: SubColor,
      color: "black",
    },
  },
  "&::-webkit-scrollbar": { display: "none" }, // Chrome, Edge, Safari
  scrollbarWidth: "none", // FireFox
  msOverflowStyle: "none", // IE
});
