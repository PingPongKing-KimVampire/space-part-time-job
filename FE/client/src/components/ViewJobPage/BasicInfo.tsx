import React, { useState, useMemo } from "react";
import { max } from "date-fns";
import CustomCalendar from "../CustomCalendar";
import CustomMap from "../CustomMap";
import {
  formatPayForDisplay,
  formatTimeForDisplay,
  formatPeriodForDisplay,
} from "../../utils/formatJobInfoForDisplay";
import { PERIOD } from "../../constants/constants";
import { BasicInfoContainer } from "../../styles/pages/ViewJobPage.styles";
import { ReactComponent as WonIcon } from "../../assets/icons/won.svg";
import { ReactComponent as CalendarIcon } from "../../assets/icons/calendar.svg";
import { ReactComponent as LocationIcon } from "../../assets/icons/location-outline.svg";
import { ReactComponent as ClockIcon } from "../../assets/icons/clock-outline.svg";
import useViewJobContext from "../../context/ViewJobContext";

const BasicInfo = () => {
  const { jobPost } = useViewJobContext();
  const { salary, addressName, workPeriod, workTime } = jobPost;
  const pay = useMemo(() => {
    if (!salary) return null;
    return { type: salary.salaryType, amount: salary.salaryAmount };
  }, [salary]);

  const payToDisplay = useMemo(() => formatPayForDisplay(pay), [pay]);
  const timeToDisplay = useMemo(
    () => (workTime ? formatTimeForDisplay(workTime) : ""),
    [workTime]
  );
  const periodToDisplay = useMemo(
    () => (workPeriod ? formatPeriodForDisplay(workPeriod) : ""),
    [workPeriod]
  );

  const detailCalendarElement = useMemo(() => {
    if (!workPeriod) return null;
    if (PERIOD[workPeriod.type] !== PERIOD.SHORT_TERM) return null;
    const dates = new Set(workPeriod.dates);
    const lastDate = max(workPeriod.dates!.map((date) => new Date(date)));
    return (
      <CustomCalendar
        dates={dates || new Set()}
        lastDate={lastDate}
        isTitleVisible={false}
        style={{ width: "70%" }}
      />
    );
  }, [workPeriod]);

  if (!pay || !addressName || !workPeriod || !workTime) return null;
  // TODO: WonIcon outline 아이콘으로 다시 찾아보기
  return (
    <BasicInfoContainer>
      <InfoItem iconElement={<WonIcon />} text={payToDisplay} />
      <InfoItem
        iconElement={<LocationIcon />}
        text={addressName}
        detail={{
          name: "지도",
          element: (
            <CustomMap
              style={{ boxShadow: "none" }}
              markerAddress={addressName}
            />
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
