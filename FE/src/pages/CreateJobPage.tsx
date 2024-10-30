import React, { useState } from "react";
import CustomInput from "../components/CustomInput.tsx";
import Chips from "../components/Chips.tsx";
import { JOB_TYPES, TERM, DAYS } from "../constants/constants.ts";
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

const CreateJobPage = () => {
  useBackgroundColor("#F9FBFC");

  const [selectedDAYS, setSelectedDAYS] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(TERM.TODAY);
  const [description, setDescription] = useState<string>("");

  const [warnings, setWarnings] = useState({
    image: "",
  });

  const onDayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dayClicked = e.currentTarget.textContent || "";
    if (selectedDAYS.includes(dayClicked)) {
      setSelectedDAYS((state) => state.filter((day) => day !== dayClicked));
    } else {
      const newSelectedDAYS = selectedDAYS.concat(dayClicked);
      const sorted = newSelectedDAYS.sort(
        (a, b) => DAYS.indexOf(a) - DAYS.indexOf(b)
      );
      setSelectedDAYS(sorted);
    }
  };

  const isDaySelected = (day) => {
    return selectedDAYS.includes(day);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const onPeriodClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const periodClicked = e.currentTarget.textContent || TERM.TODAY;
    setSelectedPeriod(periodClicked);
  };

  return (
    <Background>
      <CancelButton>취소</CancelButton>
      <LoadButton>불러오기</LoadButton>
      <Container>
        {/* ===== 기본 정보 ===== */}
        <FormSection title="기본 정보" id="basicInfo">
          <FormField id="title" title="공고 제목" warning="">
            <CustomInput
              id="title"
              placeholder="공고 내용을 요약해주세요."
              value=""
              eventHandlers={{}}
            />
          </FormField>

          <FormField
            id="types"
            title="하는 일"
            subInfo="(최대 3개)"
            warning="* 에러다 에러!!!"
          >
            <Chips id="types" options={JOB_TYPES} />
          </FormField>
        </FormSection>

        {/* ===== 근무 조건 ===== */}
        <FormSection title="근무 조건" id="workCondition">
          <FormField id="period" title="일하는 기간" warning="">
            <Chips
              id="period"
              options={Object.values(TERM)}
              onClick={onPeriodClick}
              isSelected={(period) => period === selectedPeriod}
            />
          </FormField>

          {selectedPeriod === TERM.SHORT_TERM && <CustomCalendar />}
          {selectedPeriod === TERM.LONG_TERM && (
            <FormField
              id="DAYS"
              title="요일 선택"
              subInfo={
                selectedDAYS.length ? `(${selectedDAYS.join(", ")})` : ""
              }
              warning=""
            >
              <Chips
                id="DAYS"
                options={DAYS}
                onClick={onDayClick}
                isSelected={isDaySelected}
              />
            </FormField>
          )}

          <FormField id="time" title="일하는 시간" warning="">
            <TimeSection />
          </FormField>

          <FormField id="pay" title="급여" warning="">
            <PaySection
              selectedPeriod={selectedPeriod}
              selectedWeekDays={selectedDAYS}
              selectedTime={{ start: "09:00", end: "16:00" }}
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
            warning={warnings.image}
          >
            <ImageSection setWarnings={setWarnings} />
          </FormField>

          <FormField
            id="description"
            title="자세한 설명"
            subInfo="(선택)"
            warning=""
          >
            <DescriptionSection>
              <textarea
                placeholder="구체적인 업무 내용, 근무 요건, 지원자가 갖추어야 할 능력 등 우대 사항에 대해 알려주세요."
                rows={5}
                value={description}
                onChange={onDescriptionChange}
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
            warning="* 에러다 에러!!"
          >
            <CustomInput
              id="contact"
              placeholder="- 없이 입력"
              value=""
              eventHandlers={{}}
            />
          </FormField>
        </FormSection>
        <CreateButton>게시하기</CreateButton>
      </Container>
    </Background>
  );
};

export default CreateJobPage;
