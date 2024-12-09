import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { fetchDistrictBoundary } from "../utils/fetchData";
import { MainBackgroundColor } from "../styles/global";
import useBackgroundColor from "../utils/useBackgroundColor";
import JobList from "../components/ExploreJobsPage/JobList.tsx";
import JobFilter from "../components/ExploreJobsPage/JobFilter.tsx";
import NeighborButton from "../components/ExploreJobsPage/NeighborSelector.tsx";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  Background,
  Container,
  InputContainer,
  ContentContainer,
} from "../styles/ExploreJobsPage.styles";
import { Neighbor } from "./SearchNeighborPage";
import {
  GET_RESIDENT_NEIGHBORHOOD,
  SEARCH_JOB_POSTS,
} from "../graphql/queries.js";
import {
  TERM,
  TERM_KEY,
  JOB_TYPES_KEY,
  DAYS_KEY,
} from "../constants/constants";

export type SearchNeighbor = {
  id: string;
  name: string;
  level: string;
  districts: Neighbor[];
};

export type Filter = {
  // TODO : 타입을 더 구체적으로 명시할 수 없을까?
  term: string;
  jobTypes: string[];
  time: { start: string; end: string };
  weekDays: string[];
};

export type JobPost = {
  id: string;
  title: string;
  workPeriod: { type: string; dates: string[]; days: string[] };
  workTime: { type: string; startTime: string; endTime: string };
  salary: { salaryType: string; salaryAmount: number };
  photos: string[];
  addressName: string;
};

const ExploreJobsPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const [neighbors, setNeighbors] = useState<Record<string, SearchNeighbor>>(
    {}
  );
  const [selectedNeighborID, setSelectedNeighborID] = useState<string>("");
  const [filter, setFilter] = useState<Filter>({
    term: TERM.SHORT_TERM,
    jobTypes: [],
    time: { start: "00:00", end: "00:00" },
    weekDays: [],
  });
  const [pageInfo, setPageInfo] = useState<{
    hasNextPage: boolean;
    endCursor: string | null;
  }>({
    hasNextPage: false,
    endCursor: null,
  });
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);

  const {
    loading: getResidentNeighborhoodLoading,
    error: getResidentNeighborhoodError,
    data: meData,
  } = useQuery(GET_RESIDENT_NEIGHBORHOOD);
  const [
    searchJobPosts,
    { loading: searchJobPostsLoading, error: searchJobPostsError },
  ] = useLazyQuery(SEARCH_JOB_POSTS, {
    onCompleted: (data) => {
      setJobPosts(data.edges.map((edge) => edge.node)); // 공고 데이터 저장
      setPageInfo(data.pageInfo); // 페이지 정보 저장
    },
  });

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

  useEffect(() => {
    if (Object.keys(neighbors).length === 0 || !selectedNeighborID) return;
    const selectedNeighbor = neighbors[selectedNeighborID];
    const days = filter.weekDays.map((day) => DAYS_KEY[day]);
    const filters = {
      // neighbors: selectedNeighbor.districts, // TODO : 현재 이름 배열임, 동 ID 배열로 변환해야 함
      workPeriod: TERM_KEY[filter.term],
      jobCategories: filter.jobTypes.map((type) => JOB_TYPES_KEY[type]),
      startTime: filter.time.start,
      endTime: filter.time.end,
      ...(filter.term === TERM.LONG_TERM && { days }),
    };
    const jobPostCursorInput = { afterCursor: pageInfo.endCursor, first: 20 };
    // searchJobPosts({ variables: { filters, jobPostCursorInput } });
    // TODO : 스크롤을 최상단으로 이동
  }, [selectedNeighborID, filter]);

  return (
    <Background>
      {(getResidentNeighborhoodLoading || searchJobPostsLoading) && (
        <LoadingOverlay />
      )}
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
          <JobFilter filter={filter} setFilter={setFilter} />
          <JobList jobPosts={jobPosts} />
        </ContentContainer>
      </Container>
    </Background>
  );
};

export default ExploreJobsPage;
