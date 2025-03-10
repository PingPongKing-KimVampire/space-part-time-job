import {
  styled,
  MainColor,
  NavigationBarHeight,
  getResponsiveStyleByBp,
} from "../global";

const containerResponsiveStyle = getResponsiveStyleByBp(
  (navigationBarHeight) => ({ height: navigationBarHeight })
);
export const Container = styled("div", {
  background: MainColor,
  height: NavigationBarHeight.default,
  width: "100%",
  zIndex: "3",
  boxShadow: "0 0 3px 1px #9FB0FF",
  display: "flex",
  justifyContent: "center",
  position: "fixed",
  ...containerResponsiveStyle,
});

const contentResponsiveStyle = getResponsiveStyleByBp((navigationBarHeight) => {
  return {
    "& .logo img": {
      height: `calc(${navigationBarHeight} * 0.45) !important`,
    },
    "& svg": {
      width: `calc(${navigationBarHeight} * 0.6) !important`,
      height: `calc(${navigationBarHeight} * 0.6) !important`,
    },
  };
});
export const Content = styled("div", {
  height: "100%",
  width: "1400px",
  display: "flex",
  alignItems: "center",
  color: "white",
  position: "relative",
  variants: {
    type: {
      main: {
        justifyContent: "space-between",
        "& .logo": {
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          "& img": {
            height: `calc(${NavigationBarHeight.default} * 0.45)`,
          },
          "& .text": {
            fontSize: "28px",
            fontWeight: "800",
            whiteSpace: "nowrap",
          },
        },
        "& svg": {
          cursor: "pointer",
          width: `calc(${NavigationBarHeight.default} * 0.6)`,
          height: `calc(${NavigationBarHeight.default} * 0.6)`,
        },
      },
      local: {
        justifyContent: "center",
        "& .title": {
          fontSize: "28px",
          fontWeight: "700",
        },
        "& svg": {
          position: "absolute",
          left: "0px",
          width: `calc(${NavigationBarHeight.default} * 0.6)`,
          height: `calc(${NavigationBarHeight.default} * 0.6)`,
          cursor: "pointer",
          strokeWidth: "1.8",
        },
      },
    },
  },
  "@bp7": {
    width: "90%",
  },
  "@bp5": {
    ...contentResponsiveStyle["@bp5"],
  },
  "@bp3": {
    "& .logo": {
      fontSize: "26px !important",
    },
    "& .title": {
      fontSize: "26px !important",
    },
    ...contentResponsiveStyle["@bp3"],
  },
  "@bp1": {
    "& .logo": {
      fontSize: "24px !important",
    },
    "& .title": {
      fontSize: "22px !important",
    },
    ...contentResponsiveStyle["@bp1"],
  },
});
