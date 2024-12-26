import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { fetchDistrictBoundary } from "../utils/apiRequest.ts";
import CustomMap from "../components/CustomMap.tsx";
import { ReactComponent as XmarkIcon } from "../assets/icons/x-mark.svg";
import { ReactComponent as PlusIcon } from "../assets/icons/plus.svg";
import {
  Background,
  Container,
  ScopeSettingContainer,
  NeighborsContainer,
  PlusButton,
  CompleteButton,
} from "../styles/SetNeighborScopePage.styles";
import LevelSlider from "../components/SetNeighborScopePage/LevelSlider.tsx";
import { SelectedNeighbor } from "./SearchNeighborPage.tsx";
import { ERROR } from "../constants/constants";
import { SET_RESIDENT_NEIGHBORHOOD } from "../graphql/mutations.js";
import LoadingOverlay from "../components/LoadingOverlay.tsx";
import { WarningText } from "../styles/global";

export type Coordinate = {
  longitude: number;
  latitude: number;
};

type Level = {
  districts: string[];
  outer_boundary: {
    type: string;
    coordinates: Coordinate[];
  };
};

const SetNeighborScopePage = () => {
  const navigate = useNavigate();

  const [neighbors, setNeighbors] = useState<Record<string, SelectedNeighbor>>(
    {}
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // const [scopeValues, setScopeValues] = useState<Record<string, string>>({}); // 동 ID와 레벨 매핑
  const [districtBoundaries, setDistrictBoundaries] = useState<
    Record<string, Record<string, Level>>
  >({});
  const [polygonLine, setPolygonLine] = useState<Coordinate[]>([]);
  const [warning, setWarning] = useState<string>("");

  useEffect(() => {
    // 마운트될 때 세션 스토리지에서 neighbors 값 가져와서 neighbors 세팅
    const placeSaved = sessionStorage.getItem("neighbors");
    if (!placeSaved) return;
    const placeParsed = JSON.parse(placeSaved);
    setNeighbors(
      placeParsed.reduce((acc, current) => {
        acc[current.id] = current;
        return acc;
      }, {})
    );
    setSelectedId(placeParsed.length ? placeParsed[0].id : null);
    // 구역 경계 정보 가져오기
    const setupDistrictBoundaries = async () => {
      const result = {};
      for (const { id } of placeParsed) {
        result[id] = await fetchDistrictBoundary(id);
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
      !neighbors[selectedId]
    ) {
      setPolygonLine([]);
      return;
    }
    const level = convertScopeValueToLevel(neighbors[selectedId].scopeValue);
    if (!districtBoundaries[selectedId][level]) return;
    setPolygonLine(
      districtBoundaries[selectedId][level].outer_boundary.coordinates
    );
  }, [districtBoundaries, selectedId, neighbors]);

  const onNeighborClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const neighborId = e.currentTarget.getAttribute("data-id");
    setSelectedId(neighborId);
  };

  const onXClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const neighborId = e.currentTarget.parentElement!.getAttribute("data-id")!;
    if (neighborId === selectedId) {
      setSelectedId(
        Object.keys(neighbors).filter((id) => id !== neighborId)[0] || null
      );
    }
    setNeighbors((state) => {
      const newState = { ...state };
      delete newState[neighborId];
      return newState;
    });
  };

  const onPlusClick = () => {
    // 현재 neighbors 값을 세션 스토리지에 저장하고 동 검색 페이지로 돌아가기
    sessionStorage.setItem(
      "neighbors",
      JSON.stringify(Object.values(neighbors))
    );
    navigate("/search-neighbor");
  };

  const [
    setResidentNeighborhood,
    {
      loading: setResidentNeighborhoodLoading,
      error: setResidentNeighborhoodError,
    },
  ] = useMutation(SET_RESIDENT_NEIGHBORHOOD);
  useEffect(() => {
    setWarning(setResidentNeighborhoodError ? ERROR.SERVER : "");
  }, [setResidentNeighborhoodError]);

  const sendResidentNeighborhood = async () => {
    const input = {
      neighborhoods: Object.values(neighbors).map((neighbor) => ({
        id: neighbor.id,
        level: convertScopeValueToLevel(neighbor.scopeValue),
      })),
    };
    try {
      await setResidentNeighborhood({ variables: { input } });
    } catch {
      throw new Error(ERROR.NETWORK);
    }
  };

  const onCompleteButtonClick = async () => {
    sessionStorage.clear();
    try {
      await sendResidentNeighborhood();
      navigate("/explore-jobs");
    } catch (e) {
      // TODO : 경고 메시지 표시해야 함
      console.log(e);
    }
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
          <NeighborsContainer>
            {Object.values(neighbors).map((neighbor) => (
              <button
                className={`neighborButton ${
                  selectedId && selectedId === neighbor.id ? "selected" : ""
                }`}
                key={neighbor.id}
                onClick={onNeighborClick}
                data-id={neighbor.id}
              >
                {neighbor.name}
                <XmarkIcon onClick={onXClick} />
              </button>
            ))}
            {Object.keys(neighbors).length < 3 && (
              <PlusButton onClick={onPlusClick}>
                <PlusIcon />
              </PlusButton>
            )}
          </NeighborsContainer>
          <LevelSlider
            level={4}
            value={selectedId ? neighbors[selectedId]?.scopeValue : "0"}
            setValue={(value: string) => {
              if (!selectedId) return;
              setNeighbors((state) => {
                const newState = { ...state };
                newState[selectedId].scopeValue = value;
                return newState;
              });
            }}
          />
          <WarningText>{warning}</WarningText>
        </ScopeSettingContainer>
        <CompleteButton
          className={!Object.keys(neighbors).length ? "inactivated" : ""}
          onClick={onCompleteButtonClick}
        >
          완료
        </CompleteButton>
      </Container>
    </Background>
  );
};

export default SetNeighborScopePage;
