import { gql } from "@apollo/client";

export const CREATE_JOB_POST = gql`
  mutation CreateJobPost($input: CreateJobPostInput!) {
    createJobPost(input: $input) {
      id
      title
      jobDescription
    }
  }
`;

export const SET_RESIDENT_NEIGHBORHOOD = gql`
  mutation SetResidentNeigborhood($input: SetResidentNeighborhoodInput!) {
    setResidentNeighborhood(input: $input) {
      id
      name
    }
  }
`;

export const INCREMENT_JOB_POST_VIEWS = gql`
  mutation IncrementJobPostViews($id: ID!) {
    incrementJobPostViews(id: $id)
  }
`;

export const APPLY_TO_JOB_POST = gql`
  mutation ApplyToJobPost($input: ApplyJobPostInput!) {
    applyToJobPost(input: $input) {
      id
    }
  }
`;

export const DECIDE_JOB_APPLICATION = gql`
  mutation DecideJobApplication($input: DecideJobApplicationInput!) {
    decideJobApplication(input: $input) {
      id
    }
  }
`;
