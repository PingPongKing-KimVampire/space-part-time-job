import React, { useState, useMemo } from "react";
import { max } from "date-fns";
import CustomCalendar from "../CustomCalendar.tsx";
import {
  converPayToDisplayable,
  converTimeToDisplayable,
  converPeriodToDisplayable,
} from "../../utils/convertJobInfoToDisplayable.ts";
import { TERM } from "../../constants/constants.ts";
import { BasicInfoContainer } from "../../styles/ViewJobPage.styles.ts";
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

  const [isHovering, setIsHovering] = useState({
    period: false,
    address: false,
  });

  const dates: Set<string> | null = useMemo(() => {
    return TERM[period.type] === TERM.SHORT_TERM ? new Set(period.dates) : null;
  }, [period]);

  const payToDisplay = useMemo(() => converPayToDisplayable(pay), [pay]);

  const timeToDisplay = useMemo(() => converTimeToDisplayable(time), [time]);

  const periodToDisplay = useMemo(
    () => converPeriodToDisplayable(period),
    [period]
  );

  const updateIsHovering = (field: string, type: "enter" | "leave") => {
    setIsHovering((state) => ({ ...state, [field]: type === "enter" }));
  };

  const lastDate: Date = useMemo(() => {
    if (TERM[period.type] !== TERM.SHORT_TERM) return new Date();
    const dateObjs = period.dates!.map((date) => new Date(date));
    return max(dateObjs);
  }, [period.dates]);

  // TODO: WonIcon outline 아이콘으로 다시 찾아보기

  return (
    <BasicInfoContainer>
      <InfoItem iconElement={<WonIcon />} text={payToDisplay} />
      <InfoItem
        iconElement={<LocationIcon />}
        text={address}
        eventHandlers={{
          onMouseEnter: () => {
            updateIsHovering("address", "enter");
          },
          onMouseLeave: () => {
            updateIsHovering("address", "leave");
          },
        }}
        isHovering={isHovering.address}
      />
      <InfoItem
        iconElement={<CalendarIcon />}
        text={periodToDisplay}
        eventHandlers={{
          onMouseEnter: () => {
            updateIsHovering("period", "enter");
          },
          onMouseLeave: () => {
            updateIsHovering("period", "leave");
          },
        }}
        detailElement={
          <CustomCalendar
            dates={dates || new Set()}
            lastDate={lastDate}
            isTitleVisible={false}
            style={{ width: "70%" }}
          />
        }
        isHovering={isHovering.period}
      />
      <InfoItem iconElement={<ClockIcon />} text={timeToDisplay} />
    </BasicInfoContainer>
  );
};

type EventHandlers = {
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

type InfoItem = {
  iconElement: React.JSX.Element;
  text: string;
  eventHandlers?: EventHandlers;
  detailElement?: React.JSX.Element;
  isHovering?: boolean;
};

const InfoItem: React.FC<InfoItem> = (props) => {
  const {
    iconElement,
    text,
    eventHandlers = {},
    detailElement,
    isHovering,
  } = props;
  const { onMouseEnter, onMouseLeave } = eventHandlers;

  return (
    <div
      className={`item ${detailElement ? "isDetailVisible" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="main">
        {iconElement}
        {text}
      </div>
      {detailElement && isHovering && (
        <div className="detail">{detailElement}</div>
      )}
    </div>
  );
};

export default BasicInfo;
