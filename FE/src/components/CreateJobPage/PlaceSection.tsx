import React, { useState, forwardRef, useEffect } from "react";
import {
  fetchCoordinateByAddress,
  fetchNeighborInfoByCoordinate,
  fetchDistrictBoundary,
} from "../../utils/fetchData";
import CustomInput from "../CustomInput.tsx";
import CustomMap from "../CustomMap.tsx";
import {
  Container,
  ExposurePanel,
  ExposureDetailContent,
  ArrowDownIcon,
} from "../../styles/CreateJobPage/PlaceSection.styles";

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
    const [exposureNeighbors, setExposureNeighbors] = useState({
      main: "",
      sub: [],
    });

    const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.blur();
      new daum.Postcode({
        oncomplete: (data) => {
          setPlace(data.roadAddress);
          onSelect();
        },
      }).open();
    };

    useEffect(() => {
      const displayExposureNeighbors = async () => {
        const coordinate = await fetchCoordinateByAddress(place); // 주소 -> 좌표
        if (!coordinate) return;
        const { id, name } = await fetchNeighborInfoByCoordinate(coordinate); // 좌표 -> 동 ID, 행정동
        if (!id || !name) return;
        const boundary = await fetchDistrictBoundary(id); // 동 ID -> 동 경계 데이터
        if (!boundary) return;
        setExposureNeighbors({ main: name, sub: boundary[4].districts });
      };
      if (place) displayExposureNeighbors();
    }, [place]);

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
                <span>
                  {exposureNeighbors.main} 외 {exposureNeighbors.sub.length}개
                  동네
                </span>
                에서 노출 <ArrowDownIcon isSelected={isExposureDetailVisible} />
              </div>
              <ExposureDetailContent
                className={isExposureDetailVisible ? "visible" : ""}
              >
                {exposureNeighbors.sub.join(", ")}
              </ExposureDetailContent>
            </ExposurePanel>
          </>
        )}
      </Container>
    );
  }
);

export default PlaceSection;
