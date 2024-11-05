import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchBox from "../components/SearchBox.tsx";
import {
  Background,
  Container,
  SearchItemContent,
} from "../styles/SearchAddressPage.styles.ts";

const SEARCH_RESULT = [
  // 임시 하드코딩 데이터
  {
    zipCode: "06194",
    roadNameAddress:
      "서울특별시 강남구 테헤란로 428(대치동, 테헤란로 대우 아이빌)",
    streetNumber: "서울특별시 강남구 대치동 891-6 테헤란로 대우 아이빌",
  },
  {
    zipCode: "06194",
    roadNameAddress:
      "서울특별시 강남구 테헤란로 428(대치동, 테헤란로 대우 아이빌)",
    streetNumber: "서울특별시 강남구 대치동 891-6 테헤란로 대우 아이빌",
  },
  {
    zipCode: "06194",
    roadNameAddress:
      "서울특별시 강남구 테헤란로 428(대치동, 테헤란로 대우 아이빌)",
    streetNumber: "서울특별시 강남구 대치동 891-6 테헤란로 대우 아이빌",
  },
  {
    zipCode: "06194",
    roadNameAddress:
      "서울특별시 강남구 테헤란로 428(대치동, 테헤란로 대우 아이빌)",
    streetNumber: "서울특별시 강남구 대치동 891-6 테헤란로 대우 아이빌",
  },
  {
    zipCode: "06194",
    roadNameAddress:
      "서울특별시 강남구 테헤란로 428(대치동, 테헤란로 대우 아이빌)",
    streetNumber: "서울특별시 강남구 대치동 891-6 테헤란로 대우 아이빌",
  },
  {
    zipCode: "06194",
    roadNameAddress:
      "서울특별시 강남구 테헤란로 428(대치동, 테헤란로 대우 아이빌)",
    streetNumber: "서울특별시 강남구 대치동 891-6 테헤란로 대우 아이빌",
  },
  {
    zipCode: "06194",
    roadNameAddress:
      "서울특별시 강남구 테헤란로 428(대치동, 테헤란로 대우 아이빌)",
    streetNumber: "서울특별시 강남구 대치동 891-6 테헤란로 대우 아이빌",
  },
  {
    zipCode: "06194",
    roadNameAddress:
      "서울특별시 강남구 테헤란로 428(대치동, 테헤란로 대우 아이빌)",
    streetNumber: "서울특별시 강남구 대치동 891-6 테헤란로 대우 아이빌",
  },
];

const SearchAddressPage = () => {
  const navigate = useNavigate();

  const onAddressClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const place = e.currentTarget.getAttribute("data-place");
    navigate(`/create-job?place=${place}`);
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
          style={{ height: "550px" }}
        />
      </Container>
    </Background>
  );
};

export default SearchAddressPage;
