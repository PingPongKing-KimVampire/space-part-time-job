import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { logout } from "../../api/rest/auth";
import { ProfileContainer } from "../../styles/pages/MyPage.styles";
import { ReactComponent as ProfileIcon } from "../../assets/icons/profile.svg";
import { GET_MY_BASIC_INFO } from "../../api/graphql/queries.js";
import { processGetMyBasicInfo } from "../../api/graphql/processData";
import formatTimeAgo from "../../utils/formatTimeAgo";

const Profile = () => {
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_MY_BASIC_INFO);
  const { nickname = "", timeTogether = "" } = useMemo(() => {
    if (!data) return {};
    try {
      const { nickname, createdAt } = processGetMyBasicInfo(data);
      return { nickname, timeTogether: formatTimeAgo(createdAt)}
    } catch {
      return { nickname: "불러오기 실패", timeTogether: "불러오기 실패" };
    }
  }, [data]);

  const [logoutError, setLogoutError] = useState(false);

  const onLogoutClick = async () => {
    try {
      await logout();
    } catch (e) {
      console.log("Logout Error", e.message);
      setLogoutError(true);
      return;
    }
    navigate("/login");
  };

  if (loading || error || logoutError) return null;
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
