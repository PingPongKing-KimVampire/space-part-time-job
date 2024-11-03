import React, { useState, useMemo } from "react";
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
import { DAYS } from "../../constants/constants.ts";
import {
  Container,
  Calendar,
  DateItem,
} from "../../styles/CreateJobPage/CustomCalendar.styles.ts";

type CustomCalendarProps = {
  dates: Set<string>;
  setDates: React.Dispatch<React.SetStateAction<Set<string>>>;
  onClickStart?: () => void;
};

const CustomCalendar: React.FC<CustomCalendarProps> = (props) => {
  const { dates, setDates, onClickStart } = props;

  const today = useMemo(() => new Date().setHours(0, 0, 0, 0), []);
  const selectableStart = useMemo(() => today, [today]); // 선택 가능한 시작 날짜 (오늘)
  const selectableEnd = useMemo(() => subDays(addMonths(today, 1), 1), [today]); // 선택 가능한 끝 날짜 (한 달 후)
  const visibleStart = useMemo(
    () => startOfWeek(selectableStart),
    [selectableStart]
  ); // 볼 수 있는 시작 날짜 (오늘이 있는 주의 첫 날)
  const visibleEnd = useMemo(() => endOfWeek(selectableEnd), [selectableEnd]); // 볼 수 있는 끝 날짜 (한 달 후가 있는 주의 마지막 날)
  const visibleDates = useMemo(() => {
    const dates = eachDayOfInterval({
      start: visibleStart,
      end: visibleEnd,
    }).map((date) => ({
      date,
      dateString: format(date, "yyyy-MM-dd"),
      isSelectable:
        compareAsc(selectableStart, date) <= 0 &&
        compareAsc(date, selectableEnd) <= 0,
      isSunday: isSunday(date),
      isToday: isSameDay(today, date),
    }));
    return dates;
  }, [visibleStart, visibleEnd, selectableStart, selectableEnd, today]);
  const title = useMemo(() => {
    return `${format(selectableStart, "yyyy.MM.dd")}~${format(
      selectableEnd,
      "yyyy.MM.dd"
    )}`;
  }, [selectableStart, selectableEnd]);

  const onDateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClickStart) onClickStart();
    const date: string = e.currentTarget.getAttribute("data-date") || "";
    if (dates.has(date)) {
      setDates((state) => {
        const newDates = new Set(state);
        newDates.delete(date);
        return newDates;
      });
    } else {
      setDates((state) => new Set(state).add(date));
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDragging) return;
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const date: string = element?.getAttribute("data-date") || "";
    if (date === "") return;
    setDates((state) => new Set(state).add(date));
  };

  return (
    <Container>
      <div className="title">{title}</div>
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
          <div className="weekDay" key={day}>
            {day}
          </div>
        ))}
        {visibleDates &&
          visibleDates.map((dateInfo, index) => {
            const classNames = ["date"];
            if (dateInfo.isSelectable) classNames.push("selectable");
            if (dateInfo.isSunday) classNames.push("sunday");

            if (dates.has(dateInfo.dateString)) classNames.push("selected");
            if (index !== 0 && dates.has(visibleDates[index - 1].dateString)) {
              classNames.push("leftSelected");
            }
            if (
              index !== visibleDates.length - 1 &&
              dates.has(visibleDates[index + 1].dateString)
            ) {
              classNames.push("rightSelected");
            }

            return (
              <DateItem
                className={classNames.join(" ")}
                disabled={!dateInfo.isSelectable}
                key={dateInfo.dateString}
                data-date={dateInfo.dateString}
                onClick={onDateClick}
              >
                {dateInfo.isToday ? "오늘" : format(dateInfo.date, "d")}
              </DateItem>
            );
          })}
      </Calendar>
    </Container>
  );
};

export default CustomCalendar;
