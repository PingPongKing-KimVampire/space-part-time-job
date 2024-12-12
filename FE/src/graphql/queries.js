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
