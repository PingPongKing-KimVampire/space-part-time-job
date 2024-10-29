import React, { useRef, useState, useEffect } from "react";
import { createStitches } from "@stitches/react";
import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";
import { ReactComponent as XmarkIcon } from "../../assets/icons/x-mark.svg";

const { styled } = createStitches();

const Container = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  gap: "10px",
  width: "100%",
  height: "120px",
  marginTop: "-14px",
});

const UploadButton = styled("button", {
  height: "90%",
  aspectRatio: "1/1",
  borderRadius: "5px",
  background: "#EDEDED",
  border: "1px solid #B2B2B2",
  color: "#7C7C7C",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "2.5px",
  fontSize: "16px",
  fontWeight: "bold",
  transition: " background 0.2s",
  "& svg": {
    width: "40%",
  },
  "&:hover": {
    background: "#DCE2FF",
    borderColor: "#DCE2FF",
    color: "black",
  },
});

const ImagesContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  alignItems: "flex-end",
  gap: "10px",
  overflowX: "scroll",
  overflowY: "hidden",
  height: "100%",
  width: "100%",
});

const ImageDisplay = styled("div", {
  height: "90%",
  aspectRatio: "1/1",
  boxSizing: "border-box",
  // border: "1px solid #B2B2B2",
  // borderRadius: "5px",
  position: "relative",
  "& img": {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "5px",
  },
  "& button": {
    height: "24%",
    aspectRatio: "1/1",
    border: "none",
    position: "absolute",
    bottom: "100%",
    left: "100%",
    transform: "translateY(+65%) translateX(-65%)",
    borderRadius: "100px",
    background: "#EDEDED",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "& svg": {
      color: "#7C7C7C",
      strokeWidth: "3",
      height: "70%",
    },
  },
});

const VALID_IMAGE_BYES = 10 * 1024 * 1024;

const ImageSection = () => {
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);
  const [images, setImages] = useState<string[]>([]);
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

    const validImageURLs = Array.from(validCountImages).map((image) =>
      URL.createObjectURL(image)
    );
    setImages((prev) => prev.concat(validImageURLs));
  };

  const onXmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const imagePath = e.currentTarget.getAttribute("data-path");
    setImages((prev) => prev.filter((path) => path !== imagePath));
  };

  useEffect(() => {
    if (!isValid.size && !isValid.count) {
      console.log("10MB 이하의 사진 10장까지 업로드 가능합니다.");
    } else if (!isValid.size) {
      console.log("10MB 이하의 사진만 가능합니다.");
    } else if (!isValid.count) {
      console.log("사진은 10장까지만 가능합니다.");
    }
  }, [isValid]);

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
          hiddenFileInputRef.current?.click();
        }}
      >
        <CameraIcon />
        7/10
      </UploadButton>
      <ImagesContainer>
        {images &&
          images.map((imagePath, index) => (
            <ImageDisplay key={imagePath}>
              <img src={imagePath} alt={`uploaded ${index}`} />
              <button onClick={onXmarkClick} data-path={imagePath}>
                <XmarkIcon />
              </button>
            </ImageDisplay>
          ))}
      </ImagesContainer>
    </Container>
  );
};

export default ImageSection;
