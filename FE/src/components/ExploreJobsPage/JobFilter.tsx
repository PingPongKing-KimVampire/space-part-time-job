import React, { useMemo, useState } from "react";
import Chips from "../Chips.tsx";
import {
  JobFilterContainer,
  FilterField,
  ChipsContainerStyle,
  ChipsOptionStyle,
} from "../../styles/ExploreJobsPage.styles.ts";
import { JOB_TYPES, TERM, DAYS } from "../../constants/constants.ts";
import TimeRangeSelection from "../TimeRangeSelection.tsx";

const JobFilter = () => {
  const [term, setTerm] = useState<string>(TERM.SHORT_TERM);
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [time, setTime] = useState({ start: "00:00", end: "00:00" });
  const [weekDays, setWeekDays] = useState<string[]>([]);

  const termToDisplay = useMemo(() => [TERM.SHORT_TERM, TERM.LONG_TERM], []);

  // TODO: CreateJobPage와 중복되는 코드
  const onTermClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const TermClicked = e.currentTarget.textContent || TERM.TODAY;
    setTerm(TermClicked);
  };

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

  const onJobTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const jobTypeClicked = e.currentTarget.textContent || JOB_TYPES.SERVING;
    setJobTypes(toggleSelected(jobTypes, jobTypeClicked));
  };

  const onWeekDayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dayClicked = e.currentTarget.textContent || "";
    setWeekDays(toggleSelected(weekDays, dayClicked));
  };

  const onInitClick = () => {
    setTerm("");
    setJobTypes([]);
    setWeekDays([]);
    setTime({ start: "00:00", end: "00:00" });
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
          options={termToDisplay}
          onClick={onTermClick}
          isSelected={(t) => t === term}
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
      {term === TERM.LONG_TERM && (
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
        <TimeRangeSelection time={time} setTime={setTime} isMini={true} />
      </FilterField>
    </JobFilterContainer>
  );
};

export default JobFilter;
