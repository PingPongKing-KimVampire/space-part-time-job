import {
  styled,
  MainButtonStyle,
  MainColor,
  MainHoverColor,
  SubColor,
  NavigationBarHeight,
  getResponsiveStyleByBp,
  ellipsisStyle,
  noItemNoticeStyle,
  skeletonStyle,
} from "../global";

const backgroundResponsiveStyle = getResponsiveStyleByBp(
  (navigationBarHeight) => ({ paddingTop: navigationBarHeight })
);
export const Background = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  boxSizing: "border-box",
  paddingTop: NavigationBarHeight.default,
  ...backgroundResponsiveStyle,
});

export const TopArea = styled("div", {
  width: "100%",
  background: "white",
  display: "flex",
  justifyContent: "center",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  "& .container": {
    width: "700px",
  },
  "@bp4": {
    "& .container": {
      width: "70%",
    },
  },
  "@bp3": {
    "& .container": {
      width: "80%",
    },
  },
  "@bp2": {
    "& .container": {
      width: "85%",
    },
  },
});

export const ProfileContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
  margin: "100px 0 60px",
  "& .content": {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& svg": {
      fill: MainColor,
      aspectRatio: "1/1",
    },
    "& .profileIcon": {
      width: "120px",
      minWidth: "120px",
    },
  },
  "@bp3": {
    gap: "15px",
    margin: "50px 0 20px",
    "& .content": {
      flexDirection: "column",
      "& .profileIcon": {
        marginBottom: "8px",
        width: "130px",
        minWidth: "130px",
      },
    },
  },
  "@bp2": {
    gap: "6px",
    margin: "40px 0 17px",
    "& .content .profileIcon": {
      width: "115px",
      minWidth: "115px",
    },
  },
  "@bp1": {
    margin: "32px 0 17px",
    "& .content": {
      "& .profileIcon": {
        marginBottom: "10px",
        width: "105px",
        minWidth: "105px",
      },
    },
  },
});

export const ProfileInfoContainer = styled("div", {
  marginRight: "auto",
  marginLeft: "25px",
  maxWidth: "280px",
  "& *": {
    ...ellipsisStyle,
  },
  "& .nickname": {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "12px",
  },
  "& .iconInfo": {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    marginBottom: "4px",
    fontWeight: "normal",
    "& svg": {
      width: "21px",
      height: "21px",
      minWidth: "21px",
      minHeight: "21px",
    },
  },
  "& .loading": {
    ...skeletonStyle,
    width: "100%",
    borderRadius: "15px",
  },
  "@bp4": {
    maxWidth: "calc(70vw - 300px)",
  },
  "@bp3": {
    margin: "auto",
    marginBottom: "25px",
    textAlign: "center",
    maxWidth: "80%",
  },
  "@bp1": {
    marginBottom: "20px",
    "& .nickname": {
      fontSize: "24px",
    },
    "& .iconInfo": {
      fontSize: "15px",
    },
  },
});

export const ProfileInteractionContainer = styled("div", {
  display: "flex",
  gap: "10px",
  "& button": {
    ...MainButtonStyle,
    fontSize: "17px",
    padding: "10px 20px",
    borderRadius: "12px",
    whiteSpace: "nowrap",
    minWidth: "120px",
  },
  "@bp4": {
    flexDirection: "column",
  },
  "@bp3": {
    gap: "15px",
    flexDirection: "row",
  },
  "@bp1": {
    gap: "8px",
    "& button": {
      fontSize: "16px",
      padding: "9px 16px",
      minWidth: "105px",
    },
  },
});

