import {
  styled,
  MainButtonStyle,
  OptionButtonStyle,
  SubColor,
  SubHoverColor,
  skeletonStyle,
  ellipsisStyle,
} from "../global";

export const Background = styled("div", {
  width: "100%",
  flex: "1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "@media(max-height: 800px)": {
    alignItems: "flex-start",
  },
});

export const Container = styled("div", {
  width: "800px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  "& .title": {
    fontSize: "35px",
    fontWeight: "bold",
    marginBottom: "40px",
    width: "100%",
    textAlign: "center",
    lineHeight: "40px",
  },
  "& .content": {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  "@bp4": {
    width: "90%",
    "& .title": {
      fontSize: "32px",
    },
  },
  "@bp3": {
    "& .title .newLine": {
      display: "block",
    },
  },
  "@bp1": {
    "& .title": {
      fontSize: "26px",
      marginBottom: "20px",
      lineHeight: "35px",
    },
  },
  "@media(max-height: 800px)": {
    padding: "40px 0 30px 0",
  },
});

const itemStyle = {
  ...OptionButtonStyle,
  width: "100%",
  textAlign: "left",
};

export const SelectedContainer = styled("div", {
  display: "flex",
  gap: "8px",
  marginTop: "20px",
  height: "52.5px",
  "&.empty": {
    background: "#E4E4E4",
    color: "#7C7C7C",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "16px",
  },
  "&.loading": {
    borderRadius: "16px",
    ...skeletonStyle,
  },
  "& .searchItem": {
    ...itemStyle,
    ...ellipsisStyle,
    background: `${SubColor} !important`,
    color: `black !important`,
    border: `none !important`,
    "&:hover": {
      background: `${SubHoverColor} !important`,
      color: "black !important",
    },
  },
  "@bp1": {
    marginTop: "12px",
    height: "47px",
    gap: "7px",
    "& .searchItem": {
      fontSize: "15px",
      padding: "14px",
    },
  },
});

export const ResultContainer = styled("div", {
  marginTop: "20px",
  "& .searchItem": { ...itemStyle, ...ellipsisStyle, marginBottom: "10px" },
  "& .loadingItem": {
    width: "100%",
    height: "52.5px",
    marginBottom: "10px",
    borderRadius: "16px",
    ...skeletonStyle,
  },
  "@bp1": {
    marginTop: "12px",
    "& .searchItem": {
      padding: "14px",
      fontSize: "15px",
    },
    "& .loadingItem": {
      height: "47px",
    },
  },
});

export const NextButton = styled("button", {
  width: "100%",
  marginTop: "30px",
  ...MainButtonStyle,
  "& .selectedCount": {
    fontSize: "18px",
    fontWeight: "400",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    right: "20px",
  },
  "@bp1": {
    marginTop: "25px",
    fontSize: "20px",
    padding: "14px",
    "& .selectedCount": {
      fontSize: "16px",
    },
  },
});
