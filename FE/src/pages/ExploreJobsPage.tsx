import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { fetchDistrictBoundary } from "../utils/fetchData";
import { MainBackgroundColor } from "../styles/global";
import useBackgroundColor from "../utils/useBackgroundColor";
import JobList from "../components/ExploreJobsPage/JobList.tsx";
import JobFilter from "../components/ExploreJobsPage/JobFilter.tsx";
import NeighborButton from "../components/ExploreJobsPage/NeighborSelector.tsx";
import {
  Background,
  Container,
  InputContainer,
  ContentContainer,
} from "../styles/ExploreJobsPage.styles";
import { Neighbor } from "./SearchNeighborPage";
import { GET_RESIDENT_NEIGHBORHOOD } from "../graphql/queries.js";

export type SearchNeighbor = {
  id: string;
  name: string;
  level: string;
  districts: Neighbor[];
};

const ExploreJobsPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const [neighbors, setNeighbors] = useState<Record<string, SearchNeighbor>>(
    {}
  );
  const [selectedNeighborID, setSelectedNeighborID] = useState<string>("");

  const {
    loading: getResidentNeighborhood,
    error: getResidentNeighborhoodError,
    data: meData,
  } = useQuery(GET_RESIDENT_NEIGHBORHOOD);

  useEffect(() => {
    if (!meData?.me?.residentNeighborhood) return;
    const testData = [
      { id: "1111064000", name: "이화동", level: "3" },
      { id: "1114061500", name: "신당동", level: "2" },
      { id: "1117051000", name: "후암동", level: "4" },
    ];

    // 상주 지역과 그 인접 동 데이터 불러와서 neighbors 상태로 세팅
    const setupNeighbors = async (residentNeighbors) => {
      const result = {};
      for (const neighbor of residentNeighbors) {
        let boundaries;
        try {
          boundaries = await fetchDistrictBoundary(neighbor.id);
        } catch (e) {
          console.error(e.message);
        }
        result[neighbor.id] = {
          ...neighbor,
          districts: boundaries[neighbor.level].districts,
        };
      }
      setNeighbors(result);
    };
    setupNeighbors(testData);
  }, [meData]);

  useEffect(() => {
    // 선택된 동이 없을 경우, 첫 번째 상주 지역을 선택
    if (Object.keys(neighbors).includes(selectedNeighborID)) return;
    const ids = Object.keys(neighbors);
    if (ids.length === 0) return;
    setSelectedNeighborID(ids[0]);
  }, [neighbors]);

  return (
    <Background>
      <Container>
        <InputContainer>
          <NeighborButton
            neighbors={neighbors}
            selectedNeighborID={selectedNeighborID}
            setSelectedNeighborID={setSelectedNeighborID}
          />
          <input placeholder="주변 알바 검색" />
        </InputContainer>
        <ContentContainer>
          <JobFilter />
          <JobList />
        </ContentContainer>
      </Container>
    </Background>
  );
};

export default ExploreJobsPage;
