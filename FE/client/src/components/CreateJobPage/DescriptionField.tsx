import React from "react";
import FormField from "./FormField.tsx";
import CustomTextarea from "../CustomTextarea.tsx";
import { checkRulePassInCreateJob } from "../../utils/checkRulePass.ts";
import useCreateJobContext from "../../context/CreateJobContext.tsx";

const DescriptionField = () => {
  const { input, isFocused, warnings, setInput, setIsFocused, setIsValid } =
    useCreateJobContext();

  const onFocus = () => {
    if (!isFocused.description)
      setIsFocused((state) => ({
        ...state,
        description: true,
      }));
  };

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput((state) => ({
      ...state,
      description: e.target.value,
    }));
  };

  const onBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsValid((state) => ({
      ...state,
      description: checkRulePassInCreateJob.description(e.target.value),
    }));
  };

  return (
    <FormField
      id="description"
      title="자세한 설명"
      warning={warnings.description}
    >
      <CustomTextarea
        placeholder="구체적인 업무 내용, 근무 요건, 지원자가 갖추어야 할 능력 등 우대 사항에 대해 알려주세요."
        value={input.description}
        eventHandlers={{ onFocus, onChange, onBlur }}
        maxLength={2000}
        className="inCreateJob"
      />
    </FormField>
  );
};

export default DescriptionField;
