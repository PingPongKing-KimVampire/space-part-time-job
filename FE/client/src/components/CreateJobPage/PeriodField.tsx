import React from "react";
import FormField from "./FormField.tsx";
import Chips from "../Chips.tsx";
import useCreateJobContext from "../../context/CreateJobContext.tsx";
import { PERIOD } from "../../constants/constants.ts";

const PeriodField = () => {
  const { input, setInput } = useCreateJobContext();

  const onPeriodClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const periodClicked = e.currentTarget.textContent || PERIOD.TODAY;
    setInput((state) => ({
      ...state,
      period: periodClicked,
    }));
  };

  return (
    <FormField id="period" title="일하는 기간" warning="">
      <Chips
        id="period"
        options={Object.values(PERIOD)}
        onClick={onPeriodClick}
        isSelected={(period) => period === input.period}
        className="inCreateJob"
      />
    </FormField>
  );
};

export default PeriodField;
