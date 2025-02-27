import React from "react";
import { ProfileContainer } from "../../styles/pages/ViewJobPage.styles";
import { ReactComponent as UserProfileIcon } from "../../assets/icons/profile.svg";
import useViewJobContext from "../../context/ViewJobContext";

const Profile = () => {
  const { jobPost } = useViewJobContext();

  return (
    <ProfileContainer>
      <UserProfileIcon />
      <div className="userInfo">
        <div className="nickname">{jobPost.publisher?.nickname || "-"}</div>
        <div className="timeTogether">
          우주알바와 함께한지 {jobPost.publisher?.createdAt || "-"}
        </div>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
