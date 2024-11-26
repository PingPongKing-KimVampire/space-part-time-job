import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import useDebounce from "../utils/useDebounce.ts";
import {
  Background,
  Container,
  NextButton,
} from "../styles/SearchNeighborPage.styles.ts";
import SearchBox from "../components/SearchBox.tsx";
import { MainBackgroundColor } from "../styles/global.ts";
import { IP_ADDRESS, ERROR } from "../constants/constants.ts";

export type Neighbor = {
  id: string;
  name: string;
};

type SearchNeighborResponseData = {
  districts: Neighbor[];
};

// const SEARCH_RESULT = [
//   // 임히 하드코딩 데이터
//   "기산동",
//   "대치동",
//   "개포동",
//   "도곡동",
//   "역삼동",
//   "신사동",
//   "동탄동",
//   "병점동",
//   "압구정동",
//   "홍대동",
//   "삼성동",
//   "이태원동",
//   "청담동",
//   "성수동",
//   "쌍문동",
//   "상암동",
//   "신림동",
// ];

const SearchNeighborPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const navigate = useNavigate();

  const [totalNeighbors, setTotalNeighbors] = useState<Neighbor[]>([]);
  const [filteredNeighbors, setFilteredNeighbors] = useState<Neighbor[]>([]);
  const [visibleNeighbors, setVisibleNeighbors] = useState<Neighbor[]>([]);
  const [offset, setOffset] = useState({ start: 0, end: 0 });
  const [selectedNeighbors, setSelectedNeighbors] = useState<Neighbor[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 300);
  const searchResultBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 세션 스토리지에 place가 있으면 neighbors로 세팅
    const placeSaved = sessionStorage.getItem("neighbors") || "";
    if (placeSaved) setSelectedNeighbors(JSON.parse(placeSaved));
    // 처음 모든 동 정보를 받아옴
    const setupTotalNeighbors = async () => {
      const result = await fetchTotalNeighbors();
      setTotalNeighbors(result);
      // setOffset((prev) => ({ ...prev, end: prev.end + 10 }));
    };
    setupTotalNeighbors();
  }, []);

  // 행정동 조회 API 요청
  const fetchTotalNeighbors = async (): Promise<Neighbor[]> => {
    let response: Response;
    let data: SearchNeighborResponseData;
    const requestUrl = `http://${IP_ADDRESS}:10000/district`;
    try {
      response = await fetch(requestUrl);
    } catch {
      throw new Error(ERROR.NETWORK);
    }
    if (!response.ok) {
      throw new Error(ERROR.SERVER);
    }
    try {
      data = await response.json();
    } catch {
      throw new Error(ERROR.SERVER);
    }
    // const data: { districts: Neighbor[] } = {
    //   districts: [
    //     { id: "1", name: "기산동" },
    //     { id: "2", name: "대치동" },
    //     { id: "3", name: "개포동" },
    //     { id: "4", name: "도곡동" },
    //     { id: "5", name: "신사동" },
    //     { id: "6", name: "역삼동" },
    //     { id: "7", name: "동탄동" },
    //     { id: "8", name: "병점동" },
    //     { id: "9", name: "압구정동" },
    //     { id: "10", name: "홍대동" },
    //     { id: "11", name: "삼성동" },
    //     { id: "12", name: "성수동" },
    //     { id: "13", name: "상암동" },
    //   ],
    // };
    return data.districts;
  };

  useEffect(() => {
    searchResultBoxRef.current?.scrollTo(0, 0);
    // 검색 키워드에 맞는 동만 필터링
    setFilteredNeighbors(
      totalNeighbors.filter((neighbor) =>
        neighbor.name.includes(debouncedSearchValue)
      )
    );
  }, [totalNeighbors, debouncedSearchValue]);

  const onNeighborClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const neighborClicked = JSON.parse(
        e.currentTarget.getAttribute("data-neighbor")!
      );
      const selectedNeighborIDs = selectedNeighbors.map((el) => el.id);
      if (selectedNeighborIDs.includes(neighborClicked.id)) {
        setSelectedNeighbors((state) =>
          state.filter((el) => el.id !== neighborClicked.id)
        );
      } else {
        setSelectedNeighbors((state) => state.concat(neighborClicked));
      }
    },
    [selectedNeighbors]
  );

  const searchResultElements = useMemo(() => {
    return filteredNeighbors.map((neighbor) => {
      const { id, name } = neighbor;
      const selected = selectedNeighbors.map((el) => el.id).includes(id);
      const inactivated = !selected && 3 <= selectedNeighbors.length;
      return (
        <button
          className={`searchItem ${selected ? "selected" : ""} ${
            inactivated ? "inactivated" : ""
          }`}
          key={id}
          onClick={onNeighborClick}
          disabled={inactivated}
          data-neighbor={JSON.stringify(neighbor)}
        >
          {name}
        </button>
      );
    });
  }, [filteredNeighbors, selectedNeighbors, onNeighborClick]);

  const fixedElements = useMemo(() => {
    return selectedNeighbors.map((neighbor) => (
      <button
        className="searchItem selected"
        key={neighbor.id}
        onClick={onNeighborClick}
        data-neighbor={JSON.stringify(neighbor)}
      >
        {neighbor.name}
      </button>
    ));
  }, [selectedNeighbors]);

  const isAllValid = useMemo(() => {
    return 1 <= selectedNeighbors.length && selectedNeighbors.length <= 3;
  }, [selectedNeighbors]);

  const onNextClick = () => {
    // selectedNeighbors 값을 세션 스토리지에 저장하고 동네 범위 설정 페이지로 이동
    sessionStorage.setItem("neighbors", JSON.stringify(selectedNeighbors));
    navigate("/set-neighbor-scope");
  };

  return (
    <Background>
      <Container>
        <label className="title" htmlFor="neighborhood">
          상주하는 지역을 최대 3개 선택해주세요.
        </label>
        <SearchBox
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          placeholder="상주하는 동을 입력하세요. ex) 개포동, 대치동"
          searchResult={searchResultElements}
          resultBoxStyle={{ overflowX: "hidden", overflowY: "auto" }}
          contentBoxHeight="420px"
          fixed={fixedElements}
          ref={searchResultBoxRef}
        />
        <NextButton
          className={!isAllValid ? "inactivated" : ""}
          onClick={onNextClick}
          disabled={!isAllValid}
        >
          다음
          <div className="selectedCount">
            ({selectedNeighbors.length}개 동 선택됨)
          </div>
        </NextButton>
      </Container>
    </Background>
  );
};

export default SearchNeighborPage;
