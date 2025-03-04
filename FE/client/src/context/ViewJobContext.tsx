import React, { createContext, useContext, useState } from "react";
import { JobPost } from "../types/types.ts";

type ViewJobContextType = {
  jobPost: JobPost;
  setJobPost: React.Dispatch<React.SetStateAction<JobPost>>;
  isApplicationModalVisible: boolean;
  setIsApplicationModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  getJobPostLoading: boolean;
  setGetJobPostLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const ViewJobContext = createContext<ViewJobContextType | undefined>(undefined);

export const ViewJobProvider = ({ children }) => {
  const [jobPost, setJobPost] = useState<JobPost>({
    id: "",
    status: "",
    title: "",
    jobCategories: [],
    workPeriod: { type: "", dates: [], days: [] },
    workTime: { type: "", startTime: "", endTime: "" },
    salary: { salaryType: "", salaryAmount: 0 },
    photos: [],
    detailedDescription: "",
    addressName: "",
    createdAt: "",
    views: 0,
    publisher: { nickname: "", createdAt: "" },
    applicationCount: 0,
    myJobApplication: [],
    myInterested: null,
    interestedCount: 0,
  });
  const [isApplicationModalVisible, setIsApplicationModalVisible] =
    useState<boolean>(false);
  const [getJobPostLoading, setGetJobPostLoading] = useState<boolean>(true);

  return (
    <ViewJobContext.Provider
      value={{
        jobPost,
        setJobPost,
        isApplicationModalVisible,
        setIsApplicationModalVisible,
        getJobPostLoading,
        setGetJobPostLoading,
      }}
    >
      {children}
    </ViewJobContext.Provider>
  );
};

const useViewJobContext = () => {
  const context = useContext(ViewJobContext);
  if (!context) {
    throw new Error(
      "useViewJobContext must be used within a CreateJobProvider"
    );
  }
  return context;
};

export default useViewJobContext;
