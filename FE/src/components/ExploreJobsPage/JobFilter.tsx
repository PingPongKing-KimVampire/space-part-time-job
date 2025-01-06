import React, { useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Chips from "../Chips.tsx";
import {
  JobFilterContainer,
  FilterField,
  ChipsContainerStyle,
  ChipsOptionStyle,
} from "../../styles/ExploreJobsPage.styles";
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

type JobFilterProps = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

const JobFilter: React.FC<JobFilterProps> = (props) => {
  const location = useLocation();
  const { filter, setFilter } = props;
  const { period, jobTypes, time, days } = filter;

  const periodToDisplay = useMemo(
    () => [PERIOD.SHORT_TERM, PERIOD.LONG_TERM],
    []
  );

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
    setFilter((state) => ({
      ...state,
      period: state.period === periodClicked ? null : periodClicked,
    }));
  };

  const onJobTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const jobTypeClicked = e.currentTarget.textContent || JOB_TYPES.SERVING;
    setFilter((state) => ({
      ...state,
      jobTypes: toggleSelected(jobTypes, jobTypeClicked),
    }));
  };

  const onDayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dayClicked = e.currentTarget.textContent || "";
    setFilter((state) => ({
      ...state,
      days: toggleSelected(state.days, dayClicked),
    }));
  };

  const onInitClick = () => {
    setFilter({
      period: null,
      jobTypes: [],
      days: [],
      time: { start: TIME_NOT_SET, end: TIME_NOT_SET },
    });
  };

  const setTime = (getTime, type) => {
    setFilter((state) => {
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

  return (
    <JobFilterContainer>
      <div className="topContainer">
        <div className="title">필터</div>
        <button className="initButton" onClick={onInitClick}>
          초기화
        </button>
      </div>
      <FilterField>
        <label htmlFor="period">일하는 기간</label>
        <Chips
          id="period"
          options={periodToDisplay}
          onClick={onPeriodClick}
          isSelected={(t) => t === period}
          containerStyle={ChipsContainerStyle}
          optionStyle={ChipsOptionStyle}
        />
      </FilterField>
      <FilterField>
        <label htmlFor="jobTypes">하는 일</label>
        <Chips
          id="jobTypes"
          options={Object.values(JOB_TYPES)}
          onClick={onJobTypeClick}
          isSelected={(type) => jobTypes.includes(type)}
          containerStyle={ChipsContainerStyle}
          optionStyle={ChipsOptionStyle}
        />
      </FilterField>
      {period === PERIOD.LONG_TERM && (
        <FilterField>
          <label htmlFor="days">일하는 요일</label>
          <Chips
            id="days"
            options={Object.values(DAYS)}
            onClick={onDayClick}
            isSelected={(day) => days.includes(day)}
            containerStyle={ChipsContainerStyle}
            optionStyle={ChipsOptionStyle}
          />
        </FilterField>
      )}
      <FilterField>
        <label htmlFor="time">일하는 시간</label>
        <TimeRangeSelection
          time={time}
          setTime={setTime}
          isMini={true}
          notSetPossible={true}
          autoBoth={true}
        />
      </FilterField>
    </JobFilterContainer>
  );
};

export default JobFilter;
