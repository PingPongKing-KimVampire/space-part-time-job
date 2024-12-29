import React, { useState, useMemo, useEffect } from "react";
import { max } from "date-fns";
import CustomCalendar from "../CustomCalendar.tsx";
import CustomMap from "../CustomMap.tsx";
import {
  formatPayForDisplay,
  formatTimeForDisplay,
  formatPeriodForDisplay,
} from "../../utils/formatJobInfoForDisplay";
import { TERM } from "../../constants/constants";
import { BasicInfoContainer } from "../../styles/ViewJobPage.styles";
import { ReactComponent as WonIcon } from "../../assets/icons/won.svg";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import { ReactComponent as LocationIcon } from "../../assets/icons/location-outline.svg";
import { ReactComponent as ClockIcon } from "../../assets/icons/clock.svg";

type BasicInfoProps = {
  pay: { type: string; amount: number };
  address: string;
  period: { type: string; dates?: string[]; days?: string[] };
  time: { type: string; startTime?: string; endTime?: string };
};

const BasicInfo: React.FC<BasicInfoProps> = (props) => {
  const { pay, address, period, time } = props;

  const payToDisplay = useMemo(() => formatPayForDisplay(pay), [pay]);
  const timeToDisplay = useMemo(() => formatTimeForDisplay(time), [time]);
  const periodToDisplay = useMemo(
    () => formatPeriodForDisplay(period),
    [period]
  );

  const detailCalendarElement = useMemo(() => {
    if (TERM[period.type] !== TERM.SHORT_TERM) return null;
    const dates = new Set(period.dates);
    const lastDate = max(period.dates!.map((date) => new Date(date)));
    return (
      <CustomCalendar
        dates={dates || new Set()}
        lastDate={lastDate}
        isTitleVisible={false}
        style={{ width: "70%" }}
      />
    );
  }, [period]);

  // TODO: WonIcon outline 아이콘으로 다시 찾아보기
  return (
    <BasicInfoContainer>
      <InfoItem iconElement={<WonIcon />} text={payToDisplay} />
      <InfoItem
        iconElement={<LocationIcon />}
        text={address}
        detail={{
          name: "지도",
          element: (
            <CustomMap style={{ boxShadow: "none" }} markerAddress={address} />
          ),
        }}
      />
      <InfoItem
        iconElement={<CalendarIcon />}
        text={periodToDisplay}
        detail={
          detailCalendarElement
            ? { name: "달력", element: detailCalendarElement }
            : undefined
        }
      />
      <InfoItem iconElement={<ClockIcon />} text={timeToDisplay} />
    </BasicInfoContainer>
  );
};

type InfoItemProps = {
  iconElement: React.JSX.Element;
  text: string;
  detail?: {
    name: string;
    element: React.JSX.Element;
  };
};

const InfoItem: React.FC<InfoItemProps> = (props) => {
  const { iconElement, text, detail } = props;

  const [isHovering, setHovering] = useState(false); // 호버 타겟 호버링 여부

  return (
    <div className="item">
      <div className="main">
        {iconElement}
        {text}
        {detail && (
          <div
            className="hoverTarget"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
          >
            {detail.name} 보기
          </div>
        )}
      </div>
      {detail && isHovering && <div className="detail">{detail.element}</div>}
    </div>
  );
};

export default BasicInfo;
