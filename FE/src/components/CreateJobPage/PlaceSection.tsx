import React, { useState, forwardRef, useEffect } from "react";
import CustomInput from "../CustomInput.tsx";
import CustomMap from "../CustomMap.tsx";
import {
  Container,
  ExposurePanel,
  ExposureDetailContent,
  ArrowDownIcon,
} from "../../styles/CreateJobPage/PlaceSection.styles";
import { ERROR } from "../../constants/constants";

type PlaceSectionProps = {
  place: string;
  setPlace: React.Dispatch<React.SetStateAction<string>>;
  onSelect: () => void;
};

const PlaceSection = forwardRef<HTMLDivElement, PlaceSectionProps>(
  (props, ref) => {
    const { place, setPlace, onSelect } = props;

    const [isExposureDetailVisible, setIsExposureDetailVisible] =
      useState(false);

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.blur();
      new daum.Postcode({
        oncomplete: (data) => {
          setPlace(data.roadAddress);
          onSelect();
        },
      }).open();
    };

    return (
      <Container ref={ref}>
        <CustomInput
          id="place"
          placeholder="주소를 입력해주세요."
          value={place}
          readOnly={true}
          eventHandlers={{ onFocus }}
        />
        {place !== "" && (
          <>
            <CustomMap markerAddress={place} />
            <ExposurePanel
              onClick={() => {
                setIsExposureDetailVisible((prev) => !prev);
              }}
            >
              <div className="main">
                <span>기산동 외 57개 동네</span>에서 노출{" "}
                <ArrowDownIcon isSelected={isExposureDetailVisible} />
              </div>
              <ExposureDetailContent
                className={isExposureDetailVisible ? "visible" : ""}
              >
                세류1동, 세류2동, 세류3동, 권선1동, 권선2동, 인계동, 매탄1동,
                매탄2동, 매탄3동, 매탄4동, 영통1동, 영통2동, 태장동, 세마동,
                지안동, 병점1동, 병점2동, 반월동, 동탄1동, 동탄2동, 동탄3동,
                망포동, 능동, 반송동, 기산동, 석우동, 오산동, 송산동, 안녕동,
                영천동, 황계동, 농서동, 외삼미동, 양산동, 세교동, 내삼이동,
                화산동, 기배동, 영통동, 신동, 메탕동, 장지동, 곡반정동, 대황교동
              </ExposureDetailContent>
            </ExposurePanel>
          </>
        )}
      </Container>
    );
  }
);

export default PlaceSection;
