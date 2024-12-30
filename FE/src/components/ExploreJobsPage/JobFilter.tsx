import React, { useMemo } from "react";
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
} from "../../constants/constants";
import TimeRangeSelection from "../TimeRangeSelection.tsx";
import { Filter } from "../../types/types.ts";

type JobFilterProps = {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
};

const JobFilter: React.FC<JobFilterProps> = (props) => {
  const { filter, setFilter } = props;
  const { period, jobTypes, time, weekDays } = filter;

  const periodToDisplay = useMemo(
    () => [PERIOD.SHORT_TERM, PERIOD.LONG_TERM],
    []
  );

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

  const onWeekDayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dayClicked = e.currentTarget.textContent || "";
    setFilter((state) => ({
      ...state,
      weekDays: toggleSelected(state.weekDays, dayClicked),
    }));
  };

  const onInitClick = () => {
    setFilter({
      period: null,
      jobTypes: [],
      weekDays: [],
      time: { start: TIME_NOT_SET, end: TIME_NOT_SET },
    });
  };

  const setTime = (getTime) => {
    setFilter((state) => ({
      ...state,
      time: getTime(state.time),
    }));
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
          <label htmlFor="weekDays">일하는 요일</label>
          <Chips
            id="weekDays"
            options={Object.values(DAYS)}
            onClick={onWeekDayClick}
            isSelected={(day) => weekDays.includes(day)}
            containerStyle={ChipsContainerStyle}
            optionStyle={ChipsOptionStyle}
          />
        </FilterField>
      )}
      <FilterField>
        <label htmlFor="weekDays">일하는 시간</label>
        <TimeRangeSelection
          time={time}
          setTime={setTime}
          isMini={true}
          notSetPossible={true}
        />
      </FilterField>
    </JobFilterContainer>
  );
};

export default JobFilter;
