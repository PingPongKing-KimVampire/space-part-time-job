import React from "react";
import { addMonths } from "date-fns";
import FormField from "./FormField.tsx";
import CustomCalendar from "../CustomCalendar.tsx";
import useCreateJobContext from "../../context/CreateJobContext.tsx";

const CalendarField = () => {
  const { input, isFocused, warnings, setInput, setIsFocused } =
    useCreateJobContext();
  return (
    <FormField id="calendar" title="" subInfo="" warning={warnings.dates}>
      <CustomCalendar
        dates={input.dates}
        setDates={(getNewDates) => {
          setInput((state) => ({ ...state, dates: getNewDates(state.dates) }));
        }}
        lastDate={addMonths(new Date(), 1)}
        onClickStart={() => {
          if (!isFocused.dates)
            setIsFocused((state) => ({ ...state, dates: true }));
        }}
        style={{ width: "43%", marginTop: "-30px" }}
      />
    </FormField>
  );
};

export default CalendarField;
