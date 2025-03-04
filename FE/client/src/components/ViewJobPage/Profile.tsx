import React from "react";
import { ProfileContainer } from "../../styles/pages/ViewJobPage.styles";
import { ReactComponent as UserProfileIcon } from "../../assets/icons/profile.svg";
import useViewJobContext from "../../context/ViewJobContext";
import { SPACE } from "../../constants/constants";

const Profile = () => {
  const { jobPost, getJobPostLoading } = useViewJobContext();

  return (
    <ProfileContainer>
      <UserProfileIcon />
      <div className="userInfo">
        {getJobPostLoading ? (
          <div className="nickname loading">{SPACE.repeat(15)}</div>
        ) : (
          <div className="nickname">{jobPost.publisher?.nickname || "-"}</div>
        )}
        {getJobPostLoading ? (
          <div className="timeTogether loading">{SPACE.repeat(30)}</div>
        ) : (
          <div className="timeTogether">
            우주알바와 함께한지 {jobPost.publisher?.createdAt || "-"}
          </div>
        )}
      </div>
    </ProfileContainer>
  );
};

export default Profile;
