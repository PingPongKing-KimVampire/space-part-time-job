import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createStitches } from "@stitches/react";
import {
  MainButtonStyle,
  MainColor,
  OptionButtonStyle,
} from "../styles/global.ts";
import { ReactComponent as XmarkIcon } from "../assets/icons/x-mark.svg";
import { ReactComponent as PlusIcon } from "../assets/icons/plus.svg";

const { styled } = createStitches();

const Background = styled("div", {
  background: "white",
  height: "100%",
  width: "100%",
  position: "relative",
});

const Container = styled("div", {
  width: "700px",
  position: "absolute",
  bottom: "40px",
  left: "50%",
  transform: "translateX(-50%)",
});

const ScopeSettingContainer = styled("div", {
  width: "100%",
  background: "white",
  padding: "25px",
  borderRadius: "16px",
  border: "1px solid #E3E9ED",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
  boxSizing: "border-box",
  marginBottom: "20px",
});

const LocationsContainer = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  gap: "7px",
  height: "55px",
  "& .locationButton": {
    ...OptionButtonStyle,
    textAlign: "left",
    borderRadius: "9px",
    width: "32%",
    "& svg": {
      position: "absolute",
      height: "50%",
      strokeWidth: "1",
      top: "50%",
      transform: "translateY(-50%)",
      right: "10px",
    },
    "&:not(.selected)": {
      "& svg": {
        color: MainColor,
      },
    },
  },
});

const PlusButton = styled("button", {
  padding: "16px",
  cursor: "pointer",
  background: "#EDEDED",
  color: "#B0B0B0",
  borderRadius: "9px",
  width: "32%",
  border: `0.9px solid #EDEDED`,
  position: "relative",
  "& svg": {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translateY(-50%) translateX(-50%)",
    height: "60%",
    strokeWidth: "1.3",
    color: "#7C7C7C",
  },
  transition: "background 0.2s",
  "&:hover": {
    background: "#E4E4E4",
  },
});

const CompleteButton = styled("button", {
  width: "100%",
  ...MainButtonStyle,
});

const SetLocationScopePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const locationsParam = queryParams.get("locations");
    setLocations(locationsParam ? locationsParam.split(",") : []);
    setSelectedLocation(locationsParam ? locationsParam.split(",")[0] : "");
  }, [location.search]);

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

  return (
    <Background>
      <Container>
        <ScopeSettingContainer>
          <LocationsContainer>
            {locations.map((location) => (
              <button
                className={`locationButton ${
                  selectedLocation === location ? "selected" : ""
                }`}
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
        </ScopeSettingContainer>
        <CompleteButton>완료</CompleteButton>
      </Container>
    </Background>
  );
};

export default SetLocationScopePage;
