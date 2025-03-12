import React, { useRef } from "react";
import {
  Container,
  Slider,
  MarkersContainer,
} from "../styles/components/LevelSlider.styles.ts";

const LevelSlider = ({ level, value, setValue }) => {
  const isChanging = useRef<boolean>(false); // Firefox에서는 onChangeEnd -> onChange 순서로 발생하기 때문에 필요

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isChanging.current) {
      setValue(e.target.value);
    }
  };

  const onChangeStart = () => {
    isChanging.current = true;
  };

  const onChangeEnd = (
    e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>
  ) => {
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
    isChanging.current = false;
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
          onMouseDown={onChangeStart}
          onMouseUp={onChangeEnd}
          onTouchStart={onChangeStart}
          onTouchEnd={onChangeEnd}
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
