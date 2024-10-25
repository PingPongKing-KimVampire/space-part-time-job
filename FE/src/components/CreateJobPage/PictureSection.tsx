import React from "react";
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

const PictureButton = styled("button", {
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
  gap: "2px",
  fontSize: "15px",
  transition: " background 0.2s",
  "& svg": {
    strokeWidth: "0.8",
    width: "55%",
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
    "& svg": {
      color: "#7C7C7C",
      strokeWidth: "2.5",
      height: "70%",
    },
  },
});

const images = [
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
  "/images/test1.png",
];

const PictureSection = () => {
  return (
    <Container>
      <PictureButton>
        <CameraIcon />
        7/10
      </PictureButton>
      <ImagesContainer>
        {images &&
          images.map((imagePath) => (
            <ImageDisplay>
              <img src={imagePath} alt="upload" />
              <button>
                <XmarkIcon />
              </button>
            </ImageDisplay>
          ))}
      </ImagesContainer>
    </Container>
  );
};

export default PictureSection;
