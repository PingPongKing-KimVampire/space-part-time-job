import React from "react";
import { MainBackgroundColor } from "../styles/global.ts";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import JobList from "../components/BrowseJobPage/JobList.tsx";
import JobFilter from "../components/BrowseJobPage/JobFilter.tsx";
import {
  Background,
  Container,
  InputContainer,
  LocationButton,
  LocationIcon,
  ArrowDownIcon,
  ContentContainer,
} from "../styles/BrowseJobPage.styles.ts";

const BrowseJobPage = () => {
  useBackgroundColor(MainBackgroundColor);
  return (
    <Background>
      <Container>
        <InputContainer>
          <LocationButton>
            <LocationIcon />
            <div className="location">기산동</div>
            <ArrowDownIcon />
          </LocationButton>
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

export default BrowseJobPage;
