import React from "react";
import ImageSlider from "./ImageSlider.tsx";
import Profile from "./Profile.tsx";
import BasicInfo from "./BasicInfo.tsx";
import Interaction from "./Interaction.tsx";
import { ContentContainer } from "../../styles/ViewJobPage.styles.ts";
import defaultImage from "../../assets/images/jobDefault.png";

import testImage from "../../assets/test/ViewJobTest.jpeg";
import testImage1 from "../../assets/test/ExploreJobsTest1.jpeg";
import testImage2 from "../../assets/test/ExploreJobsTest2.jpeg";

type ContentProps = {
  //   imageUrl: string;
};

const Content: React.FC<ContentProps> = (props) => {
  const imageUrls = [testImage, testImage1, testImage2];
  //   const imageUrls = [];
  const dates = ["2024-11-10", "2024-11-12"];
  const days = ["MONDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const description = `디저트 카페에서 경력있으신 알바분을 모십니다!
저희 카페는 디저트 카페로 다양한 음료와 떡볶이, 튀김, 구움류 등 여러 종류가 있습니다. 조리에 자신있으시거나 경험이 많으신 분이 지원해주시면 더욱 즐겁게 일하실 수 있을 것 같습니다^^

바쁜 카페에서 일해보셨던 분, 배달주문 많은 곳에서 일해보신분, 손 빠른 분 등 관련 직종에서 일해보셨던 분 많은 지원 부탁드리겠습니다.
디저트 카페에서 경력있으신 알바분을 모십니다!
저희 카페는 디저트 카페로 다양한 음료와 떡볶이, 튀김, 구움류 등 여러 종류가 있습니다. 조리에 자신있으시거나 경험이 많으신 분이 지원해주시면 더욱 즐겁게 일하실 수 있을 것 같습니다^^

바쁜 카페에서 일해보셨던 분, 배달주문 많은 곳에서 일해보신분, 손 빠른 분 등 관련 직종에서 일해보셨던 분 많은 지원 부탁드리겠습니다.`;

  return (
    <ContentContainer>
      <div className="leftSection">
        <ImageSlider
          imageUrls={imageUrls.length ? imageUrls : [defaultImage]}
        />
        <Profile nickname="롤리" timeTogether="우주알바와 함께한지 6개월" />
      </div>
      <div className="rightSection">
        <div className="textInfo">
          <BasicInfo
            pay={{ type: "MONTHLY", amount: 2500000 }}
            address="경기 화성시 동탄문화센터로 71-3"
            period={{ type: "SHORT_TERM", days: days, dates: dates }}
            time={{ type: "FIXED", startTime: "07:30", endTime: "17:30" }}
          />
          <div className="detail">
            <div className="title">상세 내용</div>
            <div className="description">{description}</div>
          </div>
        </div>
        <Interaction />
      </div>
    </ContentContainer>
  );
};

export default Content;
