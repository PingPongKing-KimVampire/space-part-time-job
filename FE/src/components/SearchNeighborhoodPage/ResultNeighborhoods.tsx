import React, { useMemo, forwardRef } from "react";
import { FixedSizeList as List } from "react-window";
import { ResultContainer } from "../../styles/pages/SearchNeighborhoodPage.styles";
import { Neighborhood } from "../../types/types.ts";

type ResultNeighborhoodsProps = {
  neighborhoods: Neighborhood[];
  getElements: (neighborhoods: Neighborhood[]) => React.JSX.Element[];
  loading: boolean;
};

const ResultNeighborhoods = forwardRef<
  HTMLDivElement,
  ResultNeighborhoodsProps
>((props, ref) => {
  const { neighborhoods, getElements, loading } = props;

  const elements = useMemo(
    () => getElements(neighborhoods),
    [neighborhoods, getElements]
  );

  if (loading)
    return (
      <ResultContainer style={{ height: "360px" }}>
        <div className="loadingItem" />
        <div className="loadingItem" />
        <div className="loadingItem" />
      </ResultContainer>
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
