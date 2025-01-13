import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { fetchDistrictBoundary } from "../api/rest/neighborhood.ts";
import CustomMap from "../components/CustomMap.tsx";
import { ReactComponent as XmarkIcon } from "../assets/icons/x-mark.svg";
import { ReactComponent as PlusIcon } from "../assets/icons/plus.svg";
import {
  Background,
  Container,
  ScopeSettingContainer,
  NeighborhoodsContainer,
  PlusButton,
  CompleteButton,
} from "../styles/pages/SetNeighborhoodScopePage.styles";
import LevelSlider from "../components/LevelSlider.tsx";
import { SelectedNeighborhood, Coordinate, Level } from "../types/types.ts";
import { ERROR } from "../constants/constants.ts";
import { SET_RESIDENT_NEIGHBORHOOD } from "../api/graphql/mutations.js";
import LoadingOverlay from "../components/LoadingOverlay.tsx";
import { WarningText } from "../styles/global.ts";
import { fetchResidentNeighborhoods } from "../redux/residentNeighborhoods.ts";

const SetNeighborhoodScopePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [neighborhoods, setNeighborhoods] = useState<
    Record<string, SelectedNeighborhood>
  >({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // const [scopeValues, setScopeValues] = useState<Record<string, string>>({}); // 동 ID와 레벨 매핑
  const [districtBoundaries, setDistrictBoundaries] = useState<
    Record<string, Record<string, Level>>
  >({});
  const [polygonLine, setPolygonLine] = useState<Coordinate[]>([]);
  const [fetchDistrictBoundaryError, setFetchDistrictBoundaryError] =
    useState(false);

  useEffect(() => {
    // 마운트될 때 세션 스토리지에서 neighborhoods 값 가져와서 neighborhoods 세팅
    const placeSaved = sessionStorage.getItem("neighborhoods");
    if (!placeSaved) return;
    const placeParsed = JSON.parse(placeSaved);
    setNeighborhoods(
      placeParsed.reduce((acc, current) => {
        acc[current.id] = current;
        return acc;
      }, {})
    );
    setSelectedId(placeParsed.length ? placeParsed[0].id : null);
    // 구역 경계 정보 가져오기
    const setupDistrictBoundaries = async () => {
      const result = {};
      try {
        for (const { id } of placeParsed) {
          result[id] = await fetchDistrictBoundary(id);
        }
      } catch (e) {
        console.error("FetchDistrictBoundary Error: ", e.message);
        setFetchDistrictBoundaryError(true);
        return;
      }
      setDistrictBoundaries(result);
    };
    setupDistrictBoundaries();
  }, []);

  const convertScopeValueToLevel = (scopeValue) => {
    return parseInt(scopeValue) / 100 + 1;
  };

  // 폴리곤 상태 업데이트
  useEffect(() => {
    if (
      !selectedId ||
      !districtBoundaries[selectedId] ||
      !neighborhoods[selectedId]
    ) {
      setPolygonLine([]);
      return;
    }
    const level = convertScopeValueToLevel(
      neighborhoods[selectedId].scopeValue
    );
    if (!districtBoundaries[selectedId][level]) return;
    setPolygonLine(
      districtBoundaries[selectedId][level].outer_boundary.coordinates
    );
  }, [districtBoundaries, selectedId, neighborhoods]);

  const onNeighborhoodClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const neighborhoodId = e.currentTarget.getAttribute("data-id");
    setSelectedId(neighborhoodId);
  };

  const onXClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const neighborhoodId =
      e.currentTarget.parentElement!.getAttribute("data-id")!;
    if (neighborhoodId === selectedId) {
      setSelectedId(
        Object.keys(neighborhoods).filter((id) => id !== neighborhoodId)[0] ||
          null
      );
    }
    setNeighborhoods((state) => {
      const newState = { ...state };
      delete newState[neighborhoodId];
      return newState;
    });
  };

  const onPlusClick = () => {
    // 현재 neighborhoods 값을 세션 스토리지에 저장하고 동 검색 페이지로 돌아가기
    sessionStorage.setItem(
      "neighborhoods",
      JSON.stringify(Object.values(neighborhoods))
    );
    navigate("/search-neighborhood");
  };

  const [
    setResidentNeighborhood,
    {
      loading: setResidentNeighborhoodLoading,
      error: setResidentNeighborhoodError,
    },
  ] = useMutation(SET_RESIDENT_NEIGHBORHOOD);

  const onCompleteButtonClick = async () => {
    sessionStorage.clear();

    const input = {
      neighborhoods: Object.values(neighborhoods).map((neighborhood) => ({
        id: neighborhood.id,
        level: convertScopeValueToLevel(neighborhood.scopeValue),
      })),
    };
    try {
      await setResidentNeighborhood({ variables: { input } });
      // TODO : 빨간 줄 해결하기
      dispatch(fetchResidentNeighborhoods());
    } catch (e) {
      console.error("SetResidentNeighborhood Mutation Error: ", e.message);
      return;
    }
    navigate("/explore-jobs");
  };

  return (
    <Background>
      {setResidentNeighborhoodLoading && <LoadingOverlay />}
      <CustomMap
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          height: "100%",
          width: "100%",
          zIndex: "0",
          boxSizing: "border-box",
        }}
        polygonLine={polygonLine}
      />
      <Container>
        <ScopeSettingContainer>
          <NeighborhoodsContainer>
            {Object.values(neighborhoods).map((neighborhood) => (
              <button
                className={`neighborhoodButton ${
                  selectedId && selectedId === neighborhood.id ? "selected" : ""
                }`}
                key={neighborhood.id}
                onClick={onNeighborhoodClick}
                data-id={neighborhood.id}
              >
                {neighborhood.name}
                <XmarkIcon onClick={onXClick} />
              </button>
            ))}
            {Object.keys(neighborhoods).length < 3 && (
              <PlusButton onClick={onPlusClick}>
                <PlusIcon />
              </PlusButton>
            )}
          </NeighborhoodsContainer>
          <LevelSlider
            level={4}
            value={selectedId ? neighborhoods[selectedId]?.scopeValue : "0"}
            setValue={(value: string) => {
              if (!selectedId) return;
              setNeighborhoods((state) => {
                const newState = { ...state };
                newState[selectedId].scopeValue = value;
                return newState;
              });
            }}
          />
          {(setResidentNeighborhoodError || fetchDistrictBoundaryError) && (
            <WarningText>{ERROR.SERVER}</WarningText>
          )}
        </ScopeSettingContainer>
        <CompleteButton
          className={!Object.keys(neighborhoods).length ? "inactivated" : ""}
          onClick={onCompleteButtonClick}
        >
          완료
        </CompleteButton>
      </Container>
    </Background>
  );
};

export default SetNeighborhoodScopePage;
