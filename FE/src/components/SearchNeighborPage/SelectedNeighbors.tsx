import React, { useMemo } from "react";
import { SelectedContainer } from "../../styles/SearchNeighborPage.styles";
import { Neighbor } from "../../types/types.ts";

type SelectedNeighborsProps = {
  neighbors: Neighbor[];
  getElements: (neighbors: Neighbor[]) => React.JSX.Element[];
};

const SelectedNeighbors: React.FC<SelectedNeighborsProps> = (props) => {
  const { neighbors, getElements } = props;

  const elements = useMemo(
    () => getElements(neighbors),
    [neighbors, getElements]
  );

  if (neighbors.length === 0) {
    return (
      <SelectedContainer className="empty">
        선택된 지역이 없습니다.
      </SelectedContainer>
    );
  }
  return (
    <SelectedContainer>{elements.map((element) => element)}</SelectedContainer>
  );
};

export default SelectedNeighbors;
