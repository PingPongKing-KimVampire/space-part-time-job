import React, { useState, useEffect } from "react";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import CustomInput from "../components/CustomInput.tsx";
import {
  Background,
  Container,
  SearchResultBox,
  NextButton,
} from "../styles/LocationSearchPage.styles.ts";
import { WarningText } from "../styles/global.ts";

const SEARCH_RESULT = [
  // 임히 하드코딩 데이터
  "기산동",
  "대치동",
  "개포동",
  "도곡동",
  "역삼동",
  "신사동",
  "동탄동",
  "병점동",
  "병점동",
  "병점동",
  "병점동",
  "병점동",
  "병점동",
  "병점동",
];

const LocationSearchPage = () => {
  useBackgroundColor("#F9FBFC");
  const [locations, setLocations] = useState<string[]>([]);
  const [warning, setWarning] = useState<string>("");

  const onLocationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const locationClicked = e.currentTarget.textContent || "";
    if (locations.includes(locationClicked)) {
      setLocations((state) =>
        state.filter((location) => location !== locationClicked)
      );
    } else {
      setLocations((state) => state.concat(locationClicked));
    }
  };

  useEffect(() => {
    const newWarning =
      locations.length > 3
        ? "* 최소 1개부터 최대 3개까지의 동을 선택할 수 있어요."
        : "";
    setWarning(newWarning);
  }, [locations]);

  return (
    <Background>
      <Container>
        <label className="title" htmlFor="neighborhood">
          상주하는 지역을 선택해주세요.
        </label>
        <div className="searchContainer">
          <CustomInput
            id="neighborhood"
            placeholder="상주하는 동을 입력하세요. ex) 개포동, 대치동"
            value=""
          />
          <SearchResultBox>
            {SEARCH_RESULT.map((location) => {
              const selected = locations.includes(location) ? "selected" : "";
              return (
                <button
                  className={`searchItem ${selected}`}
                  onClick={onLocationClick}
                >
                  {location}
                </button>
              );
            })}
          </SearchResultBox>
        </div>
        <WarningText>{warning}</WarningText>
        <NextButton
          className={
            locations.length < 1 || 3 < locations.length ? "inactivated" : ""
          }
        >
          다음
        </NextButton>
      </Container>
    </Background>
  );
};

export default LocationSearchPage;
