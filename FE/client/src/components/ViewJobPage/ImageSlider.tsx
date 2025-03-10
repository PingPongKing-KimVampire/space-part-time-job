import React, { useRef, useState, useCallback, useEffect } from "react";
import { ImageSliderContainer } from "../../styles/pages/ViewJobPage.styles";
import { ReactComponent as LeftArrowIcon } from "../../assets/icons/arrow-left.svg";
import { ReactComponent as RightArrowIcon } from "../../assets/icons/arrow-right.svg";

type ImageSliderProps = {
  imageUrls: string[];
  loading: boolean;
};

const ImageSlider: React.FC<ImageSliderProps> = ({ imageUrls, loading }) => {
  const imageListRef = useRef<HTMLDivElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보여지는 이미지의 인덱스
  const [containerWidth, setContainerWidth] = useState(0); // 한 번 슬라이딩 시 움직여야 하는 거리

  const containerRef = useRef<HTMLDivElement | null>(null);
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    setContainerWidth(node.clientWidth);
    containerRef.current = node;
  }, []);

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (!imageListRef.current || !containerRef.current) return;
      // resize 동안 transition 제거, transfrom 직접 업데이트
      imageListRef.current.style.transition = "none";
      imageListRef.current.style.transform = `translateX(-${
        containerRef.current.clientWidth * currentIndex
      }px)`;
      // resize 종료 후 일정 시간 뒤 transition 복원 및 containerWidth 업데이트 (debounce)
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (!imageListRef.current || !containerRef.current) return;
        setContainerWidth(containerRef.current.clientWidth);
        imageListRef.current.style.transition = "transform 0.5s";
      }, 200);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeout) clearTimeout(resizeTimeout);
    };
  }, [currentIndex]);

  const slidingTo = (index: number) => {
    if (index < 0 || imageUrls.length <= index) return;
    if (!imageListRef.current) return;
    const dist = currentIndex - index; // 이동해야 하는 거리 (방향 포함)
    const currentPos = -(containerWidth * currentIndex);
    const newPos = currentPos + dist * containerWidth;
    setCurrentIndex(index);
    imageListRef.current.style.transform = `translateX(${newPos}px)`;
  };

  if (loading) {
    return <ImageSliderContainer className="loading" />;
  }
  return (
    <ImageSliderContainer ref={setContainerRef}>
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
              key={imageUrls[index]}
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
