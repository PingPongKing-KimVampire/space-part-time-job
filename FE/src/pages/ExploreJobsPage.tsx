import React, { useState, useEffect, useRef } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { fetchDistrictBoundary } from "../utils/fetchData";
import { MainBackgroundColor } from "../styles/global";
import useBackgroundColor from "../utils/useBackgroundColor";
import useDebounce from "../utils/useDebounce";
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
import { WarningText } from "../styles/global";
import { Neighbor } from "./SearchNeighborPage";
import {
  GET_RESIDENT_NEIGHBORHOOD,
  SEARCH_JOB_POSTS,
} from "../graphql/queries.js";
import {
  ERROR,
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
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 100);
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
  const [isChangedSearchCondition, setIsChangedSearchCondition] =
    useState<boolean>(false);

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
      if (isChangedSearchCondition) {
        // 검색 조건이 바뀐 후 패치 -> 기존 데이터 날리고 새로 저장
        setJobPosts(data.edges.map((edge) => edge.node));
        setIsChangedSearchCondition(false);
      } else {
        // 스크롤 다운 후 패치 -> 기존 데이터에 추가
        setJobPosts((state) =>
          state.concat(data.edges.map((edge) => edge.node))
        );
      }
      setPageInfo(data.pageInfo); // 페이지 정보 저장
    },
  });

  useEffect(() => {
    if (!meData?.me?.residentNeighborhood) return;
    const testData = [
      { id: "1111064000", name: "이화동", level: 3 },
      { id: "1114061500", name: "신당동", level: 2 },
      { id: "1117051000", name: "후암동", level: 4 },
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
    setupNeighbors(testData); // TODO : meData.me.residentNeighborhood 로 교체하기
  }, [meData]);

  useEffect(() => {
    // 선택된 동이 없을 경우, 첫 번째 상주 지역을 선택
    if (Object.keys(neighbors).includes(selectedNeighborID)) return;
    const ids = Object.keys(neighbors);
    if (ids.length === 0) return;
    setSelectedNeighborID(ids[0]);
  }, [neighbors]);

  const fetchJobPosts = (cursor) => {
    if (Object.keys(neighbors).length === 0 || !selectedNeighborID) return;
    const selectedNeighbor = neighbors[selectedNeighborID];
    const days = filter.weekDays.map((day) => DAYS_KEY[day]);
    const filters = {
      neighbors: selectedNeighbor.districts.map((district) => district.id),
      keyword: debouncedSearchValue,
      workPeriod: TERM_KEY[filter.term],
      jobCategories: filter.jobTypes.map((type) => JOB_TYPES_KEY[type]),
      startTime: filter.time.start,
      endTime: filter.time.end,
      ...(filter.term === TERM.LONG_TERM && { days }),
    };
    const jobPostCursorInput = { afterCursor: cursor, first: 20 };
    setIsChangedSearchCondition(true);
    // searchJobPosts({ variables: { filters, jobPostCursorInput } });
  };

  useEffect(() => {
    // 검색 조건이 변경된 후 패치
    fetchJobPosts(null);
  }, [selectedNeighborID, debouncedSearchValue, filter]);

  const fetchMoreJobPosts = () => {
    console.log("fetchMoreJobPosts");
    // 스크롤 영역이 바닥에 다다랐을 때 패치
    if (pageInfo.hasNextPage) fetchJobPosts(pageInfo.endCursor);
  };

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
          <input
            placeholder="주변 알바 검색"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />
        </InputContainer>
        <WarningText>
          {(getResidentNeighborhoodError || searchJobPostsError) &&
            ERROR.SERVER}
        </WarningText>
        <ContentContainer>
          <JobFilter filter={filter} setFilter={setFilter} />
          <JobList jobPosts={jobPosts} fetchMoreJobPosts={fetchMoreJobPosts} />
        </ContentContainer>
      </Container>
    </Background>
  );
};

export default ExploreJobsPage;
