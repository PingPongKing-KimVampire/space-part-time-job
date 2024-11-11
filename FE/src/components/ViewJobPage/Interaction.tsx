import React from "react";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";
import { InteractionContainer } from "../../styles/ViewJobPage.styles.ts";

const Interaction = () => {
  return (
    <InteractionContainer>
      <div className="interaction">
        <button className="applyButton">지원하기</button>
        <HeartIcon />
      </div>
    </InteractionContainer>
  );
};

export default Interaction;
