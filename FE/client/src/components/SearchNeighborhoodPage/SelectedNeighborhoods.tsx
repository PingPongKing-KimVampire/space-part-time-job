import React, { useMemo } from "react";
import { SelectedContainer } from "../../styles/pages/SearchNeighborhoodPage.styles";
import { Neighborhood } from "../../types/types";

type SelectedNeighborhoodsProps = {
  neighborhoods: Neighborhood[];
  getElements: (neighborhoods: Neighborhood[]) => React.JSX.Element[];
};

const SelectedNeighborhoods: React.FC<SelectedNeighborhoodsProps> = (props) => {
  const { neighborhoods, getElements } = props;

  const elements = useMemo(
    () => getElements(neighborhoods),
    [neighborhoods, getElements]
  );

  if (neighborhoods.length === 0) {
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

export default SelectedNeighborhoods;
