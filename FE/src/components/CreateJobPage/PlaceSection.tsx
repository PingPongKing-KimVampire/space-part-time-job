import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomInput from "../CustomInput.tsx";
import {
  Container,
  ExposurePanel,
  ExposureDetailContent,
  ArrowDownIcon,
} from "../../styles/CreateJobPage/PlaceSection.styles.ts";

const PlaceSection = ({ place, setPlace }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const mapContainerRef = useRef(null);

  const [isExposureDetailVisible, setIsExposureDetailVisible] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setPlace(queryParams.get("place") || "");
  }, [location.search, setPlace]);

  useEffect(() => {
    if (place === "" || !mapContainerRef.current) return;
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심 좌표
      level: 3, //지도의 레벨(확대, 축소 정도)
    };
    const map = new kakao.maps.Map(mapContainerRef.current, options);
  }, [place]);

  return (
    <Container>
      <CustomInput
        id="place"
        placeholder="주소를 입력해주세요."
        value={place}
        readOnly={true}
        eventHandlers={{
          onFocus: () => {
            navigate("/search-address");
          },
        }}
      />
      {place !== "" && (
        <>
          <div className="mapContainer" ref={mapContainerRef} />
          <ExposurePanel
            onClick={() => {
              setIsExposureDetailVisible((prev) => !prev);
            }}
          >
            <div className="main">
              <span>기산동 외 57개 동네</span>에서 노출{" "}
              <ArrowDownIcon
                isSelected={isExposureDetailVisible}
                // onClick={onArrowDownClick}
              />
            </div>
            <ExposureDetailContent isVisible={isExposureDetailVisible}>
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
};

export default PlaceSection;
