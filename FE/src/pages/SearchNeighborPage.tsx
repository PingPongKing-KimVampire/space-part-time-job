import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import useBackgroundColor from "../utils/useBackgroundColor";
import useDebounce from "../utils/useDebounce";
import {
  Background,
  Container,
  NextButton,
} from "../styles/SearchNeighborPage.styles";
import CustomInput from "../components/CustomInput.tsx";
import SelectedNeighbors from "../components/SearchNeighborPage/SelectedNeighbors.tsx";
import ResultNeighbors from "../components/SearchNeighborPage/ResultNeighbors.tsx";
import { MainBackgroundColor } from "../styles/global";
import { IP_ADDRESS, ERROR } from "../constants/constants";

export type Neighbor = {
  id: string;
  name: string;
};

type SearchNeighborResponseData = {
  districts: Neighbor[];
};

const SearchNeighborPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const navigate = useNavigate();

  const [totalNeighbors, setTotalNeighbors] = useState<Neighbor[]>([]);
  const [filteredNeighbors, setFilteredNeighbors] = useState<Neighbor[]>([]);
  const [selectedNeighbors, setSelectedNeighbors] = useState<Neighbor[]>([]);

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 100);
  const searchResultBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 세션 스토리지에 place가 있으면 neighbors로 세팅
    const placeSaved = sessionStorage.getItem("neighbors") || "";
    if (placeSaved) setSelectedNeighbors(JSON.parse(placeSaved));
    // 처음 모든 동 정보를 받아옴
    const setupTotalNeighbors = async () => {
      const result = await fetchTotalNeighbors();
      setTotalNeighbors(result);
    };
    setupTotalNeighbors();
  }, []);

  // 행정동 조회 API 요청
  const fetchTotalNeighbors = async (): Promise<Neighbor[]> => {
    let response: Response;
    let data: SearchNeighborResponseData;
    const requestUrl = `https://${IP_ADDRESS}/district`;
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
    return data.districts;
  };

  useEffect(() => {
    // 검색 키워드 바뀔 때마다 스크롤을 최상단으로 이동
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
      if (selectedNeighbors.some((el) => el.id === neighborClicked.id)) {
        setSelectedNeighbors((state) =>
          state.filter((el) => el.id !== neighborClicked.id)
        );
      } else {
        setSelectedNeighbors((state) => state.concat(neighborClicked));
      }
    },
    [selectedNeighbors]
  );

  const getNeighborElements = useCallback(
    (neighbors: Neighbor[]) => {
      return neighbors.map((neighbor) => {
        const { id, name } = neighbor;
        const selected = selectedNeighbors.some((el) => el.id === id);
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
    },
    [selectedNeighbors, onNeighborClick]
  );

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
        <CustomInput
          id="neighborhood"
          placeholder="상주하는 동을 입력하세요. ex) 개포동, 대치동"
          value={searchValue}
          eventHandlers={{
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchValue(e.target.value);
            },
          }}
          maxLength={20}
        />
        <div className="content">
          <SelectedNeighbors
            neighbors={selectedNeighbors}
            getElements={getNeighborElements}
          />
          <ResultNeighbors
            neighbors={filteredNeighbors}
            getElements={getNeighborElements}
            ref={searchResultBoxRef}
          />
        </div>
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
