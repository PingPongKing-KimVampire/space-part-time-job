import React from "react";
import FormField from "./FormField.tsx";
import Chips from "../Chips.tsx";
import { JOB_TYPES } from "../../constants/constants.ts";
import { checkRulePassInCreateJob } from "../../utils/checkRulePass.ts";
import useCreateJobContext from "../../context/CreateJobContext.tsx";
import toggleItemInList from "../../utils/toggleItemInList.ts";

const JobTypesField = () => {
  const { input, isFocused, warnings, setInput, setIsFocused, setIsValid } =
    useCreateJobContext();

  const onJobTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isFocused.jobTypes)
      setIsFocused((state) => ({ ...state, jobTypes: true }));
    const newJobTypes = toggleItemInList(
      input.jobTypes,
      e.currentTarget.textContent || JOB_TYPES.SERVING
    );
    setIsValid((state) => ({
      ...state,
      jobTypes: checkRulePassInCreateJob.jobTypes(newJobTypes),
    }));
    setInput((state) => ({ ...state, jobTypes: newJobTypes }));
  };

  return (
    <FormField
      id="jobTypes"
      title="하는 일"
      subInfo="(최대 3개)"
      warning={warnings.jobTypes}
    >
      <Chips
        id="jobTypes"
        options={Object.values(JOB_TYPES)}
        onClick={onJobTypeClick}
        isSelected={(jobType: string) => input.jobTypes.includes(jobType)}
      />
    </FormField>
  );
};

export default JobTypesField;
