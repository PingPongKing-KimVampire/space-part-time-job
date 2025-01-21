import {
  styled,
  MainColor,
  SubColor,
  MainButtonStyle,
  NavigationBarHeight,
} from "../global";
import { ReactComponent as ArrowDown } from "../../assets/icons/arrow-down.svg";

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  position: "relative",
  display: "flex",
  justifyContent: "center",
  paddingTop: NavigationBarHeight,
});

export const Container = styled("div", {
  width: "1000px",
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
});

export const TimeContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "20px",
});

export const PlaceContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "100%",
  "& input": {
    cursor: "pointer",
  },
  "& .exposurePanel": {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background: SubColor,
    borderRadius: "12px",
    padding: "16px",
    boxSizing: "border-box",
    cursor: "pointer",
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
});
export const ArrowDownIcon = styled(ArrowDown, {
  width: "26px",
  height: "26px",
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
      "& img": {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: "5px",
      },
      "& button": {
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
});

export const PostButton = styled("button", {
  ...MainButtonStyle,
  width: "1000px",
  bottom: "20px",
  marginTop: "65px",
});
