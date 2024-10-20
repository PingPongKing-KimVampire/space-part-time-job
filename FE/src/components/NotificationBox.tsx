import React from "react";
import { createStitches } from "@stitches/react";

const { styled } = createStitches();

const Box = styled("div", {
  position: "fixed",
  bottom: "30px",
  background: "black",
  color: "white",
  width: "700px",
  padding: "16px",
  borderRadius: "10px",
  boxSizing: "border-box",
  zIndex: "1",
});

interface NotificationBoxProps {
  children: string;
}

const NotificationBox: React.FC<NotificationBoxProps> = (props) => {
  const { children } = props;
  return <Box>{children}</Box>;
};

export default NotificationBox;
