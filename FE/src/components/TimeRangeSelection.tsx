import React, { useState, useMemo } from "react";
import {
  Container,
  TimeSelectionContainer,
  ArrowDownIcon,
  SelectBox,
} from "../styles/TimeRangeSelection.styles";
import { START_TIMES, END_TIMES, TIME_NOT_SET } from "../constants/constants";

const TimeRangeSelection = ({
  time,
  setTime,
  isMini = false,
  notSetPossible = false,
  autoBoth = false,
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

  const setStartTime = (start) => {
    if (!autoBoth) setTime((state) => ({ ...state, start }));
    if (start === TIME_NOT_SET && time.end !== TIME_NOT_SET)
      setTime((state) => ({ start, end: TIME_NOT_SET }));
    else if (start !== TIME_NOT_SET && time.end === TIME_NOT_SET)
      setTime((state) => ({ start, end: "24:00" }));
    setTime((state) => ({ ...state, start }));
  };
  const setEndTime = (end) => {
    if (!autoBoth) setTime((state) => ({ ...state, end }));
    if (end === TIME_NOT_SET && time.start !== TIME_NOT_SET)
      setTime((state) => ({ end, start: TIME_NOT_SET }));
    else if (end !== TIME_NOT_SET && time.start === TIME_NOT_SET)
      setTime((state) => ({ end, start: "00:00" }));
    setTime((state) => ({ ...state, end }));
  };

  return (
    <Container
      className={`${isSelectingOne ? "hasMarginBottom" : ""} ${
        isMini ? "isMini" : ""
      }`}
    >
      <TimeSelection
        label="시작"
        time={time.start}
        setTime={setStartTime}
        isSelecting={isSelecting.start}
        setIsSelecting={(isSelecting) =>
          setIsSelecting((state) => ({ ...state, start: isSelecting }))
        }
        isMini={isMini}
        notSetPossible={notSetPossible}
      />
      <div className={`waveSymbol ${isMini ? "isMini" : ""}`}>~</div>
      <TimeSelection
        label="종료"
        time={time.end}
        setTime={setEndTime}
        isSelecting={isSelecting.end}
        setIsSelecting={(isSelecting) =>
          setIsSelecting((state) => ({ ...state, end: isSelecting }))
        }
        isMini={isMini}
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
    isMini,
    notSetPossible,
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
    <TimeSelectionContainer>
      <button
        className={`timeInputButton ${isMini ? "isMini" : ""}`}
        onClick={onTimeInputClick}
      >
        {time}
        <ArrowDownIcon
          className={isMini ? "isMini" : ""}
          isSelected={isSelecting}
        />
      </button>
      {!isMini && <label>{label}</label>}
      {isSelecting && (
        <SelectBox className={isMini ? "isMini" : ""}>
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
