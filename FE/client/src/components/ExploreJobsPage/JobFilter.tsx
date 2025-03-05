import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Chips from "../Chips.tsx";
import {
  JobFilterContainer,
  FilterField,
} from "../../styles/pages/ExploreJobsPage.styles";
import {
  JOB_TYPES,
  PERIOD,
  DAYS,
  TIME_NOT_SET,
  START_TIMES,
  END_TIMES,
} from "../../constants/constants";
import TimeRangeSelection from "../TimeRangeSelection.tsx";
import { Filter } from "../../types/types.ts";
import setQueryParam from "../../utils/setQueryParam.ts";
import { ReactComponent as XIcon } from "../../assets/icons/x-mark.svg";

type JobFilterProps = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  isModal?: boolean;
  setIsFilterModalVisible?: React.Dispatch<React.SetStateAction<boolean>>;
};

const JobFilter: React.FC<JobFilterProps> = (props) => {
  const location = useLocation();
  const { filter, setFilter, isModal = false, setIsFilterModalVisible } = props;
  const { period, jobTypes, time, days } = filter;

  const [modalValue, setModalValue] = useState({
    period,
    jobTypes,
    time,
    days,
  });

  const periodToDisplay = useMemo(
    () => [PERIOD.SHORT_TERM, PERIOD.LONG_TERM],
    []
  );

  // TODO : URL 쿼리 파라미터 업데이트, filter 상태 업데이트가 무한 반복되는 거 아닌가?
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const period = params.get("period") || "";
    const [startTime, endTime] = params.get("time")?.split("~") || [];
    const allTimeSet =
      START_TIMES.includes(startTime) && END_TIMES.includes(endTime);
    const jobTypes = params.get("categories")?.split(",") || [];
    const days = params.get("days")?.split(",") || [];
    setFilter({
      period: periodToDisplay.includes(period) ? period : "",
      jobTypes: jobTypes.filter((type) =>
        Object.values(JOB_TYPES).includes(type)
      ),
      time: {
        start: allTimeSet ? startTime : TIME_NOT_SET,
        end: allTimeSet ? endTime : TIME_NOT_SET,
      },
      days: days.filter((day) => Object.values(DAYS).includes(day)),
    });
  }, [location.search]);
  useEffect(() => {
    if (isModal) return;
    setQueryParam("period", filter.period);
    setQueryParam("categories", filter.jobTypes.join(","));
    setQueryParam("time", `${filter.time.start}~${filter.time.end}`);
    setQueryParam("days", filter.days.join(","));
  }, [filter]);

  const toggleSelected = (
    list: string[],
    target: string,
    preprocessing?: (input: string[]) => string[]
  ) => {
    if (list.includes(target))
      return list.filter((element) => element !== target);
    if (preprocessing) return preprocessing(list.concat(target));
    return list.concat(target);
  };

  const onPeriodClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const periodClicked = e.currentTarget.textContent || PERIOD.SHORT_TERM;
    const set = isModal ? setModalValue : setFilter;
    set((state) => ({
      ...state,
      period: state.period === periodClicked ? null : periodClicked,
    }));
  };

  const onJobTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const jobTypeClicked = e.currentTarget.textContent || JOB_TYPES.SERVING;
    const set = isModal ? setModalValue : setFilter;
    set((state) => ({
      ...state,
      jobTypes: toggleSelected(
        isModal ? modalValue.jobTypes : jobTypes,
        jobTypeClicked
      ),
    }));
  };

  const onDayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dayClicked = e.currentTarget.textContent || "";
    const set = isModal ? setModalValue : setFilter;
    set((state) => ({
      ...state,
      days: toggleSelected(isModal ? modalValue.days : days, dayClicked),
    }));
  };

  const onInitClick = () => {
    const set = isModal ? setModalValue : setFilter;
    set({
      period: null,
      jobTypes: [],
      days: [],
      time: { start: TIME_NOT_SET, end: TIME_NOT_SET },
    });
  };

  const setTime = (getTime, type) => {
    const set = isModal ? setModalValue : setFilter;
    set((state) => {
      const time = getTime(state.time);
      const { start, end } = time;
      if (type === "start") {
        if (start === TIME_NOT_SET && end !== TIME_NOT_SET) {
          time.end = TIME_NOT_SET;
        } else if (start !== TIME_NOT_SET && end === TIME_NOT_SET) {
          time.end = "24:00";
        }
      } else {
        // type = "end"
        if (end === TIME_NOT_SET && start !== TIME_NOT_SET) {
          time.start = TIME_NOT_SET;
        } else if (end !== TIME_NOT_SET && start === TIME_NOT_SET) {
          time.start = "00:00";
        }
      }
      return { ...state, time };
    });
  };

  const onXClick = () => {
    if (setIsFilterModalVisible) setIsFilterModalVisible(false);
  };

  const onApplyClick = () => {
    setFilter(modalValue);
    if (setIsFilterModalVisible) setIsFilterModalVisible(false);
  };

  return (
    <JobFilterContainer
      className={`filterContainer ${isModal ? "isModal" : ""}`}
    >
      <XIcon className="xButton" onClick={onXClick} />
      <div className="topContainer">
        <div className="title">{isModal ? "알바 검색 " : ""}필터</div>
        <button className="initButton" onClick={onInitClick}>
          초기화
        </button>
      </div>
      <div className="content">
        <FilterField className="field">
          <label htmlFor="period">일하는 기간</label>
          <Chips
            id="period"
            options={periodToDisplay}
            onClick={onPeriodClick}
            isSelected={(t) => t === (isModal ? modalValue.period : period)}
          />
        </FilterField>
        <FilterField className="field">
          <label htmlFor="jobTypes">하는 일</label>
          <Chips
            id="jobTypes"
            options={Object.values(JOB_TYPES)}
            onClick={onJobTypeClick}
            isSelected={(type) =>
              isModal
                ? modalValue.jobTypes.includes(type)
                : jobTypes.includes(type)
            }
          />
        </FilterField>
        {((isModal && modalValue.period === PERIOD.LONG_TERM) ||
          (!isModal && period === PERIOD.LONG_TERM)) && (
          <FilterField className="field">
            <label htmlFor="days">일하는 요일</label>
            <Chips
              id="days"
              options={Object.values(DAYS)}
              onClick={onDayClick}
              isSelected={(day) =>
                isModal ? modalValue.days.includes(day) : days.includes(day)
              }
            />
          </FilterField>
        )}
        <FilterField className="field">
          <label htmlFor="time">일하는 시간</label>
          <TimeRangeSelection
            time={isModal ? modalValue.time : time}
            setTime={setTime}
            notSetPossible={true}
            className="inExploreJobs"
          />
        </FilterField>
      </div>
      {/* 필터 모달에서만 표시됨 */}
      <div className="modalButtonGroups">
        <button className="initButton" onClick={onInitClick}>
          초기화
        </button>
        <button className="applyButton" onClick={onApplyClick}>
          필터 적용
        </button>
      </div>
    </JobFilterContainer>
  );
};

export default JobFilter;
