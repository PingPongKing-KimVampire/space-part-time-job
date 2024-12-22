import React from "react";
import { useNavigate } from "react-router-dom";
import { requestLogout } from "../../utils/apiRequest.ts";
import { ProfileContainer } from "../../styles/MyPage.styles";
import { ReactComponent as ProfileIcon } from "../../assets/icons/profile.svg";

const Profile = () => {
  const navigate = useNavigate();

  const onLogoutClick = async () => {
    try {
      await requestLogout();
    } catch (e) {
      console.log(e);
      return;
    }
    navigate("/login");
  };

  return (
    <ProfileContainer>
      <div className="userInfo">
        <ProfileIcon />
        <div className="textInfo">
          <div className="nickname">조하</div>
          <div className="subInfo">기산동 ㆍ 우주알바와 함께한지 6개월</div>
        </div>
      </div>
      <button className="logoutButton" onClick={onLogoutClick}>
        로그아웃
      </button>
    </ProfileContainer>
  );
};

export default Profile;
