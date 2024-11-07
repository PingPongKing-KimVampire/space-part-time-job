import { createStitches } from "@stitches/react";
import { OptionHoverColor } from "../styles/global.ts";
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
  width: "1200px",
  marginTop: "40px",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
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
});

export const LocationButton = styled("button", {
  height: "100%",
  padding: "7px 10px",
  background: "white",
  border: "1px solid black",
  fontSize: "18px",
  fontWeight: "bold",
  borderRadius: "20px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "3px",
  cursor: "pointer",
  transition: "background 0.2s",
  "&:hover": {
    background: OptionHoverColor,
  },
});

export const ArrowDownIcon = styled(ArrowDown, {
  width: "18px",
  height: "18px",
  strokeWidth: "1.4",
  color: "black",
});

export const LocationIcon = styled(Location, {
  width: "20px",
  height: "20px",
  fill: "black",
});

export const ContentContainer = styled("div", {
  width: "100%",
  display: "flex",
  gap: "35px",
  "& .filter": {
    width: "250px",
    height: "1000px",
    background: "white",
    border: "1px solid #E3E9ED",
    borderRadius: "16px",
  },
});

export const JobListContainer = styled("div", {
  flexGrow: "1",
  display: "flex",
  flexDirection: "column",
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
      fontSize: "20px",
      fontWeight: "bold",
    },
    "& .locationAndPostTime": {
      marginTop: "3px",
      fontSize: "15px",
      color: "#828282",
    },
  },
  "& .subInfo": {
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
});
