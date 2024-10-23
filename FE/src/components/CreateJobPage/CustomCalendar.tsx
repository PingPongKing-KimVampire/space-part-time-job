import React, { useState, useEffect, useMemo } from "react";
import {
  addMonths,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  compareAsc,
  isSunday,
} from "date-fns";
import { createStitches } from "@stitches/react";
import { DAYS } from "../../constants/constants.ts";
import { MainColor } from "../../styles/global.ts";

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
    borderRadius: "100px",
    padding: "12px",
    fontSize: "18px",
    border: "none",
    background: "none",
    transitionProperty: "background border-radius",
    transitionDuration: "0.2s",
    "&.selectable": {
      cursor: "pointer",
      "&.sunday": {
        color: "#BD2A2E",
      },
      "&:hover": {
        background: "#DCE2FF",
      },
      "&.selected": {
        background: MainColor,
        color: "white",
        "&.rightSelected": {
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",
        },
        "&.leftSelected": {
          borderTopLeftRadius: "0",
          borderBottomLeftRadius: "0",
        },
      },
    },
    "&:not(.selectable)": {
      color: "#6E6E6E",
      cursor: "not-allowed",
    },
  },
});

const CustomCalendar = () => {
  const today = useMemo(() => new Date().setHours(0, 0, 0, 0), []);
  const selectableStart = useMemo(() => today, [today]); // 선택 가능한 시작 날짜 (오늘)
  const selectableEnd = useMemo(() => subDays(addMonths(today, 1), 1), [today]); // 선택 가능한 끝 날짜 (한 달 후)
  const visibleStart = useMemo(
    () => startOfWeek(selectableStart),
    [selectableStart]
  ); // 볼 수 있는 시작 날짜 (오늘이 있는 주의 첫 날)
  const visibleEnd = useMemo(() => endOfWeek(selectableEnd), [selectableEnd]); // 볼 수 있는 끝 날짜 (한 달 후가 있는 주의 마지막 날)
  const visibleDays = useMemo(() => {
    const days = eachDayOfInterval({
      start: visibleStart,
      end: visibleEnd,
    }).map((day) => ({
      day,
      isSelectable:
        compareAsc(selectableStart, day) <= 0 &&
        compareAsc(day, selectableEnd) <= 0,
      isSunday: isSunday(day),
      isToday: isSameDay(today, day),
    }));
    return days;
  }, [visibleStart, visibleEnd, selectableStart, selectableEnd, today]);

  const [isSelecteds, setIsSelecteds] = useState<Boolean[]>(
    new Array(visibleDays.length).fill(false)
  );

  const onDateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const index = parseInt(e.currentTarget.getAttribute("data-index") || "");
    if (isNaN(index)) return;
    setIsSelecteds((prev) =>
      prev.map((selected, i) => (i === index ? !selected : selected))
    );
  };

  const [isDragging, setIsDragging] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDragging) return;
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const index = parseInt(element?.getAttribute("data-index") || "");
    if (isNaN(index)) return;
    setIsSelecteds((prev) =>
      prev.map((selected, i) => (i === index ? true : selected))
    );
  };

  return (
    <Container>
      <div className="title">
        {format(selectableStart, "yyyy.MM.dd")}~
        {format(selectableEnd, "yyyy.MM.dd")}
      </div>
      <Calendar
        onMouseDown={() => {
          setIsDragging(true);
        }}
        onMouseUp={() => {
          setIsDragging(false);
        }}
        onMouseMove={onMouseMove}
      >
        {DAYS.map((day) => (
          <div className="weekDay">{day}</div>
        ))}
        {visibleDays &&
          visibleDays.map((dayInfo, index) => {
            const classNames = ["date"];
            if (dayInfo.isSelectable) classNames.push("selectable");
            if (isSelecteds[index]) classNames.push("selected");
            if (index !== 0 && isSelecteds[index - 1])
              classNames.push("leftSelected");
            if (index !== visibleDays.length && isSelecteds[index + 1])
              classNames.push("rightSelected");
            return (
              <button
                className={classNames.join(" ")}
                disabled={!dayInfo.isSelectable}
                key={format(dayInfo.day, "MM.dd")}
                data-index={index}
                onClick={onDateClick}
              >
                {dayInfo.isToday ? "오늘" : format(dayInfo.day, "d")}
              </button>
            );
          })}
      </Calendar>
    </Container>
  );
};

export default CustomCalendar;
