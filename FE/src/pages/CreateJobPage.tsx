import React, { useState, useEffect, useMemo, useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import CustomInput from "../components/CustomInput.tsx";
import Chips from "../components/Chips.tsx";
import {
  JOB_TYPES,
  TERM,
  DAYS,
  PAY_TYPES,
  WORKTIME_TYPES,
  ERROR,
} from "../constants/constants.ts";
import {
  Background,
  CancelButton,
  LoadButton,
  Container,
  DescriptionSection,
  PostButton,
} from "../styles/CreateJobPage.styles.ts";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import FormSection from "../components/CreateJobPage/FormSection.tsx";
import FormField from "../components/CreateJobPage/FormField.tsx";
import CustomCalendar from "../components/CreateJobPage/CustomCalendar.tsx";
import TimeSection from "../components/CreateJobPage/TimeSection.tsx";
import PaySection from "../components/CreateJobPage/PaySection.tsx";
import ImageSection from "../components/CreateJobPage/ImageSection.tsx";
import PlaceSection from "../components/CreateJobPage/PlaceSection.tsx";
import { checkRulePassInCreateJob } from "../utils/checkRulePass.ts";
import { WarningText } from "../styles/global.ts";

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

const CREATE_JOB_POST = gql`
  mutation CreateJobPost($input: CreateJobPostInput!) {
    createJobPost(input: $input) {
      id
      title
      jobDescription
      salaryType
      salaryAmount
    }
  }
`;

export const SESSION_STORAGE_KEY = "createJobData";

const CreateJobPage = () => {
  useBackgroundColor("#F9FBFC");

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
  const [images, setImages] = useState<string[]>([]);
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
  const [isReturn, setIsReturn] = useState<boolean>(false); // TODO: 임시방편 문제 해결

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY) || "";
    if (!saved) return;
    // 장소 검색 페이지에서 공고 페이지로 돌아왔을 때 세션 스토리지에 저장된 데이터를 로드한다.
    const parsed = JSON.parse(saved);
    setTitle(parsed.title || title);
    setJobTypes(parsed.jobTypes || jobTypes);
    setTerm(parsed.term || term);
    setWeekDays(parsed.weekDays || weekDays);
    setDates(new Set(parsed.dates) || dates);
    setTime(parsed.time || time);
    setPay(parsed.pay || pay);
    setPlace(parsed.place || place);
    setImages(parsed.images || images);
    setDescription(parsed.description || description);
    setIsFocused(parsed.isFocused || isFocused);
    setIsValid(
      { ...parsed.isValid, place: parsed.place ? true : false } || isValid
    );
    sessionStorage.clear();
    placeSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsReturn(true);
  }, []);

  const saveToSessionStorage = () => {
    const createJobData = {
      title,
      jobTypes,
      term,
      weekDays,
      dates: Array.from(dates), // Set 자료구조는 JSON으로 변환할 수 없으므로
      time,
      pay,
      place,
      images,
      description,
      isValid,
      isFocused,
    };
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(createJobData));
  };

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
  }, [pay.type, isReturn]);

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

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
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
      return days.sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b));
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
  const [createJobPost, { data, loading, error }] =
    useMutation(CREATE_JOB_POST);

  const postJob = async () => {
    const workDayInfo =
      term === TERM.SHORT_TERM ? { dates } : { days: weekDays };
    const workTimeInfo =
      time.type === WORKTIME_TYPES.FIXED
        ? { start: time.start, end: time.end }
        : {};

    const input = {
      title,
      jobDescription: jobTypes,
      workPeriod: { type: term, ...workDayInfo },
      workTime: { type: time.type, ...workTimeInfo },
      salary: {
        salaryType: pay.type,
        salaryAmount: pay.amount.replace(/,/g, ""),
      },
      photos: images,
      detailedDescription: description,
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
      alert("공고 등록 성공!");
      // TODO : 조회 페이지로 이동
    } catch (e) {
      setPostWarning(e.message);
    }
  };

  return (
    <Background>
      <CancelButton>취소</CancelButton>
      <LoadButton>불러오기</LoadButton>
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
                onClickStart={() => {
                  if (!isFocused.dates)
                    setIsFocused((state) => ({ ...state, dates: true }));
                }}
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
                options={DAYS}
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

          {/* TODO: 일하는 장소 FormField 추가해야함 */}
          <FormField id="place" title="일하는 장소" warning="">
            <PlaceSection
              place={place}
              saveToSessionStorage={saveToSessionStorage}
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
            <DescriptionSection>
              <textarea
                placeholder="구체적인 업무 내용, 근무 요건, 지원자가 갖추어야 할 능력 등 우대 사항에 대해 알려주세요."
                rows={5}
                value={description}
                onFocus={() => {
                  if (!isFocused.description)
                    setIsFocused((state) => ({ ...state, description: true }));
                }}
                onChange={onDescriptionChange}
                onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                  setIsValid((state) => ({
                    ...state,
                    description: checkRulePassInCreateJob.description(
                      e.target.value
                    ),
                  }));
                }}
                maxLength={2000}
              />
              <div id="charCountInfo">
                <span>{description.length}</span>/2000
              </div>
            </DescriptionSection>
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
