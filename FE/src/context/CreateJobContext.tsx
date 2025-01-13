import React, { createContext, useContext, useState } from "react";
import { PERIOD, WORKTIME_TYPES, PAY_TYPES } from "../constants/constants.ts";

type Input = {
  title: string;
  jobTypes: string[];
  dates: Set<string>;
  days: string[];
  period: string;
  time: { type: string; start: string; end: string };
  pay: { type: string; amount: string };
  place: string;
  photos: Record<string, string>;
  description: string;
};

type IsFocused = {
  title: boolean;
  jobTypes: boolean;
  days: boolean;
  dates: boolean;
  pay: boolean;
  description: boolean;
};

type IsValid = {
  title: boolean;
  jobTypes: boolean;
  days: boolean;
  dates: boolean;
  pay: string;
  description: boolean;
  photos: { size: boolean; count: boolean; response: boolean };
  place: boolean;
};

export type Warnings = {
  title?: string;
  image?: string;
  jobTypes?: string;
  days?: string;
  dates?: string;
  pay?: string;
  description?: string;
  photos?: string;
  post?: string;
};

type CreateJobContextType = {
  input: Input;
  isFocused: IsFocused;
  isValid: IsValid;
  warnings: Warnings;
  setInput: React.Dispatch<React.SetStateAction<Input>>;
  setIsFocused: React.Dispatch<React.SetStateAction<IsFocused>>;
  setIsValid: React.Dispatch<React.SetStateAction<IsValid>>;
  setWarnings: React.Dispatch<React.SetStateAction<Warnings>>;
  isPayMessageVisible: boolean;
  setIsPayMessageVisible: React.Dispatch<React.SetStateAction<boolean>>;
  imageUploadLoading: boolean;
  setImageUploadLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateJobContext = createContext<CreateJobContextType | undefined>(
  undefined
);

export const CreateJobProvider = ({ children }) => {
  const [input, setInput] = useState<Input>({
    title: "",
    jobTypes: [],
    dates: new Set(),
    days: [],
    period: PERIOD.TODAY,
    time: { type: WORKTIME_TYPES.FLEXIBLE, start: "09:00", end: "18:00" },
    pay: { type: PAY_TYPES.HOURLY, amount: "" },
    place: "",
    photos: {},
    description: "",
  });
  const [isFocused, setIsFocused] = useState<IsFocused>({
    title: false,
    jobTypes: false,
    days: false,
    dates: false,
    pay: false,
    description: false,
  });
  const [isValid, setIsValid] = useState<IsValid>({
    title: false,
    jobTypes: false,
    days: true,
    dates: false,
    pay: "", // 오류 상황이 두 가지라서..(빔, 최저시급 불충족)
    description: false,
    photos: { size: true, count: true, response: true },
    place: false,
  });
  const [warnings, setWarnings] = useState<Warnings>({});
  const [isPayMessageVisible, setIsPayMessageVisible] = useState<boolean>(true);
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);

  return (
    <CreateJobContext.Provider
      value={{
        input,
        isFocused,
        isValid,
        warnings,
        setInput,
        setIsFocused,
        setIsValid,
        setWarnings,
        isPayMessageVisible,
        setIsPayMessageVisible,
        imageUploadLoading,
        setImageUploadLoading,
      }}
    >
      {children}
    </CreateJobContext.Provider>
  );
};

const useCreateJobContext = () => {
  const context = useContext(CreateJobContext);
  if (!context) {
    throw new Error(
      "useCreateJobContext must be used within a CreateJobProvider"
    );
  }
  return context;
};

export default useCreateJobContext;
