import React, { useState, useEffect, useMemo } from "react";
import CustomInput from "../components/CustomInput.tsx";
import Chips from "../components/Chips.tsx";
import { JOB_TYPES, TERM, DAYS, PAY_TYPES } from "../constants/constants.ts";
import {
  Background,
  CancelButton,
  LoadButton,
  Container,
  DescriptionSection,
  CreateButton,
} from "../styles/CreateJobPage.styles.ts";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import FormSection from "../components/CreateJobPage/FormSection.tsx";
import FormField from "../components/CreateJobPage/FormField.tsx";
import CustomCalendar from "../components/CreateJobPage/CustomCalendar.tsx";
import TimeSection from "../components/CreateJobPage/TimeSection.tsx";
import PaySection from "../components/CreateJobPage/PaySection.tsx";
import ImageSection from "../components/CreateJobPage/ImageSection.tsx";
import { checkRulePassInCreateJob } from "../utils/checkRulePass.ts";
import PhoneNumberInput from "../components/PhoneNumberInput.tsx";

type Warnings = {
  title?: string;
  image?: string;
  jobTypes?: string;
  weekDays?: string;
  selectedDays?: string;
  pay?: string;
  description?: string;
  phoneNumber?: string;
  images?: string;
};

type IsValid = {
  title: boolean;
  jobTypes: boolean;
  weekDays: boolean;
  selectedDays: boolean;
  pay: boolean;
  description: boolean;
  phoneNumber: boolean;
  images: { size: boolean; count: boolean };
};

