import React from "react";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";
import { InteractionContainer } from "../../styles/ViewJobPage.styles";
import { JOB_POST_STATUS } from "../../constants/constants";

type InteractionProps = {
  postStatus: string;
  alreadyApplied: boolean;
  displayApplicationModal: () => void;
};

const Interaction: React.FC<InteractionProps> = (props) => {
  const { postStatus, alreadyApplied, displayApplicationModal } = props;

  return (
    <InteractionContainer>
      <div className="interaction">
        <button
          className={`applyButton ${alreadyApplied ? "inactivated" : ""}`}
          disabled={alreadyApplied}
          onClick={displayApplicationModal}
        >
          {postStatus === JOB_POST_STATUS.CLOSE
            ? "마감된 알바에요."
            : alreadyApplied
            ? "내가 이미 지원한 알바에요."
            : "지원하기"}
        </button>
        <HeartIcon />
      </div>
    </InteractionContainer>
  );
};

export default Interaction;
