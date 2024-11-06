import React from "react";
import {
  Container,
  Slider,
  MarkersContainer,
} from "../../styles/SetLocationScopePage/LevelSlider.tsx";

const LevelSlider = ({ level, value, setValue }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const calculateLevel = (value: string): string => {
      const intValue = parseInt(value);
      if (intValue <= 50) return "0";
      if (intValue <= 150) return "100";
      if (intValue <= 250) return "200";
      return "300";
    };
    setValue(calculateLevel(e.currentTarget.value));
  };

  return (
    <Container>
      <Slider
        type="range"
        min="0"
        max={(level - 1) * 100}
        step="1"
        value={value || "0"}
        onChange={onChange}
        onMouseUp={onMouseUp}
      />
      <MarkersContainer>
        {Array.from({ length: level }).map((_, index) => {
          const left = (index / (level - 1)) * 100;
          return <div className="marker" style={{ left: `${left}%` }} />;
        })}
      </MarkersContainer>
      <div className="label left">가까운 동네</div>
      <div className="label right">먼 동네</div>
    </Container>
  );
};

export default LevelSlider;
