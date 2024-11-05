import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  const [locations, setLocations] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL에 따라 locations 상태 동기화
    const queryParams = new URLSearchParams(location.search);
    const locationsParam = queryParams.get("locations");
    setLocations(locationsParam ? locationsParam.split(",") : []);
  }, [location.search]);

  const onLocationClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const locationClicked = e.currentTarget.textContent || "";
      if (locations.includes(locationClicked)) {
        navigate(
          `?locations=${locations
            .filter((loc) => loc !== locationClicked)
            .join(",")}`
        );
      } else {
        navigate(`?locations=${locations.concat(locationClicked).join(",")}`);
      }
    },
    [locations, navigate]
  );

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

  const isAllVaid = useMemo(() => {
    return 1 <= locations.length && locations.length <= 3;
  }, [locations]);

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
          className={!isAllVaid ? "inactivated" : ""}
          onClick={() => {
            navigate(`/set-location-scope?locations=${locations.join(",")}`);
          }}
          disabled={!isAllVaid}
        >
          다음
          <div className="selectedCount">({locations.length}개 동 선택됨)</div>
        </NextButton>
      </Container>
    </Background>
  );
};

export default SearchLocationPage;
