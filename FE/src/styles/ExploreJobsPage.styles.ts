import { createStitches } from "@stitches/react";
import { OptionHoverColor } from "./global";
import { ReactComponent as ArrowDown } from "../assets/icons/arrow-down.svg";
import { ReactComponent as Location } from "../assets/icons/location.svg";

const { styled } = createStitches();

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
});

export const Container = styled("div", {
  width: "1000px",
  marginTop: "40px",
  display: "flex",
  flexDirection: "column",
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
});

export const NeighborSelectorContainer = styled("div", {
  "& .selectButton": {
    height: "100%",
    padding: "7px 10px",
    background: "white",
    border: "1px solid black",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "3px",
    cursor: "pointer",
    transition: "background 0.2s",
    position: "relative",
    "&:hover": {
      background: OptionHoverColor,
    },
  },
  "& .selectBox": {
    position: "absolute",
    left: "10px",
    top: "80%",
    padding: "3px",
    marginTop: "0px",
    borderRadius: "15px",
    background: "white",
    border: "1px solid black",
    visibility: "hidden",
    opacity: "0",
    transition: "all 0.3s",
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    boxSizing: "border-box",
    "&.isVisible": {
      opacity: "1",
      visibility: "visible",
      marginTop: "10px",
    },
    "& .optionButton": {
      background: "none",
      border: "none",
      padding: "5px 29px",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "background 0.3s",
      borderRadius: "13px",
      whiteSpace: "nowrap",
      cursor: "pointer",
      "&:hover": {
        background: OptionHoverColor,
      },
      "&.selected": {
        background: OptionHoverColor,
        "&:hover": {
          background: "#C3CDFF",
        },
      },
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
  marginTop: "10px",
  display: "flex",
  alignItems: "flex-start",
  gap: "35px",
});

export const JobFilterContainer = styled("div", {
  width: "250px",
  background: "white",
  border: "1px solid #E3E9ED",
  borderRadius: "16px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  marginBottom: "40px",
  gap: "20px",
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
  flexGrow: "1",
  display: "flex",
  flexDirection: "column",
  "& .jobList": {
    display: "flex",
    flexDirection: "column",
    marginBottom: "40px",
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
});

export const JobItemContextBox = styled("div", {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
  padding: "25px 0",
  boxSizing: "border-box",
  flexGrow: "1",
  "& .mainInfo": {
    "& .title": {
      fontSize: "18px",
      fontWeight: "bold",
    },
    "& .neighborAndPostTime": {
      marginTop: "3px",
      fontSize: "13px",
      color: "#828282",
    },
  },
  "& .subInfo": {
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
