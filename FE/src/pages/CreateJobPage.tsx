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

type Warnings = {
  title?: string;
  image?: string;
  jobTypes?: string;
  weekDays?: string;
  dates?: string;
  pay?: string;
  description?: string;
  images?: string;
};

type IsValid = {
  title: boolean;
  jobTypes: boolean;
  weekDays: boolean;
  dates: boolean;
  pay: string;
  description: boolean;
  images: { size: boolean; count: boolean; response: boolean };
  place: boolean;
};

type IsFocused = {
  title: boolean;
  jobTypes: boolean;
  weekDays: boolean;
  dates: boolean;
  pay: boolean;
  description: boolean;
};

const CreateJobPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [dates, setDates] = useState<Set<string>>(new Set());
  const [weekDays, setWeekDays] = useState<string[]>([
    "월",
    "화",
    "수",
    "목",
    "금",
  ]);
  const [term, setTerm] = useState<string>(TERM.TODAY);
  const [time, setTime] = useState({
    type: WORKTIME_TYPES.FLEXIBLE,
    start: "09:00",
    end: "18:00",
  });
  const [pay, setPay] = useState({ type: PAY_TYPES.HOURLY, amount: "" });
  const [place, setPlace] = useState("");
  const [images, setImages] = useState<Record<string, string>>({});
  const [description, setDescription] = useState<string>("");

  const [warnings, setWarnings] = useState<Warnings>({});
  const [postWarning, setPostWarning] = useState<string>("");

  const [isValid, setIsValid] = useState<IsValid>({
    title: false,
    jobTypes: false,
    weekDays: true,
    dates: false,
    pay: "", // 오류 상황이 두 가지라서..(빔, 최저시급 불충족)
    description: false,
    images: { size: true, count: true, response: true },
    place: false,
  });
  const [isFocused, setIsFocused] = useState<IsFocused>({
    // 포커스 또는 선택된 적 있는가?
    title: false,
    jobTypes: false,
    weekDays: false,
    dates: false,
    pay: false,
    description: false,
  });

  const [isPayMessageVisible, setIsPayMessageVisible] = useState<boolean>(true);

  const placeSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newWarnings: Warnings = {};
    if (isFocused.title && !isValid.title)
      newWarnings.title = ERROR.CREATE_JOB.FOLLOW_TITLE_RULE;

    if (isFocused.jobTypes && !isValid.jobTypes)
      newWarnings.jobTypes = ERROR.CREATE_JOB.FOLLOW_JOB_TYPES_RULE;

    if (!isValid.weekDays)
      newWarnings.weekDays = ERROR.CREATE_JOB.FOLLOW_WEEKDAYS_RULE;

    if (isFocused.dates && !isValid.dates)
      newWarnings.dates = ERROR.CREATE_JOB.FOLLOW_DATES_RULE;

    if (isFocused.pay) newWarnings.pay = isValid.pay;
    setIsPayMessageVisible(!newWarnings.pay);

    if (isFocused.description && !isValid.description)
      newWarnings.description = ERROR.CREATE_JOB.FOLLOW_DESCRIPTION_RULE;

    if (!isValid.images.response) {
      newWarnings.images = ERROR.SERVER;
    } else if (!isValid.images.size && !isValid.images.count) {
      newWarnings.images = ERROR.CREATE_JOB.FOLLOW_IMAGE_SIZE_COUNT_RULE;
    } else if (!isValid.images.size) {
      newWarnings.images = ERROR.CREATE_JOB.FOLLOW_IMAGE_SIZE_RULE;
    } else if (!isValid.images.count) {
      newWarnings.images = ERROR.CREATE_JOB.FOLLOW_IMAGE_COUNT_RULE;
    }
    setWarnings(newWarnings);
  }, [isValid]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      pay: checkRulePassInCreateJob.pay(pay.type, pay.amount),
    }));
  }, [pay.type]);

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
    const TermClicked = e.currentTarget.textContent || TERM.TODAY;
    setTerm(TermClicked);
  };

  const onJobTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isFocused.jobTypes)
      setIsFocused((state) => ({ ...state, jobTypes: true }));

    const jobTypeClicked = e.currentTarget.textContent || JOB_TYPES.SERVING;
    const newJobTypes = toggleSelected(jobTypes, jobTypeClicked);
    setIsValid((state) => ({
      ...state,
      jobTypes: checkRulePassInCreateJob.jobTypes(newJobTypes),
    }));
    setJobTypes(newJobTypes);
  };

  const onWeekDayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const sortDays = (days: string[]) => {
      const daysValues = Object.values(DAYS);
      return days.sort((a, b) => daysValues.indexOf(a) - daysValues.indexOf(b));
    };

    if (!isFocused.weekDays)
      setIsFocused((state) => ({ ...state, weekDays: true }));

    const dayClicked = e.currentTarget.textContent || "";
    const newWeekDays = toggleSelected(weekDays, dayClicked, sortDays);
    setIsValid((state) => ({
      ...state,
      weekDays: checkRulePassInCreateJob.weekDays(newWeekDays),
    }));
    setWeekDays(newWeekDays);
  };

  useEffect(() => {
    if (
      (term === TERM.SHORT_TERM && dates.size === 0) ||
      (term === TERM.LONG_TERM && weekDays.length === 0)
    ) {
      setIsValid((state) => ({ ...state, dates: false }));
    } else {
      setIsValid((state) => ({ ...state, dates: true }));
    }
  }, [term, setIsValid, dates.size, weekDays.length]);

  const isAllValid = useMemo(() => {
    const { title, jobTypes, weekDays, dates, pay, description, place } =
      isValid;
    if (!title || !jobTypes || pay !== "" || !description || !place)
      return false;
    if (term === TERM.LONG_TERM && !weekDays) return false;
    if (term === TERM.SHORT_TERM && !dates) return false;
    return true;
  }, [isValid, term]);

  // useMutation 훅을 사용하여 뮤테이션 함수 생성
  const [
    createJobPost,
    { loading: createJobPostLoading, error: createJobPostError },
  ] = useMutation(CREATE_JOB_POST);
  useEffect(() => {
    setPostWarning(createJobPostError ? ERROR.SERVER : "");
  }, [createJobPostError]);

  const postJob = async () => {
    const tempTerm = term === TERM.LONG_TERM ? TERM.LONG_TERM : TERM.SHORT_TERM;
    const workPeriod: WorkPeriod = { type: TERM_KEY[tempTerm] };
    if (term === TERM.TODAY) {
      workPeriod.dates = [format(new Date(), "yyyy-MM-dd")];
    } else if (term === TERM.TOMORROW) {
      workPeriod.dates = [format(addDays(new Date(), 1), "yyyy-MM-dd")];
    } else if (term === TERM.SHORT_TERM) {
      workPeriod.dates = Array.from(dates);
    } else {
      workPeriod.days = weekDays.map((day) => DAYS_KEY[day]);
    }
    const workTime: WorkTime = { type: WORKTIME_TYPES_KEY[time.type] };
    if (time.type === WORKTIME_TYPES.FIXED) {
      workTime.startTime = time.start;
      workTime.endTime = time.end;
    }
    const payAmount = parseInt(pay.amount.replace(/,/g, ""));
    const salary = {
      salaryType: PAY_TYPES_KEY[pay.type],
      salaryAmount:
        pay.type === PAY_TYPES.MONTHLY ? payAmount * 10000 : payAmount,
    };

    const input = {
      title,
      jobDescription: jobTypes.map((type) => JOB_TYPES_KEY[type]),
      workPeriod,
      workTime,
      salary,
      photos: Object.values(images),
      detailedDescription: description,
      addressName: place,
    };

    try {
      await createJobPost({ variables: { input } });
    } catch {
      throw new Error(ERROR.NETWORK);
    }
  };

  const onPostButtonClick = async () => {
    try {
      await postJob();
      navigate("/explore-jobs");
    } catch (e) {
      setPostWarning(e.message);
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
              value={title}
              eventHandlers={{
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setTitle(e.target.value);
                },
                onFocus: () => {
                  if (!isFocused.title)
                    setIsFocused((state) => ({ ...state, title: true }));
                },
                onBlur: () => {
                  setIsValid((state) => ({
                    ...state,
                    title: checkRulePassInCreateJob.title(title),
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
              isSelected={(jobType: string) => jobTypes.includes(jobType)}
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
              isSelected={(t) => t === term}
            />
          </FormField>

          {term === TERM.SHORT_TERM && (
            <FormField
              id="calendar"
              title=""
              subInfo=""
              warning={warnings.dates}
            >
              <CustomCalendar
                dates={dates}
                setDates={setDates}
                lastDate={addMonths(new Date(), 1)}
                onClickStart={() => {
                  if (!isFocused.dates)
                    setIsFocused((state) => ({ ...state, dates: true }));
                }}
                style={{ width: "43%", marginTop: "-30px" }}
              />
            </FormField>
          )}
          {term === TERM.LONG_TERM && (
            <FormField
              id="weekDays"
              title="요일 선택"
              subInfo={weekDays.length ? `(${weekDays.join(", ")})` : ""}
              warning={warnings.weekDays}
            >
              <Chips
                id="weekDays"
                options={Object.values(DAYS)}
                onClick={onWeekDayClick}
                isSelected={(day: string) => weekDays.includes(day)}
              />
            </FormField>
          )}

          <FormField id="time" title="일하는 시간" warning="">
            <TimeSection time={time} setTime={setTime} />
          </FormField>

          <FormField id="pay" title="급여" warning={warnings.pay}>
            <PaySection
              pay={pay}
              setPay={setPay}
              term={term}
              weekDays={weekDays}
              time={{ start: time.start, end: time.end }}
              onBlurStart={() => {
                setIsValid((state) => ({
                  ...state,
                  pay: checkRulePassInCreateJob.pay(pay.type, pay.amount),
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
              place={place}
              setPlace={setPlace}
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
            warning={warnings.images}
          >
            <ImageSection
              images={images}
              setImages={setImages}
              setIsValid={setIsValid}
            />
          </FormField>

          <FormField
            id="description"
            title="자세한 설명"
            warning={warnings.description}
          >
            <CustomTextarea
              placeholder="구체적인 업무 내용, 근무 요건, 지원자가 갖추어야 할 능력 등 우대 사항에 대해 알려주세요."
              value={description}
              eventHandlers={{
                onFocus: () => {
                  if (!isFocused.description)
                    setIsFocused((state) => ({ ...state, description: true }));
                },
                onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                  setDescription(e.target.value);
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
        <WarningText>{postWarning}</WarningText>
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
