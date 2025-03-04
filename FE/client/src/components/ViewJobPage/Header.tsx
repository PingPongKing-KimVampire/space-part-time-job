import { HeaderContainer } from "../../styles/pages/ViewJobPage.styles";
import { CloseTag } from "../../styles/global";
import { JOB_POST_STATUS, JOB_TYPES, SPACE } from "../../constants/constants";
import useViewJobContext from "../../context/ViewJobContext";

const Header = () => {
  const { jobPost, getJobPostLoading } = useViewJobContext();
  const {
    jobCategories = [],
    status,
    title,
    createdAt,
    views,
    applicationCount,
    interestedCount,
  } = jobPost;

  if (getJobPostLoading) {
    return (
      <HeaderContainer>
        <div className="jobTypesContainer">
          <div className="jobType loading">{SPACE.repeat(20)}</div>
          <div className="jobType loading">{SPACE.repeat(20)}</div>
          <div className="jobType loading">{SPACE.repeat(20)}</div>
        </div>
        <div className="title loading">{SPACE.repeat(100)}</div>
        <div className="subInfo loading">{SPACE.repeat(50)}</div>
      </HeaderContainer>
    );
  }
  return (
    <HeaderContainer>
      <div className="jobTypesContainer">
        {jobCategories.map((type) => (
          <div key={type} className="jobType">
            {JOB_TYPES[type]}
          </div>
        ))}
      </div>
      <div className="title">
        {status === JOB_POST_STATUS.CLOSE && (
          <CloseTag className="inViewJob">마감</CloseTag>
        )}
        <div className="titleText">{title}</div>
      </div>
      <div className="subInfo">
        {`${createdAt} 전  ·  조회 ${views}  ·  관심 ${interestedCount}  ·  지원 ${
          applicationCount === null ? "-" : applicationCount
        }`}
      </div>
    </HeaderContainer>
  );
};

export default Header;
