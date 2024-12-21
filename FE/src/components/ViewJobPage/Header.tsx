import React from "react";
import { HeaderContainer } from "../../styles/ViewJobPage.styles";
import { JOB_TYPES } from "../../constants/constants";
import { JobPost } from "../../pages/ViewJobPage.tsx";

type HeaderProps = {
  jobPost: JobPost;
};

const Header: React.FC<HeaderProps> = ({ jobPost }) => {
  const { jobDescription, title, createdAt, views, applicationCount } = jobPost;

  const interestCount = 8; // TODO : 임시 하드 코딩

  return (
    <HeaderContainer>
      <div className="jobTypesContainer">
        {jobDescription.map((type) => (
          <div key={type} className="jobType">
            {JOB_TYPES[type]}
          </div>
        ))}
      </div>
      <div className="title">{title}</div>
      <div className="subInfo">
        {`${createdAt} 전  ·  조회 ${views}  ·  관심 ${interestCount} · 지원 ${applicationCount}`}
      </div>
    </HeaderContainer>
  );
};

export default Header;
