import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { logout } from "../../api/rest/auth.ts";
import { ProfileContainer } from "../../styles/MyPage.styles";
import { ReactComponent as ProfileIcon } from "../../assets/icons/profile.svg";
import { GET_MY_BASIC_INFO } from "../../api/graphql/queries.js";
import formatTimeAgo from "../../utils/formatTimeAgo.ts";

const Profile = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_MY_BASIC_INFO);
  const { nickname = "", timeTogether = "" } = useMemo(() => {
    if (!data) return {};
    return {
      nickname: data.me.nickname,
      timeTogether: formatTimeAgo(data.me.createdAt),
    };
  }, [data]);

  const onLogoutClick = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e);
      return;
    }
    navigate("/login");
  };

  if (loading) return null;
  return (
    <ProfileContainer>
      <div className="userInfo">
        <ProfileIcon />
        <div className="textInfo">
          <div className="nickname">{nickname}</div>
          <div className="timeTogether">우주알바와 함께한지 {timeTogether}</div>
        </div>
      </div>
      <button className="logoutButton" onClick={onLogoutClick}>
        로그아웃
      </button>
    </ProfileContainer>
  );
};

export default Profile;
