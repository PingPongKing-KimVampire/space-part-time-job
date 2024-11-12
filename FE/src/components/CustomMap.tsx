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

const CustomMap = ({ style = {} }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심 좌표
      level: 3, //지도의 레벨(확대, 축소 정도)
    };
    const map = new kakao.maps.Map(mapContainerRef.current, options);
  }, []);

  return <Container ref={mapContainerRef} style={style} />;
};

export default CustomMap;
