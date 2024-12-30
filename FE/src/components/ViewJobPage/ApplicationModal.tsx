import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import CustomTextarea from "../CustomTextarea.tsx";
import LoadingOverlay from "../LoadingOverlay.tsx";
import { ApplicationModalBackground } from "../../styles/ViewJobPage.styles";
import { ReactComponent as XIcon } from "../../assets/icons/x-mark.svg";
import { checkRulePassInApplication } from "../../utils/checkRulePass";
import { APPLY_TO_JOB_POST } from "../../api/graphql/mutations.js";
import useViewJobContext from "../../context/ViewJobContext.tsx";

const ApplicationModal = () => {
  const { jobPost, setIsApplicationModalVisible } = useViewJobContext();

  const [coverLetter, setCoverLetter] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [applyToJobPost, { loading: applyLoading }] =
    useMutation(APPLY_TO_JOB_POST);

  const onXClick = () => {
    setIsApplicationModalVisible(false);
  };

  const onApplyClick = async () => {
    try {
      await applyToJobPost({
        variables: { input: { jobPostId: jobPost.id, coverLetter } },
      });
    } catch (e) {
      console.log(e);
    }
    onXClick();
  };

  useEffect(() => {
    setIsValid(checkRulePassInApplication.coverLetter(coverLetter));
  }, [coverLetter]);

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
