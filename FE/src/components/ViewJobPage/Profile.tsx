import React from "react";
import { ProfileContainer } from "../../styles/ViewJobPage.styles";
import { ReactComponent as UserProfileIcon } from "../../assets/icons/profile.svg";

type ProfileProps = {
  nickname: string;
  timeTogether: string;
};

const Profile: React.FC<ProfileProps> = ({ nickname, timeTogether }) => {
  return (
    <ProfileContainer>
      <UserProfileIcon />
      <div className="userInfo">
        <div className="nickname">{nickname}</div>
        <div className="timeTogether">우주알바와 함께한지 {timeTogether}</div>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
