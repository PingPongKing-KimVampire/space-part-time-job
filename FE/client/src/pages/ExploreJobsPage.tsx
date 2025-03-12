import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLazyQuery } from "@apollo/client";
import formatTimeAgo from "../utils/formatTimeAgo";
import useBackgroundColor from "../utils/useBackgroundColor";
import useDebounce from "../utils/useDebounce";
import JobList from "../components/ExploreJobsPage/JobList";
import JobFilter from "../components/ExploreJobsPage/JobFilter";
import NeighborhoodButton from "../components/ExploreJobsPage/NeighborhoodSelector";
import {
  Background,
  Container,
  InputContainer,
  ContentContainer,
} from "../styles/pages/ExploreJobsPage.styles";
import {
  MainBackgroundColor,
  WarningText,
  ModalBackground,
} from "../styles/global";
import { SEARCH_JOB_POSTS } from "../api/graphql/queries.js";
import { processSearchJobPosts } from "../api/graphql/processData";
import {
  ERROR,
  PERIOD,
  PERIOD_KEY,
  JOB_TYPES_KEY,
  DAYS_KEY,
  TIME_NOT_SET,
  JOB_POST_STATUS,
} from "../constants/constants";
import { JobPost, PageInfo, Filter, ApiState } from "../types/types";
import setQueryParam from "../utils/setQueryParam";
import { fetchResidentNeighborhoods } from "../redux/residentNeighborhoods";
import { ReactComponent as WriteIcon } from "../assets/icons/write.svg";
import { ReactComponent as FilterIcon } from "../assets/icons/filter.svg";

const ExploreJobsPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedNeighborhoodID, setSelectedNeighborhoodID] =
    useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchValue = useDebounce(searchValue, 200);
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
  const [nextJobPosts, setNextJobPosts] = useState<JobPost[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] =
    useState<boolean>(false);

  const isFirstFetchRef = useRef<boolean>(true);

  const {
    data: residentNeighborhoods,
    loading: fetchResidentNeighborhoodsLoading,
    error: fetchResidentNeighborhoodsError,
  } = useSelector(
    (state: { residentNeighborhoods: ApiState }) => state.residentNeighborhoods
  );

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchValue(params.get("query") || "");
    setSelectedNeighborhoodID(params.get("neighborhood-id") || "");
  }, [location.search]);
  useEffect(() => {
    setQueryParam("query", searchValue);
  }, [searchValue]);
  useEffect(() => {
    setQueryParam("neighborhood-id", selectedNeighborhoodID);
  }, [selectedNeighborhoodID]);

  useEffect(() => {
    if (Object.keys(residentNeighborhoods).length === 0) {
      // TODO : 빨간 줄 해결하기
      dispatch(fetchResidentNeighborhoods());
    }
  }, [residentNeighborhoods]);

  useEffect(() => {
    // 선택된 동이 없을 경우, 세션 스토리지에서 가져오거나 첫 번째 상주 지역을 선택
    const neighborhoodIds = Object.keys(residentNeighborhoods);
    if (neighborhoodIds.length === 0) return;
    if (neighborhoodIds.includes(selectedNeighborhoodID)) return;
    const selectedId = sessionStorage.getItem("selectedNeighborhoodID");
    setSelectedNeighborhoodID(selectedId || neighborhoodIds[0]);
  }, [residentNeighborhoods]);

  const [searchJobPosts, { error: searchJobPostsError }] = useLazyQuery(
    SEARCH_JOB_POSTS,
    { fetchPolicy: "network-only" }
  );
  const [searchJobPostsFinalError, setSearchJobPostsFinalError] =
    useState<Error | null>(null);
  const [searchJobPostsLoading, setSearchJobPostsLoading] = useState(true);
  useEffect(() => {
    if (searchJobPostsError)
      setSearchJobPostsFinalError(new Error(ERROR.SERVER));
  }, [searchJobPostsError]);

  const fetchJobPosts = useCallback(
    async (
      cursor
    ): Promise<{ posts: JobPost[]; pageInfo: PageInfo } | null> => {
      if (
        Object.keys(residentNeighborhoods).length === 0 ||
        !selectedNeighborhoodID
      )
        return null;
      const selectedNeighborhood =
        residentNeighborhoods[selectedNeighborhoodID];
      if (!selectedNeighborhood) return null;
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
        const result: { posts: JobPost[]; pageInfo: PageInfo } =
          await new Promise((resolve, reject) => {
            setSearchJobPostsLoading(true);
            searchJobPosts({
              variables: { filters, pagination },
              onCompleted: (data) => {
                try {
                  const { totalCount, edges, pageInfo } =
                    processSearchJobPosts(data);
                  const posts = edges.map((edge) => ({
                    ...edge.node,
                    createdAt: formatTimeAgo(edge.node.createdAt),
                  }));
                  setPageInfo(pageInfo); // 페이지 정보 저장
                  setTotalCount(totalCount); // 총 개수 저장
                  resolve({ posts, pageInfo });
                } catch (e) {
                  reject(e);
                } finally {
                  setSearchJobPostsLoading(false);
                }
              },
              onError: () => {
                reject(new Error(ERROR.SERVER));
              },
            });
          });
        return result;
      } catch (e) {
        console.log("SearchJobPosts Query Error: ", e.message);
      }
      return null;
    },
    [
      debouncedSearchValue,
      filter,
      residentNeighborhoods,
      selectedNeighborhoodID,
      searchJobPosts,
    ]
  );

  useEffect(() => {
    // 처음이나 검색 조건이 변경된 후 패치
    window.scrollTo(0, 0);
    isFirstFetchRef.current = true;
    const setupJobPosts = async () => {
      const firstResult = await fetchJobPosts(null);
      if (!firstResult) return;
      const { posts: firstPosts, pageInfo } = firstResult;
      setJobPosts(firstPosts);
      if (!pageInfo.hasNextPage) return;
      const secondResult = await fetchJobPosts(pageInfo.endCursor);
      if (!secondResult) return;
      const { posts: secondPosts } = secondResult;
      setNextJobPosts(secondPosts);
    };
    setupJobPosts();
  }, [fetchJobPosts]);

  const fetchMoreJobPosts = useCallback(async () => {
    // 스크롤 영역이 바닥에 다다랐을 때 패치
    setJobPosts((state) => state.concat(nextJobPosts));
    setNextJobPosts([]);
    if (pageInfo.hasNextPage) {
      const result = await fetchJobPosts(pageInfo.endCursor);
      if (!result) return;
      setNextJobPosts(result.posts);
    }
  }, [fetchJobPosts, pageInfo, nextJobPosts]);

  return (
    <Background>
      {isFilterModalVisible && (
        <ModalBackground>
          <JobFilter
            filter={filter}
            setFilter={setFilter}
            isModal={true}
            setIsFilterModalVisible={setIsFilterModalVisible}
          />
        </ModalBackground>
      )}
      <Container>
        <InputContainer>
          <NeighborhoodButton
            neighborhoods={residentNeighborhoods}
            selectedNeighborhoodID={selectedNeighborhoodID}
            setSelectedNeighborhoodID={setSelectedNeighborhoodID}
            loading={fetchResidentNeighborhoodsLoading}
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
          {fetchResidentNeighborhoodsError && ERROR.SERVER}
          {searchJobPostsFinalError && searchJobPostsFinalError.message}
        </WarningText>
        <button
          className="filterButton"
          onClick={() => {
            setIsFilterModalVisible(true);
          }}
        >
          <FilterIcon />
          필터
        </button>
        <ContentContainer>
          <JobFilter filter={filter} setFilter={setFilter} />
          <JobList
            totalCount={totalCount}
            jobPosts={jobPosts}
            fetchMoreJobPosts={fetchMoreJobPosts}
            loading={searchJobPostsLoading}
          />
        </ContentContainer>
        <button
          className="createJobButton"
          onClick={() => {
            navigate("/create-job");
          }}
        >
          <WriteIcon />
        </button>
      </Container>
    </Background>
  );
};

export default ExploreJobsPage;
