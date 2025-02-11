import {
  styled,
  MainButtonStyle,
  MainColor,
  NavigationBarHeight,
  getResponsiveStyleByBp,
  NegativeColor,
  NegativeHoverColor,
  ellipsisStyle,
} from "../global";

const containerResponsiveStyle = getResponsiveStyleByBp(
  (navigationBarHeight) => ({
    paddingTop: `calc(${navigationBarHeight} + 24px)`,
  })
);
export const Container = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  paddingTop: `calc(${NavigationBarHeight.default} + 24px)`,
  paddingBottom: "30px",
  "& .item": {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "700px",
    padding: "15px 20px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
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
  ...containerResponsiveStyle,
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
});
