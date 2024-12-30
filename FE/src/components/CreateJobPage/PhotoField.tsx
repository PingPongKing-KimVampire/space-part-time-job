import React, { useRef } from "react";
import FormField from "./FormField.tsx";
import useCreateJobContext from "../../context/CreateJobContext.tsx";
import { uploadImages } from "../../api/rest/post.ts";
import { ReactComponent as CameraIcon } from "../../assets/icons/camera.svg";
import { ReactComponent as XmarkIcon } from "../../assets/icons/x-mark.svg";
import {
  Container,
  UploadButton,
  ImagesContainer,
  ImageDisplay,
} from "../../styles/CreateJobPage/ImageSection.styles.ts";

const VALID_IMAGE_BYTE = 10 * 1024 * 1024;

const PhotoField = () => {
  const { input, warnings, setInput, setIsValid, setImageUploadLoading } =
    useCreateJobContext();

  const hiddenFileInputRef = useRef<HTMLInputElement | null>(null);

  const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImageUploadLoading(true); // loading start

    const selectedImages = Array.from(e.target.files);
    // 이미지 크기, 개수 유효성 검사
    const validSizeImages = selectedImages.filter(
      (image) => image.size <= VALID_IMAGE_BYTE
    );
    const validCountImages = validSizeImages.slice(
      0,
      10 - Object.keys(input.photos).length
    );
    const imageUrls = validCountImages.map((file) => URL.createObjectURL(file));
    setInput((state) => ({
      ...state,
      photos: {
        ...state.photos,
        ...imageUrls.reduce((acc, url) => ({ ...acc, [url]: null }), {}),
      },
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
        setInput((state) => ({
          ...state,
          photos: {
            ...state.photos,
            ...Object.keys(urlMap).reduce(
              (acc, key) => ({ ...acc, [key]: urlMap[key] }),
              {}
            ),
          },
        }));
      } catch {
        isResponseValid = false;
        // 업로드 실패 시 url 제거
        setInput((state) => ({
          ...state,
          photos: {
            ...imageUrls.reduce((acc, url) => {
              const { [url]: _, ...rest } = acc; // 해당 URL 삭제
              return rest;
            }, state.photos),
          },
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

    setImageUploadLoading(false); // loading end
  };

  const onXmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const imageUrl = e.currentTarget.getAttribute("data-url");
    setInput((state) => {
      const newPhotos = { ...state.photos };
      Object.keys(state.photos).forEach((key) => {
        if (key === imageUrl) delete newPhotos[key];
      });
      return { ...state, photos: newPhotos };
    });
  };

  return (
    <FormField
      id="pictures"
      title="사진"
      subInfo="(선택)"
      warning={warnings.photos}
    >
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
          {Object.keys(input.photos).length}/10
        </UploadButton>
        <ImagesContainer>
          {input.photos &&
            Object.keys(input.photos).map((url, index) => (
              <ImageDisplay key={url}>
                <img src={url} alt={`uploaded ${index}`} />
                <button onClick={onXmarkClick} data-url={url}>
                  <XmarkIcon />
                </button>
              </ImageDisplay>
            ))}
        </ImagesContainer>
      </Container>
    </FormField>
  );
};

export default PhotoField;
