import {
  styled,
  MainButtonStyle,
  MainColor,
  OptionButtonStyle,
} from "../global";

export const Background = styled("div", {
  background: "white",
  flex: "1",
  width: "100%",
  position: "relative",
});

export const Container = styled("div", {
  width: "700px",
  position: "absolute",
  bottom: "40px",
  left: "50%",
  transform: "translateX(-50%)",
  "@bp3": {
    width: "90%",
  },
});

export const ScopeSettingContainer = styled("div", {
  width: "100%",
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #E3E9ED",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  boxSizing: "border-box",
  marginBottom: "20px",
  "@bp2": {
    padding: "20px 20px 15px 20px",
    marginBottom: "12px",
  },
});

export const NeighborhoodsContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  gap: "7px",
  height: "55px",
  marginBottom: "28px",
  "& .neighborhoodButton": {
    ...OptionButtonStyle,
    textAlign: "left",
    borderRadius: "9px",
    width: "calc((100% - 14px) / 3)",
    "& svg": {
      position: "absolute",
      height: "50%",
      strokeWidth: "1",
      top: "50%",
      transform: "translateY(-50%)",
      right: "10px",
    },
    "&:not(.selected)": {
      "& svg": {
        color: MainColor,
      },
    },
  },
  "@bp2": {
    height: "45px",
    marginBottom: "24px",
    "& .neighborhoodButton": { padding: "12px" },
  },
});

export const PlusButton = styled("button", {
  padding: "16px",
  cursor: "pointer",
  background: "#EDEDED",
  color: "#B0B0B0",
  borderRadius: "9px",
  width: "calc((100% - 14px) / 3)",
  border: `0.9px solid #EDEDED`,
  position: "relative",
  "& svg": {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateY(-50%) translateX(-50%)",
    height: "60%",
    strokeWidth: "1.3",
    color: "#7C7C7C",
  },
  transition: "background 0.2s",
  "&:hover": {
    background: "#E4E4E4",
  },
});

export const CompleteButton = styled("button", {
  width: "100%",
  ...MainButtonStyle,
  "@bp2": {
    fontSize: "22px",
    padding: "13px",
  },
});
