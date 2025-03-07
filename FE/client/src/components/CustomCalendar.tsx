import React, { useState, useMemo, useRef } from "react";
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

  const toggleDate = (date, addCondition) => {
    if (!setDates) return;
    if (addCondition) {
      setDates((state) => new Set(state).add(date));
    } else {
      setDates((state) => {
        const newDates = new Set(state);
        newDates.delete(date);
        return newDates;
      });
    }
  };

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const isSelectingRef = useRef<boolean | null>(null); // 드래그 중이면 boolean, 선택 중이면 true / 선택 해제 중이면 false
  const isVisitedDateRef = useRef(false); // 드래그 후 선택 가능한 첫 DateItem을 만났는가?

  const handleDateSelection = (element) => {
    if (
      !element ||
      !element.classList.contains("dateItem") ||
      !element.classList.contains("selectable")
    )
      return;
    if (onClickStart) onClickStart();
    const date = element.getAttribute("data-date")!;
    if (!isVisitedDateRef.current) {
      isSelectingRef.current = !dates.has(date);
      isVisitedDateRef.current = true;
    }
    toggleDate(date, isSelectingRef.current);
  };

  const onMouseMove = (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    if (!setDates || !isDragging) return; // setDates가 없으면 날짜 선택이 불가능한 보기용 캘린더라는 뜻
    let clientX: number, clientY: number;
    if ("touches" in e) {
      // 터치 이벤트인 경우
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // 마우스 이벤트인 경우
      clientX = e.clientX;
      clientY = e.clientY;
    }
    handleDateSelection(document.elementFromPoint(clientX, clientY));
  };

  const onDragStart = (
    e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    setIsDragging(true);
    handleDateSelection(e.target);
  };
  const onDragEnd = () => {
    setIsDragging(false);
    isVisitedDateRef.current = false;
  };

  return (
    <Container className={className}>
      {isTitleVisible && <div className="title">{title}</div>}
      <Calendar
        onMouseDown={onDragStart}
        onMouseUp={onDragEnd}
        onMouseMove={onMouseMove}
        onTouchStart={onDragStart}
        onTouchEnd={onDragEnd}
        onTouchMove={onMouseMove}
      >
        {Object.values(DAYS).map((day) => (
          <div className="day" key={day}>
            {day}
          </div>
        ))}
        {visibleDates &&
          visibleDates.map((dateInfo, index) => {
            const classNames = ["dateItem", className];
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
