import React, { createContext, useContext, useState } from "react";
import { JobPost } from "../types/types.ts";

interface ViewJobContextType {
  jobPost: JobPost;
  setJobPost: React.Dispatch<React.SetStateAction<JobPost>>;
  isApplicationModalVisible: boolean;
  setIsApplicationModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ViewJobContext = createContext<ViewJobContextType | undefined>(undefined);

export const ViewJobProvider = ({ children }) => {
  const [jobPost, setJobPost] = useState<JobPost>({
    id: "",
    status: "",
    title: "",
    jobDescription: [],
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

  return (
    <ViewJobContext.Provider
      value={{
        jobPost,
        setJobPost,
        isApplicationModalVisible,
        setIsApplicationModalVisible,
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