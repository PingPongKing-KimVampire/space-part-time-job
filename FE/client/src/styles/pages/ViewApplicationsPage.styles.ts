import {
  styled,
  MainButtonStyle,
  MainColor,
  NavigationBarHeight,
  getResponsiveStyleByBp,
  NegativeColor,
  NegativeHoverColor,
  ellipsisStyle,
  skeletonStyle,
} from "../global";

export const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "center",
});

const containerResponsiveStyle = getResponsiveStyleByBp(
  (navigationBarHeight) => ({
    paddingTop: `calc(${navigationBarHeight} + 24px)`,
  })
);
export const Container = styled("div", {
  width: "700px",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  paddingTop: `calc(${NavigationBarHeight.default} + 24px)`,
  paddingBottom: "30px",
  "& .loadingItem": {
    ...skeletonStyle,
    width: "100%",
    height: "162px",
    borderRadius: "15px",
  },
  "& .item": {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    padding: "15px 20px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
    boxSizing: "border-box",
    "& .coverLetter": {
      fontSize: "15px",
      fontWeight: "400",
      lineHeight: "24px",
    },
    "& .decideButtons": {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      marginTop: "10px",
      "& button": {
        ...MainButtonStyle,
        fontSize: "18px",
        width: "49.2%",
        padding: "9px",
        borderRadius: "12px",
        "&.rejectButton": {
          background: NegativeColor,
          "&:hover": {
            background: NegativeHoverColor,
          },
        },
      },
    },
  },
  "@bp5": { ...containerResponsiveStyle["@bp5"] },
  "@bp4": {
    width: "70%",
  },
  "@bp3": {
    width: "80%",
    ...containerResponsiveStyle["@bp3"],
  },
  "@bp2": {
    width: "90%",
    "& .item": {
      padding: "12px 15px 15px 15px",
      "& .coverLetter": {
        fontSize: "14px",
      },
      "& .decideButtons": {
        marginTop: "8px",
        "& button": {
          fontSize: "16px",
          padding: "8px",
          borderRadius: "10px",
          width: "49%",
        },
      },
    },
    "& .loadingItem": {
      height: "150px",
    },
  },
  "@bp1": {
    "& .item": {
      gap: "7px",
      "& .decideButtons": {
        "& button": {
          fontSize: "15px",
          padding: "7px",
          width: "48.7%",
        },
      },
    },
    "& .loadingItem": {
      height: "141px",
    },
    ...containerResponsiveStyle["@bp1"],
  },
});

export const UserInfo = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  "& svg": {
    width: "42px",
    height: "42px",
    fill: MainColor,
  },
  "& .nickname": {
    fontSize: "20px",
    fontWeight: "700",
    maxWidth: "500px",
    ...ellipsisStyle,
  },
  "& .createdAt": {
    fontSize: "15px",
    color: "#828282",
    whiteSpace: "nowrap",
  },
  "@bp2": {
    "& svg": {
      width: "40px",
      height: "40px",
    },
    "& .nickname": {
      fontSize: "19px",
    },
    "& .createdAt": {
      fontSize: "14px",
    },
  },
  "@bp1": {
    "& svg": {
      width: "36px",
      height: "36px",
    },
    "& .nickname": {
      fontSize: "18px",
    },
    "& .createdAt": {
      fontSize: "13px",
    },
  },
});
