import React, { useState, useMemo } from "react";
import { max } from "date-fns";
import CustomCalendar from "../CustomCalendar.tsx";
import CustomMap from "../CustomMap.tsx";
import {
  converPayToDisplayable,
  converTimeToDisplayable,
  converPeriodToDisplayable,
} from "../../utils/convertJobInfoToDisplayable";
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

  const dates: Set<string> | null = useMemo(() => {
    return TERM[period.type] === TERM.SHORT_TERM ? new Set(period.dates) : null;
  }, [period]);
  const lastDate: Date = useMemo(() => {
    if (TERM[period.type] !== TERM.SHORT_TERM) return new Date();
    const dateObjs = period.dates!.map((date) => new Date(date));
    return max(dateObjs);
  }, [period]);

  const payToDisplay = useMemo(() => converPayToDisplayable(pay), [pay]);
  const timeToDisplay = useMemo(() => converTimeToDisplayable(time), [time]);
  const periodToDisplay = useMemo(
    () => converPeriodToDisplayable(period),
    [period]
  );

  const detailCalendarElement = useMemo(
    () => (
      <CustomCalendar
        dates={dates || new Set()}
        lastDate={lastDate}
        isTitleVisible={false}
        style={{ width: "70%" }}
      />
    ),
    [dates, lastDate]
  );

  // TODO: WonIcon outline 아이콘으로 다시 찾아보기
  return (
    <BasicInfoContainer>
      <InfoItem iconElement={<WonIcon />} text={payToDisplay} />
      <InfoItem
        iconElement={<LocationIcon />}
        text={address}
        detail={{
          name: "지도",
          element: <CustomMap style={{ boxShadow: "none" }} />,
        }}
      />
      <InfoItem
        iconElement={<CalendarIcon />}
        text={periodToDisplay}
        detail={{ name: "달력", element: detailCalendarElement }}
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
