import {
  styled,
  MainButtonStyle,
  MainColor,
  MainHoverColor,
  SubColor,
  NavigationBarHeight,
  getResponsiveStyleByBp,
  ellipsisStyle,
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
    }
  },
  // "@bp3_5": {
  //   "& .container": {
  //     width: "75%",
  //   }
  // }
});

export const ProfileContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "120px",
  margin: "100px 0 60px",
  "& svg": {
    fill: MainColor,
    aspectRatio: "1/1",
  },
  "& .profileIcon": {
    height: "120px",
    width: "120px",
    minHeight: "120px",
    minWidth: "120px",
  },
  "& .textInfo": {
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
  },
  "& .buttons": {
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
  },
  "@bp4": {
    "& .textInfo": {
      maxWidth: "calc(70vw - 300px)"
    },
    "& .buttons": {
      flexDirection: "column",
    }
  },
  "@bp3": {
    flexDirection: "column",
    height: "auto",
    margin: "60px 0 40px",
    "& .profileIcon": {
      marginBottom: "15px",
      height: "150px",
      width: "150px",
      minHeight: "150px",
      minWidth: "150px",
    }, 
    "& .textInfo": {
      margin: "auto",
      textAlign: "center",
      marginBottom: "35px",
      maxWidth: "80%",
    },
    "& .buttons": {
      gap: "15px",
      flexDirection: "row",
    }
  },
  "@bp1": {
    margin: "40px 0 30px",
    "& .profileIcon": {
      marginBottom: "10px",
      height: "120px",
      width: "120px",
      minHeight: "120px",
      minWidth: "120px",
    },
    "& .textInfo": {
      marginBottom: "25px",
      "& .nickname": {
        fontSize: "24px",
      },
      "& .iconInfo": {
        fontSize: "15px",
      }
    },
    "& .buttons": {
      gap: "8px",
      "& button": {
        fontSize: "16px",
        padding: "9px 16px",
        minWidth: "105px",
      }
    }
  }
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
  overflow: "scroll",
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
  "&.isHovering": {
    background: SubColor,
  },
  "& .main": {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "400px",
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
});
