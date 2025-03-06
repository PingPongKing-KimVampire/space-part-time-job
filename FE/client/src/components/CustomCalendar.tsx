import React, { useState, useMemo } from "react";
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  compareAsc,
  isSunday,
} from "date-fns";
import { DAYS } from "../constants/constants";
import {
  Container,
  Calendar,
  DateItem,
} from "../styles/components/CustomCalendar.styles";

type CustomCalendarProps = {
  dates: Set<string>;
  setDates?: (getNewDate: (dates: Set<string>) => Set<string>) => void;
  lastDate: Date;
  onClickStart?: () => void;
  isTitleVisible?: boolean;
  className: string;
};

const CustomCalendar: React.FC<CustomCalendarProps> = (props) => {
  const {
    dates,
    setDates, // 캘린더가 선택가능한지 아닌지를 암시함
    lastDate,
    onClickStart,
    isTitleVisible = true,
    className,
  } = props;

  const today = useMemo(() => new Date().setHours(0, 0, 0, 0), []);
  const visibleStart = useMemo(() => startOfWeek(today), [today]); // 볼 수 있는 시작 날짜 (오늘이 있는 주의 첫 날)
  const visibleEnd = useMemo(() => endOfWeek(lastDate), [lastDate]); // 볼 수 있는 끝 날짜 (마지막 날짜가 있는 주의 마지막 날)
  const visibleDates = useMemo(() => {
    return eachDayOfInterval({
      start: visibleStart,
      end: visibleEnd,
    }).map((date) => ({
      date,
      dateString: format(date, "yyyy-MM-dd"),
      isSelectable:
        compareAsc(today, date) <= 0 && compareAsc(date, lastDate) <= 0,
      isSunday: isSunday(date),
      isToday: isSameDay(today, date),
    }));
  }, [visibleStart, visibleEnd, today, lastDate]);
  const title = useMemo(() => {
    return `${format(today, "yyyy.MM.dd")}~${format(lastDate, "yyyy.MM.dd")}`;
  }, [today, lastDate]);

  const onDateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!setDates) return; // setDates가 없으면 날짜 선택이 불가능한 보기용 캘린더라는 뜻
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
    if (!setDates) return; // setDates가 없으면 날짜 선택이 불가능한 보기용 캘린더라는 뜻
    if (!isDragging) return;
    const element = document.elementFromPoint(e.clientX, e.clientY);
    const date: string = element?.getAttribute("data-date") || "";
    if (date === "") return;
    setDates((state) => new Set(state).add(date));
  };

  return (
    <Container className={className}>
      {isTitleVisible && <div className="title">{title}</div>}
      <Calendar
        onMouseDown={() => {
          setIsDragging(true);
        }}
        onMouseUp={() => {
          setIsDragging(false);
        }}
        onMouseMove={onMouseMove}
      >
        {Object.values(DAYS).map((day) => (
          <div className="day" key={day}>
            {day}
          </div>
        ))}
        {visibleDates &&
          visibleDates.map((dateInfo, index) => {
            const classNames = [className];
            if (setDates && dateInfo.isSelectable)
              classNames.push("selectable");
            if (!setDates) {
              classNames.push("viewable");
            }
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
                disabled={!setDates || !dateInfo.isSelectable}
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
