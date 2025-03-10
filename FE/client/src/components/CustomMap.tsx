import React, { useRef, useEffect, useCallback } from "react";
import { Coordinate } from "../types/types.ts";
import { Container } from "../styles/components/CustomMap.styles.ts";

type CustomMapProps = {
  polygonLine?: Coordinate[];
  markerAddress?: string;
  className?: string;
};

const CustomMap: React.FC<CustomMapProps> = (props) => {
  const { polygonLine = null, markerAddress = null, className = "" } = props;
  const mapContainerRef = useRef(null);
  const mapRef = useRef<kakao.maps>(null);
  const polygonRef = useRef<kakao.maps.Polygon>(null);
  const markerRef = useRef<kakao.maps.Marker>(null);
  const resizeTimeoutRef = useRef<number | null>(null);

  const getMapLevel = () => {
    if (!mapContainerRef.current) return 0;
    const containerWidth = (mapContainerRef.current as HTMLDivElement)
      .clientWidth;
    return containerWidth <= 550 ? 5 : 4;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;
    // 지도 표시하기
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심 좌표
      level: getMapLevel(), //지도의 레벨(확대, 축소 정도)
    };
    mapRef.current = new kakao.maps.Map(mapContainerRef.current, options);
    mapRef.current.setDraggable(false);
    mapRef.current.setZoomable(false);
  }, []);

  const updatePolygon = (polygonLine) => {
    if (polygonRef.current) polygonRef.current?.setMap(null); // 이전 폴리곤 삭제
    if (!polygonLine) return;

    const setPolygon = (polygonPath) => {
      polygonRef.current = new kakao.maps.Polygon({
        path: polygonPath, // 선을 구성하는 좌표배열
        strokeWeight: 3,
        strokeColor: "#405CDB",
        strokeOpacity: 1,
        fillColor: "#405CDB",
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
  };
  const updateMarker = (markerAddress) => {
    if (markerRef.current) markerRef.current?.setMap(null); // 이전 마커 삭제
    if (!markerAddress) return;
    // 전달된 주소에 마커 표시하기
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(markerAddress, (result, status) => {
      if (status !== kakao.maps.services.Status.OK) return;
      const coordinate = new kakao.maps.LatLng(result[0].y, result[0].x);
      markerRef.current = new kakao.maps.Marker({
        map: mapRef.current,
        position: coordinate,
      });
      mapRef.current.setCenter(coordinate);
      mapRef.current.setLevel(getMapLevel());
    });
  };

  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) return;
    resizeTimeoutRef.current = setTimeout(() => {
      if (!mapContainerRef.current || !mapRef.current) return;
      updateMarker(markerAddress);
      updatePolygon(polygonLine);
      resizeTimeoutRef.current = null;
    }, 200);
  }, [polygonLine]);
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    updatePolygon(polygonLine);
  }, [polygonLine]);
  useEffect(() => {
    updateMarker(markerAddress);
  }, [markerAddress]);

  return <Container className={className} ref={mapContainerRef} />;
};

export default CustomMap;
