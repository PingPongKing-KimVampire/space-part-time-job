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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const setContainerhRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    setContainerWidth(node.clientWidth);
    containerRef.current = node;
  }, []);

  useEffect(() => {
    const updateContainerWidth = () => {
      if (!containerRef.current) return;
      setContainerWidth(containerRef.current.clientWidth);
    };
    window.addEventListener("resize", updateContainerWidth);
    return () => window.removeEventListener("resize", updateContainerWidth);
  }, []);

  useEffect(() => {
    // 지원하기 상호작용 후, imageUrls이 변경되었을 때 새로운 imageList 요소의 위치를 기존 위치로 업데이트하여 유지
    if (!imageListRef.current) return;
    imageListRef.current.style.transition = "none";
    imageListRef.current.style.transform = `translateX(-${
      containerWidth * currentIndex
    }px)`;
  }, [imageUrls]);

  useEffect(() => {
    if (!imageListRef.current) return;
    imageListRef.current.style.transition = "transform 0.5s";
    imageListRef.current.style.transform = `translateX(-${
      containerWidth * currentIndex
    }px)`;
  }, [currentIndex]);

  useEffect(() => {
    if (!imageListRef.current) return;
    imageListRef.current.style.transition = "none";
    imageListRef.current.style.transform = `translateX(-${
      containerWidth * currentIndex
    }px)`;
  }, [containerWidth]);

  const slidingTo = (index: number) => {
    if (index < 0 || index >= imageUrls.length) return;
    setCurrentIndex(index);
  };

  if (loading) return <ImageSliderContainer className="loading" />;
  return (
    <ImageSliderContainer ref={setContainerhRef}>
      <div className="imageList" ref={imageListRef}>
        {imageUrls.map((url) => (
          <div className="imageBox" key={url}>
            <img src={url} alt="job" />
          </div>
        ))}
      </div>
      <div className="indicatorContainer">
        <div className="indicator">
          {imageUrls.map((url, index) => (
            <button
              className={`item ${index === currentIndex ? "active" : ""}`}
              key={url}
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
          currentIndex >= imageUrls.length - 1 ? "inactive" : ""
        }`}
        onClick={() => slidingTo(currentIndex + 1)}
      />
    </ImageSliderContainer>
  );
};

export default ImageSlider;