const CreateJobPage = () => {
  useBackgroundColor("#F9FBFC");

  const [title, setTitle] = useState<string>("");
  const [isValid, setIsValid] = useState<IsValid>({
    title: false,
    jobTypes: false,
    weekDays: true,
    selectedDays: false,
    pay: false,
    description: false,
    phoneNumber: false,
    images: { size: true, count: true },
  });
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [isSelectedDays, setIsSelectedDays] = useState<boolean[]>(
    new Array(42).fill(false)
  ); // 42는 보이는 최대 날짜 개수
  const [weekDays, setWeekDays] = useState<string[]>([
    "월",
    "화",
    "수",
    "목",
    "금",
  ]);
  const [term, setTerm] = useState<string>(TERM.TODAY);
  const [pay, setPay] = useState({ type: PAY_TYPES.HOURLY, amount: "" });
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);
  const [description, setDescription] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");

  const [warnings, setWarnings] = useState<Warnings>({});

  useEffect(() => {
    const newWarnings: Warnings = {};
    if (title !== "" && !isValid.title)
      newWarnings.title = "* 최소 6자에서 최대 30자까지 입력할 수 있어요.";
    if (jobTypes.length !== 0 && !isValid.jobTypes)
      newWarnings.jobTypes =
        "* 하는 일은 1개 이상, 3개 이하로 선택할 수 있어요.";
    if (!isValid.weekDays)
      newWarnings.weekDays = "* 요일을 1개 이상 선택해 주세요.";
    if (!isValid.selectedDays)
      newWarnings.selectedDays = "* 날짜를 1일 이상 선택해 주세요.";
    if (pay.amount !== "" && !isValid.pay)
      newWarnings.pay =
        "* 최저임금을 준수해주세요. 2024년 최저시급은 9,860원입니다.";
    if (description !== "" && !isValid.description)
      newWarnings.description =
        "* 최소 15자에서 최대 2000자까지 입력할 수 있어요.";
    if (phoneNumber !== "" && !isValid.phoneNumber)
      newWarnings.phoneNumber = "* 전화번호가 유효하지 않습니다.";
    if (!isValid.images.size && !isValid.images.count) {
      newWarnings.images = "* 10MB 이하의 사진 10장까지 업로드 가능합니다.";
    } else if (!isValid.images.size) {
      newWarnings.images = "* 10MB 이하의 사진만 가능합니다.";
    } else if (!isValid.images.count) {
      newWarnings.images = "* 사진은 10장까지만 가능합니다";
    }
    setWarnings(newWarnings);
  }, [isValid]);

  useEffect(() => {
    if (pay.type !== PAY_TYPES.HOURLY) {
      setIsValid((state) => ({ ...state, pay: true }));
    } else {
      setIsValid((state) => ({ ...state, pay: false }));
    }
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

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const onTermClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const TermClicked = e.currentTarget.textContent || TERM.TODAY;
    setTerm(TermClicked);
  };

  const onJobTypeClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
    const dayClicked = e.currentTarget.textContent || "";
    const newWeekDays = toggleSelected(weekDays, dayClicked, sortDays);
    setIsValid((state) => ({
      ...state,
      weekDays: checkRulePassInCreateJob.weekDays(newWeekDays),
    }));
    setWeekDays(newWeekDays);
  };

  const onPhoneNumberInputBlurStart = () => {
    setIsValid((state) => ({
      ...state,
      phoneNumber: checkRulePassInCreateJob.phoneNumber(phoneNumber),
    }));
  };

  const selectedDayCount = useMemo(() => {
    return isSelectedDays.reduce(
      (count, current) => (current ? count + 1 : count),
      0
    );
  }, [isSelectedDays]);

  useEffect(() => {
    if (
      (term === TERM.SHORT_TERM && selectedDayCount === 0) ||
      (term === TERM.LONG_TERM && weekDays.length === 0)
    ) {
      console.log("여기 안 걸림?");
      setIsValid((state) => ({ ...state, selectedDays: false }));
    } else {
      setIsValid((state) => ({ ...state, selectedDays: true }));
    }
  }, [term, setIsValid, selectedDayCount, weekDays.length]);

  const isAllValid = useMemo(() => {
    const {
      title,
      jobTypes,
      weekDays,
      selectedDays,
      pay,
      description,
      phoneNumber,
    } = isValid;
    if (!title || !jobTypes || !pay || !description || !phoneNumber)
      return false;
    if (term === TERM.LONG_TERM && !weekDays) return false;
    if (term === TERM.SHORT_TERM && !selectedDays) return false;
    return true;
  }, [isValid, term]);

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
              warning={warnings.selectedDays}
            >
              <CustomCalendar
                isSelectedDays={isSelectedDays}
                setIsSelectedDays={setIsSelectedDays}
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
            <TimeSection />
          </FormField>

          <FormField id="pay" title="급여" warning={warnings.pay}>
            <PaySection
              pay={pay}
              setPay={setPay}
              term={term}
              weekDays={weekDays}
              time={{ start: "09:00", end: "16:00" }}
              onBlurStart={() => {
                setIsValid((state) => ({
                  ...state,
                  pay: checkRulePassInCreateJob.pay(pay.type, pay.amount),
                }));
              }}
              isPayValid={isValid.pay}
            />
          </FormField>

          <FormField id="place" title="일하는 장소" warning="">
            <CustomInput id="place" value="" eventHandlers={{}} />
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
            subInfo="(선택)"
            warning={warnings.description}
          >
            <DescriptionSection>
              <textarea
                placeholder="구체적인 업무 내용, 근무 요건, 지원자가 갖추어야 할 능력 등 우대 사항에 대해 알려주세요."
                rows={5}
                value={description}
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

          <FormField
            id="contact"
            title="연락처"
            description="연락처는 안심번호로 표시돼요."
            warning={warnings.phoneNumber}
          >
            <PhoneNumberInput
              invalid={phoneNumber !== "" && !isValid.phoneNumber}
              value={phoneNumber}
              setValue={setPhoneNumber}
              onBlurStart={onPhoneNumberInputBlurStart}
            />
          </FormField>
        </FormSection>
        <CreateButton className={isAllValid ? "" : "inactivated"}>
          게시하기
        </CreateButton>
      </Container>
    </Background>
  );
};

export default CreateJobPage;
