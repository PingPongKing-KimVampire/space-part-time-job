import { gql } from "@apollo/client";

export const GET_RESIDENT_NEIGHBORHOOD = gql`
  query GetResidentNeighborhood {
    me {
      residentNeighborhood {
        id
        level
        name
      }
    }
  }
`;

export const GET_MY_ID = gql`
  query GetMyId {
    me {
      id
    }
  }
`;

export const SEARCH_JOB_POSTS = gql`
  query SearchJobPosts(
    $filters: JobPostSearchFilter!
    $pagination: JobPostCursorInput!
  ) {
    searchJobPosts(filters: $filters, pagination: $pagination) {
      totalCount
      edges {
        node {
          id
          title
          workPeriod {
            type
            dates
            days
          }
          workTime {
            type
            startTime
            endTime
          }
          salary {
            salaryType
            salaryAmount
          }
          photos
          addressName
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_MY_JOB_POSTS = gql`
  query GetMyJobPosts(
    $filters: JobPostSearchFilter!
    $pagination: JobPostCursorInput!
  ) {
    searchJobPosts(filters: $filters, pagination: $pagination) {
      edges {
        node {
          id
          title
          applicationCount
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_JOB_POST = gql`
  query GetJobPost($id: ID!) {
    getJobPost(id: $id) {
      id
      status
      title
      jobDescription
      workPeriod {
        type
        dates
        days
      }
      workTime {
        type
        startTime
        endTime
      }
      salary {
        salaryType
        salaryAmount
      }
      photos
      detailedDescription
      addressName
      createdAt
      views
      publisher {
        nickname
        createdAt
      }
      applicationCount
      myJobApplication {
        id
      }
    }
  }
`;

export const GET_JOB_POST_APPLICATIONS = gql`
  query GetJobPostApplications($id: ID!) {
    getJobPost(id: $id) {
      node {
        applications {
          id
          coverLetter
          applicant {
            nickname
          }
          status
          createdAt
        }
      }
    }
  }
`;

export const LIST_MY_JOB_APPLICATIONS = gql`
  query ListMyJobApplications {
    listMyJobApplications {
      id
      jobPost {
        id
        title
        status
      }
      coverLetter
      status
      createdAt
    }
  }
`;

export const LIST_MY_INTEREST_JOB_POSTS = gql`
  query ListMyInterestJobPosts {
    listMyInterestJobPosts {
      jobPost {
        id
        status
        title
      }
      createdAt
    }
  }
`;
