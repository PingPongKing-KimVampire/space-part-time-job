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

const SetNeighborScopePage = () => {
  const navigate = useNavigate();

  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [selectedNeighbor, setSelectedNeighbor] = useState<Neighbor | null>(
    null
  );
  const [scopeLevel, setScopeLevel] = useState<Record<string, string>>({}); // 동 ID와 레벨 매핑

  // 마운트될 때 세션 스토리지에서 neighbors 값 가져와서 neighbors 세팅
  useEffect(() => {
    const placeSaved = sessionStorage.getItem("neighbors") || "";
    if (placeSaved) {
      const placeParsed = JSON.parse(placeSaved);
      setNeighbors(JSON.parse(placeSaved));
      setSelectedNeighbor(placeParsed.length ? placeParsed[0] : null);
    }
  }, []);

  useEffect(() => {
    setScopeLevel((prev) => {
      return neighbors.reduce((result, neighbor) => {
        result[neighbor.id] = prev[neighbor.id] || "0";
        return result;
      }, {});
    });
  }, [neighbors]);

  useEffect(() => {
    const ids = neighbors.map((el) => el.id);
    if (!selectedNeighbor || !ids.includes(selectedNeighbor.id))
      setSelectedNeighbor(neighbors.length ? neighbors[0] : null);
  }, [neighbors, selectedNeighbor]);

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
