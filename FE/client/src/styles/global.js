import { createStitches } from "@stitches/react";
export const { styled } = createStitches({
  media: {
    bp1: "(max-width: 480px)", // 모바일
    bp2: "(max-width: 600px)", // 작은 모바일
    bp3: "(max-width: 768px)", // 태블릿 (세로)
    bp4: "(max-width: 1024px)", // 태블릿 (가로) 및 작은 데스크탑
    bp5: "(max-width: 1280px)", // 작은 데스크탑
    bp6: "(max-width: 1440px)", // 중간 크기 데스크탑
    bp7: "(max-width: 1600px)", // 큰 데스크탑
  },
});

export const MainColor = "#384C9F";
export const MainHoverColor = "#1d2b64";
export const MainBackgroundColor = "#F9FBFC";
export const SubColor = "#DCE2FF";
export const SubHoverColor = "#C3CDFF";
export const NegativeColor = "#EE4346";
export const NegativeHoverColor = "#DD2B2E";

export const NavigationBarHeight = {
  default: "70px",
  bp5: "70px",
  bp3: "67px",
  bp1: "60px",
};
document.documentElement.style.setProperty(
  "--navigation-bar-height",
  NavigationBarHeight.default
);
document.documentElement.style.setProperty(
  "--navigation-bar-height-bp5",
  NavigationBarHeight.bp5
);
document.documentElement.style.setProperty(
  "--navigation-bar-height-bp3",
  NavigationBarHeight.bp3
);
document.documentElement.style.setProperty(
  "--navigation-bar-height-bp1",
  NavigationBarHeight.bp1
);
export const getResponsiveStyleByBp = (getStyle) => {
  return {
    "@bp5": { ...getStyle(NavigationBarHeight.bp5) },
    "@bp3": { ...getStyle(NavigationBarHeight.bp3) },
    "@bp1": { ...getStyle(NavigationBarHeight.bp1) },
  };
};

export const ButtonStyle = {
  fontWeight: "bold",
  padding: "16px",
  borderRadius: "16px",
  border: "none",
  cursor: "pointer",
  position: "relative",
  transitionDuration: "0.2s",
  transitionProperty: "background border",
};

export const MainButtonStyle = {
  ...ButtonStyle,
  fontSize: "24px",
  fontWeight: "800",
  "&.inactivated": {
    background: "#E7E7E7",
    color: "#AAAAAA",
    cursor: "not-allowed",
  },
  "&:not(.inactivated)": {
    background: MainColor,
    color: "white",
    cursor: "pointer",
    "&:hover": {
      background: MainHoverColor,
    },
  },
};

export const OptionButtonStyle = {
  ...ButtonStyle,
  fontSize: "16px",
  "&.inactivated": {
    background: "#EDEDED",
    color: "#B0B0B0",
    cursor: "not-allowed",
    border: `0.9px solid #EDEDED`,
  },
  "&.selected": {
    background: MainColor,
    border: `0.9px solid ${MainColor}`,
    color: "white",
    cursor: "pointer",
    "&:hover": {
      background: MainHoverColor,
      borderColor: MainHoverColor,
    },
  },
  "&:not(.selected):not(.inactivated)": {
    border: `0.9px solid ${MainColor}`,
    background: "white",
    cursor: "pointer",
    fontWeight: "600",
    "&:hover": {
      background: SubColor,
      borderColor: SubColor,
    },
  },
};

export const WarningText = styled("div", {
  marginTop: "10px",
  color: "#FF4043",
  fontSize: "14px",
});

export const CloseTag = styled("div", {
  fontSize: "15px",
  padding: "6px 11px",
  borderRadius: "9px",
  background: "#E4E4E4",
  color: "#7C7C7C",
  fontWeight: "bold",
  whiteSpace: "nowrap",
});

export const ellipsisStyle = {
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
};

export const ModalBackground = styled("div", {
  position: "fixed",
  left: "0",
  top: "0",
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "& .container": {
    width: "400px",
    background: "white",
    borderRadius: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 24px",
    gap: "18px",
    position: "relative",
    marginTop: "calc(var(--navigation-bar-height) / 2)",
    "& .title": {
      fontSize: "22px",
      fontWeight: "bold",
    },
    "& .textareaContainer": {
      width: "100%",
      display: "flex", // TODO : 여기 flexbox 관련 속성이 왜 있지?
      flexDirection: "column",
      marginBottom: "15px",
    },
    "& .applyButton": {
      ...MainButtonStyle,
      width: "100%",
      fontSize: "20px",
      padding: "12px",
      textAlign: "center",
      boxSizing: "border-box",
    },
    "& svg": {
      position: "absolute",
      top: "12px",
      right: "12px",
      width: "30px",
      color: MainColor,
      strokeWidth: "1",
      cursor: "pointer",
    },
    "& .content": {
      lineHeight: "24px",
    },
  },
  "@bp2": {
    "& .container": {
      width: "70%",
    },
  },
  "@bp1": {
    "& .container": {
      width: "75%",
      padding: "15px 18px",
      gap: "12px",
      "& .title": {
        fontSize: "20px",
      },
      "& .textareaContainer": {
        "& textarea": {
          padding: "12px 14px",
          fontSize: "16px",
          height: "130px",
          "&::placeholder": {
            fontSize: "16px",
          },
        },
        "& .charCounter": {
          fontSize: "14px",
          bottom: "-16px",
        },
      },
      "& .applyButton": {
        fontSize: "18px",
        padding: "10px",
        borderRadius: "12px",
      },
    },
  },
});
