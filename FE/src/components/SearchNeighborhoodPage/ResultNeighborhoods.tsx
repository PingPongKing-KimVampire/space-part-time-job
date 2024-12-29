import React, { useMemo, forwardRef } from "react";
import { FixedSizeList as List } from "react-window";
import { ResultContainer } from "../../styles/SearchNeighborhoodPage.styles";
import { Neighborhood } from "../../types/types.ts";

type ResultNeighborhoodsProps = {
  neighborhoods: Neighborhood[];
  getElements: (neighborhoods: Neighborhood[]) => React.JSX.Element[];
};

const ResultNeighborhoods = forwardRef<
  HTMLDivElement,
  ResultNeighborhoodsProps
>((props, ref) => {
  const { neighborhoods, getElements } = props;

  const elements = useMemo(
    () => getElements(neighborhoods),
    [neighborhoods, getElements]
  );

  return (
    <ResultContainer style={{ height: "360px" }}>
      <List
        height={360}
        itemCount={neighborhoods.length}
        itemSize={62.8}
        width="100%"
        ref={ref}
      >
        {({ index, style }) => <div style={style}>{elements[index]}</div>}
      </List>
    </ResultContainer>
  );
});

export default ResultNeighborhoods;
