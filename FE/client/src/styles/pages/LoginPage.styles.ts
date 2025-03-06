import { styled, MainColor, MainButtonStyle, SubColor } from "../global";

export const Background = styled("div", {
  width: "100%",
  flex: "1",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  "@media (max-height: 700px)": {
    alignItems: "flex-start",
    padding: "50px",
  },
});

export const Container = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginBottom: "7%",
  "& .logoImage": {
    height: "80px",
    marginBottom: "35px",
    "@bp1": {
      height: "65px",
      marginBottom: "25px",
    },
    "@bp6": {
      height: "60px",
      marginBottom: "18px",
    },
  },
  "@media (max-height: 1000px)": {
    marginBottom: "4%",
  },
  "@media (max-height: 800px)": {
    marginBottom: "0%",
  },
});

export const Title = styled("div", {
  marginBottom: "40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
  letterSpacing: "1px",
  color: MainColor,
  "& .sub": {
    fontSize: "24px",
    fontWeight: "600",
  },
  "& .main": {
    fontSize: "50px",
    fontWeight: "900",
  },
  "&.white": {
    color: "white",
    "& .sub span": {
      color: SubColor,
    },
  },
  "@bp6": {
    gap: "6px",
    marginBottom: "34px",
    "& .sub": {
      fontSize: "20px",
    },
    "& .main": {
      fontSize: "46px",
    },
  },
  "@bp3": {
    "& .sub": {
      fontSize: "21px",
    },
    "& .main": {
      fontSize: "45px",
    },
  },
  "@bp1": {
    "& .sub": {
      fontSize: "18px",
    },
    "& .main": {
      fontSize: "40px",
    },
  },
});

export const LoginPanel = styled("div", {
  width: "500px",
  "@bp6": {
    width: "460px",
  },
  "@bp3": {
    width: "450px",
  },
  "@bp2": {
    width: "400px",
  },
  "@bp1": {
    width: "320px",
  },
});

export const TabButton = styled("button", {
  width: "50%",
  padding: "18px",
  fontSize: "20px",
  fontWeight: "600",
  border: "1px solid #CDD2D7",
  background: "#F8F8F8",
  color: "#7C7C7C",
  cursor: "pointer",
  "&.left": {
    borderTopLeftRadius: "10px",
    borderRight: "none",
  },
  "&.right": {
    borderTopRightRadius: "10px",
  },
  "&.selected": {
    borderBottom: "1px solid white",
    background: "white",
    color: "black",
  },
  "@bp6": {
    padding: "16px",
    fontSize: "18px",
  },
  "@bp3": {
    padding: "15px",
    fontSize: "18px",
  },
  "@bp1": {
    padding: "12px",
    fontSize: "16px",
  },
});

export const LoginForm = styled("form", {
  padding: "36px 32px 30px 32px",
  background: "white",
  border: "1px solid #CDD2D7",
  borderTop: "none",
  borderRadius: "0 0 10px 10px",
  "@bp6": {
    padding: "30px 28px 26px 26px",
  },
  "@bp3": {
    padding: "30px 26px 24px 26px",
  },
  "@bp1": {
    padding: "27px 24px 22px 24px",
  },
});

export const LoginButton = styled("button", {
  ...MainButtonStyle,
  width: "100%",
  marginTop: "24px",
  "@bp6": {
    padding: "13px",
    marginTop: "16px !important",
    fontSize: "22px",
  },
  "@bp2": {
    padding: "12px",
  },
  "@bp1": {
    padding: "10px",
    borderRadius: "12px",
    fontSize: "20px",
  },
});

export const SignupMessage = styled("div", {
  marginTop: "20px",
  marginBottom: "40px",
  color: SubColor,
  "& span": {
    color: "white",
    cursor: "pointer",
  },
});

export const PhoneNumberInputChild = styled("div", {
  position: "absolute",
  right: "12px",
  top: "50%",
  display: "flex",
  flexDirection: "row-reverse",
  alignItems: "center",
  gap: "12px",
  transform: "translateY(-50%)",
  "& .sendNumberButton": {
    ...MainButtonStyle,
    padding: "7px 10px",
    borderRadius: "8px",
    fontWeight: "600",
    fontSize: "14px",
  },
  "& .timeCounter": {
    fontWeight: "400",
    fontSize: "16px",
  },
});
