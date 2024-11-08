import React from "react";
import { ProfileContainer } from "../../styles/ViewJobPage.styles.ts";
import { ReactComponent as UserProfileIcon } from "../../assets/icons/profile.svg";

type ProfileProps = {
  nickname: string;
  timeTogether: string; // TODO: 시간만 받아서 가공하는 방식으로 변경될 예정
};

const Profile: React.FC<ProfileProps> = ({ nickname, timeTogether }) => {
  return (
    <ProfileContainer>
      <UserProfileIcon />
      <div className="userInfo">
        <div className="nickname">{nickname}</div>
        <div className="timeTogether">{timeTogether}</div>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
