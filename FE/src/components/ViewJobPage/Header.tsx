import React from "react";
import { HeaderContainer } from "../../styles/ViewJobPage.styles.ts";

type HeaderProps = {
  jobTypes: string[];
  title: string;
  postTime: string; // TODO: 시간만 받아서 가공하는 방식으로 변경될 예정
};

const Header: React.FC<HeaderProps> = (props) => {
  const { jobTypes, title, postTime } = props;
  return (
    <HeaderContainer>
      <div className="jobTypesContainer">
        {jobTypes.map((type) => (
          <div key={type} className="jobType">
            {type}
          </div>
        ))}
      </div>
      <div className="title">{title}</div>
      <div className="postTime">{postTime}</div>
    </HeaderContainer>
  );
};

export default Header;
