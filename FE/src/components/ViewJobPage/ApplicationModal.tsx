import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import CustomTextarea from "../CustomTextarea.tsx";
import LoadingOverlay from "../LoadingOverlay.tsx";
import { ModalBackground, WarningText } from "../../styles/global.ts";
import { ReactComponent as XIcon } from "../../assets/icons/x-mark.svg";
import { checkRulePassInApplication } from "../../utils/checkRulePass";
import { APPLY_TO_JOB_POST } from "../../api/graphql/mutations.js";
import useViewJobContext from "../../context/ViewJobContext.tsx";
import { ERROR } from "../../constants/constants.ts";

const ApplicationModal = () => {
  const { jobPost, setIsApplicationModalVisible } = useViewJobContext();

  const [coverLetter, setCoverLetter] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [applyToJobPost, { loading: applyLoading, error: applyError }] =
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
      console.error("ApplyToJobPost Mutation Error: ", e.message);
    }
    onXClick();
  };

  useEffect(() => {
    setIsValid(checkRulePassInApplication.coverLetter(coverLetter));
  }, [coverLetter]);

  return (
    <ModalBackground>
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
                const value = e.target.value;
                setCoverLetter(value.length > 200 ? value.slice(0, 200) : value);
              },
            }}
          />
        </div>
        {applyError && <WarningText>{ERROR.SERVER}</WarningText>}
        <button
          className={`applyButton ${!isValid ? "inactivated" : ""}`}
          disabled={!isValid}
          onClick={onApplyClick}
        >
          지원하기
        </button>
        <XIcon onClick={onXClick} />
      </div>
    </ModalBackground>
  );
};

export default ApplicationModal;
