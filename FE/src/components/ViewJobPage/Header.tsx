import React from "react";
import { HeaderContainer } from "../../styles/pages/ViewJobPage.styles";
import { CloseTag } from "../../styles/global.ts";
import { JOB_POST_STATUS, JOB_TYPES } from "../../constants/constants";
import useViewJobContext from "../../context/ViewJobContext.tsx";

const Header = () => {
  const { jobPost } = useViewJobContext();
  const {
    jobDescription = [],
    status,
    title,
    createdAt,
    views,
    applicationCount,
    interestedCount,
  } = jobPost;

  return (
    <HeaderContainer>
      <div className="jobTypesContainer">
        {jobDescription.map((type) => (
          <div key={type} className="jobType">
            {JOB_TYPES[type]}
          </div>
        ))}
      </div>
      <div className="title">
        {status === JOB_POST_STATUS.CLOSE && <CloseTag>마감</CloseTag>}
        {title}
      </div>
      <div className="subInfo">
        {`${createdAt} 전  ·  조회 ${views}  ·  관심 ${interestedCount}  ·  지원 ${applicationCount}`}
      </div>
    </HeaderContainer>
  );
};

export default Header;
