import React from "react";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";
import { InteractionContainer } from "../../styles/ViewJobPage.styles";

type InteractionProps = {
  alreadyApplied: boolean;
  displayApplicationModal: () => void;
};

const Interaction: React.FC<InteractionProps> = (props) => {
  const { alreadyApplied, displayApplicationModal } = props;
  return (
    <InteractionContainer>
      <div className="interaction">
        <button
          className={`applyButton ${alreadyApplied ? "inactivated" : ""}`}
          disabled={alreadyApplied}
          onClick={displayApplicationModal}
        >
          {alreadyApplied ? "내가 이미 지원한 알바에요." : "지원하기"}
        </button>
        <HeartIcon />
      </div>
    </InteractionContainer>
  );
};

export default Interaction;
