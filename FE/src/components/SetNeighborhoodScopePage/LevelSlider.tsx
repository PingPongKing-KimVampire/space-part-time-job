import React from "react";
import {
  Container,
  Slider,
  MarkersContainer,
} from "../../styles/SetNeighborhoodScopePage/LevelSlider.tsx";

const LevelSlider = ({ level, value, setValue }) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    const calculateLevel = (value: string): string => {
      const intValue = parseInt(value);
      const limitValues = new Array(level - 1)
        .fill(0)
        .map((_, index) => index * 100 + 50); // 50, 150, 250 ...
      for (const limitValue of limitValues) {
        if (intValue <= limitValue) return (limitValue - 50).toString();
      }
      return `${(level - 1) * 100}`;
    };
    setValue(calculateLevel(e.currentTarget.value));
  };

  return (
    <Container>
      <div className="sliderContainer">
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
            return (
              <div
                className="marker"
                key={index}
                style={{ left: `${left}%` }}
              />
            );
          })}
        </MarkersContainer>
      </div>
      <div className="labels">
        <div className="label left">가까운 동네</div>
        <div className="label right">먼 동네</div>
      </div>
    </Container>
  );
};

export default LevelSlider;
