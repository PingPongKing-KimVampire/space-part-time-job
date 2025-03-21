import {
  styled,
  MainColor,
  SubColor,
  MainButtonStyle,
  NavigationBarHeight,
  getResponsiveStyleByBp,
  skeletonStyle,
} from "../global";
import { ReactComponent as ArrowDown } from "../../assets/icons/arrow-down.svg";

const backgroundResponsiveStyle = getResponsiveStyleByBp(
  (navigationBarHeight) => ({ paddingTop: navigationBarHeight })
);
export const Background = styled("div", {
  width: "100%",
  height: "100%",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  paddingTop: NavigationBarHeight.default,
  ...backgroundResponsiveStyle,
});

export const Container = styled("div", {
  width: "1000px",
  "@bp5": {
    width: "80%",
  },
  "@bp4": {
    width: "90%",
  },
});

export const FormSectionContainer = styled("div", {
  marginTop: "45px",
  width: "100%",
  "& > label": {
    fontSize: "20px",
    fontWeight: "900",
    marginBottom: "12px",
    display: "inline-block",
  },
  "& .content": {
    width: "100%",
    background: "white",
    border: "1px solid #E3E9ED",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
    display: "flex",
    flexDirection: "column",
    gap: "40px",
    boxSizing: "border-box",
  },
  "@bp5": {
    marginTop: "35px",
    "& .content": {
      padding: "34px",
      gap: "34px",
    },
  },
  "@bp3": {
    marginTop: "30px",
    "& .content": {
      padding: "26px",
      gap: "26px",
    },
  },
  "@bp1": {
    marginTop: "22px",
    "& > label": {
      fontSize: "18px",
      marginBottom: "10px",
    },
    "& .content": {
      padding: "23px",
      gap: "23px",
    },
  },
});

export const FormFieldContainer = styled("div", {
  width: "100%",
  "& > label": {
    color: MainColor,
    fontSize: "20px",
    fontWeight: "900",
    marginBottom: "12px",
    display: "inline-block",
    "& span": {
      color: "#9A9A9A",
      fontWeight: "normal",
      fontSize: "18px",
    },
  },
  "@bp1": {
    "& > label": {
      fontSize: "18px",
      marginBottom: "10px",
      "& span": {
        fontSize: "16px",
      },
    },
  },
});

export const TimeContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  "@bp2": {
    gap: "14px",
  },
  "@bp1": {
    gap: "10px",
  },
});

export const PlaceContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "100%",
  "& .exposurePanel": {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background: SubColor,
    borderRadius: "12px",
    padding: "16px",
    boxSizing: "border-box",
    "&:not(.loading)": {
      cursor: "pointer",
    },
    "&.loading": {
      ...skeletonStyle,
      height: "48px",
    },
    "& .main": {
      position: "relative",
      "& span": {
        fontWeight: "bold",
      },
    },
    "& .exposureDetailContent": {
      lineHeight: "23px",
      transition: "all 0.2s",
      height: "0",
      opacity: "0",
      pointerEvents: "none",
      "&.visible": {
        height: "auto",
        opacity: "1",
        marginTop: "10px",
        pointerEvents: "auto",
      },
    },
  },
  "@bp2": {
    "& .exposurePanel": {
      padding: "14px",
      fontSize: "15px",
    },
  },
  "@bp3": {
    "& .exposurePanel": {
      padding: "12px 14px",
    },
  },
});
export const ArrowDownIcon = styled(ArrowDown, {
  width: "26px",
  strokeWidth: "1.6",
  color: "#7C7C7C",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  right: "0",
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
  "@bp1": {
    width: "24px",
    marginRight: "-4px",
  },
});

export const PayContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  "& .unit": {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    right: "20px",
    fontSize: "18px",
  },
});
export const MinimumMessage = styled("div", {
  fontSize: "14px",
  marginTop: "10px",
  "& span": {
    fontWeight: "bold",
  },
});

export const PhotoContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  gap: "10px",
  width: "100%",
  height: "120px",
  marginTop: "-14px",
  "& .uploadButton": {
    height: "90%",
    aspectRatio: "1/1",
    borderRadius: "5px",
    background: "#EDEDED",
    border: "1px solid #B2B2B2",
    color: "#7C7C7C",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "2.5px",
    fontSize: "16px",
    fontWeight: "bold",
    transition: " background 0.2s",
    "& svg": {
      width: "40%",
    },
    "&:hover": {
      background: SubColor,
      borderColor: SubColor,
      color: "black",
    },
  },
  "& .imagesContainer": {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: "10px",
    overflowX: "auto",
    overflowY: "hidden",
    height: "100%",
    width: "100%",
    "& .imageDisplay": {
      height: "90%",
      aspectRatio: "1/1",
      boxSizing: "border-box",
      position: "relative",
      "& > img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        border: "1px solid #B2B2B2",
        borderRadius: "5px",
        boxSizing: "border-box",
      },
      "& > button": {
        height: "24%",
        aspectRatio: "1/1",
        border: "none",
        position: "absolute",
        bottom: "100%",
        left: "100%",
        transform: "translateY(+65%) translateX(-65%)",
        borderRadius: "100px",
        background: "#EDEDED",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        "& svg": {
          color: "#7C7C7C",
          strokeWidth: "3",
          height: "70%",
        },
      },
    },
  },
  "@bp2": {
    marginTop: "-10px",
    height: "calc(15vw + 30px)",
  },
});

export const PostButton = styled("button", {
  ...MainButtonStyle,
  margin: "30px 0 35px 0",
  width: "100%",
  "@bp6": {
    margin: "25px 0 30px 0",
  },
  "@bp5": {
    margin: "20px 0 30px 0",
  },
  "@bp4": {
    margin: "18px 0 30px 0",
  },
  "@bp3": {
    padding: "14px",
    fontSize: "22px",
    margin: "15px 0 25px 0",
  },
  "@bp2": {
    padding: "13px",
  },
  "@bp1": {
    padding: "12px",
    fontSize: "20px",
    margin: "10px 0 20px 0",
  },
});
