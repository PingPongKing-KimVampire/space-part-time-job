import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as XmarkIcon } from "../assets/icons/x-mark.svg";
import { ReactComponent as PlusIcon } from "../assets/icons/plus.svg";
import {
  Background,
  Container,
  ScopeSettingContainer,
  LocationsContainer,
  PlusButton,
  CompleteButton,
} from "../styles/SetLocationScopePage.styles.ts";
import LevelSlider from "../components/SetLocationScopePage/LevelSlider.tsx";

const SetLocationScopePage = () => {
  const navigate = useNavigate();
  const mapContainerRef = useRef(null);

  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [scopeLevel, setScopeLevel] = useState<Record<string, string>>({}); // 지역과 레벨 매핑

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심 좌표
      level: 3, //지도의 레벨(확대, 축소 정도)
    };
    const map = new kakao.maps.Map(mapContainerRef.current, options);
  }, []);

  // 마운트될 때 세션 스토리지에서 locations 값 가져와서 locations 세팅
  useEffect(() => {
    const placeSaved = sessionStorage.getItem("locations") || "";
    if (placeSaved) {
      const placeParsed = JSON.parse(placeSaved);
      setLocations(JSON.parse(placeSaved));
      setSelectedLocation(placeParsed.length ? placeParsed[0] : "");
    }
  }, []);

  useEffect(() => {
    setScopeLevel(
      locations.reduce((result, location) => {
        result[location] = "0";
        return result;
      }, {})
    );
    if (!locations.includes(selectedLocation))
      setSelectedLocation(locations.length ? locations[0] : "");
  }, [locations]);

  const onLocationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const locationClicked = e.currentTarget.textContent || "";
    setSelectedLocation(locationClicked);
  };

  const onXClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const locationClicked = e.currentTarget.getAttribute("data-location") || "";
    setLocations((state) => state.filter((loc) => loc !== locationClicked));
  };

  const onPlusClick = () => {
    // 현재 locations 값을 세션 스토리지에 저장하고 동 검색 페이지로 돌아가기
    sessionStorage.setItem("locations", JSON.stringify(locations));
    navigate("/search-location");
  };

  const onCompleteButtonClick = () => {
    sessionStorage.clear();
    // TODO : 알바 조회 페이지로 이동
  };

  return (
    <Background>
      <div className="mapContainer" ref={mapContainerRef} />
      <Container>
        <ScopeSettingContainer>
          <LocationsContainer>
            {locations.map((location) => (
              <button
                className={`locationButton ${
                  selectedLocation === location ? "selected" : ""
                }`}
                key={location}
                onClick={onLocationClick}
              >
                {location}
                <XmarkIcon data-location={location} onClick={onXClick} />
              </button>
            ))}
            {locations.length < 3 && (
              <PlusButton onClick={onPlusClick}>
                <PlusIcon />
              </PlusButton>
            )}
          </LocationsContainer>
          <LevelSlider
            level={4}
            value={scopeLevel[selectedLocation]}
            setValue={(value: string) => {
              setScopeLevel((state) => ({
                ...state,
                [selectedLocation]: value,
              }));
            }}
          />
        </ScopeSettingContainer>
        <CompleteButton
          className={!locations.length ? "inactivated" : ""}
          onClick={onCompleteButtonClick}
        >
          완료
        </CompleteButton>
      </Container>
    </Background>
  );
};

export default SetLocationScopePage;
