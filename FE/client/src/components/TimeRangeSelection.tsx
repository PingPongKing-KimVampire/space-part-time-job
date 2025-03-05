import React, { useState, useMemo } from "react";
import {
  Container,
  TimeSelectionContainer,
  ArrowDownIcon,
  SelectBox,
} from "../styles/components/TimeRangeSelection.styles";
import { START_TIMES, END_TIMES, TIME_NOT_SET } from "../constants/constants";

const TimeRangeSelection = ({
  time,
  setTime,
  className = "",
  notSetPossible = false,
}) => {
  const [isSelecting, setIsSelecting] = useState({
    start: false,
    end: false,
  });
  const isSelectingOne = useMemo(
    // 하나라도 선택됐는가?
    () => isSelecting.start || isSelecting.end,
    [isSelecting]
  );

  return (
    <Container
      className={`${isSelectingOne ? "hasMarginBottom" : ""} ${className}`}
    >
      <TimeSelection
        label="시작"
        time={time.start}
        setTime={(start) => {
          setTime((state) => ({ ...state, start }), "start");
        }}
        isSelecting={isSelecting.start}
        setIsSelecting={(isSelecting) =>
          setIsSelecting((state) => ({ ...state, start: isSelecting }))
        }
        className={className}
        notSetPossible={notSetPossible}
      />
      <div className="waveSymbol">~</div>
      <TimeSelection
        label="종료"
        time={time.end}
        setTime={(end) => {
          setTime((state) => ({ ...state, end }), "end");
        }}
        isSelecting={isSelecting.end}
        setIsSelecting={(isSelecting) =>
          setIsSelecting((state) => ({ ...state, end: isSelecting }))
        }
        className={className}
        notSetPossible={notSetPossible}
      />
    </Container>
  );
};

const TimeSelection = (props) => {
  const {
    label,
    time,
    setTime,
    isSelecting,
    setIsSelecting,
    notSetPossible,
    className,
  } = props;
  const TIMES = label === "시작" ? START_TIMES : END_TIMES;

  const onTimeInputClick = () => {
    setIsSelecting(!isSelecting);
  };

  const onOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const timeClicked = e.currentTarget.textContent || "";
    if (!timeClicked) return;
    setTime(timeClicked);
    setIsSelecting(false);
  };

  return (
    <TimeSelectionContainer className={className}>
      <button className="timeInputButton" onClick={onTimeInputClick}>
        {time}
        <ArrowDownIcon className={className} isSelected={isSelecting} />
      </button>
      {className !== "inExploreJobs" && <label>{label}</label>}
      {isSelecting && (
        <SelectBox className={className}>
          {notSetPossible && (
            <button
              className="optionButton"
              key="미설정"
              onClick={onOptionClick}
            >
              {TIME_NOT_SET}
            </button>
          )}
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

export default TimeRangeSelection;
