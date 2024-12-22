import React from "react";
import { ReactComponent as CheckBadgeIcon } from "../assets/icons/check-badge.svg";
import { createStitches } from "@stitches/react";
import { MainColor, NegativeColor } from "../styles/global";

const { styled } = createStitches();

const Badge = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: "3px",
  fontWeight: "bold",
  fontSize: "16px",
  "&.accepted": {
    color: MainColor,
  },
  "&.rejected": {
    color: NegativeColor,
  },
  "& svg": {
    width: "20px",
    height: "20px",
    strokeWidth: "2",
  },
});

export const AcceptedBadge = (props) => {
  const { style = {} } = props;

  return (
    <Badge className="accepted" style={style}>
      <CheckBadgeIcon />
      채용 확정
    </Badge>
  );
};

export const RejectedBadge = (props) => {
  const { style = {} } = props;

  return (
    <Badge className="rejected" style={style}>
      <CheckBadgeIcon />
      채용 거절
    </Badge>
  );
};
