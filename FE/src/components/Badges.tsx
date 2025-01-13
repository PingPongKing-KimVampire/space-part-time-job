import React from "react";
import { ReactComponent as CheckBadgeIcon } from "../assets/icons/check-badge.svg";
import { Badge } from "../styles/components/Badge.styles.ts";

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