export const TabsContainer = styled("div", {
  width: "100%",
  display: "flex",
  position: "relative",
  height: "50px",
  "& .tabButton": {
    fontSize: "20px",
    fontWeight: "600",
    background: "none",
    border: "none",
    height: "100%",
    position: "absolute",
    cursor: "pointer",
    width: "150px",
    "&:nth-of-type(1)": {
      left: "0",
    },
    "&:nth-of-type(2)": {
      left: "50%",
      transform: "translateX(-50%)",
    },
    "&:nth-of-type(3)": {
      left: "100%",
      transform: "translateX(-100%)",
    },
    "&.selected": {
      color: MainColor,
      fontWeight: "800",
    },
    "&:hover": {
      color: MainColor,
    },
  },
  "& .tabIndicator": {
    position: "absolute",
    width: "150px",
    height: "4px",
    background: MainColor,
    bottom: "0",
    transition: "left 0.2s",
    "&.left": {
      left: "0",
    },
    "&.middle": {
      left: "50%",
      transform: "translateX(-50%)",
    },
    "&.right": {
      left: "100%",
      transform: "translateX(-100%)",
    },
  },
  "@bp3": {
    height: "48px",
    "& .tabButton": {
      fontSize: "19px",
      width: "120px",
    },
    "& .tabIndicator": {
      width: "120px",
      height: "3.5px",
    },
  },
  "@bp2": {
    "& .tabButton": {
      fontSize: "18px",
      width: "110px",
    },
    "& .tabIndicator": {
      width: "110px",
    },
  },
  "@bp1": {
    height: "43px",
    "& .tabButton": {
      fontSize: "16.5px",
      width: "93px",
    },
    "& .tabIndicator": {
      width: "93px",
      height: "3px",
    },
  },
});

export const BottomArea = styled("div", {
  width: "100%",
  flexGrow: "1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  paddingTop: "24px",
  paddingBottom: "30px",
  "& .noJobNotice": {
    ...noItemNoticeStyle,
    minHeight: "300px",
  },
  "@bp3": {
    "& .noJobNotice": {
      minHeight: "100px",
    },
  },
});

export const ListItem = styled("button", {
  width: "700px",
  padding: "13px 17px",
  background: "white",
  borderRadius: "15px",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  transition: "background 0.2s",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "none",
  cursor: "pointer",
  "&.loadingItem": {
    ...skeletonStyle,
    height: "56px",
  },
  "&.isHovering": {
    background: SubColor,
  },
  "&.appliedPostItem .main": {
    width: "calc(100% - 248px)",
  },
  "&.myPostItem .main": {
    width: "calc(100% - 200px)",
  },
  "&.interestedPostItem .main": {
    width: "calc(100% - 168px)",
  },
  "& .main": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    "& .title": {
      ...ellipsisStyle,
      textAlign: "left",
      fontSize: "18px",
      fontWeight: "600",
    },
  },
  "& .interaction": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    "& button": {
      ...MainButtonStyle,
      fontSize: "15px",
      padding: "6px 11px",
      borderRadius: "9px",
      cursor: "pointer",
      "&:not(.inactivated):hover": {
        background: MainHoverColor,
      },
      "& span": {
        fontWeight: "400",
      },
    },
    "& .createdAt": {
      fontSize: "14px",
      color: "#828282",
    },
  },
  "@bp4": {
    width: "70%",
  },
  "@bp3": {
    width: "80%",
    padding: "11px 15px",
    "&.loadingItem": {
      height: "50.5px",
    },
    "&.appliedPostItem .main": {
      width: "calc(100% - 230px)",
    },
    "&.myPostItem .main": {
      width: "calc(100% - 185px)",
    },
    "&.interestedPostItem .main": {
      width: "calc(100% - 162px)",
    },
    "& .main .title": {
      fontSize: "17px",
    },
    "& .interaction": {
      gap: "9px",
      "& button": {
        fontSize: "14px",
        fontWeight: "600",
      },
      "& .createdAt": {
        fontSize: "13px",
      },
    },
  },
  "@bp2": {
    width: "85%",
    padding: "10px 13px",
    borderRadius: "13px",
    "&.loadingItem": {
      height: "48.5px",
    },
    "& .main .title": {
      fontSize: "16px",
    },
  },
  "@bp1": {
    width: "90%",
    padding: "8.5px 10px 8.5px 12px",
    "&.loadingItem": {
      height: "43px",
    },
    "&.appliedPostItem .main": {
      width: "calc(100% - 203px)",
    },
    "&.myPostItem .main": {
      width: "calc(100% - 160px)",
    },
    "&.interestedPostItem .main": {
      width: "calc(100% - 143px)",
    },
    "& .main .title": {
      fontSize: "15px",
    },
    "& .interaction": {
      gap: "7px",
      "& button": {
        fontSize: "13px",
        borderRadius: "7px",
        padding: "5px 9px",
      },
      "& .createdAt": {
        fontSize: "12px",
      },
    },
  },
});
