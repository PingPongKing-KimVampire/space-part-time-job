import React from "react";
import { ReactComponent as HeartIcon } from "../../assets/icons/heart.svg";
import { InteractionContainer } from "../../styles/ViewJobPage.styles.ts";

type InteractionProps = {
  views: number;
  interests: number;
};

const Interaction: React.FC<InteractionProps> = ({ views, interests }) => {
  return (
    <InteractionContainer>
      <div className="info">
        조회 {views} ㆍ 관심 {interests}
      </div>
      <div className="interaction">
        <button className="applyButton">지원하기</button>
        <HeartIcon />
      </div>
    </InteractionContainer>
  );
};

export default Interaction;
