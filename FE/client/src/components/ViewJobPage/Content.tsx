import React from "react";
import ImageSlider from "./ImageSlider.tsx";
import Profile from "./Profile.tsx";
import BasicInfo from "./BasicInfo.tsx";
import Interaction from "./Interaction.tsx";
import { ContentContainer } from "../../styles/pages/ViewJobPage.styles";
import defaultImage from "../../assets/images/jobDefault.png";
import useViewJobContext from "../../context/ViewJobContext.tsx";

const Content = () => {
  const { jobPost, getJobPostLoading } = useViewJobContext();
  const { photos, detailedDescription } = jobPost;

  return (
    <ContentContainer>
      <div className="leftSection">
        <ImageSlider
          imageUrls={photos && photos.length ? photos : [defaultImage]}
          loading={getJobPostLoading}
        />
        <Profile />
      </div>
      <div className="rightSection">
        <div className="textInfo">
          <BasicInfo />
          <div className="detail">
            <div className="title">상세 내용</div>
            {getJobPostLoading ? (
              <div className="description loading">{"\n\n\n\n"}</div>
            ) : (
              <div className="description">{detailedDescription}</div>
            )}
          </div>
        </div>
        <Interaction />
      </div>
    </ContentContainer>
  );
};

export default Content;
