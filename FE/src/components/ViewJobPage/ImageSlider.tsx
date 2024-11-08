import React, { useRef, useState, useEffect, useMemo } from "react";
import { ImageSliderContainer } from "../../styles/ViewJobPage.styles.ts";
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

  const isSlidingPossible = useMemo(() => {
    const right = currentIndex < imageUrls.length - 1;
    const left = 0 < currentIndex;
    return { right, left };
  }, [currentIndex, imageUrls.length]);

  const onArrowClick = (isForward: boolean) => {
    if (!imageListRef.current) return;
    if (isForward && !isSlidingPossible.right) return;
    if (!isForward && !isSlidingPossible.left) return;
    const currentPos = -(containerWidth * currentIndex);
    const newPos = currentPos + (isForward ? -containerWidth : containerWidth);
    setCurrentIndex((prev) => prev + (isForward ? 1 : -1));
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
            <div
              className={`item ${index === currentIndex ? "active" : ""}`}
              key={index}
            />
          ))}
        </div>
      </div>
      <LeftArrowIcon
        className={`left ${!isSlidingPossible.left ? "inactive" : ""}`}
        onClick={() => onArrowClick(false)}
      />
      <RightArrowIcon
        className={`right ${!isSlidingPossible.right ? "inactive" : ""}`}
        onClick={() => onArrowClick(true)}
      />
    </ImageSliderContainer>
  );
};

export default ImageSlider;
