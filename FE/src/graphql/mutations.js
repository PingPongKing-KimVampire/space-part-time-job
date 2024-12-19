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
