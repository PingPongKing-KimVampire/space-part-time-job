import React, { useRef, useEffect } from "react";
import { createStitches } from "@stitches/react";

const { styled } = createStitches();

const Container = styled("div", {
  width: "100%",
  height: "240px",
  borderRadius: "16px",
  border: "1px solid #E3E9ED",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
});

type CustomMapProps = {
  style: Record<string, string>;
  polygonLine?: [number, number][];
};

const CustomMap: React.FC<CustomMapProps> = (props) => {
  const { style = {}, polygonLine = [] } = props;
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    // 지도 표시하기
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심 좌표
      level: 3, //지도의 레벨(확대, 축소 정도)
    };
    mapRef.current = new kakao.maps.Map(mapContainerRef.current, options);
    // polygonLine이 있다면 폴리곤 표시하기
  }, []);

  useEffect(() => {
    if (polygonLine.length === 0) return;
    const linePath = polygonLine.map(
      (coordinate) => new kakao.maps.LatLng(...coordinate)
    );
    const polygon = new kakao.maps.Polyline({
      path: linePath, // 선을 구성하는 좌표배열
      strokeWeight: 5,
      strokeColor: "#FFAE00",
      strokeOpacity: 0.7,
      strokeStyle: "solid",
    });
    mapRef.current?.setCenter(linePath[0]); // 임시로 중심 설정
    polygon.setMap(mapRef.current);
  }, [polygonLine]);

  return <Container ref={mapContainerRef} style={style} />;
};

export default CustomMap;
