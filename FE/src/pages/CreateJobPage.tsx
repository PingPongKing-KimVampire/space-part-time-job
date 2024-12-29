import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import { format, addDays, addMonths } from "date-fns";
import CustomInput from "../components/CustomInput.tsx";
import Chips from "../components/Chips.tsx";
import CustomTextarea from "../components/CustomTextarea.tsx";
import {
  JOB_TYPES,
  JOB_TYPES_KEY,
  TERM,
  TERM_KEY,
  DAYS,
  DAYS_KEY,
  PAY_TYPES,
  WORKTIME_TYPES,
  ERROR,
  WORKTIME_TYPES_KEY,
  PAY_TYPES_KEY,
} from "../constants/constants";
import { CREATE_JOB_POST } from "../api/graphql/mutations.js";
import {
  Background,
  Container,
  PostButton,
} from "../styles/CreateJobPage.styles";
import useBackgroundColor from "../utils/useBackgroundColor";
import FormSection from "../components/CreateJobPage/FormSection.tsx";
import FormField from "../components/CreateJobPage/FormField.tsx";
import CustomCalendar from "../components/CustomCalendar.tsx";
import TimeSection from "../components/CreateJobPage/TimeSection.tsx";
import PaySection from "../components/CreateJobPage/PaySection.tsx";
import ImageSection from "../components/CreateJobPage/ImageSection.tsx";
import PlaceSection from "../components/CreateJobPage/PlaceSection.tsx";
import { checkRulePassInCreateJob } from "../utils/checkRulePass";
import { WarningText, MainBackgroundColor } from "../styles/global";
import LoadingOverlay from "../components/LoadingOverlay.tsx";
import { WorkPeriod, WorkTime } from "../types/types.ts";
import sortDays from "../utils/sortDays.ts";
import useCreateJobContext, { Warnings } from "../context/CreateJobContext.tsx";

const CreateJobPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const navigate = useNavigate();

  const {
    input,
    isFocused,
    isValid,
    warnings,
    setInput,
    setIsFocused,
    setIsValid,
    setWarnings,
  } = useCreateJobContext();

  const [isPayMessageVisible, setIsPayMessageVisible] = useState<boolean>(true);
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);

  const placeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newWarnings: Warnings = {};
    if (isFocused.title && !isValid.title)
      newWarnings.title = ERROR.CREATE_JOB.FOLLOW_TITLE_RULE;
    if (isFocused.jobTypes && !isValid.jobTypes)
      newWarnings.jobTypes = ERROR.CREATE_JOB.FOLLOW_JOB_TYPES_RULE;
    if (!isValid.days) newWarnings.days = ERROR.CREATE_JOB.FOLLOW_WEEKDAYS_RULE;
    if (isFocused.dates && !isValid.dates)
      newWarnings.dates = ERROR.CREATE_JOB.FOLLOW_DATES_RULE;
    if (isFocused.pay) newWarnings.pay = isValid.pay;
    if (isFocused.description && !isValid.description)
      newWarnings.description = ERROR.CREATE_JOB.FOLLOW_DESCRIPTION_RULE;
    if (!isValid.photos.response) {
      newWarnings.photos = ERROR.SERVER;
    } else if (!isValid.photos.size && !isValid.photos.count) {
      newWarnings.photos = ERROR.CREATE_JOB.FOLLOW_IMAGE_SIZE_COUNT_RULE;
    } else if (!isValid.photos.size) {
      newWarnings.photos = ERROR.CREATE_JOB.FOLLOW_IMAGE_SIZE_RULE;
    } else if (!isValid.photos.count) {
      newWarnings.photos = ERROR.CREATE_JOB.FOLLOW_IMAGE_COUNT_RULE;
    }
    setIsPayMessageVisible(!newWarnings.pay);
    setWarnings(newWarnings);
  }, [isValid]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      pay: checkRulePassInCreateJob.pay(input.pay.type, input.pay.amount),
    }));
  }, [input.pay.type]);

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

  const onTermClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setInput((state) => ({
      ...state,
      term: e.currentTarget.textContent || TERM.TODAY,
    }));
  };

  const onJobTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isFocused.jobTypes)
      setIsFocused((state) => ({ ...state, jobTypes: true }));
    const newJobTypes = toggleSelected(
      input.jobTypes,
      e.currentTarget.textContent || JOB_TYPES.SERVING
    );
    setIsValid((state) => ({
      ...state,
      jobTypes: checkRulePassInCreateJob.jobTypes(newJobTypes),
    }));
    setInput((state) => ({ ...state, newJobTypes }));
  };

  const onWeekDayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isFocused.days) setIsFocused((state) => ({ ...state, days: true }));
    const newDays = toggleSelected(
      input.days,
      e.currentTarget.textContent || "",
      sortDays
    );
    setIsValid((state) => ({
      ...state,
      days: checkRulePassInCreateJob.days(newDays),
    }));
    setInput((state) => ({ ...state, days: newDays }));
  };

  useEffect(() => {
    if (
      (input.term === TERM.SHORT_TERM && input.dates.size === 0) ||
      (input.term === TERM.LONG_TERM && input.days.length === 0)
    ) {
      setIsValid((state) => ({ ...state, dates: false }));
    } else {
      setIsValid((state) => ({ ...state, dates: true }));
    }
  }, [input.term, input.dates, input.days, setIsValid]);

  const isAllValid = useMemo(() => {
    const { title, jobTypes, days, dates, pay, description, place } = isValid;
    if (!title || !jobTypes || pay !== "" || !description || !place)
      return false;
    if (imageUploadLoading) return false;
    if (input.term === TERM.LONG_TERM && !days) return false;
    if (input.term === TERM.SHORT_TERM && !dates) return false;
    return true;
  }, [isValid, input.term, imageUploadLoading]);

  // useMutation 훅을 사용하여 뮤테이션 함수 생성
  const [
    createJobPost,
    { loading: createJobPostLoading, error: createJobPostError },
  ] = useMutation(CREATE_JOB_POST);
  useEffect(() => {
    setWarnings((state) => ({
      ...state,
      post: createJobPostError ? ERROR.SERVER : "",
    }));
  }, [createJobPostError]);

  const postJob = async () => {
    const workPeriod: WorkPeriod = {
      type: TERM_KEY[
        input.term === TERM.LONG_TERM ? TERM.LONG_TERM : TERM.SHORT_TERM
      ],
    };
    if (input.term === TERM.TODAY) {
      workPeriod.dates = [format(new Date(), "yyyy-MM-dd")];
    } else if (input.term === TERM.TOMORROW) {
      workPeriod.dates = [format(addDays(new Date(), 1), "yyyy-MM-dd")];
    } else if (input.term === TERM.SHORT_TERM) {
      workPeriod.dates = Array.from(input.dates);
    } else {
      workPeriod.days = input.days.map((day) => DAYS_KEY[day]);
    }
    const workTime: WorkTime = { type: WORKTIME_TYPES_KEY[input.time.type] };
    if (input.time.type === WORKTIME_TYPES.FIXED) {
      workTime.startTime = input.time.start;
      workTime.endTime = input.time.end;
    }
    const payAmount = parseInt(input.pay.amount.replace(/,/g, ""));
    const salary = {
      salaryType: PAY_TYPES_KEY[input.pay.type],
      salaryAmount:
        input.pay.type === PAY_TYPES.MONTHLY ? payAmount * 10000 : payAmount,
    };

    try {
      await createJobPost({
        variables: {
          input: {
            title: input.title,
            jobDescription: input.jobTypes.map((type) => JOB_TYPES_KEY[type]),
            workPeriod,
            workTime,
            salary,
            photos: Object.values(input.photos),
            detailedDescription: input.description,
            addressName: input.address,
          },
        },
      });
    } catch {
      throw new Error(ERROR.NETWORK);
    }
  };

  const onPostButtonClick = async () => {
    try {
      await postJob();
      navigate("/explore-jobs");
    } catch (e) {
      setWarnings((state) => ({ ...state, post: e.message }));
    }
  };

  return (
    <Background>
      {createJobPostLoading && <LoadingOverlay />}
      <Container>
        {/* ===== 기본 정보 ===== */}
        <FormSection title="기본 정보" id="basicInfo">
          <FormField id="title" title="공고 제목" warning={warnings.title}>
            <CustomInput
              id="title"
              placeholder="공고 내용을 요약해주세요."
              value={input.title}
              eventHandlers={{
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setInput((state) => ({ ...state, title: e.target.value }));
                },
                onFocus: () => {
                  if (!isFocused.title)
                    setIsFocused((state) => ({ ...state, title: true }));
                },
                onBlur: (e) => {
                  setIsValid((state) => ({
                    ...state,
                    title: checkRulePassInCreateJob.title(e.target.value),
                  }));
                },
              }}
            />
          </FormField>

          <FormField
            id="jobTypes"
            title="하는 일"
            subInfo="(최대 3개)"
            warning={warnings.jobTypes}
          >
            <Chips
              id="jobTypes"
              options={Object.values(JOB_TYPES)}
              onClick={onJobTypeClick}
              isSelected={(jobType: string) => input.jobTypes.includes(jobType)}
            />
          </FormField>
        </FormSection>

        {/* ===== 근무 조건 ===== */}
        <FormSection title="근무 조건" id="workCondition">
          <FormField id="term" title="일하는 기간" warning="">
            <Chips
              id="term"
              options={Object.values(TERM)}
              onClick={onTermClick}
              isSelected={(term) => term === input.term}
            />
          </FormField>

          {input.term === TERM.SHORT_TERM && (
            <FormField
              id="calendar"
              title=""
              subInfo=""
              warning={warnings.dates}
            >
              <CustomCalendar
                dates={input.dates}
                setDates={(dates) => {
                  setInput((state) => ({ ...state, dates }));
                }}
                lastDate={addMonths(new Date(), 1)}
                onClickStart={() => {
                  if (!isFocused.dates)
                    setIsFocused((state) => ({ ...state, dates: true }));
                }}
                style={{ width: "43%", marginTop: "-30px" }}
              />
            </FormField>
          )}
          {input.term === TERM.LONG_TERM && (
            <FormField
              id="weekDays"
              title="요일 선택"
              subInfo={input.days.length ? `(${input.days.join(", ")})` : ""}
              warning={warnings.days}
            >
              <Chips
                id="weekDays"
                options={Object.values(DAYS)}
                onClick={onWeekDayClick}
                isSelected={(day: string) => input.days.includes(day)}
              />
            </FormField>
          )}

          <FormField id="time" title="일하는 시간" warning="">
            <TimeSection
              time={input.time}
              setTime={(time) => {
                setInput((state) => ({ ...state, time }));
              }}
            />
          </FormField>

          <FormField id="pay" title="급여" warning={warnings.pay}>
            <PaySection
              pay={input.pay}
              setPay={(pay) => {
                setInput((state) => ({ ...state, pay }));
              }}
              term={input.term}
              weekDays={input.days}
              time={{ start: input.time.start, end: input.time.end }}
              onBlurStart={() => {
                setIsValid((state) => ({
                  ...state,
                  pay: checkRulePassInCreateJob.pay(
                    input.pay.type,
                    input.pay.amount
                  ),
                }));
              }}
              onFocus={() => {
                if (!isFocused.pay)
                  setIsFocused((state) => ({ ...state, pay: true }));
              }}
              isPayMessageVisible={isPayMessageVisible}
            />
          </FormField>

          <FormField id="place" title="일하는 장소" warning="">
            <PlaceSection
              place={input.address}
              setPlace={(address) => {
                setInput((state) => ({ ...state, address }));
              }}
              onSelect={() => {
                setIsValid((prev) => ({ ...prev, place: true }));
              }}
              ref={placeSectionRef}
            />
          </FormField>
        </FormSection>

        {/* ===== 부가 정보 ===== */}
        <FormSection title="부가 정보" id="subInfo">
          <FormField
            id="pictures"
            title="사진"
            subInfo="(선택)"
            warning={warnings.photos}
          >
            <ImageSection
              images={input.photos}
              setImages={(photos) => {
                setInput((state) => ({ ...state, photos }));
              }}
              setIsValid={setIsValid}
              setImageUploadLoading={setImageUploadLoading}
            />
          </FormField>

          <FormField
            id="description"
            title="자세한 설명"
            warning={warnings.description}
          >
            <CustomTextarea
              placeholder="구체적인 업무 내용, 근무 요건, 지원자가 갖추어야 할 능력 등 우대 사항에 대해 알려주세요."
              value={input.description}
              eventHandlers={{
                onFocus: () => {
                  if (!isFocused.description)
                    setIsFocused((state) => ({
                      ...state,
                      description: true,
                    }));
                },
                onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setInput((state) => ({
                    ...state,
                    description: e.target.value,
                  }));
                },
                onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => {
                  setIsValid((state) => ({
                    ...state,
                    description: checkRulePassInCreateJob.description(
                      e.target.value
                    ),
                  }));
                },
              }}
              maxLength={2000}
            />
          </FormField>
        </FormSection>
        <WarningText>{warnings.post}</WarningText>
        <PostButton
          className={isAllValid ? "" : "inactivated"}
          onClick={onPostButtonClick}
          disabled={!isAllValid}
        >
          게시하기
        </PostButton>
      </Container>
    </Background>
  );
};

export default CreateJobPage;
