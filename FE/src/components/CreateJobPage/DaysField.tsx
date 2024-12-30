import React from "react";
import Chips from "../Chips.tsx";
import FormField from "./FormField.tsx";
import useCreateJobContext from "../../context/CreateJobContext.tsx";
import { DAYS } from "../../constants/constants.ts";
import { checkRulePassInCreateJob } from "../../utils/checkRulePass.ts";
import toggleItemInList from "../../utils/toggleItemInList.ts";
import sortDays from "../../utils/sortDays.ts";

const DaysField = () => {
  const { input, isFocused, warnings, setInput, setIsFocused, setIsValid } =
    useCreateJobContext();

  const onDayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isFocused.days) setIsFocused((state) => ({ ...state, days: true }));
    const newDays = toggleItemInList(
      input.days,
      e.currentTarget.textContent || ""
    );
    const sortedDays = sortDays(newDays);
    setIsValid((state) => ({
      ...state,
      days: checkRulePassInCreateJob.days(sortedDays),
    }));
    setInput((state) => ({ ...state, days: sortedDays }));
  };

  return (
    <FormField
      id="days"
      title="요일 선택"
      subInfo={input.days.length ? `(${input.days.join(", ")})` : ""}
      warning={warnings.days}
    >
      <Chips
        id="days"
        options={Object.values(DAYS)}
        onClick={onDayClick}
        isSelected={(day: string) => input.days.includes(day)}
      />
    </FormField>
  );
};

export default DaysField;
