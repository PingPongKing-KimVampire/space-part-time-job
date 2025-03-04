import React, { useMemo, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";
import { InteractionContainer } from "../../styles/pages/ViewJobPage.styles";
import {
  JOB_POST_STATUS,
  APPLICATION_STATUS,
  ERROR,
} from "../../constants/constants";
import {
  UNMARK_JOB_POST_AS_INTEREST,
  MARK_JOB_POST_AS_INTEREST,
} from "../../api/graphql/mutations";
import {
  processMarkPostAsInterest,
  processUnmarkPostAsInterest,
} from "../../api/graphql/processData";
import useViewJobContext from "../../context/ViewJobContext";
import { WarningText } from "../../styles/global";

const Interaction = () => {
  const {
    jobPost,
    setJobPost,
    setIsApplicationModalVisible,
    getJobPostLoading,
  } = useViewJobContext();
  const { id, myJobApplication, myInterested, status } = jobPost;

  const isApplied = useMemo(() => {
    if (!myJobApplication) return null; // TODO : 지원서 받아오기 실패
    return myJobApplication.some(
      (application) => application.status === APPLICATION_STATUS.PENDING
    );
  }, [jobPost]);
  const isClosed = useMemo(() => status === JOB_POST_STATUS.CLOSE, [jobPost]);

  const [markInterest, { loading: markLoading, error: markError }] =
    useMutation(MARK_JOB_POST_AS_INTEREST);
  const [unmarkInterest, { loading: unmarkLoading, error: unmarkError }] =
    useMutation(UNMARK_JOB_POST_AS_INTEREST);
  const [markAndUnmarkFinalError, setMarkAndUnmarkFinalError] =
    useState<Error | null>(null);
  useEffect(() => {
    if (markError || unmarkError)
      setMarkAndUnmarkFinalError(new Error(ERROR.SERVER));
  }, [markError, unmarkError]);

  const onHeartClick = async () => {
    if (!myInterested && isClosed) return; // 마감한 알바라면 mark는 불가능함
    if (markLoading || unmarkLoading) return;
    const mutation = myInterested ? unmarkInterest : markInterest;
    const processData = myInterested
      ? processUnmarkPostAsInterest
      : processMarkPostAsInterest;
    try {
      let response;
      try {
        response = await mutation({ variables: { jobPostId: id } });
      } catch {
        throw new Error(ERROR.SERVER);
      }
      const { myInterested, interestedCount } = processData(response.data);
      setJobPost((state) => ({ ...state, myInterested, interestedCount }));
    } catch (e) {
      setMarkAndUnmarkFinalError(e);
    }
  };

  return (
    <InteractionContainer>
      <div className="interaction">
        {getJobPostLoading ? (
          <>
            <button className="applyButton loading" />
            <HeartIcon className="inactivated" />
          </>
        ) : (
          <>
            <button
              className={`applyButton ${
                isApplied === null || isApplied || isClosed ? "inactivated" : ""
              }`}
              disabled={isApplied === null || isApplied || isClosed}
              onClick={() => {
                setIsApplicationModalVisible(true);
              }}
            >
              {isClosed
                ? "마감된 알바에요."
                : isApplied === null
                ? "서버 오류로 지금은 지원할 수 없어요."
                : isApplied
                ? "내가 이미 지원한 알바에요."
                : "지원하기"}
            </button>
            <HeartIcon
              className={`${isClosed ? "inactivated" : ""} ${
                myInterested ? "selected" : ""
              }`}
              onClick={onHeartClick}
            />
          </>
        )}
      </div>
      {markAndUnmarkFinalError && (
        <WarningText>{markAndUnmarkFinalError.message}</WarningText>
      )}
    </InteractionContainer>
  );
};

export default Interaction;
