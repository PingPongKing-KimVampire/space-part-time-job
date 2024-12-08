import React, { useRef, useState, useEffect, useMemo } from "react";
import { ImageSliderContainer } from "../../styles/ViewJobPage.styles";
import { ReactComponent as LeftArrowIcon } from "../../assets/icons/arrow-left.svg";
import { ReactComponent as RightArrowIcon } from "../../assets/icons/arrow-right.svg";

type ImageSliderProps = {
  imageUrls: string[];
};

const ImageSlider: React.FC<ImageSliderProps> = ({ imageUrls }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageListRef = useRef<HTMLDivElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보여지는 이미지의 인덱스
  const [containerWidth, setContainerWidth] = useState(0); // 한 번 슬라이딩 시 움직여야 하는 거리

  useEffect(() => {
    setContainerWidth(
      containerRef.current ? containerRef.current.clientWidth : 0
    );
  }, []);

  const slidingTo = (index: number) => {
    if (index < 0 || imageUrls.length <= index) return;
    if (!imageListRef.current) return;
    const dist = currentIndex - index; // 이동해야 하는 거리 (방향 포함)
    const currentPos = -(containerWidth * currentIndex);
    const newPos = currentPos + dist * containerWidth;
    setCurrentIndex(index);
    imageListRef.current.style.transform = `translateX(${newPos}px)`;
  };

  return (
    <ImageSliderContainer ref={containerRef}>
      <div className="imageList" ref={imageListRef}>
        {imageUrls.map((url) => (
          <div className="imageBox" key={url}>
            <img src={url} alt="job" />
          </div>
        ))}
      </div>
      <div className="indicatorContainer">
        <div className="indicator">
          {Array.from({ length: imageUrls.length }).map((_, index) => (
            <button
              className={`item ${index === currentIndex ? "active" : ""}`}
              key={index}
              onClick={() => slidingTo(index)}
            />
          ))}
        </div>
      </div>
      <LeftArrowIcon
        className={`left ${currentIndex <= 0 ? "inactive" : ""}`}
        onClick={() => slidingTo(currentIndex - 1)}
      />
      <RightArrowIcon
        className={`right ${
          imageUrls.length - 1 <= currentIndex ? "inactive" : ""
        }`}
        onClick={() => slidingTo(currentIndex + 1)}
      />
    </ImageSliderContainer>
  );
};

export default ImageSlider;
