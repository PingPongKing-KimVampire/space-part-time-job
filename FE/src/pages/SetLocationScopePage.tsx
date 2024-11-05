import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as XmarkIcon } from "../assets/icons/x-mark.svg";
import { ReactComponent as PlusIcon } from "../assets/icons/plus.svg";
import {
  Background,
  Container,
  ScopeSettingContainer,
  LocationsContainer,
  PlusButton,
  ScopeSlider,
  SliderContainer,
  CompleteButton,
} from "../styles/SetLocationScopePage.styles.ts";

const SetLocationScopePage = () => {
  const location = useLocation();
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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const locationsParam = queryParams.get("locations");
    setLocations(locationsParam ? locationsParam.split(",") : []);
    setSelectedLocation(locationsParam ? locationsParam.split(",")[0] : "");
  }, [location.search]);

  useEffect(() => {
    setScopeLevel((prev) => {
      return locations.reduce((result, location) => {
        result[location] = prev[location] || "1";
        return result;
      }, {});
    });
  }, [locations]);

  const onLocationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const locationClicked = e.currentTarget.textContent || "";
    setSelectedLocation(locationClicked);
  };

  const onXClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const locationClicked = e.currentTarget.getAttribute("data-location") || "";
    navigate(
      `?locations=${locations.filter((loc) => loc !== locationClicked)}`
    );
  };

  const onSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScopeLevel((state) => ({
      ...state,
      [selectedLocation]: e.target.value,
    }));
  };

  const onSliderMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const calculateLevel = (value) => {
      if (value <= 50) return "0";
      if (value <= 150) return "100";
      if (value <= 250) return "200";
      return "300";
    };

    const level = calculateLevel(e.currentTarget.value);
    setScopeLevel((state) => ({
      ...state,
      [selectedLocation]: level,
    }));
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
              <PlusButton
                onClick={() =>
                  navigate(`/search-location?locations=${locations.join(",")}`)
                }
              >
                <PlusIcon />
              </PlusButton>
            )}
          </LocationsContainer>
          <SliderContainer>
            <ScopeSlider
              type="range"
              min="0"
              max="300"
              step="1"
              value={scopeLevel[selectedLocation] || "0"}
              onChange={onSliderChange}
              onMouseUp={onSliderMouseUp}
            />
            <div className="markers">
              <div className="marker" style={{ left: "0%" }} />
              <div className="marker" style={{ left: "33.33%" }} />
              <div className="marker" style={{ left: "66.66%" }} />
              <div className="marker" style={{ left: "100%" }} />
            </div>
            <div className="label left">가까운 동네</div>
            <div className="label right">먼 동네</div>
          </SliderContainer>
        </ScopeSettingContainer>
        <CompleteButton className={!locations.length ? "inactivated" : ""}>
          완료
        </CompleteButton>
      </Container>
    </Background>
  );
};

export default SetLocationScopePage;
