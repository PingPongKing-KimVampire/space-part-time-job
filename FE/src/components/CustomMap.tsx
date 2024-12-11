import React, { useRef, useEffect } from "react";
import { createStitches } from "@stitches/react";
import { MainColor } from "../styles/global";
import { Coordinate } from "../pages/SetNeighborScopePage";

const { styled } = createStitches();

const Container = styled("div", {
  width: "100%",
  height: "280px",
  borderRadius: "16px",
  border: "1px solid #E3E9ED",
  boxShadow: "0 0 30px 10px rgba(0, 0, 0, 0.03)",
});

type CustomMapProps = {
  style?: Record<string, string>;
  polygonLine?: Coordinate[];
  markerAddress?: string;
};

const CustomMap: React.FC<CustomMapProps> = (props) => {
  const { style = {}, polygonLine = [], markerAddress } = props;
  const mapContainerRef = useRef(null);
  const mapRef = useRef<kakao.maps>(null);
  const polygonRef = useRef<kakao.maps.Polygon>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    // 지도 표시하기
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심 좌표
      level: 3, //지도의 레벨(확대, 축소 정도)
    };
    mapRef.current = new kakao.maps.Map(mapContainerRef.current, options);
    mapRef.current.setDraggable(false);
    mapRef.current.setZoomable(false);
  }, []);

  useEffect(() => {
    if (polygonRef.current) polygonRef.current?.setMap(null); // 이전 폴리곤 삭제
    if (polygonLine.length === 0) return;

    const setPolygon = (polygonPath) => {
      polygonRef.current = new kakao.maps.Polygon({
        path: polygonPath, // 선을 구성하는 좌표배열
        strokeWeight: 3,
        strokeColor: MainColor,
        strokeOpacity: 1,
        fillColor: MainColor,
        fillOpacity: 0.2,
      });
      polygonRef.current?.setMap(mapRef.current);
    };
    const setCenter = (polygonPath) => {
      const bounds = new kakao.maps.LatLngBounds();
      polygonPath.forEach((point) => {
        bounds.extend(point);
      });
      mapRef.current.panTo(bounds);
    };

    const polygonPath = polygonLine.map(
      ({ latitude, longitude }) => new kakao.maps.LatLng(latitude, longitude)
    );
    setPolygon(polygonPath); // 폴리곤 표시
    setCenter(polygonPath); // 지도 중심 설정
  }, [polygonLine]);

  useEffect(() => {
    // 전달된 주소에 마커 표시하기
    if (!markerAddress) return;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(markerAddress, (result, status) => {
      if (status !== kakao.maps.services.Status.OK) return;
      const coordinate = new kakao.maps.LatLng(result[0].y, result[0].x);
      const marker = new kakao.maps.Marker({
        map: mapRef.current,
        position: coordinate,
      });
      mapRef.current.setCenter(coordinate);
    });
  }, [markerAddress]);

  return <Container ref={mapContainerRef} style={style} />;
};

export default CustomMap;
