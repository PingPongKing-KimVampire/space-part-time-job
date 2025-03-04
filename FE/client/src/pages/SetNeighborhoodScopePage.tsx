import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMutation } from "@apollo/client";
import { fetchDistrictBoundary } from "../api/rest/neighborhood";
import CustomMap from "../components/CustomMap";
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
import LevelSlider from "../components/LevelSlider";
import { SelectedNeighborhood, Coordinate, Level } from "../types/types";
import { ERROR } from "../constants/constants";
import { SET_RESIDENT_NEIGHBORHOOD } from "../api/graphql/mutations";
import { processSetResidentNeighborhood } from "../api/graphql/processData";
import LoadingOverlay from "../components/LoadingOverlay";
import { WarningText } from "../styles/global";
import { fetchResidentNeighborhoods } from "../redux/residentNeighborhoods";

const SetNeighborhoodScopePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [neighborhoods, setNeighborhoods] = useState<
    Record<string, SelectedNeighborhood>
  >({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
    setResidentNeighborhoodFinalError,
    setSetResidentNeighborhoodFinalError,
  ] = useState<Error | null>(null);
  const [
    setResidentNeighborhood,
    {
      loading: setResidentNeighborhoodLoading,
      error: setResidentNeighborhoodError,
    },
  ] = useMutation(SET_RESIDENT_NEIGHBORHOOD);
  useEffect(() => {
    if (setResidentNeighborhoodError)
      setSetResidentNeighborhoodFinalError(new Error(ERROR.SERVER));
  }, [setResidentNeighborhoodError]);

  const onCompleteButtonClick = async () => {
    sessionStorage.clear();

    const input = {
      neighborhoods: Object.values(neighborhoods).map((neighborhood) => ({
        id: neighborhood.id,
        level: convertScopeValueToLevel(neighborhood.scopeValue),
      })),
    };
    try {
      let response;
      try {
        response = await setResidentNeighborhood({ variables: { input } });
      } catch {
        throw new Error(ERROR.SERVER);
      }
      if (!response.data || !response.data.setResidentNeighborhood) return;
      processSetResidentNeighborhood(response.data);
      dispatch(fetchResidentNeighborhoods()); // TODO : 빨간 줄 해결하기
    } catch (e) {
      setSetResidentNeighborhoodFinalError(e);
      return;
    }
    navigate("/explore-jobs");
  };

  return (
    <Background>
      {setResidentNeighborhoodLoading && <LoadingOverlay />}
      <CustomMap className="inSetNeighborhoodScope" polygonLine={polygonLine} />
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
                <div className="neighborhoodName">{neighborhood.name}</div>
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
          {fetchDistrictBoundaryError && (
            <WarningText>{ERROR.SERVER}</WarningText>
          )}
          {setResidentNeighborhoodFinalError && (
            <WarningText>
              {setResidentNeighborhoodFinalError.message}
            </WarningText>
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
