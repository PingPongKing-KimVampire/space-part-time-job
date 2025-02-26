import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useQuery } from "@apollo/client";
import { GET_MY_BASIC_INFO } from "../../api/graphql/queries.js";
import { processGetMyBasicInfo } from "../../api/graphql/processData";
import formatTimeAgo from "../../utils/formatTimeAgo";
import { Neighborhood, ApiState } from "../../types/types";
import { fetchResidentNeighborhoods } from "../../redux/residentNeighborhoods";
import { ReactComponent as LocationIcon } from "../../assets/icons/location.svg";
import { ReactComponent as ClockIcon } from "../../assets/icons/clock.svg";
import { ERROR } from "../../constants/constants";
import { ProfileInfoContainer } from "../../styles/pages/MyPage.styles";

type ProfileInfoProp = {
  setWarning: React.Dispatch<React.SetStateAction<string>>;
};

const ProfileInfo: React.FC<ProfileInfoProp> = ({ setWarning }) => {
  const dispatch = useDispatch();
  const [neighborhoodNames, setNeighborhoodNames] = useState<string[]>([]);

  // 사용자 닉네임, 우주알바 가입 기간 정보 불러오기
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
      return { nickname: "-", timeTogether: "-" };
    }
  }, [myBasicInfo]);
  const isBasicInfoFetched = useMemo(
    () => !fetchMyBasicInfoLoading && !fetchMyBasicInfoError,
    [fetchMyBasicInfoLoading, fetchMyBasicInfoError]
  );

  // 사용자 상주 지역 정보 불러오기
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
  const isResidentFetched = useMemo(
    () =>
      !fetchResidentNeighborhoodsLoading && !fetchResidentNeighborhoodsError,
    [fetchResidentNeighborhoodsLoading, fetchResidentNeighborhoodsError]
  );

  useEffect(() => {
    if (fetchMyBasicInfoError || fetchResidentNeighborhoodsError)
      setWarning(ERROR.SERVER);
  }, [fetchMyBasicInfoError, fetchResidentNeighborhoodsError]);

  return (
    <ProfileInfoContainer>
      <div className={`nickname ${!isBasicInfoFetched ? "loading" : ""}`}>
        {!isBasicInfoFetched ? "\u00A0".repeat(15) : nickname}
      </div>
      <div className="iconInfo">
        <LocationIcon />
        <div className={!isResidentFetched ? "loading" : ""}>
          {!isResidentFetched
            ? "\u00A0".repeat(30)
            : neighborhoodNames.join(" · ")}
        </div>
      </div>
      <div className="iconInfo">
        <ClockIcon />
        <div className={!isBasicInfoFetched ? "loading" : ""}>
          {!isBasicInfoFetched
            ? "\u00A0".repeat(30)
            : `우주알바와 함께한지 ${timeTogether}`}
        </div>
      </div>
    </ProfileInfoContainer>
  );
};

export default ProfileInfo;
