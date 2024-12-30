import React, { useState, useEffect } from "react";
import FormField from "./FormField.tsx";
import CustomInput from "../CustomInput.tsx";
import CustomMap from "../CustomMap.tsx";
import useCreateJobContext from "../../context/CreateJobContext.tsx";
import {
  fetchCoordinateByAddress,
  fetchNeighborhoodInfoByCoordinate,
  fetchDistrictBoundary,
} from "../../api/rest/neighborhood.ts";
import {
  Container,
  ExposurePanel,
  ExposureDetailContent,
  ArrowDownIcon,
} from "../../styles/CreateJobPage/PlaceSection.styles.ts";

const PlaceField = () => {
  const { input, setInput, setIsValid } = useCreateJobContext();

  const [isExposureDetailVisible, setIsExposureDetailVisible] = useState(false);
  const [exposureNeighborhoods, setExposureNeighborhoods] = useState({
    main: "",
    sub: [],
  });

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.blur();
    new daum.Postcode({
      oncomplete: (data) => {
        setInput((state) => ({ ...state, place: data.roadAddress }));
        setIsValid((state) => ({ ...state, place: true }));
      },
    }).open();
  };

  useEffect(() => {
    const displayExposureNeighborhoods = async () => {
      const coordinate = await fetchCoordinateByAddress(input.place); // 주소 -> 좌표
      if (!coordinate) return;
      const { id, name } = await fetchNeighborhoodInfoByCoordinate(coordinate); // 좌표 -> 동 ID, 행정동
      if (!id || !name) return;
      const boundary = await fetchDistrictBoundary(id); // 동 ID -> 동 경계 데이터
      if (!boundary) return;
      setExposureNeighborhoods({
        main: name,
        sub: boundary[4].districts.map((district) => district.name),
      });
    };
    if (input.place) displayExposureNeighborhoods();
  }, [input.place]);

  return (
    <FormField id="place" title="일하는 장소" warning="">
      <Container>
        <CustomInput
          id="place"
          placeholder="주소를 입력해주세요."
          value={input.place}
          readOnly={true}
          eventHandlers={{ onFocus }}
        />
        {input.place !== "" && (
          <>
            <CustomMap markerAddress={input.place} />
            <ExposurePanel
              onClick={() => {
                setIsExposureDetailVisible((state) => !state);
              }}
            >
              <div className="main">
                <span>
                  {exposureNeighborhoods.main} 외{" "}
                  {exposureNeighborhoods.sub.length}개 동네
                </span>
                에서 노출 <ArrowDownIcon isSelected={isExposureDetailVisible} />
              </div>
              <ExposureDetailContent
                className={isExposureDetailVisible ? "visible" : ""}
              >
                {exposureNeighborhoods.sub.join(", ")}
              </ExposureDetailContent>
            </ExposurePanel>
          </>
        )}
      </Container>
    </FormField>
  );
};

export default PlaceField;
