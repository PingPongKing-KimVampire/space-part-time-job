import React from "react";
import Chips from "../Chips.tsx";
import FormField from "./FormField.tsx";
import useCreateJobContext from "../../context/CreateJobContext.tsx";
import { WORKTIME_TYPES } from "../../constants/constants.ts";
import { TimeContainer } from "../../styles/CreateJobPage.styles.ts";
import TimeRangeSelection from "../TimeRangeSelection.tsx";

const TimeField = () => {
  const { input, setInput } = useCreateJobContext();

  const onTimeTypeSelected = (e: React.MouseEvent<HTMLButtonElement>) => {
    const typeClicked = e.currentTarget.textContent || WORKTIME_TYPES.FLEXIBLE;
    setInput((state) => ({
      ...state,
      time: { ...state.time, type: typeClicked },
    }));
  };

  return (
    <FormField id="time" title="일하는 시간" warning="">
      <TimeContainer id="time">
        <Chips
          id="timeType"
          options={Object.values(WORKTIME_TYPES)}
          onClick={onTimeTypeSelected}
          isSelected={(type) => type === input.time.type}
        />
        {input.time.type === WORKTIME_TYPES.FIXED && (
          <TimeRangeSelection
            time={input.time}
            setTime={(getNewTime) => {
              setInput((state) => ({ ...state, time: getNewTime(state.time) }));
            }}
          />
        )}
      </TimeContainer>
    </FormField>
  );
};

export default TimeField;
