import React from "react";
import { HeaderContainer } from "../../styles/ViewJobPage.styles";
import { JOB_TYPES } from "../../constants/constants";

type HeaderProps = {
  jobTypes: string[];
  title: string;
  postTime: string;
  viewCount: number;
  interestCount: number;
};

const Header: React.FC<HeaderProps> = (props) => {
  const { jobTypes, title, postTime, viewCount, interestCount } = props;
  return (
    <HeaderContainer>
      <div className="jobTypesContainer">
        {jobTypes.map((type) => (
          <div key={type} className="jobType">
            {JOB_TYPES[type]}
          </div>
        ))}
      </div>
      <div className="title">{title}</div>
      <div className="subInfo">
        {`${postTime} 전  ·  조회 ${viewCount}  ·  관심 ${interestCount}`}
      </div>
    </HeaderContainer>
  );
};

export default Header;
