import React, { useMemo, useEffect } from "react";
import FormField from "./FormField.tsx";
import Chips from "../Chips.tsx";
import CustomInput from "../CustomInput.tsx";
import useCreateJobContext from "../../context/CreateJobContext.tsx";
import {
  PAY_TYPES,
  PERIOD,
  MINIMUM_HOURLY_PAY,
} from "../../constants/constants.ts";
import formatCurrency from "../../utils/formatCurrency.ts";
import {
  PayContainer,
  MinimumMessage,
} from "../../styles/pages/CreateJobPage.styles.ts";
import getMinimumMonthlyPay from "../../utils/getMinimumMonthlyPay.ts";
import { checkRulePassInCreateJob } from "../../utils/checkRulePass.ts";

const PayField = () => {
  const {
    input,
    isFocused,
    warnings,
    setInput,
    setIsFocused,
    setIsValid,
    isPayMessageVisible,
  } = useCreateJobContext();

  const VISIBLE_PAY_TYPES = useMemo(() => {
    if (input.period !== PERIOD.LONG_TERM) {
      return Object.values(PAY_TYPES).filter(
        (type) => type !== PAY_TYPES.MONTHLY
      );
    }
    return Object.values(PAY_TYPES);
  }, [input.period]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      pay: checkRulePassInCreateJob.pay(input.pay.type, input.pay.amount),
    }));
  }, [input.pay.type]);

  useEffect(() => {
    // 일하는 기간이 '1개월 이상' 외의 항목으로 변경된 경우 && 현재 선택된 급여 타입이 '월급'인 경우
    if (
      input.period !== PERIOD.LONG_TERM &&
      input.pay.type === PAY_TYPES.MONTHLY
    ) {
      setInput((state) => ({
        ...state,
        pay: { ...state.pay, type: PAY_TYPES.HOURLY },
      }));
    }
  }, [input.period, input.pay, setInput]);

  const onPayTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const payTypeClicked = e.currentTarget.textContent || PAY_TYPES.HOURLY;
    setInput((state) => ({
      ...state,
      pay: { ...state.pay, type: payTypeClicked },
    }));
  };

  const minimumMessage = useMemo(() => {
    // [건당]인 경우 -> 출력 x
    if (input.pay.type === PAY_TYPES.PER_TASK) return "";
    // [시급]인 경우 -> 최저시급을 알려준다.
    if (input.pay.type === PAY_TYPES.HOURLY) {
      return (
        <>
          * 2024년 최저시급은{" "}
          <span>{formatCurrency(MINIMUM_HOURLY_PAY)}원</span>입니다.
        </>
      );
    }
    // [월급]인 경우 -> 설정된 요일, 시간 기준 최소 월급을 알려준다.
    const { monthlyPay, weekDayCount, dailyHours } = getMinimumMonthlyPay(
      input.days,
      input.time
    );
    return (
      <>
        * 2024년 최저시급은 <span>{formatCurrency(MINIMUM_HOURLY_PAY)}원</span>
        이며, 하루 {dailyHours}시간씩 주 {weekDayCount}일 근무할 경우 주휴수당을
        포함한 예상 월급은 <span>최소 {formatCurrency(monthlyPay)}원</span>{" "}
        이상이에요.
      </>
    );
  }, [input.pay, input.time, input.days]);

  const onPayAmountBlur = () => {
    setIsValid((state) => ({
      ...state,
      pay: checkRulePassInCreateJob.pay(input.pay.type, input.pay.amount),
    }));
    if (input.pay.amount === "") {
      setInput((state) => ({ ...state, pay: { ...state.pay, amount: "" } }));
      return;
    }
    const pureValue = parseInt(input.pay.amount.replace(/,/g, ""));
    setInput((state) => ({
      ...state,
      pay: { ...state.pay, amount: formatCurrency(pureValue) },
    }));
  };

  const payAmountMaxLength = useMemo(() => {
    // pay.type에 따른 ','을 제외한 최대 문자 개수
    if (input.pay.type === PAY_TYPES.PER_TASK) return 10; // 원 단위, 100억 미만
    if (input.pay.type === PAY_TYPES.MONTHLY) return 5; // 만원 단위, 10억 미만
    return 7; // PAY_TYPES.HOURLY 원 단위, 1000만원 미만
  }, [input.pay.type]);
  useEffect(() => {
    // ,을 제외한 문자의 개수가 maxLength를 넘으면, maxLength 만큼 맞추기
    const pureValue = input.pay.amount.replace(/,/g, "");
    if (payAmountMaxLength < pureValue.length) {
      setInput((state) => ({
        ...state,
        pay: {
          ...state.pay,
          amount: formatCurrency(
            parseInt(pureValue.slice(0, payAmountMaxLength))
          ),
        },
      }));
    }
  }, [payAmountMaxLength]);

  const onPayAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9,]/g, "");
    if (payAmountMaxLength < value.replace(/,/g, "").length) return;
    setInput((state) => ({ ...state, pay: { ...state.pay, amount: value } }));
  };

  const onPayAmountFocus = () => {
    if (!isFocused.pay) setIsFocused((state) => ({ ...state, pay: true }));
  };

  return (
    <FormField id="pay" title="급여" warning={warnings.pay}>
      <PayContainer>
        <Chips
          id="pay"
          options={Object.values(VISIBLE_PAY_TYPES)}
          isSelected={(type) => type === input.pay.type}
          onClick={onPayTypeClick}
          className="inCreateJob"
        />
        <CustomInput
          id="pay"
          placeholder={
            input.pay.type === PAY_TYPES.HOURLY
              ? formatCurrency(MINIMUM_HOURLY_PAY)
              : "0"
          }
          value={input.pay.amount}
          eventHandlers={{
            onChange: onPayAmountChange,
            onBlur: onPayAmountBlur,
            onFocus: onPayAmountFocus,
          }}
          className="inCreateJob"
        >
          <div className="unit">
            {input.pay.type === PAY_TYPES.MONTHLY ? "만원" : "원"}
          </div>
        </CustomInput>
      </PayContainer>
      {isPayMessageVisible && <MinimumMessage>{minimumMessage}</MinimumMessage>}
    </FormField>
  );
};

export default PayField;
