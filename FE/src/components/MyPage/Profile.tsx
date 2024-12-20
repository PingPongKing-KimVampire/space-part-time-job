import React from "react";
import { ProfileContainer } from "../../styles/MyPage.styles";
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
      <button
        className="logoutButton"
        onClick={() => {
          // TODO : 로그아웃 구현하기
        }}
      >
        로그아웃
      </button>
    </ProfileContainer>
  );
};

export default Profile;
