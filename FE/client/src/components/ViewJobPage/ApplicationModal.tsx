import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import CustomTextarea from "../CustomTextarea";
import LoadingOverlay from "../LoadingOverlay";
import { ModalBackground, WarningText } from "../../styles/global";
import { ReactComponent as XIcon } from "../../assets/icons/x-mark.svg";
import { checkRulePassInApplication } from "../../utils/checkRulePass";
import { APPLY_TO_JOB_POST } from "../../api/graphql/mutations";
import { processApplyToPost } from "../../api/graphql/processData";
import useViewJobContext from "../../context/ViewJobContext";
import { ERROR } from "../../constants/constants";

const ApplicationModal = () => {
  const { jobPost, setIsApplicationModalVisible } = useViewJobContext();

  const [coverLetter, setCoverLetter] = useState("");
  const [isValid, setIsValid] = useState(false);

  const [applyToJobPost, { loading: applyLoading, error: applyError }] =
    useMutation(APPLY_TO_JOB_POST);
  const [applyFinalError, setApplyFinalError] = useState<Error | null>(null);
  useEffect(() => {
    if (applyError) setApplyFinalError(new Error(ERROR.SERVER));
  }, [applyError]);

  const onXClick = () => {
    setIsApplicationModalVisible(false);
  };

  const onApplyClick = async () => {
    try {
      let response;
      try {
        response = await applyToJobPost({
          variables: { input: { jobPostId: jobPost.id, coverLetter } },
        });
      } catch (e) {
        throw new Error(ERROR.SERVER);
      }
      processApplyToPost(response.data);
    } catch (e) {
      setApplyFinalError(e);
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
                setCoverLetter(
                  value.length > 200 ? value.slice(0, 200) : value
                );
              },
            }}
            className="inApplicationModal"
          />
        </div>
        {applyFinalError && (
          <WarningText>{applyFinalError.message}</WarningText>
        )}
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
