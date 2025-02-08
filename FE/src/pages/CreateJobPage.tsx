import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import { format, addDays } from "date-fns";
import {
  JOB_TYPES_KEY,
  PERIOD,
  PERIOD_KEY,
  DAYS_KEY,
  PAY_TYPES,
  WORKTIME_TYPES,
  ERROR,
  WORKTIME_TYPES_KEY,
  PAY_TYPES_KEY,
} from "../constants/constants";
import { CREATE_JOB_POST } from "../api/graphql/mutations.js";
import { processCreatePost } from "../api/graphql/processData";
import {
  Background,
  Container,
  PostButton,
} from "../styles/pages/CreateJobPage.styles";
import useBackgroundColor from "../utils/useBackgroundColor";
import FormSection from "../components/CreateJobPage/FormSection.tsx";
import { WarningText, MainBackgroundColor } from "../styles/global";
import LoadingOverlay from "../components/LoadingOverlay.tsx";
import { WorkPeriod, WorkTime } from "../types/types.ts";
import useCreateJobContext, { Warnings } from "../context/CreateJobContext.tsx";
import TitleField from "../components/CreateJobPage/TitleField.tsx";
import JobTypesField from "../components/CreateJobPage/JobTypesField.tsx";
import PeriodField from "../components/CreateJobPage/PeriodField.tsx";
import CalendarField from "../components/CreateJobPage/CalendarField.tsx";
import DaysField from "../components/CreateJobPage/DaysField.tsx";
import TimeField from "../components/CreateJobPage/TimeField.tsx";
import PayField from "../components/CreateJobPage/PayField.tsx";
import PlaceField from "../components/CreateJobPage/PlaceField.tsx";
import PhotoField from "../components/CreateJobPage/PhotoField.tsx";
import DescriptionField from "../components/CreateJobPage/DescriptionField.tsx";

const CreateJobPage = () => {
  useBackgroundColor(MainBackgroundColor);
  const navigate = useNavigate();

  const {
    input,
    isFocused,
    isValid,
    warnings,
    setIsValid,
    setWarnings,
    setIsPayMessageVisible,
    imageUploadLoading,
  } = useCreateJobContext();

  useEffect(() => {
    const newWarnings: Warnings = {};
    if (isFocused.title && !isValid.title)
      newWarnings.title = ERROR.CREATE_JOB.FOLLOW_TITLE_RULE;
    if (isFocused.jobTypes && !isValid.jobTypes)
      newWarnings.jobTypes = ERROR.CREATE_JOB.FOLLOW_JOB_TYPES_RULE;
    if (!isValid.days) newWarnings.days = ERROR.CREATE_JOB.FOLLOW_DAYS_RULE;
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
    if (
      (input.period === PERIOD.SHORT_TERM && input.dates.size === 0) ||
      (input.period === PERIOD.LONG_TERM && input.days.length === 0)
    ) {
      setIsValid((state) => ({ ...state, dates: false }));
    } else {
      setIsValid((state) => ({ ...state, dates: true }));
    }
  }, [input.period, input.dates, input.days, setIsValid]);

  const isAllValid = useMemo(() => {
    const { title, jobTypes, days, dates, pay, description, place } = isValid;
    if (!title || !jobTypes || pay !== "" || !description || !place)
      return false;
    if (imageUploadLoading) return false;
    if (input.period === PERIOD.LONG_TERM && !days) return false;
    if (input.period === PERIOD.SHORT_TERM && !dates) return false;
    return true;
  }, [isValid, input.period, imageUploadLoading]);

  const [
    createJobPost,
    { loading: createJobPostLoading, error: createJobPostError },
  ] = useMutation(CREATE_JOB_POST);
  useEffect(() => {
    setWarnings((state) => ({
      ...state,
      post: createJobPostError ? ERROR.SERVER : "",
    }));
  }, [setWarnings, createJobPostError]);

  const postJob = async () => {
    const getProcessedPeriod = () => {
      const workPeriod: WorkPeriod = {
        type: PERIOD_KEY[
          input.period === PERIOD.LONG_TERM
            ? PERIOD.LONG_TERM
            : PERIOD.SHORT_TERM
        ],
      };
      if (input.period === PERIOD.TODAY) {
        workPeriod.dates = [format(new Date(), "yyyy-MM-dd")];
      } else if (input.period === PERIOD.TOMORROW) {
        workPeriod.dates = [format(addDays(new Date(), 1), "yyyy-MM-dd")];
      } else if (input.period === PERIOD.SHORT_TERM) {
        workPeriod.dates = Array.from(input.dates);
      } else {
        workPeriod.days = input.days.map((day) => DAYS_KEY[day]);
      }
      return workPeriod;
    };
    const getProcessedTime = () => {
      const workTime: WorkTime = { type: WORKTIME_TYPES_KEY[input.time.type] };
      if (input.time.type === WORKTIME_TYPES.FIXED) {
        workTime.startTime = input.time.start;
        workTime.endTime =
          input.time.end !== "24:00" ? input.time.end : "00:00";
      }
      return workTime;
    };
    const payAmount = parseInt(input.pay.amount.replace(/,/g, ""));
    const salary = {
      salaryType: PAY_TYPES_KEY[input.pay.type],
      salaryAmount:
        input.pay.type === PAY_TYPES.MONTHLY ? payAmount * 10000 : payAmount,
    };

    try {
      const response = await createJobPost({
        variables: {
          input: {
            title: input.title,
            jobCategories: input.jobTypes.map((type) => JOB_TYPES_KEY[type]),
            workPeriod: getProcessedPeriod(),
            workTime: getProcessedTime(),
            salary,
            photos: Object.values(input.photos),
            detailedDescription: input.description,
            addressName: input.place,
          },
        },
      });
      processCreatePost(response.data);
    } catch (e) {
      console.error("CreateJobPost Mutation Error: ", e.message);
      throw new Error(ERROR.SERVER);
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
        <FormSection title="기본 정보" id="basicInfo">
          <TitleField />
          <JobTypesField />
        </FormSection>
        <FormSection title="근무 조건" id="workCondition">
          <PeriodField />
          {input.period === PERIOD.SHORT_TERM && <CalendarField />}
          {input.period === PERIOD.LONG_TERM && <DaysField />}
          <TimeField />
          <PayField />
          <PlaceField />
        </FormSection>
        <FormSection title="부가 정보" id="subInfo">
          <PhotoField />
          <DescriptionField />
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
