import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { fetchTotalNeighborhoods } from "../api/rest/neighborhood";
import useBackgroundColor from "../utils/useBackgroundColor";
import useDebounce from "../utils/useDebounce";
import {
  Background,
  Container,
  NextButton,
} from "../styles/pages/SearchNeighborhoodPage.styles";
import CustomInput from "../components/CustomInput";
import SelectedNeighborhoods from "../components/SearchNeighborhoodPage/SelectedNeighborhoods";
import ResultNeighborhoods from "../components/SearchNeighborhoodPage/ResultNeighborhoods";
import { MainBackgroundColor, WarningText } from "../styles/global";
import { GET_RESIDENT_NEIGHBORHOOD } from "../api/graphql/queries.js";
import { Neighborhood, SelectedNeighborhood } from "../types/types";
import { ERROR } from "../constants/constants";

const SearchNeighborhoodPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const navigate = useNavigate();

  const [totalNeighborhoods, setTotalNeighborhoods] = useState<{
    data: Neighborhood[];
    loading: boolean;
    error: Error | null;
  }>({ data: [], loading: false, error: null });
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<
    Neighborhood[]
  >([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<
    SelectedNeighborhood[]
  >([]);

  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 100);
  const searchResultBoxRef = useRef<HTMLDivElement>(null);

  const convertLevelToScopeValue = (level) => {
    return (parseInt(level) - 1) * 100;
  };

  const [
    getResidentNeighborhood,
    { loading: getResidentLoading, error: getResidentError },
  ] = useLazyQuery(GET_RESIDENT_NEIGHBORHOOD, {
    onCompleted: (data) => {
      if (!data?.me?.residentNeighborhood) return;
      setSelectedNeighborhoods(
        data.me.residentNeighborhood.map((neighborhood) => ({
          ...neighborhood,
          scopeValue: convertLevelToScopeValue(neighborhood.level),
        }))
      );
    },
  });
  useEffect(() => {
    const setupTotalNeighborhoods = async () => {
      setTotalNeighborhoods((state) => ({ ...state, loading: true }));
      const result = await fetchTotalNeighborhoods();
      setTotalNeighborhoods({ data: result, loading: false, error: null });
    };
    const setupSelectedNeighborhoods = () => {
      const placeSaved = sessionStorage.getItem("neighborhoods");
      if (placeSaved) {
        setSelectedNeighborhoods(JSON.parse(placeSaved));
        return;
      }
      try {
        getResidentNeighborhood(); // 세션 스토리지에 없다면, 상주 지역 조회 API 호출
      } catch (e) {
        console.error("GetResidentNeighborhood Query Error: ", e.message);
      }
    };
    try {
      setupTotalNeighborhoods(); // 처음 모든 동 정보를 받아옴
    } catch (e) {
      setTotalNeighborhoods((state) => ({ ...state, error: e }));
      return;
    }
    setupSelectedNeighborhoods(); // 디폴트로 선택될 동 정보를 받아옴 (세션 스토리지 -> 상주 지역 조회 API)
  }, []);

  useEffect(() => {
    // 검색 키워드 바뀔 때마다 스크롤을 최상단으로 이동
    searchResultBoxRef.current?.scrollTo(0, 0);
    // 검색 키워드에 맞는 동만 필터링
    setFilteredNeighborhoods(
      totalNeighborhoods.data.filter((neighborhood) =>
        neighborhood.name.includes(debouncedSearchValue)
      )
    );
  }, [totalNeighborhoods, debouncedSearchValue]);

  const onNeighborhoodClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const neighborhoodClicked = JSON.parse(
        e.currentTarget.getAttribute("data-neighborhood")!
      );
      if (
        selectedNeighborhoods.some((el) => el.id === neighborhoodClicked.id)
      ) {
        setSelectedNeighborhoods((state) =>
          state.filter((el) => el.id !== neighborhoodClicked.id)
        );
      } else {
        setSelectedNeighborhoods((state) =>
          state.concat({ ...neighborhoodClicked, scopeValue: "0" })
        );
      }
    },
    [selectedNeighborhoods]
  );

  const getNeighborhoodElements = useCallback(
    (neighborhoods: Neighborhood[]) => {
      return neighborhoods.map((neighborhood) => {
        const { id, name } = neighborhood;
        const selected = selectedNeighborhoods.some((el) => el.id === id);
        const inactivated = !selected && 3 <= selectedNeighborhoods.length;
        return (
          <button
            className={`searchItem ${selected ? "selected" : ""} ${
              inactivated ? "inactivated" : ""
            }`}
            key={id}
            onClick={onNeighborhoodClick}
            disabled={inactivated}
            data-neighborhood={JSON.stringify(neighborhood)}
          >
            {name}
          </button>
        );
      });
    },
    [selectedNeighborhoods, onNeighborhoodClick]
  );

  const isAllValid = useMemo(() => {
    return (
      1 <= selectedNeighborhoods.length && selectedNeighborhoods.length <= 3
    );
  }, [selectedNeighborhoods]);

  const onNextClick = () => {
    // selectedNeighborhoods 값을 세션 스토리지에 저장하고 동네 범위 설정 페이지로 이동
    sessionStorage.setItem(
      "neighborhoods",
      JSON.stringify(selectedNeighborhoods)
    );
    navigate("/set-neighborhood-scope");
  };

  return (
    <Background>
      <Container>
        <label className="title" htmlFor="neighborhood">
          상주하는 지역을 <span className="newLine">최대 3개 선택해주세요.</span>
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
        {(getResidentError || totalNeighborhoods.error) && (
          <WarningText>{ERROR.SERVER}</WarningText>
        )}
        <div className="content">
          <SelectedNeighborhoods
            neighborhoods={selectedNeighborhoods}
            getElements={getNeighborhoodElements}
          />
          <ResultNeighborhoods
            neighborhoods={filteredNeighborhoods}
            getElements={getNeighborhoodElements}
            loading={totalNeighborhoods.loading || getResidentLoading}
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
            ({selectedNeighborhoods.length}개 동 선택됨)
          </div>
        </NextButton>
      </Container>
    </Background>
  );
};

export default SearchNeighborhoodPage;
