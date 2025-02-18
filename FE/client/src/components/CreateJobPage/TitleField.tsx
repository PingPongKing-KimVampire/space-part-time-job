import React from "react";
import FormField from "./FormField.tsx";
import CustomInput from "../CustomInput.tsx";
import { checkRulePassInCreateJob } from "../../utils/checkRulePass.ts";
import useCreateJobContext from "../../context/CreateJobContext.tsx";

const TitleField = () => {
  const { input, isFocused, warnings, setInput, setIsFocused, setIsValid } =
    useCreateJobContext();
  return (
    <FormField id="title" title="공고 제목" warning={warnings.title}>
      <CustomInput
        id="title"
        placeholder="공고 내용을 요약해주세요."
        value={input.title}
        eventHandlers={{
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            setInput((state) => ({ ...state, title: e.target.value }));
          },
          onFocus: () => {
            if (!isFocused.title)
              setIsFocused((state) => ({ ...state, title: true }));
          },
          onBlur: (e) => {
            setIsValid((state) => ({
              ...state,
              title: checkRulePassInCreateJob.title(e.target.value),
            }));
          },
        }}
      />
    </FormField>
  );
};

export default TitleField;
