import { gql } from "@apollo/client";

export const CREATE_JOB_POST = gql`
  mutation CreateJobPost($input: CreateJobPostInput!) {
    createJobPost(input: $input) {
      ... on JobPost {
        id
        title
        jobCategories
      }
      ... on BadInputError {
        message
        invalidFields
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const SET_RESIDENT_NEIGHBORHOOD = gql`
  mutation SetResidentNeighborhood($input: SetResidentNeighborhoodInput!) {
    setResidentNeighborhood(input: $input) {
      ... on NeighborhoodList {
        neighborhoods {
          id
          name
        }
      }
      ... on NotFoundError {
        message
      }
      ... on BadInputError {
        message
        invalidFields
      }
    }
  }
`;

export const INCREMENT_JOB_POST_VIEWS = gql`
  mutation IncrementJobPostViews($id: ID!) {
    incrementJobPostViews(id: $id) {
      ... on ViewsCountType {
        count
      }
      ... on NotFoundError {
        message
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const APPLY_TO_JOB_POST = gql`
  mutation ApplyToJobPost($input: ApplyJobPostInput!) {
    applyToJobPost(input: $input) {
      ... on JobApplication {
        id
      }
      ... on BadInputError {
        message
        invalidFields
      }
      ... on InternalError {
        message
      }
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

export const CLOSE_JOB_POST = gql`
  mutation CloseJobPost($id: ID!) {
    closeJobPost(id: $id) {
      id
    }
  }
`;

export const CANCEL_JOB_APPLICATION = gql`
  mutation CancelJobApplication($id: ID!) {
    cancelJobApplication(id: $id) {
      ... on JobApplication {
        id
      }
      ... on NotFoundError {
        message
      }
      ... on ForbiddenError {
        message
      }
    }
  }
`;

export const MARK_JOB_POST_AS_INTEREST = gql`
  mutation MarkJobPostAsInterest($jobPostId: ID!) {
    markJobPostAsInterest(jobPostId: $jobPostId) {
      myInterested {
        createdAt
      }
      interestedCount
    }
  }
`;

export const UNMARK_JOB_POST_AS_INTEREST = gql`
  mutation UnmarkJobPostAsInterest($jobPostId: ID!) {
    unmarkJobPostAsInterest(jobPostId: $jobPostId) {
      myInterested {
        createdAt
      }
      interestedCount
    }
  }
`;
