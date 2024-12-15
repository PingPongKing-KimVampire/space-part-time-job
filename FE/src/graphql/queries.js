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

export const GET_JOB_POST = gql`
  query GetJobPost($id: ID!) {
    getJobPost(id: $id) {
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
    }
  }
`;

// export const INCREMENT_JOB_POST_VIEWS = gql`
//   query IncrementJobPostViews($id: ID!) {
//     incrementJobPostViews(id: $id) {
//       views // TODO : 반환하는 이름을 모르겠어!
//     }
//   }
// `;
