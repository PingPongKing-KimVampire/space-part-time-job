import React, { useRef, useState, useEffect } from "react";
import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";
import { ReactComponent as XmarkIcon } from "../../assets/icons/x-mark.svg";
import {
  Container,
  UploadButton,
  ImagesContainer,
  ImageDisplay,
} from "../../styles/CreateJobPage/ImageSection.styles.ts";

const VALID_IMAGE_BYES = 10 * 1024 * 1024;

type ImageData = {
  url: string;
  file: File;
};

const ImageSection = ({ setWarnings }) => {
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<ImageData[]>([]);
  const [isValid, setIsValid] = useState({ size: true, count: true });

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedImages = Array.from(e.target.files);
    // 이미지 크기, 개수 유효성 검사
    const validSizeImages = selectedImages.filter(
      (image) => image.size <= VALID_IMAGE_BYES
    );
    const validCountImages = validSizeImages.slice(0, 10 - images.length);

    setIsValid({
      size: selectedImages.length === validSizeImages.length,
      count: validSizeImages.length === validCountImages.length,
    });

    const validImages = validCountImages.map((image) => ({
      url: URL.createObjectURL(image),
      file: image,
    }));
    setImages((prev) => prev.concat(validImages));
  };

  const onXmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const imageUrl = e.currentTarget.getAttribute("data-url");
    setImages((prev) => prev.filter((image) => image.url !== imageUrl));
  };

  useEffect(() => {
    const getWarning = () => {
      if (!isValid.size && !isValid.count) {
        return "* 10MB 이하의 사진 10장까지 업로드 가능합니다.";
      } else if (!isValid.size) {
        return "* 10MB 이하의 사진만 가능합니다.";
      } else if (!isValid.count) {
        return "* 사진은 10장까지만 가능합니다";
      }
      return "";
    };
    setWarnings((state) => ({ ...state, image: getWarning() }));
  }, [isValid, setWarnings]);

  return (
    <Container>
      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={hiddenFileInputRef}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          onImageChange(e);
          e.target.value = "";
        }}
        style={{ display: "none" }}
      />
      {/* 파일 선택 커스텀 버튼 */}
      <UploadButton
        onClick={() => {
          setIsValid({ size: true, count: true }); // 경고 메시지 제거 목적
          hiddenFileInputRef.current?.click();
        }}
      >
        <CameraIcon />
        {images.length}/10
      </UploadButton>
      <ImagesContainer>
        {images &&
          images.map((image, index) => (
            <ImageDisplay key={image.url}>
              <img src={image.url} alt={`uploaded ${index}`} />
              <button onClick={onXmarkClick} data-url={image.url}>
                <XmarkIcon />
              </button>
            </ImageDisplay>
          ))}
      </ImagesContainer>
    </Container>
  );
};

export default ImageSection;