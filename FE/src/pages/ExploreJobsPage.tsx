import React from "react";
import { MainBackgroundColor } from "../styles/global.ts";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import JobList from "../components/ExploreJobsPage/JobList.tsx";
import JobFilter from "../components/ExploreJobsPage/JobFilter.tsx";
import {
  Background,
  Container,
  InputContainer,
  NeighborButton,
  LocationIcon,
  ArrowDownIcon,
  ContentContainer,
} from "../styles/ExploreJobsPage.styles.ts";

const ExploreJobsPage = () => {
  useBackgroundColor(MainBackgroundColor);
  return (
    <Background>
      <Container>
        <InputContainer>
          <NeighborButton>
            <LocationIcon />
            <div className="neighbor">기산동</div>
            <ArrowDownIcon />
          </NeighborButton>
          <input placeholder="주변 알바 검색" />
        </InputContainer>
        <ContentContainer>
          <JobFilter />
          <JobList />
        </ContentContainer>
      </Container>
    </Background>
  );
};

export default ExploreJobsPage;
