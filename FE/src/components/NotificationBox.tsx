import React from "react";
import { Box } from "../styles/components/NotificationBox.styles.ts";

type NotificationBoxProps = {
  children: string;
};

const NotificationBox: React.FC<NotificationBoxProps> = (props) => {
  const { children } = props;
  return <Box>{children}</Box>;
};

export default NotificationBox;
