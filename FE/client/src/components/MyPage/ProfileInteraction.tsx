import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../api/rest/auth";
import { ERROR } from "../../constants/constants";
import { ProfileInteractionContainer } from "../../styles/pages/MyPage.styles";

type ProfileInteractionProp = {
  setWarning: React.Dispatch<React.SetStateAction<string>>;
};

const ProfileInteraction = ({ setWarning }: ProfileInteractionProp) => {
  const navigate = useNavigate();

  const onLogoutClick = async () => {
    try {
      await logout();
    } catch (e) {
      console.log("Logout Error", e.message);
      setWarning(ERROR.SERVER);
      return;
    }
    navigate("/login");
  };

  const onResetNeighborhoodsClick = () => {
    navigate("/search-neighborhood");
  };

  return (
    <ProfileInteractionContainer>
      <button className="logoutButton" onClick={onLogoutClick}>
        로그아웃
      </button>
      <button
        className="resetNeighborhoodsButton"
        onClick={onResetNeighborhoodsClick}
      >
        지역 재설정
      </button>
    </ProfileInteractionContainer>
  );
};

export default ProfileInteraction;
