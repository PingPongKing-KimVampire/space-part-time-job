import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "../styles/SetNeighborScopePage.styles.ts";
import LevelSlider from "../components/SetNeighborScopePage/LevelSlider.tsx";
import { Neighbor } from "./SearchNeighborPage.tsx";
import { IP_ADDRESS, ERROR } from "../constants/constants.ts";

type Level = {
  districts: string[];
  outer_boundary: {
    type: string;
    coordinates: [number, number][];
  };
};

type DistrictBoundaryResponseData = {
  levels: Record<string, Level>;
};

const SetNeighborScopePage = () => {
  const navigate = useNavigate();

  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [selectedNeighbor, setSelectedNeighbor] = useState<Neighbor | null>(
    null
  );
  const [scopeLevel, setScopeLevel] = useState<Record<string, string>>({}); // 동 ID와 레벨 매핑
  const [distructBoundaries, setDistructBoundaries] = useState<
    Record<string, Level>
  >({}); // TODO : useMemo를 쓰는 게 낫나?
  const [polygonLine, setPolygonLine] = useState<[number, number][]>([]);

  useEffect(() => {
    // 마운트될 때 세션 스토리지에서 neighbors 값 가져와서 neighbors 세팅
    const placeSaved = sessionStorage.getItem("neighbors") || "";
    if (!placeSaved) return;
    const placeParsed = JSON.parse(placeSaved);
    setNeighbors(placeParsed);
    setSelectedNeighbor(placeParsed.length ? placeParsed[0] : null);
    // 구역 경계 정보 가져오기
    const setupDistrictBoundaries = async () => {
      const result = {};
      for (const { id } of placeParsed) {
        result[id] = await fetchDistructBoundary(id);
      }
      setDistructBoundaries(result);
    };
    setupDistrictBoundaries();
  }, []);

  const fetchDistructBoundary = async (id) => {
    let response: Response;
    const requestUrl = `http://${IP_ADDRESS}:15000/district/${id}/neighbors`;
    try {
      response = await fetch(requestUrl);
    } catch {
      throw new Error(ERROR.NETWORK);
    }
    if (!response.ok) throw new Error(ERROR.SERVER);
    let data: DistrictBoundaryResponseData;
    try {
      data = await response.json();
    } catch {
      throw new Error(ERROR.SERVER);
    }
    return data.levels;
  };

  useEffect(() => {
    if (
      !selectedNeighbor ||
      Object.keys(distructBoundaries).length === 0 ||
      Object.keys(scopeLevel).length === 0
    )
      return;
    // TODO : scope level 가공해서 사용하기
    setPolygonLine(
      distructBoundaries[selectedNeighbor.id][1].outer_boundary.coordinates
    );
  }, [distructBoundaries, selectedNeighbor, scopeLevel]);

  const onNeighborClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const neighborClicked = JSON.parse(
      e.currentTarget.getAttribute("data-neighbor")!
    );
    setSelectedNeighbor(neighborClicked);
  };

  const onXClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const neighborClicked = JSON.parse(
      e.currentTarget.parentElement!.getAttribute("data-neighbor")!
    );
    setNeighbors((state) => state.filter((el) => el.id !== neighborClicked.id));
  };

  // x 눌렀을 때 scopeLevel 업데이트
  useEffect(() => {
    setScopeLevel((prev) => {
      return neighbors.reduce((result, neighbor) => {
        result[neighbor.id] = prev[neighbor.id] || "0";
        return result;
      }, {});
    });
  }, [neighbors]);

  // x 누른 neighbor가 현재 선택된 neighbor인 경우 selectedNeighbor 업데이트
  useEffect(() => {
    if (
      !selectedNeighbor ||
      neighbors.every((el) => el.id !== selectedNeighbor.id)
    )
      setSelectedNeighbor(neighbors.length ? neighbors[0] : null);
  }, [neighbors, selectedNeighbor]);

  const onPlusClick = () => {
    // 현재 neighbors 값을 세션 스토리지에 저장하고 동 검색 페이지로 돌아가기
    sessionStorage.setItem("neighbors", JSON.stringify(neighbors));
    navigate("/search-neighbor");
  };

  const onCompleteButtonClick = () => {
    sessionStorage.clear();
    navigate("/explore-jobs");
  };

  return (
    <Background>
      <CustomMap
        style={{
          position: "absolute",
          top: "0",
          left: "0",
          height: "100%",
          width: "100%",
          zIndex: "0",
        }}
        polygonLine={polygonLine}
      />
      <Container>
        <ScopeSettingContainer>
          <NeighborsContainer>
            {neighbors.map((neighbor) => (
              <button
                className={`neighborButton ${
                  selectedNeighbor && selectedNeighbor.id === neighbor.id
                    ? "selected"
                    : ""
                }`}
                key={neighbor.id}
                onClick={onNeighborClick}
                data-neighbor={JSON.stringify(neighbor)}
              >
                {neighbor.name}
                <XmarkIcon onClick={onXClick} />
              </button>
            ))}
            {neighbors.length < 3 && (
              <PlusButton onClick={onPlusClick}>
                <PlusIcon />
              </PlusButton>
            )}
          </NeighborsContainer>
          <LevelSlider
            level={4}
            value={selectedNeighbor ? scopeLevel[selectedNeighbor.id] : "0"}
            setValue={(value: string) => {
              setScopeLevel((state) => {
                const newState = { ...state };
                if (selectedNeighbor) newState[selectedNeighbor.id] = value;
                return newState;
              });
            }}
          />
        </ScopeSettingContainer>
        <CompleteButton
          className={!neighbors.length ? "inactivated" : ""}
          onClick={onCompleteButtonClick}
        >
          완료
        </CompleteButton>
      </Container>
    </Background>
  );
};

export default SetNeighborScopePage;
