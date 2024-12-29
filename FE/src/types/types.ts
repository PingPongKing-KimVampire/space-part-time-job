import { APPLICATION_STATUS } from "../constants/constants.ts";

export type Application = {
  id: string;
  coverLetter: string;
  status: APPLICATION_STATUS;
  createdAt: string;
  jobPost?: { id: string; title: string; status: string };
  applicant?: { nickname: string };
};

export type WorkPeriod = {
  type: string;
  dates?: string[];
  days?: string[];
};

export type WorkTime = {
  type: string;
  startTime?: string;
  endTime?: string;
};

export type JobPost = {
  id: string;
  title: string;
  status?: string;
  jobDescription?: string[];
  workPeriod?: WorkPeriod;
  workTime?: WorkTime;
  salary?: { salaryType: string; salaryAmount: number };
  photos?: string[];
  detailedDescription: string;
  addressName?: string;
  createdAt?: string;
  views?: number;
  publisher?: { nickname: string; createdAt: string };
  applicationCount?: number;
  myJobApplication?: { id: string; status: string }[];
  myInterested?: { createdAt: string } | null;
  interestedCount?: number;
};

export type InterestedJobPost = {
  jobPost: JobPost;
  createdAt: string;
};

export type Tab = {
  label: "지원 내역" | "게시한 공고" | "관심 목록";
  pos: "left" | "middle" | "right";
};

export type Neighborhood = {
  id: string;
  name: string;
};

export type SelectedNeighborhood = Neighborhood & {
  scopeValue: string;
};

export type SearchNeighborhood = Neighborhood & {
  level: string;
  districts: Neighborhood[];
};

export type Coordinate = {
  longitude: number;
  latitude: number;
};

export type Level = {
  districts: string[];
  outer_boundary: {
    type: string;
    coordinates: Coordinate[];
  };
};

export type PageInfo = {
  hasNextPage: boolean;
  endCursor: string | null;
};

export type Filter = {
  term: string | null;
  jobTypes: string[];
  time: { start: string; end: string };
  weekDays: string[];
};
