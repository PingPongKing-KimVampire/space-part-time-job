import React from "react";
import { useParams } from "react-router-dom";
import Header from "../components/ViewJobPage/Header.tsx";
import Content from "../components/ViewJobPage/Content.tsx";
import useBackgroundColor from "../utils/useBackgroundColor.ts";
import { Background, Container } from "../styles/ViewJobPage.styles.ts";
import { MainBackgroundColor } from "../styles/global.ts";

const ViewJobPage = () => {
  useBackgroundColor(MainBackgroundColor);

  const { id } = useParams();
  console.log("선택된 포스트의 ID: ", id);

  return (
    <Background>
      <Container>
        <Header
          jobTypes={["매장관리/판매", "음료 제조", "베이킹"]}
          title="남광장 카페에서 경력직 주간 직원분 모십니다"
          postTime="10시간 전"
        />
        <Content />
      </Container>
    </Background>
  );
};

export default ViewJobPage;
