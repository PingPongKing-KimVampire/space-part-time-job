import React, { useState, useMemo, useEffect } from "react";
import Chips from "../Chips.tsx";
import CustomInput from "../CustomInput.tsx";
import {
  PAY_TYPES,
  TERM,
  MINIMUM_HOURLY_PAY,
} from "../../constants/constants.ts";
import formatCurrency from "../../utils/formatCurrency.ts";
import {
  Container,
  Unit,
  MinimumMessage,
} from "../../styles/CreateJobPage/PaySection.styles.ts";

const PaySection = ({ selectedPeriod, selectedWeekDays, selectedTime }) => {
  const [payType, setPayType] = useState(PAY_TYPES.HOURLY);
  const [payAmount, setPayAmount] = useState("");

  const VISIBLE_PAY_TYPES = useMemo(() => {
    if (selectedPeriod !== TERM.LONG_TERM) {
      const payTypes = Object.values(PAY_TYPES);
      return payTypes.filter((type) => type !== PAY_TYPES.MONTHLY);
    }
    return Object.values(PAY_TYPES);
  }, [selectedPeriod]);

  useEffect(() => {
    // 일하는 기간이 '1개월 이상' 외의 항목으로 변경된 경우 && 현재 선택된 급여 타입이 '월급'인 경우
    if (selectedPeriod !== TERM.LONG_TERM && payType === PAY_TYPES.MONTHLY) {
      setPayType(PAY_TYPES.HOURLY);
    }
  }, [selectedPeriod, payType]);

  const onPayTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const payTypeClicked = e.currentTarget.textContent || "";
    if (!payTypeClicked) return;
    setPayType(payTypeClicked);
  };

  const getMinimumMonthlyPay = (selectedWeekDays, selectedTime) => {
    const weekDaysCount = selectedWeekDays.length;
    const [startH, startM] = selectedTime.start.split(":").map(Number);
    const [endH, endM] = selectedTime.end.split(":").map(Number);
    const dailyHours = (endM + endH * 60 - (startM + startH * 60)) / 60;
    const weeklyHours = dailyHours * weekDaysCount;
    const holidayPay = weeklyHours >= 15 ? MINIMUM_HOURLY_PAY : 0; // 주휴수당
    const weeksInMonth = 4.3;
    const monthlyHours = weeklyHours * weeksInMonth;
    const monthlyPay = formatCurrency(
      Math.floor(
        monthlyHours * MINIMUM_HOURLY_PAY + holidayPay * weeksInMonth
      ).toString()
    );
    return { monthlyPay, weekDaysCount, dailyHours };
  };

  const mininumMessage = useMemo(() => {
    if (payType === PAY_TYPES.PER_UNIT) return "";
    // [시급] / [월급]이면서 일하는 날짜가 오늘, 내일, 단기인 경우 -> 최저시급을 알려준다.
    if (
      payType === PAY_TYPES.HOURLY ||
      (payType === PAY_TYPES.HOURLY && selectedPeriod !== TERM.LONG_TERM)
    ) {
      return (
        <>
          * 2024년 최저시급은{" "}
          <span>{formatCurrency(MINIMUM_HOURLY_PAY)}원</span>입니다.
        </>
      );
    }
    // [월급]이면서 시간을 설정된 경우 -> 설정된 요일, 시간 기준 최소 월급을 알려준다.
    const { monthlyPay, weekDaysCount, dailyHours } = getMinimumMonthlyPay(
      selectedWeekDays,
      selectedTime
    );
    return (
      <>
        * 2024년 최저시급은 <span>{formatCurrency(MINIMUM_HOURLY_PAY)}원</span>
        이며, 하루 {dailyHours}시간씩 주 {weekDaysCount}일 근무할 경우
        주휴수당을 포함한 예상 월급은{" "}
        <span>최소 {formatCurrency(monthlyPay)}원</span> 이상이에요.
      </>
    );
  }, [payType, selectedPeriod, selectedTime, selectedWeekDays]);

  const onPayAmountBlur = () => {
    if (payAmount === "") {
      setPayAmount("");
      return;
    }
    const pureValue = parseInt(payAmount.replace(",", "")).toString();
    // 천 단위 구분법으로 가공하기
    const parts: string[] = [];
    for (let i = pureValue.length; i > 0; i -= 3) {
      const part: string = pureValue.slice(Math.max(i - 3, 0), i);
      parts.unshift(part);
    }
    setPayAmount(parts.join(","));
  };

  //123456789

  return (
    <Container>
      <Chips
        id="pay"
        options={Object.values(VISIBLE_PAY_TYPES)}
        isSelected={(type) => type === payType}
        onClick={onPayTypeClick}
      />
      <CustomInput
        id="pay"
        value={payAmount}
        eventHandlers={{
          onChange: (e) => {
            setPayAmount(e.target.value.replace(/[^0-9,]/g, ""));
          },
          onBlur: onPayAmountBlur,
        }}
        maxLength={9}
      >
        <Unit>{payType === PAY_TYPES.MONTHLY ? "만원" : "원"}</Unit>
      </CustomInput>
      <MinimumMessage>{mininumMessage}</MinimumMessage>
    </Container>
  );
};

export default PaySection;
