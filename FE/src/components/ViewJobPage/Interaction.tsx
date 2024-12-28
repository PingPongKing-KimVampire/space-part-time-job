import React, { useMemo } from "react";
import { useMutation } from "@apollo/client";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";
import { InteractionContainer } from "../../styles/ViewJobPage.styles";
import { JOB_POST_STATUS, APPLICATION_STATUS } from "../../constants/constants";
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

  const isApplied = useMemo(
    () =>
      jobPost.myJobApplication.some(
        (application) => application.status === APPLICATION_STATUS.PENDING
      ),
    [jobPost]
  );

  const [markInterest, { loading: markLoading, error: markError }] =
    useMutation(MARK_JOB_POST_AS_INTEREST);
  const [unmarkInterest, { loading: unmarkLoading, error: unmarkError }] =
    useMutation(UNMARK_JOB_POST_AS_INTEREST);
  const onHeartClick = async () => {
    if (!jobPost.myInterested && jobPost.status === JOB_POST_STATUS.CLOSE)
      return; // 마감한 알바라면 mark는 불가능함
    const mutation = jobPost.myInterested ? unmarkInterest : markInterest;
    try {
      const response = await mutation({ variables: { jobPostId: jobPost.id } });
      if (!response?.data) return;
      const responsePost = response.data.markJobPostAsInterest;
      setJobPost((state) => ({
        ...state,
        myInterested: jobPost.myInterested ? null : responsePost.myInterested,
        interestedCount: responsePost.interestedCount,
      }));
    } catch (e) {
      console.log(e);
    }
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
        <HeartIcon
          className={`${
            jobPost.status === JOB_POST_STATUS.CLOSE ? "inactivated" : ""
          } ${jobPost.myInterested ? "selected" : ""}`}
          onClick={onHeartClick}
        />
      </div>
    </InteractionContainer>
  );
};

export default Interaction;
