import React, { useState } from "react";
import CustomTextarea from "../CustomTextarea.tsx";
import { ApplicationModalBackground } from "../../styles/ViewJobPage.styles";
import { ReactComponent as XIcon } from "../../assets/icons/x-mark.svg";
import { checkRulePassInApplication } from "../../utils/checkRulePass";

const ApplicationModal = ({ onXClick }) => {
  const [value, setValue] = useState("");
  const [isValid, setIsValid] = useState(false);

  return (
    <ApplicationModalBackground>
      <div className="container">
        <div className="title">자기소개 작성</div>
        <div className="textareaContainer">
          <CustomTextarea
            placeholder="최소 15자 이상 입력해주세요."
            value={value}
            maxLength={200}
            eventHandlers={{
              onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setValue(e.target.value);
                setIsValid(checkRulePassInApplication.selfIntroduction(value));
              },
            }}
          />
        </div>
        <button
          className={`applyButton ${!isValid ? "inactivated" : ""}`}
          disabled={!isValid}
        >
          지원하기
        </button>
        <XIcon onClick={onXClick} />
      </div>
    </ApplicationModalBackground>
  );
};

export default ApplicationModal;
