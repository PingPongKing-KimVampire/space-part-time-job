import React, { useState, useMemo } from "react";
import {
  Container,
  TimeSelectionContainer,
  ArrowDownIcon,
  SelectBox,
} from "../styles/TimeRangeSelection.styles.ts";
import { TIMES } from "../constants/constants.ts";

const TimeRangeSelection = ({ time, setTime, isMini = false }) => {
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
      className={`${isSelectingOne ? "hasMarginBottom" : ""} ${
        isMini ? "isMini" : ""
      }`}
    >
      <TimeSelection
        label="시작"
        time={time.start}
        setTime={(time) => setTime((state) => ({ ...state, start: time }))}
        isSelecting={isSelecting.start}
        setIsSelecting={(isSelecting) =>
          setIsSelecting((state) => ({ ...state, start: isSelecting }))
        }
        isMini={isMini}
      />
      <div className={`waveSymbol ${isMini ? "isMini" : ""}`}>~</div>
      <TimeSelection
        label="종료"
        time={time.end}
        setTime={(time) => setTime((state) => ({ ...state, end: time }))}
        isSelecting={isSelecting.end}
        setIsSelecting={(isSelecting) =>
          setIsSelecting((state) => ({ ...state, end: isSelecting }))
        }
        isMini={isMini}
      />
    </Container>
  );
};

const TimeSelection = (props) => {
  const { label, time, setTime, isSelecting, setIsSelecting, isMini } = props;

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
        <ArrowDownIcon isSelected={isSelecting} />
      </button>
      <label className={isMini ? "isMini" : ""}>{label}</label>
      {isSelecting && (
        <SelectBox className={isMini ? "isMini" : ""}>
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
