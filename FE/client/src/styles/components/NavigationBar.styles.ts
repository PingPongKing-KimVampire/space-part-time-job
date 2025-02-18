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
  zIndex: "2",
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
  width: "1000px",
  display: "flex",
  alignItems: "center",
  color: "white",
  position: "relative",
  variants: {
    type: {
      main: {
        justifyContent: "space-between",
        "& .logo": {
          fontSize: "25px",
          fontWeight: "900",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          "& img": {
            height: `calc(${NavigationBarHeight.default} * 0.45)`,
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
          fontSize: "24px",
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
  "@bp5": {
    width: "90%",
    ...contentResponsiveStyle["@bp5"],
  },
  "@bp3": {
    "& .logo": {
      fontSize: "24px !important",
    },
    "& .title": {
      fontSize: "24px !important",
    },
    ...contentResponsiveStyle["@bp3"],
  },
  "@bp1": {
    "& .title": {
      fontSize: "22px !important",
    },
    ...contentResponsiveStyle["@bp1"],
  },
});
