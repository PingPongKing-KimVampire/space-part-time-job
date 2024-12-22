import React from "react";
import ImageSlider from "./ImageSlider.tsx";
import Profile from "./Profile.tsx";
import BasicInfo from "./BasicInfo.tsx";
import Interaction from "./Interaction.tsx";
import { ContentContainer } from "../../styles/ViewJobPage.styles";
import { JobPostEdge } from "../../pages/ViewJobPage.tsx";
import defaultImage from "../../assets/images/jobDefault.png";

type ContentProps = {
  jobPostEdge: JobPostEdge;
  displayApplicationModal: () => void;
};

const Content: React.FC<ContentProps> = (props) => {
  const { jobPostEdge, displayApplicationModal } = props;
  const {
    status,
    workPeriod,
    workTime,
    salary,
    photos,
    detailedDescription,
    addressName,
    publisher,
  } = jobPostEdge.node;

  return (
    <ContentContainer>
      <div className="leftSection">
        <ImageSlider
          imageUrls={photos && photos.length ? photos : [defaultImage]}
        />
        <Profile
          nickname={publisher.nickname}
          timeTogether={publisher.createdAt}
        />
      </div>
      <div className="rightSection">
        <div className="textInfo">
          <BasicInfo
            pay={{ type: salary.salaryType, amount: salary.salaryAmount }}
            address={addressName}
            period={workPeriod}
            time={workTime}
          />
          <div className="detail">
            <div className="title">상세 내용</div>
            <div className="description">{detailedDescription}</div>
          </div>
        </div>
        <Interaction
          postStatus={status}
          alreadyApplied={!!jobPostEdge.myJobApplication}
          displayApplicationModal={displayApplicationModal}
        />
      </div>
    </ContentContainer>
  );
};

export default Content;
