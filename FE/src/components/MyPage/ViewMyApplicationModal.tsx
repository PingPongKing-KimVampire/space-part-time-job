import React from "react";
import { ModalBackground } from "../../styles/global.ts";
import { ReactComponent as XIcon } from "../../assets/icons/x-mark.svg";

const ViewMyApplicationModal = ({ coverLetter, setDetailApplication }) => {
  const onXClick = () => {
    setDetailApplication((state) => ({ ...state, isVisible: false }));
  };

  return (
    <ModalBackground>
      <div className="container">
        <div className="title">내 자기소개</div>
        <div>{coverLetter}</div>
        <XIcon onClick={onXClick} />
      </div>
    </ModalBackground>
  );
};

export default ViewMyApplicationModal;
