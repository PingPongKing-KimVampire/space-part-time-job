import React, { useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "../components/SearchBox.tsx";
import {
  Background,
  Container,
  SearchItemContent,
} from "../styles/SearchAddressPage.styles.ts";
import { SESSION_STORAGE_KEY } from "./CreateJobPage.tsx";

const SEARCH_RESULT = [
  // 임시 하드코딩 데이터
  {
    zipCode: "18395",
    roadNameAddress: "경기도 화성시 동탄지성로 333",
    streetNumber: "경기도 화성시 기산동 464",
  },
  {
    zipCode: "11111",
    roadNameAddress: "경기도 화성시 동탄지성로 333",
    streetNumber: "경기도 화성시 기산동 464",
  },
  {
    zipCode: "22222",
    roadNameAddress: "경기도 화성시 동탄지성로 333",
    streetNumber: "경기도 화성시 기산동 464",
  },
  {
    zipCode: "33333",
    roadNameAddress: "경기도 화성시 동탄지성로 333",
    streetNumber: "경기도 화성시 기산동 464",
  },
  {
    zipCode: "44444",
    roadNameAddress: "경기도 화성시 동탄지성로 333",
    streetNumber: "경기도 화성시 기산동 464",
  },
  {
    zipCode: "55555",
    roadNameAddress: "경기도 화성시 동탄지성로 333",
    streetNumber: "경기도 화성시 기산동 464",
  },
  {
    zipCode: "66666",
    roadNameAddress: "경기도 화성시 동탄지성로 333",
    streetNumber: "경기도 화성시 기산동 464",
  },
  {
    zipCode: "77777",
    roadNameAddress: "경기도 화성시 동탄지성로 333",
    streetNumber: "경기도 화성시 기산동 464",
  },
];

const SearchAddressPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onAddressClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // 장소 선택 페이지에서 선택된 주소를 세션 스토리지에 저장한다.
    const place = e.currentTarget.getAttribute("data-place");
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY) || "";
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.place = place;
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(parsed));
    }
    navigate("/create-job");
  };

  const resultElements = useMemo(() => {
    return SEARCH_RESULT.map((info) => {
      const { zipCode, roadNameAddress, streetNumber } = info;
      return (
        <button
          className="searchItem"
          style={{ padding: "0" }}
          onClick={onAddressClick}
          data-place={streetNumber}
          key={zipCode}
        >
          <SearchItemContent>
            <div className="zipCode">{zipCode}</div>
            <div className="keyAndValue">
              <div className="key">도로명</div>
              <div className="value">{roadNameAddress}</div>
            </div>
            <div className="keyAndValue">
              <div className="key">지 번</div>
              <div className="value">{streetNumber}</div>
            </div>
          </SearchItemContent>
        </button>
      );
    });
  }, []);

  return (
    <Background>
      <Container>
        <SearchBox
          placeholder="도로명, 건물명, 번지 검색"
          searchResult={resultElements}
          style={{ overflowX: "hidden", overflowY: "hidden" }}
        />
      </Container>
    </Background>
  );
};

export default SearchAddressPage;
