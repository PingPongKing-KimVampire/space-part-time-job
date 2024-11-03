import React, { useState } from "react";
import { TIMES, WORKTIME_TYPES } from "../../constants/constants.ts";
import Chips from "../Chips.tsx";
import {
  Container,
  TimeSelectionsContainer,
  TimeSelectionContainer,
  ArrowDownIcon,
  SelectBox,
} from "../../styles/CreateJobPage/TimeSection.styles.ts";

const TimeSelection = (props) => {
  const { type, time, setTime, isTimeInputSelected, setIsTimeInputSelected } =
    props;

  const onTimeInputClick = () => {
    setIsTimeInputSelected((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const onOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const timeClicked = e.currentTarget.textContent || "";
    if (!timeClicked) return;
    setTime((prev) => ({
      ...prev,
      [type]: timeClicked,
    }));
    setIsTimeInputSelected((prev) => ({
      ...prev,
      [type]: false,
    }));
  };

  return (
    <TimeSelectionContainer>
      <button className="timeInputButton" onClick={onTimeInputClick}>
        {time[type]}
        <ArrowDownIcon isSelected={isTimeInputSelected[type]} />
      </button>
      <label>{type === "start" ? "시작" : "종료"}</label>
      {isTimeInputSelected[type] && (
        <SelectBox>
          {TIMES &&
            TIMES.map((time) => (
              <button
                className="optionButton"
                key={time}
                onClick={onOptionClick}
              >
                {time}
              </button>
            ))}
        </SelectBox>
      )}
    </TimeSelectionContainer>
  );
};

const TimeSection = ({ time, setTime }) => {
  const [isTimeInputSelected, setIsTimeInputSelected] = useState({
    start: false,
    end: false,
  });

  const onTimeTypeSelected = (e: React.MouseEvent<HTMLButtonElement>) => {
    const type = e.currentTarget.textContent || WORKTIME_TYPES.FLEXIBLE;
    setTime((state) => ({ ...state, type }));
  };

  return (
    <Container id="time">
      <Chips
        id="timeType"
        options={Object.values(WORKTIME_TYPES)}
        onClick={onTimeTypeSelected}
        isSelected={(type) => type === time.type}
      />
      {time.type === WORKTIME_TYPES.FIXED && (
        <TimeSelectionsContainer
          hasMarginBottom={isTimeInputSelected.start || isTimeInputSelected.end}
        >
          <TimeSelection
            type="start"
            time={time}
            setTime={setTime}
            isTimeInputSelected={isTimeInputSelected}
            setIsTimeInputSelected={setIsTimeInputSelected}
          />
          <div className="waveSymbol">~</div>
          <TimeSelection
            type="end"
            time={time}
            setTime={setTime}
            isTimeInputSelected={isTimeInputSelected}
            setIsTimeInputSelected={setIsTimeInputSelected}
          />
        </TimeSelectionsContainer>
      )}
    </Container>
  );
};

export default TimeSection;
