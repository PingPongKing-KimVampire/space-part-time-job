import React, { useMemo } from "react";
import { useMutation } from "@apollo/client";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";
import { InteractionContainer } from "../../styles/ViewJobPage.styles";
import { JOB_POST_STATUS } from "../../constants/constants";
import { JobPost } from "../../pages/ViewJobPage.tsx";
import {
  UNMARK_JOB_POST_AS_INTEREST,
  MARK_JOB_POST_AS_INTEREST,
} from "../../graphql/mutations.js";

type InteractionProps = {
  jobPost: JobPost;
  setJobPost: React.Dispatch<React.SetStateAction<JobPost>>;
  displayApplicationModal: () => void;
};

const Interaction: React.FC<InteractionProps> = (props) => {
  const { jobPost, setJobPost, displayApplicationModal } = props;

  const isApplied = useMemo(() => jobPost.myJobApplication !== null, [jobPost]);

  const [
    markInterest,
    { loading: markInterestLoading, error: markInterestError },
  ] = useMutation(MARK_JOB_POST_AS_INTEREST);
  const onHeartClick = async () => {
    // TODO : jobPost의 myInterested 필드를 보고 mark를 할지, unmark를 할지 결정해야 함
    const response = await markInterest({
      variables: { jobPostId: jobPost.id },
    });
    if (!response || !response.data) return;
    // TODO : 응답 받은 값으로 jobPost의 myInterested 세팅하기
  };

  return (
    <InteractionContainer>
      <div className="interaction">
        <button
          className={`applyButton ${isApplied ? "inactivated" : ""}`}
          disabled={isApplied}
          onClick={displayApplicationModal}
        >
          {jobPost.status === JOB_POST_STATUS.CLOSE
            ? "마감된 알바에요."
            : isApplied
            ? "내가 이미 지원한 알바에요."
            : "지원하기"}
        </button>
        <HeartIcon />
      </div>
    </InteractionContainer>
  );
};

export default Interaction;
