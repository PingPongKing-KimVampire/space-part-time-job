import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import CustomTextarea from "../CustomTextarea.tsx";
import LoadingOverlay from "../LoadingOverlay.tsx";
import { ApplicationModalBackground } from "../../styles/ViewJobPage.styles";
import { ReactComponent as XIcon } from "../../assets/icons/x-mark.svg";
import { checkRulePassInApplication } from "../../utils/checkRulePass";
import { APPLY_TO_JOB_POST } from "../../graphql/mutations.js";

const ApplicationModal = ({ jobPostId, onXClick }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [applyToJobPost, { loading: applyLoading }] =
    useMutation(APPLY_TO_JOB_POST);

  const onApplyClick = async () => {
    try {
      await applyToJobPost({
        variables: { input: { jobPostId, coverLetter } },
      });
    } catch (e) {
      // TODO : 경고 메시지 표시
      console.log(e);
    }
    onXClick();
  };

  return (
    <ApplicationModalBackground>
      {applyLoading && <LoadingOverlay />}
      <div className="container">
        <div className="title">자기소개 작성</div>
        <div className="textareaContainer">
          <CustomTextarea
            placeholder="최소 15자 이상 입력해주세요."
            value={coverLetter}
            maxLength={200}
            eventHandlers={{
              onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setCoverLetter(e.target.value);
                setIsValid(
                  checkRulePassInApplication.selfIntroduction(coverLetter)
                );
              },
            }}
          />
        </div>
        <button
          className={`applyButton ${!isValid ? "inactivated" : ""}`}
          disabled={!isValid}
          onClick={onApplyClick}
        >
          지원하기
        </button>
        <XIcon onClick={onXClick} />
      </div>
    </ApplicationModalBackground>
  );
};

export default ApplicationModal;
