import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useLazyQuery } from "@apollo/client";
import { fetchDistrictBoundary } from "../api/rest/neighborhood.ts";
import { MainBackgroundColor } from "../styles/global";
import formatTimeAgo from "../utils/formatTimeAgo";
import useBackgroundColor from "../utils/useBackgroundColor";
import useDebounce from "../utils/useDebounce";
import JobList from "../components/ExploreJobsPage/JobList.tsx";
import JobFilter from "../components/ExploreJobsPage/JobFilter.tsx";
import NeighborhoodButton from "../components/ExploreJobsPage/NeighborhoodSelector.tsx";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  Background,
  Container,
  InputContainer,
  ContentContainer,
} from "../styles/ExploreJobsPage.styles";
import { WarningText } from "../styles/global";
import { SearchNeighborhood } from "../types/types.ts";
import {
  GET_RESIDENT_NEIGHBORHOOD,
  SEARCH_JOB_POSTS,
} from "../api/graphql/queries.js";
import {
  ERROR,
  PERIOD,
  PERIOD_KEY,
  JOB_TYPES_KEY,
  DAYS_KEY,
  TIME_NOT_SET,
  JOB_POST_STATUS,
} from "../constants/constants";
import { JobPost, PageInfo, Filter } from "../types/types.ts";

const ExploreJobsPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const [neighborhoods, setNeighborhoods] = useState<
    Record<string, SearchNeighborhood>
  >({});
  const [selectedNeighborhoodID, setSelectedNeighborhoodID] =
    useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 100);
  const [filter, setFilter] = useState<Filter>({
    period: null,
    jobTypes: [],
    time: { start: TIME_NOT_SET, end: TIME_NOT_SET },
    days: [],
  });
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    hasNextPage: false,
    endCursor: null,
  });
  const [totalCount, setTotalCount] = useState<number>(0);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const isChangedSearchConditionRef = useRef<boolean>(false);
  const [fetchDistrictBoundaryError, setFetchDistrictBoundaryError] =
    useState(false);

  const {
    loading: getResidentNeighborhoodLoading,
    error: getResidentNeighborhoodError,
    data: meData,
  } = useQuery(GET_RESIDENT_NEIGHBORHOOD, {
    fetchPolicy: "network-only",
  });
  const [
    searchJobPosts,
    { loading: searchJobPostsLoading, error: searchJobPostsError },
  ] = useLazyQuery(SEARCH_JOB_POSTS, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      // 게시 시간 가공
      const nodes = data.searchJobPosts.edges.map((edge) => ({
        ...edge.node,
        createdAt: formatTimeAgo(edge.node.createdAt),
      }));
      if (isChangedSearchConditionRef.current) {
        // 검색 조건이 바뀐 후 패치 -> 기존 데이터 날리고 새로 저장
        setJobPosts(nodes);
        isChangedSearchConditionRef.current = false;
      } else {
        // 스크롤 다운 후 패치 -> 기존 데이터에 추가
        setJobPosts((state) => state.concat(nodes));
      }
      setPageInfo(data.searchJobPosts.pageInfo); // 페이지 정보 저장
      setTotalCount(data.searchJobPosts.totalCount); // 총 개수 저장
    },
  });

  useEffect(() => {
    // 상주 지역과 그 인접 동 데이터 불러와서 neighborhoods 상태로 세팅
    const setupNeighborhoods = async (residentNeighborhoods) => {
      const result = {};
      for (const neighborhood of residentNeighborhoods) {
        let boundaries;
        try {
          boundaries = await fetchDistrictBoundary(neighborhood.id);
        } catch (e) {
          console.error("FetchDistrictBoundary Error: ", e.message);
          setFetchDistrictBoundaryError(true);
          return;
        }
        result[neighborhood.id] = {
          ...neighborhood,
          districts: boundaries[neighborhood.level].districts,
        };
      }
      setNeighborhoods(result);
    };
    if (!meData?.me?.residentNeighborhood) return;
    setupNeighborhoods(meData?.me?.residentNeighborhood);
  }, [meData]);

  useEffect(() => {
    // 선택된 동이 없을 경우, 첫 번째 상주 지역을 선택
    if (Object.keys(neighborhoods).includes(selectedNeighborhoodID)) return;
    const ids = Object.keys(neighborhoods);
    if (ids.length === 0) return;
    setSelectedNeighborhoodID(ids[0]);
  }, [neighborhoods]);

  const fetchJobPosts = useCallback(
    (cursor) => {
      const getProcessedTime = () => {
        if (
          filter.time.start === TIME_NOT_SET ||
          filter.time.end === TIME_NOT_SET
        ) {
          // 하나라도 세팅이 안 되어 있으면 둘 다 null로 전송
          return { startTime: null, endTime: null };
        }
        if (filter.time.end === "24:00") {
          if (filter.time.start === "00:00") {
            return { startTime: null, endTime: null };
          } else {
            return { startTime: filter.time.start, endTime: "00:00" };
          }
        }
        return { startTime: filter.time.start, endTime: filter.time.end };
      };
      if (Object.keys(neighborhoods).length === 0 || !selectedNeighborhoodID)
        return;
      const selectedNeighborhood = neighborhoods[selectedNeighborhoodID];
      const days = filter.days.map((day) => DAYS_KEY[day]);
      const { startTime, endTime } = getProcessedTime();

      const filters = {
        neighborhoodIds: selectedNeighborhood.districts.map(
          (district) => district.id
        ),
        keyword: debouncedSearchValue || null,
        workPeriodType: filter.period ? PERIOD_KEY[filter.period] : null,
        jobCategories: filter.jobTypes.map((type) => JOB_TYPES_KEY[type]),
        startTime,
        endTime,
        ...(filter.period === PERIOD.LONG_TERM && { days }),
        status: JOB_POST_STATUS.OPEN,
      };
      const pagination = { afterCursor: cursor, first: 20 };
      try {
        searchJobPosts({ variables: { filters, pagination } });
      } catch (e) {
        console.log("SearchJobPosts Query Error: ", e.message);
      }
    },
    [
      debouncedSearchValue,
      filter,
      neighborhoods,
      selectedNeighborhoodID,
      searchJobPosts,
    ]
  );

  useEffect(() => {
    // 검색 조건이 변경된 후 패치
    isChangedSearchConditionRef.current = true;
    fetchJobPosts(null);
  }, [fetchJobPosts]);

  const fetchMoreJobPosts = useCallback(() => {
    // 스크롤 영역이 바닥에 다다랐을 때 패치
    if (pageInfo.hasNextPage) fetchJobPosts(pageInfo.endCursor);
  }, [fetchJobPosts, pageInfo]);

  return (
    <Background>
      {(getResidentNeighborhoodLoading ||
        (searchJobPostsLoading && !isChangedSearchConditionRef.current)) && (
        <LoadingOverlay />
      )}
      <Container>
        <InputContainer>
          <NeighborhoodButton
            neighborhoods={neighborhoods}
            selectedNeighborhoodID={selectedNeighborhoodID}
            setSelectedNeighborhoodID={setSelectedNeighborhoodID}
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
          {(getResidentNeighborhoodError ||
            searchJobPostsError ||
            fetchDistrictBoundaryError) &&
            ERROR.SERVER}
        </WarningText>
        <ContentContainer>
          <JobFilter filter={filter} setFilter={setFilter} />
          <JobList
            totalCount={totalCount}
            jobPosts={jobPosts}
            fetchMoreJobPosts={fetchMoreJobPosts}
          />
        </ContentContainer>
      </Container>
    </Background>
  );
};

export default ExploreJobsPage;
