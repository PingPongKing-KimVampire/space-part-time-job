import React from "react";
import {
  addMonths,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  compareAsc,
} from "date-fns";
import { createStitches } from "@stitches/react";
import { DAYS } from "../../constants/constants.ts";

const { styled } = createStitches();

const Container = styled("div", {
  width: "50%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  "& .title": {
    fontSize: "20px",
    fontWeight: "bold",
    padding: "15px",
  },
});

const Calendar = styled("div", {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  "& > *": {
    width: "calc(100% / 7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxSizing: "border-box",
  },
  "& .weekDay": {
    padding: "4px",
    fontSize: "15px",
    color: "#9A9A9A",
  },
  "& .date": {
    padding: "12px",
    fontSize: "18px",
    border: "none",
    background: "none",
    "&.selectable": {
      cursor: "pointer",
    },
    "&:not(.selectable)": {
      color: "#6E6E6E",
      cursor: "not-allowed",
    },
  },
});

const CustomCalendar = () => {
  const today = new Date();
  const selectableStart = today; // 선택 가능한 시작 날짜 (오늘)
  const selectableEnd = subDays(addMonths(today, 1), 1); // 선택 가능한 끝 날짜 (한 달 후)

  const visibleStart = startOfWeek(selectableStart); // 볼 수 있는 시작 날짜 (오늘이 있는 주의 첫 날)
  const visibleEnd = endOfWeek(selectableEnd); // 볼 수 있는 끝 날짜 (한 달 후가 있는 주의 마지막 날)

  const visibleDays = eachDayOfInterval({
    start: visibleStart,
    end: visibleEnd,
  });

  return (
    <Container>
      <div className="title">
        {format(selectableStart, "yyyy.MM.dd")}~
        {format(selectableEnd, "yyyy.MM.dd")}
      </div>
      <Calendar>
        {DAYS.map((day) => (
          <div className="weekDay">{day}</div>
        ))}
        {visibleDays &&
          visibleDays.map((day) => {
            const date = isSameDay(today, day) ? "오늘" : format(day, "d");
            // selectabeStart 이상, selectableEnd 이하면 selected 추가
            // TODO : 오늘 날짜에 selectable이 추가되지 않음
            const selectable =
              compareAsc(selectableStart, day) <= 0 &&
              compareAsc(day, selectableEnd) <= 0;
            return (
              <button className={`date ${selectable ? "selectable" : ""}`}>
                {date}
              </button>
            );
          })}
      </Calendar>
    </Container>
  );
};

export default CustomCalendar;
