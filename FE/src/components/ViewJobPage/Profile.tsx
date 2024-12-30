import React from "react";
import { ProfileContainer } from "../../styles/ViewJobPage.styles";
import { ReactComponent as UserProfileIcon } from "../../assets/icons/profile.svg";
import useViewJobContext from "../../context/ViewJobContext.tsx";

const Profile = () => {
  const { jobPost } = useViewJobContext();

  if (!jobPost?.publisher) return null;
  return (
    <ProfileContainer>
      <UserProfileIcon />
      <div className="userInfo">
        <div className="nickname">{jobPost.publisher.nickname}</div>
        <div className="timeTogether">
          우주알바와 함께한지 {jobPost.publisher.createdAt} 전
        </div>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
