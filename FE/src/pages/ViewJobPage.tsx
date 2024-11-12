import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/ViewJobPage/Header.tsx";
import Content from "../components/ViewJobPage/Content.tsx";
import ApplicationModal from "../components/ViewJobPage/ApplicationModal.tsx";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import { Background, Container } from "../styles/ViewJobPage.styles.ts";
import { MainBackgroundColor } from "../styles/global.ts";

const ViewJobPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const { id } = useParams();
  console.log("선택된 포스트의 ID: ", id);

  const [isApplicationModalVisible, setIsApplicationModalVisible] =
    useState(true);

  return (
    <Background>
      <Container>
        <Header
          jobTypes={["STORE_MANAGEMENT", "BEVERAGE_MAKING", "BAKING"]}
          title="남광장 카페에서 경력직 주간 직원분 모십니다"
          postTime="10시간 전"
          viewCount={25}
          interestCount={8}
        />
        <Content
          displayApplicationModal={() => {
            setIsApplicationModalVisible(true);
          }}
        />
      </Container>
      {isApplicationModalVisible && (
        <ApplicationModal
          onXClick={() => {
            setIsApplicationModalVisible(false);
          }}
        />
      )}
    </Background>
  );
};

export default ViewJobPage;
