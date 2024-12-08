import React from "react";
import { WORKTIME_TYPES } from "../../constants/constants";
import Chips from "../Chips.tsx";
import { TimeContainer } from "../../styles/CreateJobPage.styles";
import TimeRangeSelection from "../TimeRangeSelection.tsx";

const TimeSection = ({ time, setTime }) => {
  const onTimeTypeSelected = (e: React.MouseEvent<HTMLButtonElement>) => {
    const type = e.currentTarget.textContent || WORKTIME_TYPES.FLEXIBLE;
    setTime((state) => ({ ...state, type }));
  };

  return (
    <TimeContainer id="time">
      <Chips
        id="timeType"
        options={Object.values(WORKTIME_TYPES)}
        onClick={onTimeTypeSelected}
        isSelected={(type) => type === time.type}
      />
      {time.type === WORKTIME_TYPES.FIXED && (
        <TimeRangeSelection time={time} setTime={setTime} />
      )}
    </TimeContainer>
  );
};

export default TimeSection;
