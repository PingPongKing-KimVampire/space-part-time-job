import { gql } from "@apollo/client";

export const GET_RESIDENT_NEIGHBORHOOD = gql`
  query GetResidentNeighborhoods {
    me {
      ... on User {
        residentNeighborhoods {
          ... on ResidentNeighborhoodsType {
            neighborhoods {
              id
              level
              name
            }
          }
          ... on InternalError {
            message
          }
        }
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const GET_MY_ID = gql`
  query GetMyId {
    me {
      ... on User {
        id
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const GET_MY_BASIC_INFO = gql`
  query GetMyBasicInfo {
    me {
      ... on User {
        nickname
        createdAt
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const SEARCH_JOB_POSTS = gql`
  query SearchJobPosts(
    $filters: JobPostSearchFilter!
    $pagination: JobPostCursorInput!
  ) {
    searchJobPosts(filters: $filters, pagination: $pagination) {
      ... on JobPostConnection {
        totalCount
        edges {
          node {
            id
            title
            workPeriod {
              dates
              days
              type
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
          endCursor
          hasNextPage
        }
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

export const GET_MY_JOB_POSTS = gql`
  query GetMyJobPosts(
    $filters: JobPostSearchFilter!
    $pagination: JobPostCursorInput!
  ) {
    searchJobPosts(filters: $filters, pagination: $pagination) {
      ... on JobPostConnection {
        edges {
          node {
            id
            title
            status
            applicationCount {
              ... on ApplicationCount {
                count
              }
              ... on InternalError {
                message
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
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

export const GET_JOB_POST = gql`
  query GetJobPost($id: ID!) {
    getJobPost(id: $id) {
      ... on JobPost {
        id
        status
        title
        jobCategories
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
          ... on UserPublicInfo {
            nickname
            createdAt
          }
          ... on InternalError {
            message
          }
        }
        applicationCount {
          ... on ApplicationCount {
            count
          }
          ... on InternalError {
            message
          }
        }
        myJobApplication {
          ... on InternalError {
            message
          }
          ... on JobApplications {
            applications {
              id
              status
            }
          }
        }
        myInterested {
          createdAt
        }
        interestedCount
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

export const GET_JOB_POST_APPLICATIONS = gql`
  query GetJobPostApplications($id: ID!) {
    getJobPost(id: $id) {
      ... on JobPost {
        applications {
          ... on JobApplications {
            applications {
              id
              coverLetter
              applicant {
                ... on UserPublicInfo {
                  nickname
                }
                ... on InternalError {
                  message
                }
              }
              status
              createdAt
            }
          }
          ... on InternalError {
            message
          }
          ... on ForbiddenError {
            message
          }
        }
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

export const LIST_MY_JOB_APPLICATIONS = gql`
  query ListMyJobApplications {
    listMyJobApplications {
      ... on JobApplications {
        applications {
          id
          jobPost {
            ... on JobPost {
              id
              title
              status
            }
            ... on InternalError {
              message
            }
          }
          status
          coverLetter
          createdAt
        }
      }
      ... on InternalError {
        message
      }
    }
  }
`;

export const LIST_MY_INTERESTED_JOB_POSTS = gql`
  query ListMyInterestedJobPosts {
    listMyInterestedJobPosts {
      ... on InterestedJobPosts {
        interestedJobPosts {
          jobPost {
            id
            status
            title
          }
          createdAt
        }
      }
      ... on InternalError {
        message
      }
    }
  }
`;
