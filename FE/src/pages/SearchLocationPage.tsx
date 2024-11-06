import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import {
  Background,
  Container,
  NextButton,
} from "../styles/SearchLocationPage.styles.ts";
import SearchBox from "../components/SearchBox.tsx";

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
  "압구정동",
  "홍대동",
  "삼성동",
  "이태원동",
  "청담동",
  "성수동",
  "쌍문동",
  "상암동",
  "신림동",
];

const SearchLocationPage = () => {
  useBackgroundColor("#F9FBFC");
  const navigate = useNavigate();

  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    // 세션 스토리지에 place가 있으면 locations로 세팅
    const placeSaved = sessionStorage.getItem("locations") || "";
    if (placeSaved) setLocations(JSON.parse(placeSaved));
  }, []);

  const onLocationClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const locationClicked = e.currentTarget.textContent || "";
    if (locations.includes(locationClicked)) {
      setLocations((state) => state.filter((loc) => loc !== locationClicked));
    } else {
      setLocations((state) => state.concat(locationClicked));
    }
  };

  const searchResultElements = useMemo(() => {
    return SEARCH_RESULT.map((location) => {
      const selected = locations.includes(location);
      const inactivated = !selected && 3 <= locations.length;
      return (
        <button
          className={`searchItem ${selected ? "selected" : ""} ${
            inactivated ? "inactivated" : ""
          }`}
          key={location}
          onClick={onLocationClick}
          disabled={inactivated}
        >
          {location}
        </button>
      );
    });
  }, [locations, onLocationClick]);

  const isAllValid = useMemo(() => {
    return 1 <= locations.length && locations.length <= 3;
  }, [locations]);

  const onNextClick = () => {
    // locations 값을 세션 스토리지에 저장하고 동네 범위 설정 페이지로 이동
    sessionStorage.setItem("locations", JSON.stringify(locations));
    navigate("/set-location-scope");
  };

  return (
    <Background>
      <Container>
        <label className="title" htmlFor="neighborhood">
          상주하는 지역을 최대 3개 선택해주세요.
        </label>
        <SearchBox
          placeholder="상주하는 동을 입력하세요. ex) 개포동, 대치동"
          searchResult={searchResultElements}
          style={{ height: "420px" }}
        />
        <NextButton
          className={!isAllValid ? "inactivated" : ""}
          onClick={onNextClick}
          disabled={!isAllValid}
        >
          다음
          <div className="selectedCount">({locations.length}개 동 선택됨)</div>
        </NextButton>
      </Container>
    </Background>
  );
};

export default SearchLocationPage;
