import React from "react";
import { ProfileContainer } from "../../styles/MyPage.styles.ts";
import { ReactComponent as ProfileIcon } from "../../assets/icons/profile.svg";

const Profile = () => {
  return (
    <ProfileContainer>
      <div className="userInfo">
        <ProfileIcon />
        <div className="textInfo">
          <div className="nickname">조하</div>
          <div className="subInfo">기산동 ㆍ 우주알바와 함께한지 6개월</div>
        </div>
      </div>
      <button className="editButton">정보 수정</button>
    </ProfileContainer>
  );
};

export default Profile;