import React, { useRef } from "react";
import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";
import { ReactComponent as XmarkIcon } from "../../assets/icons/x-mark.svg";
import {
  Container,
  UploadButton,
  ImagesContainer,
  ImageDisplay,
} from "../../styles/CreateJobPage/ImageSection.styles.ts";
import { IP_ADDRESS, ERROR } from "../../constants/constants.ts";

type UploadImagesResponseData = {
  error?: string;
  imageUrlList?: string[];
};

const VALID_IMAGE_BYTE = 10 * 1024 * 1024;

const ImageSection = ({ images, setImages, setIsValid }) => {
  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadImages = async (imageFiles: File[]): Promise<string[]> => {
    const requestUrl = `https://${IP_ADDRESS}/api/image-upload`;
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append("imageFiles", file);
    });
    let response: Response;
    try {
      response = await fetch(requestUrl, {
        method: "POST",
        // headers: { "Content-Type": "multipart/form-data" },
        body: formData,
        credentials: "include",
      });
    } catch {
      throw new Error(ERROR.NETWORK);
    }
    let data: UploadImagesResponseData;
    try {
      data = await response.json();
    } catch {
      throw new Error(ERROR.SERVER);
    }
    if (!response.ok) throw new Error(ERROR.SERVER);
    return data.imageUrlList || [];
  };

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedImages = Array.from(e.target.files);

    // 이미지 크기, 개수 유효성 검사
    const validSizeImages = selectedImages.filter(
      (image) => image.size <= VALID_IMAGE_BYTE
    );
    const validCountImages = validSizeImages.slice(
      0,
      10 - Object.keys(images).length
    );
    const imageUrls = validCountImages.map((file) => URL.createObjectURL(file));
    setImages((state) => ({
      ...state,
      ...imageUrls.reduce((acc, url) => ({ ...acc, [url]: null }), {}),
    }));

    let isResponseValid: boolean = true;
    if (validCountImages.length) {
      try {
        const fetchedUrls: string[] = await uploadImages(validCountImages);
        // 프론트엔드 url과 백엔드 url을 매핑
        const urlMap = imageUrls.reduce(
          (acc, url, idx) => ({ ...acc, [url]: fetchedUrls[idx] }),
          {}
        );
        // images 상태 업데이트 (응답받은 url을 저장)
        setImages((state) => ({
          ...state,
          ...Object.keys(urlMap).reduce(
            (acc, key) => ({ ...acc, [key]: urlMap[key] }),
            {}
          ),
        }));
      } catch {
        isResponseValid = false;
        // 업로드 실패 시 url 제거
        setImages((state) => ({
          ...imageUrls.reduce((acc, url) => {
            const { [url]: _, ...rest } = acc; // 해당 URL 삭제
            return rest;
          }, state),
        }));
      }
    }

    const isSizeValid = selectedImages.length === validSizeImages.length;
    const isCountValid = validSizeImages.length === validCountImages.length;
    setIsValid((state) => ({
      ...state,
      images: {
        size: isSizeValid,
        count: isCountValid,
        response: isResponseValid,
      },
    }));
  };

  const onXmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const imageUrl = e.currentTarget.getAttribute("data-url");
    setImages((state) => {
      const newState = { ...state };
      Object.keys(state).forEach((key) => {
        if (key === imageUrl) delete newState[key];
      });
      return newState;
    });
  };

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
          setIsValid((state) => ({
            ...state,
            images: { size: true, count: true, response: true },
          })); // 경고 메시지 제거 목적
          hiddenFileInputRef.current?.click();
        }}
      >
        <CameraIcon />
        {Object.keys(images).length}/10
      </UploadButton>
      <ImagesContainer>
        {images &&
          Object.keys(images).map((url, index) => (
            <ImageDisplay key={url}>
              <img src={url} alt={`uploaded ${index}`} />
              <button onClick={onXmarkClick} data-url={url}>
                <XmarkIcon />
              </button>
            </ImageDisplay>
          ))}
      </ImagesContainer>
    </Container>
  );
};

export default ImageSection;
