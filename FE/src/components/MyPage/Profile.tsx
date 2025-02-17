import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { logout } from "../../api/rest/auth";
import { ProfileContainer } from "../../styles/pages/MyPage.styles";
import { ReactComponent as ProfileIcon } from "../../assets/icons/profile.svg";
import { ReactComponent as LocationIcon } from "../../assets/icons/location.svg";
import { ReactComponent as ClockIcon } from "../../assets/icons/clock.svg";
import { GET_MY_BASIC_INFO } from "../../api/graphql/queries.js";
import { processGetMyBasicInfo } from "../../api/graphql/processData";
import formatTimeAgo from "../../utils/formatTimeAgo";
import { Neighborhood, ApiState } from "../../types/types";
import { fetchResidentNeighborhoods } from "../../redux/residentNeighborhoods";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [neighborhoodNames, setNeighborhoodNames] = useState([]);
  const [logoutError, setLogoutError] = useState(false);

  const {
    data: myBasicInfo,
    loading: fetchMyBasicInfoLoading,
    error: fetchMyBasicInfoError,
  } = useQuery(GET_MY_BASIC_INFO);
  const { nickname = "", timeTogether = "" } = useMemo(() => {
    if (!myBasicInfo) return {};
    try {
      const { nickname, createdAt } = processGetMyBasicInfo(myBasicInfo);
      return { nickname, timeTogether: formatTimeAgo(createdAt) };
    } catch {
      return { nickname: "불러오기 실패", timeTogether: "불러오기 실패" };
    }
  }, [myBasicInfo]);

  const {
    data: residentNeighborhoods,
    loading: fetchResidentNeighborhoodsLoading,
    error: fetchResidentNeighborhoodsError,
  } = useSelector(
    (state: { residentNeighborhoods: ApiState<Neighborhood[]> }) =>
      state.residentNeighborhoods
  );
  useEffect(() => {
    if (Object.keys(residentNeighborhoods).length === 0) {
      // TODO : 빨간 줄 해결하기
      dispatch(fetchResidentNeighborhoods());
      return;
    }
    setNeighborhoodNames(
      Object.values(residentNeighborhoods).map(
        (neighborhood) => neighborhood.name
      )
    );
  }, [residentNeighborhoods]);

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

  const onResetNeighborhoodsClick = () => {
    navigate("/search-neighborhood");
  };

  if (
    fetchMyBasicInfoLoading ||
    fetchResidentNeighborhoodsLoading ||
    fetchMyBasicInfoError ||
    fetchResidentNeighborhoodsError ||
    logoutError
  )
    return null;
  return (
    <ProfileContainer>
      <div className="userInfo">
        <ProfileIcon />
        <div className="textInfo">
          <div className="nickname">{nickname}</div>
          <div className="iconInfo">
            <LocationIcon />
            <div className="neighborhoods">{neighborhoodNames.join(" · ")}</div>
          </div>
          <div className="iconInfo">
            <ClockIcon />
            <div className="timeTogether">
              우주알바와 함께한지 {timeTogether}
            </div>
          </div>
        </div>
      </div>
      <div className="buttons">
        <button className="logoutButton" onClick={onLogoutClick}>
          로그아웃
        </button>
        <button
          className="resetNeighborhoodsButton"
          onClick={onResetNeighborhoodsClick}
        >
          지역 재설정
        </button>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
